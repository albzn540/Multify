import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as oauthClient from 'client-oauth2';
import * as firebase from 'firebase';

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

export const loginAnon = firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
});

export const getUserInfo = firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});