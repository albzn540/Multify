import React from 'react';
import { compose } from 'recompose';
import { Redirect } from 'react-router-dom';
import { withSpotify } from '../../Spotify';

const RedirectParty = (props) => {
  // Check cookies for last party
  const lastParty = localStorage.getItem('last_party');
  let url = '/';
  if (lastParty) {
    const partyId = lastParty.replace(/"/g, '');
    url = `${props.location.pathname}/${partyId}`;
  }

  console.debug('Redirecting to', url);
  return (
    <Redirect to={url} />
  );
};

export default compose(
  withSpotify,
)(RedirectParty);
