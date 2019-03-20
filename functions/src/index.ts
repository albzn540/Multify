import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Admin SDK to access firstore
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const authenticateSpotifyUser = functions.https.onCall((data, context) => {
  console.log("Called auth Spot");
  console.log(data);
});
