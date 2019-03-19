import React from 'react';
import * as oauth2 from 'simple-oauth2';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';

// Do we even need this here?
const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  logo: {
    color: theme.palette.green.main,
    paddingBottom: '80px',
    fontSize: '160px',
  },
  button: {
    borderRadius: '50px',
    marginBottom: '10px',
  },
  buttonText: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
});

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

  if ('error' in params || !('code' in params)) {
    // TODO: Handle error
  } else {
    /* const tokenConfig = {
      code: params.code,
      // Create new component to be directed to, and remove this in spotify app as allowed
      redirect_uri: 'http://localhost:3000/',
      scope: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
    }; */

    /* try {
      // Need to pass the auth variable through props (compose?) from Landing
      const result = await auth.authorizationCode.getToken(tokenConfig)
      const accessToken = auth.accessToken.create(result);
      console.log(accessToken);
    } catch (error) {
      console.log('Access Token Error', error.message);
    } */
  }
};

export default compose(
  withStyles(styles),
)(Auth);
