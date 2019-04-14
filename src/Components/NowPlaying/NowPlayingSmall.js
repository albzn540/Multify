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
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  img: {
    maxHeight: `${ListItemHeight - 2 * theme.spacing.unit}px`,
    width: 'auto',
  },
  voteButton: {
    color: theme.palette.common.white,
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

  const getCurrentlyPlaying = () => {
    spotify.nowPlaying().then((newTrack) => {
      if (typeof newTrack === 'string' && newTrack.length === 0) {
        return;
      }
      let timeLeft = newTrack.item.duration_ms - newTrack.progress_ms;
      // We want to check the currently playing track often in case the track
      // is manually skipped, fast fowarded or something similar
      timeLeft = timeLeft < 1000 ? timeLeft : 1000;

      if (timeLeft > 1000) {
        // We don't want to flood the console
        console.log(`[NowPlayingSmall][getCurrentlyPlaying] Now playing "${newTrack.item.name}"`, newTrack);
        console.debug(`[NowPlayingSmall][getCurrentlyPlaying] Fetching again in ${timeLeft} ms`);
      }

      setTimeout(getCurrentlyPlaying, timeLeft);
      handleTrack(newTrack.item);
    });
  };

  useEffect(() => {
    getCurrentlyPlaying();
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
          primaryTypographyProps={{ className: classes.primaryText }}
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
