import React, { useState } from 'react';
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
  buttonSelected: {
    color: theme.palette.common.green,
  },
  buttonDeselected: {
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
    classes, name, artists, album, albumUrl, id, changeVote,
  } = props;

  const [upvoted, setUpvote] = useState(false);
  const [downvoted, setDownvote] = useState(false);

  const concatArtists = artists.join(', ');

  const artistAndAlbum = `${concatArtists} - ${album}`;

  /**
   * Upvote and downvote takes place inside the list item file
   * to give imidiate feedback
   *
   * Feels like DRY may not work here, but should be considered
   * for improvement
   */
  const toggleUpvote = () => {
    if (downvoted) {
      setUpvote(true);
      setDownvote(false);
      // Add upvote and remove downvote
      changeVote(true, false, id);
    } else if (upvoted) {
      setUpvote(false);
      // Remove upvote
      changeVote(false, false, id);
    } else {
      setUpvote(true);
      // Add upvote
      changeVote(true, false, id);
    }
  };
  const toggleDownvote = () => {
    if (upvoted) {
      setUpvote(false);
      setDownvote(true);
      // Add downvote and remove upvote
      changeVote(false, true, id);
    } else if (downvoted) {
      setDownvote(false);
      // Remove downvote
      changeVote(false, false, id);
    } else {
      setDownvote(true);
      // Add downvote
      changeVote(false, true, id);
    }
  };

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
        <IconButton
          aria-label="Downvote"
          onClick={() => toggleDownvote()}
        >
          <Downvote className={{
            [classes.buttonSelected]: downvoted,
            [classes.buttonDeselected]: !downvoted,
          }}
          />
        </IconButton>
        <IconButton
          aria-label="Upvote"
          onClick={() => toggleUpvote()}
        >
          <Upvote className={{
            [classes.buttonSelected]: upvoted,
            [classes.buttonDeselected]: !upvoted,
          }}
          />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>

  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(SongListItem);
