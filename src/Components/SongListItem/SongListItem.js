import React from 'react';
import { compose } from 'recompose';
import {
  withStyles, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import Downvote from '../../Constants/Icons/Downvote';
import Upvote from '../../Constants/Icons/Upvote';


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
    classes, name, artist, album, albumUrl,
  } = props;

  const artistAndAlbum = `${artist} - ${album}`;

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
      <ListItemSecondaryAction>
        <IconButton aria-label="Downvote">
          <Downvote className={classes.voteButton} />
        </IconButton>
        <IconButton aria-label="Upvote">
          <Upvote className={classes.voteButton} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>

  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(SongListItem);
