import SpotifyWebApi from 'spotify-web-api-js';
import oauth2 from 'client-oauth2';

declare class Firebase {
  db: firebase.firestore.Firestore;
  functions: firebase.functions.Functions;
  auth: firebase.auth.Auth;
  currentUser(): null | firebase.User;
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

  constructor(firebase: Firebase) {
    // Initialize private stuff
    fb = firebase;
    tokenExpiresIn = 0;

    // Public stuff
    this.client = new SpotifyWebApi();

    // Check for stored data
    const storedData = localStorage.getItem('spotify_data');
    if (storedData) {
      const spotifyData = JSON.parse(storedData);
      console.log('[Spotify] Stored data', spotifyData);
      const currentTime = Math.round(Date.now() / 1000) + 30; // add 30s buff time
      tokenExpiresIn = spotifyData.expires_at - currentTime;
      console.info('[Spotify] Token expires in', tokenExpiresIn);
      if (tokenExpiresIn >= 0) {
        // token has not yet expired
        console.log('[Spotify] Token has not yet expired');
        refreshToken = spotifyData.refresh_token;
        setTimeout(this.refreshTokenCallback, tokenExpiresIn * 1000 - 3000);
        this.client.setAccessToken(spotifyData.access_token);
      }
    }
  }

  spotifyUser = () => {
    const accToken = this.client.getAccessToken();
    console.log('[Spotify][spotifyUser]', accToken);
    return accToken === '' ? null : accToken;
  };

  authorizeWithSpotify = async (url: string = '') => {
    console.log('[Spotify][authorizeWithSpotify]');

    if (!this.spotifyUser()) {
      const authenticate = fb.functions.httpsCallable('authenticateSpotifyUser');
      return authenticate({ url }).then(async response => {
        console.log('[Spotify][authorizeWithSpotify] Authorized! Now authenticating...');
        const { data: { access_token, refresh_token, expires_in } } = response;
        tokenExpiresIn = expires_in;
        refreshToken = refresh_token;
        this.client.setAccessToken(access_token);
        this.saveToLocalStorage();
      }).catch(e => {
        console.error(e);
        console.info('[Spotify][authorizeWithSpotify] Not yet authorizing. Now autorizing...');
        const uri = authClient.code.getUri();
        window.location.assign(uri);
      });
    } else {
      return Promise.resolve('Already authenticated');
    }
  };

  loginUser = async (url: string = '') => {
    // Check if we're already logged in
    // Check if we already have an access token
    if (!this.spotifyUser()) {
      // Retrieve Spotify code
      
      console.log('[Spotify][loginUser] Retrieve accesstoken...', this.spotifyUser());
      await this.authorizeWithSpotify(url).catch(err => {
        return Promise.resolve(err);
      });
      console.log('[Spotify][loginUser] Retrieved accesstoken!', this.spotifyUser());
    }

    if(fb.currentUser()) {
      return Promise.resolve(fb.currentUser());
    }

    const verifiedUser = await this.client.getMe();
    console.log('[Spotify][loginUser] Verified Spotify user', verifiedUser);
    const { email, id } = verifiedUser;

    return fb.auth.signInWithEmailAndPassword(email, id).then(userCredentials => {
      // User exists
      return userCredentials.user;
    }).catch(error => {
      // User does not exist
      console.error(error.message);
      console.log("[Spotify][loginUser] Creating new user");
      return fb.auth.createUserWithEmailAndPassword(email, id).then(userCredentials => {
        const user = userCredentials.user;
        if (user != null) {
          user.updateProfile({
            displayName: verifiedUser.display_name
          });
        }
        return user;
      });
    });

  }

  saveToLocalStorage = () => {
    const localStorageData = {
      access_token: this.spotifyUser(),
      refresh_token: refreshToken,
      expires_at: Math.round(Date.now() / 1000 + tokenExpiresIn),
    };

    localStorage.setItem('spotify_data', JSON.stringify(localStorageData));
  };

  refreshTokenCallback = () => {
    console.log('[Spotify][refreshTokenCallback]');
    const refreshFunction = fb.functions.httpsCallable('refreshToken');
    refreshFunction({ refreshToken }).then(res => {
      const { data } = res;
      tokenExpiresIn = data.expires_in;
      this.client.setAccessToken(data.access_token);
      this.saveToLocalStorage();
      console.info('[Spotify][refreshTokenCallback] New access token', data.access_token);
    });

    setTimeout(this.refreshTokenCallback, tokenExpiresIn * 1000 - 3000);
  }

  createParty = () => {
    console.log('[Spotify][createParty] Creating party')
  };

}

export default Spotify;