import React from 'react';
import { withSpotify } from '../Spotify';

const RedirectAuth = (props) => {
  console.log('[RedirectAuth] Redirect Auth page');
  console.log(props);

  const { spotify, location } = props;

  const query = location.search.substring(1);
  const vars = query.split('&');
  const params = {};

  vars.forEach((value) => {
    const pair = value.split('=');
    params[pair[0]] = pair[1];
  });

  const url = location.pathname + location.search;
  spotify.codeCallback(params, url);

  return (
    <div>
      Redirect auth page
    </div>
  );
};

export default withSpotify(RedirectAuth);
