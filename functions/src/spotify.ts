import * as functions from 'firebase-functions';
import * as clientOauth2 from 'client-oauth2';
import admin from './admin';
import { user } from 'firebase-functions/lib/providers/auth';
import { resolve } from 'url';

const config = {
  clientId: functions.config().spotify.id,
  clientSecret: functions.config().spotify.secret,
  authorizationUri: 'https://accounts.spotify.com/authorize',
  accessTokenUri: 'https://accounts.spotify.com/api/token',
  redirectUri: 'http://localhost:3000/login/',
  scopes: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
};

// Oauth2 client
const oauthClient = new clientOauth2(config);

export const authenticateSpotifyUser = functions.https.onCall(async (reqData, context) => {
  console.log("[authenticateSpotifyUser] 1.1");
  const { url } = reqData;

  if (!url) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "Missing 'url' parameter.",
    );
  }

  return oauthClient.code.getToken(url).then(res => {
    console.log(res);
    const { data } = res;
    return data;
  }).catch((err) => {
    console.error(err);
    throw new functions.https.HttpsError(
      'unknown',
      `Spotify error code: '${err.status}`,
    );
  });
});


// export const verifyUser = functions.https.onCall(async (reqData, context) => {
//   console.log("[verifyUser] 1.1");
//   const { userdata } = reqData;

//   return admin.auth().getUserByEmail(userdata.email);

//   return admin.auth().createUser({
//     email: userdata.email,
//   });

//   admin.auth().
  
// }); 

export const refreshToken = functions.https.onCall(async (data, context) => {
  console.log("[refreshToken] 1.0");

  const { refreshToken } = data;
  if (!refreshToken) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "Missing 'refreshToken' parameter.",
    );
  }

  const token = oauthClient.createToken({});
  token.refreshToken = refreshToken;
  return token.refresh().then(res => {
    const { data } = res;
    return data;
  }).catch((err) => {
    console.error(err);
    throw new functions.https.HttpsError(
      'unknown',
      `Spotify error code: '${err.status}`,
    );
  });;

  // return {
  //   accessToken: body.access_token,
  //   expiresIn: body.expires_in,
  // };
});