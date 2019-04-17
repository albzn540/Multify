import * as functions from 'firebase-functions';
import * as clientOauth2 from 'client-oauth2';
import * as admin from 'firebase-admin';
const SpotifyWebApi = require('spotify-web-api-node');

const callbackUrl = functions.config().dev ? 'http://localhost:3000/login/' : 'https://multify-d5371.firebaseapp.com/login/';

const config = {
  clientId: functions.config().spotify.id,
  clientSecret: functions.config().spotify.secret,
  authorizationUri: 'https://accounts.spotify.com/authorize/',
  accessTokenUri: 'https://accounts.spotify.com/api/token/',
  redirectUri: callbackUrl,
  scopes: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
};

// Oauth2 client
const oauthClient = new clientOauth2(config);

// Spotify client
const spotifyClient = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectUri
});

// Firestore references
const partiesRef = admin.firestore().collection('parties');

const compareTracks = (track1: any, track2: any) => {
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

export const authenticateSpotifyUser = functions.https
  .onCall(async (reqData, context) => {
  console.log("[authenticateSpotifyUser] 1.1");
  console.log("URL param", reqData.url);
  if (!reqData.url) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "Missing 'url' parameter.",
    );
  }

  return oauthClient.code.getToken(reqData.url).then(res => {
    console.log(res);
    const { data } = res;
    return data;
  }).catch((err) => {
    console.error(err);
    throw new functions.https.HttpsError(
      'unknown',
      `Spotify error code: ${err.status}`,
    );
  });
  });

export const refreshToken = functions.https.onCall(async (data, context) => {
  console.log("[refreshToken] 1.0");

  if (!data.refreshToken) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "Missing 'refreshToken' parameter.",
    );
  }

  const token = oauthClient.createToken({});
  token.refreshToken = data.refreshToken;
  return token.refresh().then(res => {
    return res.data;
  }).catch((err) => {
    console.error(err);
    throw new functions.https.HttpsError(
      'unknown',
      `Spotify error code: '${err.status}`,
    );
  });;
});

const partyCodeGenerator = async () => {
  let partyNumbers = [];
  await partiesRef.select('code').get().then(partyCodes => {
    partyCodes.forEach(partyNum => {
      partyNumbers = [Number(partyNum.data().code), ...partyNumbers];
    });
  }).catch((err) => {
    console.error(err);
  });
  console.log("Numbers", partyNumbers);

  let done = false;
  let num = 0;
  while(!done) {
    num = Math.floor(Math.random() * 90000) + 10000;
    done = !partyNumbers.some(existingNumber => {
      return (existingNumber === num);
    })
  }
  console.log("Found unique number", num);
  return `${num}`;
}

export const createParty = functions.https.onCall(async (data, context) => {
  const { name, spotifyToken, spotifyId } = data;
  const promises = [];
  
  if (!name) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "Missing 'name' parameter.",
    );
  }

  if (!spotifyToken) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "Missing 'spotify_token' parameter.",
    );
  }

  // Get party code
  let code: string;
  promises.push(partyCodeGenerator().then(num => code = num));

  // Create spotify playlist
  let spotifyRes: any;
  spotifyClient.setAccessToken(spotifyToken);
  promises.push(spotifyClient.createPlaylist(
    spotifyId,
    'Multify Playlist'
  ).then((res: any) => spotifyRes = res));

  // Wait for all promises
  return Promise.all(promises).then(async () => {
    const party = {
      code,
      name,
      spotifyToken,
      spotifyId,
      playlistId: spotifyRes.body.id,
      playlistUri: spotifyRes.body.uri,
      host: context.auth.uid
    }
    return admin.firestore().collection('parties').doc().create(party)
      .then(() => {
        return {code, name}
      }).catch(error => {
        throw new functions.https.HttpsError(
          'unknown',
          error
        );
      });
  }).catch(error => {
    throw new functions.https.HttpsError(
      'unknown',
      error
    );
  });
});

export const pushQueueToSpotify = async (partyRef: FirebaseFirestore.DocumentReference) => {
  const queueRef = partyRef.collection('queue');
  const queue = await queueRef.get();
    const likePromises = [];
    const dislikePromises = [];
    const queueTracks = [];
    queue.forEach(trackDoc => {
      // Get track likes
      const likePromise = trackDoc.ref.collection('likes').get()
        .then(likesDoc => likesDoc.size);

      // Get track dislikes
      const dislikePromise = trackDoc.ref.collection('dislikes').get()
        .then(likesDoc => likesDoc.size);
      
      queueTracks.push(trackDoc.data());
      likePromises.push(likePromise)
      dislikePromises.push(dislikePromise)
    });

    const partyData = await partyRef.get()
    .then(partyDoc => partyDoc.data());
    

    // Wait for all tracks to compute likes and dislikes
    await Promise.all(likePromises).then(upvotes => {
      queueTracks.forEach((val, index) => {
        val.upvotes = upvotes[index];
      });
    });

    await Promise.all(dislikePromises).then(downvotes => {
      queueTracks.forEach((val, index) => {
        val.downvotes = downvotes[index];
      });
    });

    const processedTracks = queueTracks.map(track => (
      { ...track, likes: track.upvotes - track.downvotes }
    ));
    processedTracks.sort(compareTracks); // sort by likes and timestamps

    const trackIds = processedTracks.map(track => track.uri); // get uris
    console.log('Track ids', trackIds);
    console.log('Processed tracks', processedTracks);
    
    const accessToken = partyData.spotifyToken;
    const playlistId = partyData.playlistId;
    spotifyClient.setAccessToken(accessToken);
    spotifyClient.replaceTracksInPlaylist(playlistId, trackIds, (ans: any) => {
      console.log('Spotify response', ans);
    });
    return Promise.resolve('Tracks should have been added to Spotify playlist');
};

export const songLikedCallback = functions.firestore
  .document('parties/{partyId}/queue/{songId}/likes/{userId}')
  .onWrite(async (change, context) => {
    const partyRef = change.after.ref.parent.parent.parent.parent;
    return pushQueueToSpotify(partyRef);
  });

export const songDislikedCallback = functions.firestore
  .document('parties/{partyId}/queue/{songId}/dislikes/{userId}')
  .onWrite(async (change, context) => {
    const partyRef = change.after.ref.parent.parent.parent.parent;
    return pushQueueToSpotify(partyRef);
  });