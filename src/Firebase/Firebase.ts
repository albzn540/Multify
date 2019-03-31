import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/auth';

// Initialize Firebase
var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

class Firebase {
  db: firebase.firestore.Firestore;
  functions: firebase.functions.Functions;
  auth: firebase.auth.Auth;

  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
    this.functions = firebase.functions();
    this.auth = firebase.auth();

    if(process.env.NODE_ENV === 'development') {
      console.log('[Firebase] Running in dev mode, setting firebase functions address to localhost:3001');
      this.functions.useFunctionsEmulator('http://localhost:3001');
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.info('[Firebase] User logged in', user);
      } else {
        console.info('[Firebase] User logged out (or was never loged in)', user);
        console.info('[Firebase] Logging in anonymous user...');
        firebase.auth().signInAnonymously().catch(error => {
          console.error('[Firebase] Something went wrong logging in anonymously', error);
        })
      }
    });
  }

  currentUser = () => {
    return firebase.auth().currentUser;
  };

  partiesRef = () => firebase.firestore().collection('parties');
  
  partyRef = (id: string) => this.partiesRef().doc(id);
  
  partyQueueRef = (id: string) => this.partyRef(id).collection('queue');
  
  test = () => {
    
  };
}

export default Firebase;