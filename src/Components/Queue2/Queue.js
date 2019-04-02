import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { withStyles, Typography, List } from '@material-ui/core';
import { withFirebase } from '../../Firebase';
import { SongListItem, SongItem } from '../SongItem';

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexGrow: '1',
    height: `calc(100% - ${theme.spacing.unit * 8}px)`,
    padding: theme.spacing.unit,
  },
  text: {
    color: theme.palette.common.white,
  },
});

const Queue = (props) => {
  const { classes, partyId, firebase } = props;

  const [songs, setSongs] = useState([]);

  const queue = firebase.db
    .collection('parties')
    .doc(partyId)
    .collection('queue');

  useEffect(() => {
    const unsubscribeParty = firebase.partyQueueRef(partyId).onSnapshot((snap) => {
      const newSongs = [];
      snap.forEach(songDoc => newSongs.push(songDoc.data()));
      setSongs(songs.concat(newSongs));
    });

    return () => {
      unsubscribeParty();
    };
  }, []);

  // Get upvotes and downvotes for uid
  // Might be a race cond. here
  songs.forEach((song) => {
    // Cannot get uid outside this foreach for some reason
    const uid = firebase.currentUser().uid;
    queue.doc(song.id).collection('likes').doc(uid).get()
      .then((like) => {
        if (like.exists) {
          song.upvote = true;
          song.downvote = false;
        }
      })
      .catch((err) => {
        console.error('[Queue] Error checking for likes', err);
      });
    queue.doc(song.id).collection('dislikes').doc(uid).get()
      .then((dislike) => {
        if (dislike.exists) {
          song.upvote = false;
          song.downvote = true;
        }
      })
      .catch((err) => {
        console.error('[Queue] Error checking for dislikes', err);
      });
  });

  // Make this more DRY?
  const changeVote = (up, down, id) => {
    const votes = queue.doc(id);
    const uid = firebase.currentUser().uid;
    if (up) {
      votes.collection('likes').doc(uid).set({})
        .then(() => {
          console.log('[Queue] Upvote added');
        })
        .catch((err) => {
          console.error('[Queue] Error adding upvote', err);
        });
    } else {
      votes.collection('likes').doc(uid).delete()
        .then(() => {
          console.log('[Queue] Upvote deleted');
        })
        .catch((err) => {
          console.error('[Queue] Error deleting upvote', err);
        });
    }
    if (down) {
      votes.collection('dislikes').doc(uid).set({})
        .then(() => {
          console.log('[Queue] Downvote added');
        })
        .catch((err) => {
          console.error('[Queue] Error adding downvote', err);
        });
    } else {
      votes.collection('dislikes').doc(uid).delete()
        .then(() => {
          console.log('[Queue] Downvote deleted');
        })
        .catch((err) => {
          console.error('[Queue] Error deleting downvote', err);
        });
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.text}>
        Now playing
      </Typography>

      <List>
        <SongItem
          key="Give you up"
          name="Give you up"
          artists={['Rick']}
          album="pW0ned"
          albumUrl="https://www.femalefirst.co.uk/image-library/square/1000/r/rick-astley-whenever-you-need-somebody-album-cover.jpg"
        />
      </List>

      <Typography variant="h6" className={classes.text}>
        Queue
      </Typography>

      <List>
        {songs.map(song => (
          <SongListItem
            key={song.name}
            name={song.name}
            artists={song.artists}
            album={song.album.name}
            albumUrl={song.album.images[2].url}
            id={song.id}
            changeVote={changeVote}
            upvoteBefore={song.upvote}
            downvoteBefore={song.downvote}
          />
        ))}
      </List>
    </div>
  );
};

export default compose(
  withStyles(styles),
  withFirebase,
)(Queue);
