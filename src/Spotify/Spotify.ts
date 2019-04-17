import SpotifyWebApi from 'spotify-web-api-js';
import oauth2 from 'client-oauth2';
import uuidv4 from 'uuid/v4';

declare class Firebase {
  db: firebase.firestore.Firestore;
  functions: firebase.functions.Functions;
  auth: firebase.auth.Auth;
  currentUser(): null | firebase.User;
  partyRef(id: string): firebase.firestore.DocumentReference;
  partiesRef(): firebase.firestore.CollectionReference;
  partyQueueRef(id: string): firebase.firestore.CollectionReference;
  addUser(user: firebase.User, name: string, token: string, spotifyId: string): Promise<void>;
}

const config = {
  clientId: process.env.REACT_APP_SPOTIFY_ID,
  clientSecret: process.env.REACT_APP_SPOTIFY_SECRET,
  authorizationUri: 'https://accounts.spotify.com/authorize',
  accessTokenUri: 'https://accounts.spotify.com/api/token',
  redirectUri: 'https://multify-d5371.firebaseapp.com/login/',
  scopes: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email', 'user-read-playback-state', 'user-read-currently-playing'],
};

if (process.env.NODE_ENV === 'development') {
  console.log('[Spotify] Running in dev mode, setting spotify redirect uri to localhost:3000');
  config.redirectUri = 'http://localhost:3000/login/';
  // config.redirectUri = 'http://192.168.43.45:3000/login/';
}

// Private stuff
const authClient = new oauth2(config);
let fb: Firebase;
let refreshToken: null | string;
let tokenExpiresIn: number;
let observers: { observerFunction: any, action: string[] }[];
let firestoreSubscriptions: any[] = [];

/*
* Observable actions:
*   queue
*   nowplaying
*   party
*/

class Spotify {
  client: SpotifyWebApi.SpotifyWebApiJs;
  spotifyUser: SpotifyApi.CurrentUsersProfileResponse | undefined;
  uuid: string;
  partyId: string | null;
  party: {
    code: string,
    name: string,
    doc: firebase.firestore.DocumentSnapshot,
  } | undefined;
  currentlyPlaying: SpotifyApi.CurrentPlaybackResponse | undefined;
  queue: {
    id: string,
    album: string,
  }[];

  constructor(firebase: Firebase) {
    // Initialize private stuff
    fb = firebase;
    tokenExpiresIn = 0;
    observers = [];

    // Public stuff
    this.client = new SpotifyWebApi();
    this.uuid = uuidv4();
    this.queue = [];

    this.client.getMyCurrentPlaybackState();
    // Check for stored data
    const storedData = localStorage.getItem('spotify_data');
    const uuid = localStorage.getItem('uuid');
    this.partyId = localStorage.getItem('party_id');

    if (storedData) {
      // Stored data exists, user has logged in before
      const spotifyData = JSON.parse(storedData);
      console.log('[Spotify] Stored data', spotifyData);
      const currentTime = Math.round(Date.now() / 1000) + 30; // add 30s buff time
      tokenExpiresIn = spotifyData.expires_at - currentTime;
      if (tokenExpiresIn >= 0) {
        // token has not yet expired
        console.info('[Spotify] Token expires in', tokenExpiresIn);
        refreshToken = spotifyData.refresh_token;
        setTimeout(this.refreshTokenCallback, tokenExpiresIn * 1000 - 3000);
        this.client.setAccessToken(spotifyData.access_token);
        this.getNewSpotifyUser();
      } else {
        console.log('[Spotify] Token has expired');
      }
    }
    //Anoymous user, use old uuid if there is one
    this.uuid = uuid || this.uuid;
    console.debug('[Spotify] Anonymous user', this.uuid);

    // setup tracklistener for removing playing tracks from the queue
    this.nowPlayingListener();

    if (this.partyId) {
      this.subscribeFirestore();
    }

  }

  handlePartyUpdate = (doc: any) => {

  };

