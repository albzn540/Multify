import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import {
  withStyles, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import Downvote from '../../Constants/Icons/Downvote';
import Upvote from '../../Constants/Icons/Upvote';
import { withSpotify } from '../../Spotify';


const ListItemHeight = 60;

const styles = theme => ({
  root: {
    height: `${ListItemHeight}px`,
    width: '90%',
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

const QueueListItem = (props) => {
  const {
    classes,
    name,
    artists,
    album,
    albumUrl,
    id,
    spotify,
    liked,
    trackRef,
  } = props;

  const [vote, setVote] = useState(liked);
  const concatArtists = artists.join(', ');
  const artistAndAlbum = `${concatArtists} - ${album}`;

  const likeRef = trackRef.collection('likes');
  const dislikeRef = trackRef.collection('dislikes');

  useEffect(() => {
    const unsubscribeLikeChanges = likeRef
      .onSnapshot(() => spotify.subscribeFirestore());
    const unsubscribeDislikeChanges = dislikeRef
      .onSnapshot(() => spotify.subscribeFirestore());

    return () => {
      unsubscribeLikeChanges();
      unsubscribeDislikeChanges();
    };
  }, []);

  /**
   * Toggle an up or down vote
   * @param {bool} direction - True for Up and False for Down
   */
  const toggleVote = (direction) => {
    let newVote = null;
    if (direction) {
      newVote = vote ? null : true;
    } else {
      newVote = vote !== false ? false : null;
    }
    setVote(newVote);
    spotify.voteTrack(id, newVote);
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
        primaryTypographyProps={{ className: classes.primaryText, noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
      />
      <ListItemSecondaryAction>
        <IconButton
          aria-label="Downvote"
          onClick={() => toggleVote(false)}
        >
          <Downvote className={vote === false ? (
            classes.buttonSelected
          ) : (
            classes.buttonDeselected
          )}
          />
        </IconButton>
        <IconButton
          aria-label="Upvote"
          onClick={() => toggleVote(true)}
        >
          <Upvote className={vote === true ? (
            classes.buttonSelected
          ) : (
            classes.buttonDeselected
          )}
          />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(QueueListItem);
