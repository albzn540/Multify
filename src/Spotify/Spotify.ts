import SpotifyWebApi from 'spotify-web-api-js';
import oauth2 from 'client-oauth2';

declare class Firebase {
  db: firebase.firestore.Firestore;
  func: firebase.functions.Functions;
}

const config = {
  redirectUri: 'http://localhost:3000/redirectauth/',
  scope: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
};

const authClient = new oauth2(config);
let fb: Firebase;

class Spotify {
  client: SpotifyWebApi.SpotifyWebApiJs;

  constructor(firebase: Firebase) {
    this.client = new SpotifyWebApi();
    fb = firebase;
  }

  authorizeWithSignIn() {
    console.log('[Spotify] Signing in?');
    const url = "";
    window.location.assign(url);
  };

  async codeCallback(params: any) {
    console.log('[Spotify] Answer from Spotify', params);
    try {
      console.log('[Spotify] Access granted!');
    } catch (error) {
      console.error('[Spotify] Access Token Error', error);
    }
  };

}

export default Spotify;