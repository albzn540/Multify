import SpotifyWebApi from 'spotify-web-api-js';
import oauth2 from 'simple-oauth2';

const config = {
  redirectUri: 'http://localhost:3000/redirectauth/',
  scope: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
};

const credentials = {
  client: {
    id: process.env.REACT_APP_SPOTIFY_ID,
    secret: process.env.REACT_APP_SPOTIFY_SECRET,
  },
  auth: {
    tokenHost: 'https://accounts.spotify.com',
    authorizePath: '/authorize',
    tokenPath: '/api/token/',
  },
};

const authClient = oauth2.create(credentials);

class Spotify {
  constructor() {
    this.client = new SpotifyWebApi();
  }

  authorizeWithSignIn() {
    console.log('[Spotify] Signing in?');
    window.location.assign(authClient.authorizationCode.authorizeURL({
      redirect_uri: config.redirectUri,
      scope: config.scope,
    }));
  };

  async codeCallback(params) {
    console.log('[Spotify] Answer from Spotify', params);
    if (params.error || !params.code) {
      console.error('[Spotify] Something went wrong', params);
    } else {
      const tokenConfig = {
        code: params.code,
        // redirect_uri: 'http://localhost:3000/callback',
        // scope: config.scope,
      };
      try {
        const result = await authClient.authorizationCode.getToken(tokenConfig);
        const accessToken = authClient.accessToken.create(result);
        this.client.setAccessToken(accessToken);
        console.log('[Spotify] Access granted!', accessToken);
      } catch (error) {
        console.error('[Spotify] Access Token Error', error);
      }
    }
  };

}

export default Spotify;