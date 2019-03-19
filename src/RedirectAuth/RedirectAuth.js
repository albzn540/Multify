import React from 'react';
import { withSpotify } from '../Spotify';


const RedirectAuth = props => {
  console.log('[RedirectAuth] Redirect Auth page');
  console.log(props);

  const { spotify } = props;

  const query = props.location.search.substring(1);
  const vars = query.split('&');
  const params = {};

  vars.forEach(value => {
    const pair = value.split('=');
    params[pair[0]] = pair[1];
  })
  
  spotify.codeCallback(params);

  return (
    <div>
      Redirect auth page
    </div>
  )
};

export default withSpotify(RedirectAuth);