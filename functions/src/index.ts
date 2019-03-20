import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as clientOauth2 from 'client-oauth2';

const config = {
  clientId: functions.config().spotify.id,
  clientSecret: functions.config().spotify.secret,
  authorizationUri: 'https://accounts.spotify.com/authorize',
  accessTokenUri: 'https://accounts.spotify.com/api/token',
  redirectUri: 'http://localhost:3000/redirectauth/',
  scopes: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
};

// Admin SDK to access firstore
admin.initializeApp();

// Authentication client for oauth requests
const oauthClient = new clientOauth2(config);

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const authenticateSpotifyUser = functions.https.onCall((req, context) => {
  console.log("Version 1.1");
  const { url } = req;
  return oauthClient.code.getToken(url).then(token => {
    console.log(token);
    const { data } = token;
    return data;
  });
});
