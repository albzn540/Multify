import React from 'react';
import { withSpotify } from '../Spotify';

const RedirectAuth = (props) => {
  console.log('[RedirectAuth] Redirect Auth page');
  const { spotify, location } = props;

  const query = location.search.substring(1);
  const vars = query.split('&');
  const params = {};

  vars.forEach((value) => {
    const pair = value.split('=');
    params[pair[0]] = pair[1];
  });

  const url = location.pathname + location.search;

  const codeCallback = () => {
    spotify.codeCallback(params, url).then(() => {
      console.log('Awesome');
    }).catch((e) => {
      console.log(e);
    });
  };

  return (
    <div>
      Redirect auth page

      <button onClick={() => codeCallback()}>
        Get tokn
      </button>
      <button onClick={() => spotify.test()}>
        REFRESH THAT SHIT
      </button>
    </div>
  );
};

export default withSpotify(RedirectAuth);
