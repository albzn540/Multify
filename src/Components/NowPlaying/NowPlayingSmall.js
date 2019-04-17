import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import {
  withStyles, ListItem, ListItemText, Typography,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';

const ListItemHeight = 60;

const styles = theme => ({
  root: {
    height: `${ListItemHeight}px`,
    width: '100%',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  img: {
    maxHeight: `${ListItemHeight - 2 * theme.spacing.unit}px`,
    width: 'auto',
  },
  primaryText: {
    color: theme.palette.common.white,
  },
  secondaryText: {
    color: theme.palette.common.white,
  },
  textDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: `${ListItemHeight - 2 * theme.spacing.unit}px`,
  },
});

const NowPlayingSmall = (props) => {
  const { classes, spotify } = props;

  const [track, setTrack] = useState(null);

  const handleTrack = (newTrack) => {
    const concatArtists = newTrack.artists.map(artist => artist.name).join(', ');

    setTrack({
      name: newTrack.name,
      artistAndAlbum: `${concatArtists} - ${newTrack.album.name}`,
      albumUrl: newTrack.album.images[2].url,
    });
  };

  const updatePlaying = () => {
    console.log('Handle new track', spotify.currentlyPlaying.item);
    handleTrack(spotify.currentlyPlaying.item);
  };

  useEffect(() => {
    // check if a track is playing right now
    spotify.client.getMyCurrentPlaybackState().then((newTrack) => {
      if (newTrack.is_playing) {
        handleTrack(newTrack.item);
      }
    });

    // set up listener
    const currentlyPlayingSub = spotify.addObserver(updatePlaying, ['nowplaying']);
    return () => {
      currentlyPlayingSub();
    };
  }, []);

  return (
    track ? (
      <ListItem className={classes.root}>
        <img
          alt="Album art"
          className={classes.img}
          src={track.albumUrl}
        />
        <ListItemText
          primary={track.name}
          secondary={track.artistAndAlbum}
          primaryTypographyProps={{ className: classes.primaryText, noWrap: true }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItem>
    ) : (
      <div className={classes.textDiv}>
        <Typography
          color="primary"
        >
          Nothing's playing
        </Typography>
      </div>
    )
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(NowPlayingSmall);
