import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as oauthClient from 'client-oauth2';

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

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const authenticateSpotifyUser = functions.https.onCall((data, context) => {

});
