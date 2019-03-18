import React from 'react';
import * as oauth2 from 'simple-oauth2';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';

const Auth = (props) => {
  console.log(props);
  let query = props.location.search.substring(1);
  let vars = query.split('&');
  let params = {};
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    params.pair[0] = pair[1];
    /* if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    } */
  }
  /* console.log('Query variable %s not found', variable); */

  if ('error' in params || !'code' in params) {
    // TODO: Handle error
  }
  else {
    const tokenConfig = {
      code: params.code,
      // Create new component to be directed to, and remove this in spotify app as allowed
      redirect_uri: 'http://localhost:3000/',
      scope: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
    };

    try {
      const result = await oauth2.authorizationCode.getToken(tokenConfig)
      const accessToken = oauth2.accessToken.create(result);
    } catch (error) {
      console.log('Access Token Error', error.message);
    }
  }
};

export default Auth;
