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
    classes,
    name,
    artists,
    album,
    albumUrl,
    songRef,
    id,
    spotify,
    setLikes,
  } = props;

  const uuid = spotify.uuid;
  const [vote, setVote] = useState(null);
  const concatArtists = artists.join(', ');
  const artistAndAlbum = `${concatArtists} - ${album}`;

  const likeRef = songRef.collection('likes');
  const dislikeRef = songRef.collection('dislikes');

  let likes = 0;
  let dislikes = 0;
  let isLiked = null;

  const countLikes = () => {
    setLikes(id, likes - dislikes);
  };

  useEffect(() => {
    const handleLikeChange = (snap) => {
      likes = 0;
      snap.forEach((user) => {
        likes += 1;
        if (user.id === uuid) {
          isLiked = true;
        }
      });
      setVote(isLiked);
      countLikes();
    };

    const handleDislikeChange = (snap) => {
      dislikes = 0;
      snap.forEach((user) => {
        dislikes += 1;
        if (user.id === uuid) {
          isLiked = false;
        }
      });
      setVote(isLiked);
      countLikes();
    };

    const unsubscribeLikeChanges = likeRef
      .onSnapshot(likeSnap => handleLikeChange(likeSnap));
    const unsubscribeDislikeChanges = dislikeRef
      .onSnapshot(dislikeSnap => handleDislikeChange(dislikeSnap));

    return () => {
      unsubscribeLikeChanges();
      unsubscribeDislikeChanges();
    };
  }, []);

  const pushVoteToFirebase = (newVote) => {
    likeRef.doc(uuid).delete();
    dislikeRef.doc(uuid).delete();
    if (newVote) {
      likeRef.doc(uuid).set({});
    } else if (newVote === false) {
      dislikeRef.doc(uuid).set({});
    }
  };

  const toggleVote = (direction) => {
    let newVote = null;
    if (direction) {
      newVote = vote ? null : true;
    } else {
      newVote = vote !== false ? false : null;
    }
    setVote(newVote);
    pushVoteToFirebase(newVote);
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
          onClick={() => toggleVote(false)}
        >
          <Downvote className={{
            [classes.buttonSelected]: vote === false,
            [classes.buttonDeselected]: vote !== false,
          }}
          />
        </IconButton>
        <IconButton
          aria-label="Upvote"
          onClick={() => toggleVote(true)}
        >
          <Upvote className={{
            [classes.buttonSelected]: vote === true,
            [classes.buttonDeselected]: vote !== true,
          }}
          />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(SongListItem);
