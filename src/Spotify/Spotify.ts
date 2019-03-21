import SpotifyWebApi from 'spotify-web-api-js';
import oauth2 from 'client-oauth2';

declare class Firebase {
  db: firebase.firestore.Firestore;
  functions: firebase.functions.Functions;
  auth: firebase.auth.Auth;
}

const config = {
  clientId: process.env.REACT_APP_SPOTIFY_ID,
  clientSecret: process.env.REACT_APP_SPOTIFY_SECRET,
  authorizationUri: 'https://accounts.spotify.com/authorize',
  accessTokenUri: 'https://accounts.spotify.com/api/token',
  redirectUri: 'http://localhost:3000/login/',
  scopes: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
};

const authClient = new oauth2(config);
let fb: Firebase;
let refreshToken: null | string;
let tokenExpiresIn: number;

class Spotify {
  client: SpotifyWebApi.SpotifyWebApiJs;
  firebaseUser: null | firebase.auth.UserCredential;
  status: 'pending' | 'done';

  constructor(firebase: Firebase) {
    // Initialize private stuff
    fb = firebase;
    this.firebaseUser = null;
    tokenExpiresIn = 0;

    // Public stuff
    this.client = new SpotifyWebApi();
    this.status = 'pending';

    const storedData = localStorage.getItem('spotify_data');
    if (storedData) {
      const spotifyData = JSON.parse(storedData);
      console.log('[Spotify] Stored data', spotifyData);
      const currentTime = Math.round(Date.now() / 1000) + 30; // add 30s buff time
      tokenExpiresIn = spotifyData.expires_at - currentTime;
      console.info('[Spotify] Token expires in', tokenExpiresIn);
      if (tokenExpiresIn >= 0) {
        // token has not yet expired
        refreshToken = spotifyData.refresh_token;
        this.refreshTokenCallback(); // refresh token every 3000 seconds
        this.client.setAccessToken(spotifyData.access_token);
      }
    }
  }

  spotifyUser = () => {
    const accToken = this.client.getAccessToken();
    return accToken === '' ? null : accToken; 
  };

  authorizeWithSpotify = () => {
    this.spotifyUser
    console.log('[Spotify] Signing in');
    const url = authClient.code.getUri();
    window.location.assign(url);
  };

  authenticateSpotifyUser = async (url: string) => {
    const authenticate = fb.functions.httpsCallable('authenticateSpotifyUser');
    return authenticate({ url }).then(async response => {
      const { data } = response;
      console.log(data);
      const { access_token, refresh_token, expires_in } = data;

      const localStorageData = {
        access_token,
        refresh_token,
        expires_at: Math.round(Date.now() / 1000 + expires_in),
      };

      localStorage.setItem('spotify_data', JSON.stringify(localStorageData));

      this.client.setAccessToken(access_token);
    });
  };

  loginUser = async () => {
    const verifiedUser = await this.client.getMe();

    console.log('Verified Spotify user', verifiedUser);
    const { email, id } = verifiedUser;

    fb.auth.signInWithEmailAndPassword(email, id).then(loggedInUser => {
      // User exists
      this.setUser(loggedInUser);
    }).catch(error => {
      // user does not exist
      console.error(error.message);
      console.log("Creating new user");
      fb.auth.createUserWithEmailAndPassword(email, id).then(user => this.setUser(user));
    });
  }

  setUser = (user: firebase.auth.UserCredential) => {
    console.log('[Spotify] Set user', user);
    this.firebaseUser = user;
    this.status = 'done';
  }

  refreshTokenCallback = () => {
    console.log('[Spotify] refreshTokenCallback');
    const refreshFunction = fb.functions.httpsCallable('refreshToken');
    refreshFunction({ refreshToken }).then(res => {
      const { data } = res;
      this.client.setAccessToken(data.access_token);
      tokenExpiresIn = data.expires_in;
    });

    setTimeout(this.refreshTokenCallback, tokenExpiresIn * 1000);
  }

  createParty = () => {
    console.log('[Spotify] Creating party')
  };

}

export default Spotify;