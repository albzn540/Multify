import React from 'react';
import { compose } from 'recompose';
import {
  withStyles, ListItem, ListItemText,
} from '@material-ui/core';

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
});

const SongListItem = (props) => {
  const {
    classes, name, artists, album, albumUrl,
  } = props;

  const concatArtists = artists.join(', ');

  const artistAndAlbum = `${concatArtists} - ${album}`;

  return (
    <ListItem className={classes.root}>
      <img
        alt="Album art"
        className={classes.img}
        src={albumUrl}
      />
      <ListItemText
        primary={name}
        secondary={artistAndAlbum}
        primaryTypographyProps={{ className: classes.primaryText }}
      />
      Place final number of votes here?
    </ListItem>

  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(SongListItem);