  handleQueueUpdate = async (doc: firebase.firestore.QuerySnapshot) => {
    const newTracks: any[] = [];
    const upvotePromises: Promise<{ isLiked: boolean; likes: number; }>[] = [];
    const downvotePromises: Promise<{ isDisliked: boolean; dislikes: number; }>[] = [];
    const likeReferences: firebase.firestore.CollectionReference[] = []
    const dislikeReferences: firebase.firestore.CollectionReference[] = []

    doc.forEach(track => {
      if (!this.partyId) {
        return;
      }

      const likeRef = fb.partyQueueRef(this.partyId).doc(track.id)
        .collection('likes');
      const dislikeRef = fb.partyQueueRef(this.partyId).doc(track.id)
        .collection('dislikes');

      likeReferences.push(likeRef);
      dislikeReferences.push(dislikeRef);

      const upvotes = likeRef.get().then(likes => {
          let isLiked = false;
          likes.forEach(likedoc => {
            if(likedoc.id === this.uuid) {
              isLiked = true;
            }
          });
          return {
            isLiked,
            likes: likes.size
          }
        });
      const downvotes = dislikeRef.get().then(dislikes => {
          let isDisliked = false;
          dislikes.forEach(dislikedoc => {
            if(dislikedoc.id === this.uuid) {
              isDisliked = true;
            }
          });
          return {
            isDisliked,
            dislikes: dislikes.size
          }
        });
        
      const newTrack = {
        id: track.id,
        ...track.data(),
        ref: track.ref
      }

      //setup listener for liking disliking
      newTracks.push(newTrack);
      upvotePromises.push(upvotes);
      downvotePromises.push(downvotes);
    });

    // Wait for all tracks to compute likes and dislikes
    await Promise.all(upvotePromises).then(upvotes => {
      newTracks.forEach((val, index) => {
        val.upvotes = upvotes[index].likes;
        val.vote = upvotes[index].isLiked ? true : null;
      });
    });
    
    await Promise.all(downvotePromises).then(downvotes => {
      newTracks.forEach((val, index) => {
        val.downvotes = downvotes[index].dislikes;
        val.vote = downvotes[index].isDisliked ? false : val.vote;
      });
    });
    
    const processedTracks = newTracks.map(track => (
      {
        ...track,
        likes: track.upvotes - track.downvotes
      }
      ));
      processedTracks.sort(this.compareTrack); // sort by likes and timestamps
    
    this.queue = processedTracks;
    console.log('[Spotify] New tracks', processedTracks);
    console.log('[Spotify] Notifying observers - queue');
    this.notifyObservers('queue');
  }

  /**
   * Subscribes to party and queue in firestore
   * If already subscribed when calling this method, it will unsubscribe
   * current subscriptions first.
   */
  subscribeFirestore = () => {
    console.log('[Spotify] Setting up firestore listeners');
    if (!this.partyId) {
      console.error('No party id');
      return;
    }

    if (firestoreSubscriptions.length > 0) {
      firestoreSubscriptions.map(unsub => unsub());
    }

    const partySub = fb.partyRef(this.partyId).onSnapshot(this.handlePartyUpdate);
    const queueSub = fb.partyQueueRef(this.partyId).onSnapshot(this.handleQueueUpdate);
    firestoreSubscriptions.push(partySub);
    firestoreSubscriptions.push(queueSub);
  };

  /**
   * Sets the party id in the Spotify instance, triggering a cascade of 
   * functions updating the internal states of the Spotify instance.
   */
  setParty = (id: string) => {
    this.partyId = id;
    this.subscribeFirestore();
  };

  currentPartyRef = () => {
    if (!this.partyId) {
      console.error('Cant fetch current party when there is none');
      return;
    }
    return fb.partyRef(this.partyId);
  }

  currentPartyQueueRef = () => {
    if (!this.partyId) {
      console.error('Cant fetch current party when there is none');
      return;
    }
    return fb.partyQueueRef(this.partyId)
  }

  /**
   * Adds an observable update function to Spotify instance
   */
  addObserver = (updateFunc: any, action: string[]) => {
    observers.push({
      observerFunction: updateFunc,
      action
    });
    return () => this.removeObserver(updateFunc)
  };

  /**
   * Removes an update function from Spotify instance
   */
  removeObserver = (updateFunc: any) => {
    observers = observers.filter(observer => observer.observerFunction !== updateFunc);
  }

