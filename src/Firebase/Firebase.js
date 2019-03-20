import firebase from 'firebase';


// Initialize Firebase
var config = {
  apiKey: "AIzaSyDtnd6FOHftcw7A5HTtqH9jP7Wycg8ldX4",
  authDomain: "multify-d5371.firebaseapp.com",
  databaseURL: "https://multify-d5371.firebaseio.com",
  projectId: "multify-d5371",
  storageBucket: "multify-d5371.appspot.com",
  messagingSenderId: "455889368796"
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
  }
}

export default Firebase;