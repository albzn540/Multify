import SpotifyWebApi from 'spotify-web-api-js';
import oauth2 from 'client-oauth2';
import uuidv4 from 'uuid/v4';

declare class Firebase {
  db: firebase.firestore.Firestore;
  functions: firebase.functions.Functions;
  auth: firebase.auth.Auth;
  currentUser(): null | firebase.User;
  partyRef(): firebase.firestore.DocumentReference;
  partiesRef(): firebase.firestore.CollectionReference;
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

if(process.env.NODE_ENV === 'development') {
  console.log('[Spotify] Running in dev mode, setting spotify redirect uri to localhost:3000');
  config.redirectUri = 'http://localhost:3000/login/';
}

const authClient = new oauth2(config);
let fb: Firebase;
let refreshToken: null | string;
let tokenExpiresIn: number;

class Spotify {
  client: SpotifyWebApi.SpotifyWebApiJs;
  spotifyUser: SpotifyApi.CurrentUsersProfileResponse | undefined;
  uuid: string;
  party: { code: string, id: string | null, name: string } | undefined;

  constructor(firebase: Firebase) {
    // Initialize private stuff
    fb = firebase;
    tokenExpiresIn = 0;

    // Public stuff
    this.client = new SpotifyWebApi();
    this.uuid = uuidv4();

    // Check for stored data
    const storedData = localStorage.getItem('spotify_data');
    const uuid = localStorage.getItem('uuid');

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

    this.nowPlaying().then((d) => {
      console.log(d);
    })
  }

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

    if(this.spotifyUser) {
      return Promise.resolve('Already authenticated');
    }

    if (!url.includes('?code=')) {
      // code was missing from url
      const uri = authClient.code.getUri();
      window.location.assign(uri);
      // Uncomment if you're experiencing a refresh loop  
      // console.log("Right now, since we have to pay Firebase, we need to restrict the number of requests");
      // console.log("In the future this way of authentication will be removed");
      // console.log("Paste this url into the browser: ", uri);
      // console.info('[Spotify][authorizeWithSpotify] Not yet authorizing. Now autorizing...');
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

    if(!this.spotifyUser) {
      // Log in spotify user to retrieve access token
      console.log('[Spotify][loginUser] Retrieve accesstoken...', this.spotifyUser);
      await this.authorizeWithSpotify(url).catch(err => {
        return Promise.resolve(err);
      });
      console.log('[Spotify][loginUser] Retrieved accesstoken!', this.client.getAccessToken());
    }

    if(fb.currentUser()) {
      return Promise.resolve(fb.currentUser());
    }

    // Log into Firebase
    if(!this.spotifyUser) {
      // Make sure we got the data needed
      await this.getNewSpotifyUser().catch(err => {
        console.error(err);
        return Promise.reject()
      });
    }
    
    if(!this.spotifyUser) {
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

    if(!this.spotifyUser) {
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
   * Also sets the party property for this Spotify instance
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
        this.party = { name, code, id };
      });

      if(id) {
        return Promise.resolve(id);
      } else { 
        return Promise.reject(`Could not find party with code=${code}`);
      }
    });
  };

  /**
   * @return A promise resolving to the current playing track
   */
  nowPlaying = async () => {
    return this.client.getMyCurrentPlayingTrack()
  };

  /**
   * A track has its important features stripped and added to firestore
   * @param {Object} track
   */
  addTrack(track : any, partyId : string) {
    const reducedTrack = {
      id: track.id,
      uri: track.uri,
      artists: track.artists.map((artist : any) => artist.name),
      name: track.name,
      likes: 0,
      album: {
        images: track.album.images,
        name: track.album.name,
      },
      timeStamp: Date.now(),
    };
    fb.db.collection('parties').doc(partyId)
      .collection('queue').doc(track.id)
      .set(reducedTrack)
      .then(() => {
        console.log('[Search] Track added!');
      })
      .catch((err : Error) => {
        console.error('[Search] Error adding track!', err);
      });
  }
}

export default Spotify;