  /**
   * Notifies observables when appropriate action is called
   */
  notifyObservers = (action: string) => {
    console.log(`[Spotify] Notifying "${action}"`)
    observers.map(observer => {
      if (observer.action.some(obsAction => obsAction === action)) {
        observer.observerFunction();
      }
    })
  };

  /**
   * Frequently polls the current playing track from spotify.
   * For this method to work an access token has had to been set.
   * 
   * Notify action: nowplaying
   */
  nowPlayingListener = async () => {
    this.client.getMyCurrentPlaybackState()
      .then(currentState => {
        if (!currentState || !currentState.item || !currentState.progress_ms) {
          return console.error('Couldnt process current playback state');
        }
        let timeLeft = currentState.item.duration_ms - currentState.progress_ms;
        // We want to check the currently playing track often in case the track
        // is manually skipped, fast fowarded or something similar
        timeLeft = timeLeft < 1000 ? timeLeft : 1000;
        setTimeout(this.nowPlayingListener, timeLeft);
        this.notifyObservers('nowplaying');
      });
  };

  /**
   * Removes all track that comes after given track in the queue
   * @param {string} trackId
   */
  removeSubsequentTracks = (trackId: string) => {
    console.log('track id', trackId);
    this.getQueue().then(queue => {
      console.log(queue);
    }).catch(err => {
      console.error(err);
    })
  };

  /**
   * Requests Spotify user data and saves it to Spotify instance
   */
  getNewSpotifyUser = async () => {
    return this.client.getMe().then(user => {
      this.spotifyUser = user;
      this.uuid = user.id;
    }).catch(err => console.log("[Spotify] Couldn't fetch Spotify user"));
  }

  /** 
   * Authorize a Spotify user with Spotify popup window (Retrieve access token).
   * 
   * The function will check the current url and see if it contains the oauth
   * code needed for authorization. If the code is missing from the url, we need
   * to be redirected to the spotify popup window.
   * After logging in with our Spotify account, we will be redirected back to
   * the login page. This time with the code in the url needed for the
   * autorization
   * 
   * @param {string} url - Window URL
  */
  authorizeWithSpotify = async (url: string = '') => {
    console.log('[Spotify][authorizeWithSpotify]');

    if (this.spotifyUser) {
      return Promise.resolve('Already authenticated');
    }

    if (!url.includes('?code=')) {
      // code was missing from url
      const uri = authClient.code.getUri();
      window.location.assign(uri);
    }

    // Get firebase function
    const authenticate = fb.functions.httpsCallable('authenticateSpotifyUser');
    return authenticate({ url }).then(async response => {
      console.log(url);
      console.log('[Spotify][authorizeWithSpotify] Authorized! Now authenticating...');
      const { data: { access_token, refresh_token, expires_in } } = response;
      tokenExpiresIn = expires_in;
      refreshToken = refresh_token;
      this.client.setAccessToken(access_token);
      await this.getNewSpotifyUser();
      this.saveToLocalStorage();
    }).catch(err => console.error(err));
  };

  /** 
   * Main user login function.
   *  - Authenticates the spotify user if neccessary (spotify login popup) 
   *  - Retrieves access token
   *  - Logs user into Firebase
   * 
   * @param {string} url - Window URL
   */
  loginUser = async (url: string = '') => {

    if (!this.spotifyUser) {
      // Log in spotify user to retrieve access token
      console.log('[Spotify][loginUser] Retrieve accesstoken...', this.spotifyUser);
      await this.authorizeWithSpotify(url).catch(err => {
        return Promise.resolve(err);
      });
      console.log('[Spotify][loginUser] Retrieved accesstoken!', this.client.getAccessToken());
    }

    if (fb.currentUser()) {
      return Promise.resolve(fb.currentUser());
    }

    // Log into Firebase
    if (!this.spotifyUser) {
      // Make sure we got the data needed
      await this.getNewSpotifyUser().catch(err => {
        console.error(err);
        return Promise.reject()
      });
    }

    if (!this.spotifyUser) {
      // Check again that we have the needed data
      return Promise.reject("Could not log in");
    }

    const { email, id, display_name } = this.spotifyUser;
    return fb.auth.signInWithEmailAndPassword(email, id).then(userCredentials => {
      // User exists
      fb.auth.updateCurrentUser(userCredentials.user);
      return userCredentials.user;
    }).catch(async (error) => {
      // User does not exist
      console.error(error.message);
      console.log('[Spotify][loginUser] Creating new user');
      return fb.auth.createUserWithEmailAndPassword(email, id).then(userCredentials => {
        // Save displayname and such
        const user = userCredentials.user;
        const name = display_name;
        if (user != null && name != null) {
          user.updateProfile({
            displayName: name
          });
          // New user created, add user to database
          fb.addUser(user, name, this.client.getAccessToken(), id).catch(e => {
            console.error('ADD SNACKBAR'); //TODO
            console.error("Couldn't add user to database", e);
          });
        } else {
          console.error('Something went wrong creating new user, one or more parameter were missing', user, name);
        }
        fb.auth.updateCurrentUser(userCredentials.user);
        return user;
      });
    });
  }

