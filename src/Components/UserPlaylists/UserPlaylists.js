import React from 'react';
import { withSpotify } from '../../Spotify';

const UserPlaylists = (props) => {
  const { spotify } = props;

  spotify.getUserPlaylists();

  return (
    <div />
  );
};

export default (withSpotify)(UserPlaylists);