  /**
   * Save data to local storage
   */
  saveToLocalStorage = () => {
    const localStorageData = {
      access_token: this.client.getAccessToken(),
      refresh_token: refreshToken,
      expires_at: Math.round(Date.now() / 1000 + tokenExpiresIn),
    };

    localStorage.setItem('spotify_data', JSON.stringify(localStorageData));
    if (this.party) {
      localStorage.setItem('party_id', JSON.stringify(this.partyId));
    }
    localStorage.setItem('uuid', this.uuid);
  };

  /**
   * Invokes Firebase function "refreshToken" to, well, refresh the token
   * Also, it sets a timeout to call the refreshTokenCallback function again
   * before the new token runs out of time.
   */
  refreshTokenCallback = () => {
    console.log('[Spotify][refreshTokenCallback]');
    const refreshFunction = fb.functions.httpsCallable('refreshToken');
    refreshFunction({ refreshToken }).then(res => {
      const { data } = res;
      tokenExpiresIn = data.expires_in;
      this.client.setAccessToken(data.access_token);
      this.saveToLocalStorage();
      console.info('[Spotify][refreshTokenCallback] New access token', data.access_token);
    });

    setTimeout(this.refreshTokenCallback, tokenExpiresIn * 1000 - 3000);
  };

  /**
   * Create a new party
   * Invokes Firebase function "createParty"
   * 
   * @param {string} partyname
   */
  createParty = (partyname: string) => {
    console.debug(`[Spotify][createParty] Creating party "${partyname}"`);
    const createPartyFunc = fb.functions.httpsCallable('createParty');

    if (!this.spotifyUser) {
      console.error("[Spotify][createParty] Can't create party if you're not logged in");
      return Promise.reject("You don't seem to be logged in");
    }

    return createPartyFunc({
      name: partyname,
      spotifyToken: this.client.getAccessToken(),
      spotifyId: this.spotifyUser.id
    });
  };

  /**
   * Retrieve a party id (document firebase id) by party code (5 numbers)
   * Also sets the party property for this Spotify instance (important)
   * 
   * @param {string} code - 5 digit party code
   */
  getPartyId = async (code: string) => {
    console.debug('[Spotify][getParyId] Retrieving party', code);
    return fb.partiesRef().where('code', '==', code).get().then((snap) => {
      let id = undefined;
      snap.forEach(doc => {
        const name = doc.data().name;
        id = doc.id;
        this.partyId = id;
        this.party = { name, code, doc };
      });
      this.saveToLocalStorage();
      if (id) {
        return Promise.resolve(id);
      } else {
        return Promise.reject(`Could not find party with code=${code}`);
      }
    });
  };

  /**
   * @param {string} id Party id
   * @returns Promise<firebase.firestore.DocumentReference> party object and
   * saves it to the Spotify instance, or nothing if the party did not exist
   */
  getParty = async (id: string) => {
    return fb.partyRef(id).get().then(partyDoc => {
      const party = partyDoc.data();
      if (party) {
        this.party = {
          name: party.name,
          code: party.code,
          doc: partyDoc
        }
        this.saveToLocalStorage();
        return Promise.resolve(this.party);
      }
      return Promise.reject("No such party");
    });
  };

  changePartyName = (name: string) => {
    const party = this.party;
    if (!party) {
      console.error('Party is not defined');
      return
    }
    const partyDoc = party.doc.ref;
    if (partyDoc) {
      partyDoc.update({ name });
    } else {
      console.error('You dont have a party')
    }

  };

  /**
   * @param trackId
   * @returns {firebase.firestore.QueryDocumentSnapshot | null} Track object or null if track was not in queue
   */
  getTrackFromQueue = async (trackId: string) => {
    console.debug(`[Spotify][getTrackFromQueue] Retrieving track "${trackId}" from queue...`);
    if (!this.partyId) {
      console.error('Cant fetch track from a queue that does not exist')
      return;
    }
    return fb.partyQueueRef(this.partyId).get().then(queueSnap => {
      let found: firebase.firestore.QueryDocumentSnapshot | null = null;
      queueSnap.forEach(track => {
        if (track.id === trackId) {
          found = track;
        }
      });
      return found;
    });
  };

  /**
   * @returns The current party's queue, sorted on likes and timestamps
   */
  getQueue = async () => {
    const cParty = this.party;
    if (!cParty) {
      return Promise.reject('[Spotify][getQueue] No party instanciated');
    }

    return cParty.doc.ref.collection('queue').get().then(queueDoc => {
      const tracks: any[] = []
      queueDoc.forEach(track => {
        tracks.push(track.data());
      })
      return tracks.sort(this.compareTrack);
    });
  }

  /**
   * @return A promise resolving to the current playing track
   */
  nowPlaying = async () => {
    return this.client.getMyCurrentPlayingTrack()
  };

  /**
   * A track has its important features stripped and added to firestore
   * @param track
   */
  addTrack = async (track: any) => {
    if(!this.partyId) return;

    const reducedTrack = {
      id: track.id,
      uri: track.uri,
      artists: track.artists.map((artist: any) => artist.name),
      name: track.name,
      album: {
        images: track.album.images,
        name: track.album.name,
      },
      timeStamp: Date.now(),
    };

    const trackRef = fb.partyQueueRef(this.partyId).doc(track.id);
    const trackExists = await this.getTrackFromQueue(track.id);

    if (trackExists) {
      trackRef.collection('likes').doc(this.uuid)
        .set({});
    } else {
      trackRef.set(reducedTrack)
        .then(() => {
          console.log(`[Spotify][addTrack] ${track.name} added by ${this.uuid}`);
        })
        .then(() => {
          trackRef.collection('likes').doc(this.uuid).set({});
        })
        .catch((err: Error) => {
          console.error('[Spotify][addTrack] Error adding track!', err);
        });
    }
  }

  /**
   * Votes on a track in the party queue
   * @param {string} trackId
   * @param {boolean | undefined} vote
   */
  voteTrack = (trackId: string, vote: boolean | undefined) => {
    const queueRef = this.currentPartyQueueRef();
    if(!queueRef) {
      console.error('[Spotify][voteTrack] No party instanciated');
      return;
    }
    const likeRef = queueRef.doc(trackId).collection('likes');
    const dislikeRef = queueRef.doc(trackId).collection('dislikes');

    likeRef.doc(this.uuid).delete();
    dislikeRef.doc(this.uuid).delete();
    if (vote) {
      likeRef.doc(this.uuid).set({});
    } else if (vote === false) {
      dislikeRef.doc(this.uuid).set({});
    }
    console.log(`${this.uuid} voted ${vote} on track "${trackId}"`);
  }

  /**
   * Compares two tracks based on number of upvotes.
   * If upvotes are equal the track added earliest
   * is the track selected by a .sort function.
   * @param {Object} track1
   * @param {Object} track2
   */
  compareTrack = (track1: any, track2: any) => {
    if (track1.likes > track2.likes) {
      return -1;
    }
    if (track1.likes < track2.likes) {
      return 1;
    }
    if (track1.timeStamp < track2.timeStamp) {
      return -1;
    }
    if (track1.timeStamp > track2.timeStamp) {
      return 1;
    }
    return 0;
  };
}

export default Spotify;