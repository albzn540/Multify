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
  const [votes, setVotes] = useState({});

  const queue = firebase.db
    .collection('parties')
    .doc(partyId)
    .collection('queue');

  /* const getVotes = (() => {
    // Get upvotes and downvotes for uid
    // Might be a race cond. here if songs isn't ready
    setVotes({});
    songs.forEach((song) => {
      // Cannot get uid outside this foreach for some reason
      const uid = firebase.currentUser().uid;
      queue.doc(song.id).collection('likes').doc(uid).get()
        .then((like) => {
          if (like.exists) {
            votes[song.id] = {
              upvote: true,
              downvote: false,
            };
            setVotes(votes);
          } else {
            queue.doc(song.id).collection('dislikes').doc(uid).get()
              .then((dislike) => {
                if (dislike.exists) {
                  votes[song.id] = {
                    downvote: true,
                    upvote: false,
                  };
                  setVotes(votes);
                } else {
                  votes[song.id] = {
                    upvote: false,
                    downvote: false,
                  };
                  setVotes(votes);
                }
              })
              .catch((err) => {
                console.error('[Queue] Error checking for dislikes', err);
              });
          }
        })
        .catch((err) => {
          console.error('[Queue] Error checking for likes', err);
        });
    });
  }); */

  useEffect(() => {
    const unsubscribeParty = firebase.partyQueueRef(partyId).onSnapshot((snap) => {
      const uid = firebase.currentUser().uid;
      const newSongs = [];
      // snap.forEach(songDoc => newSongs.push(songDoc.data()));
      snap.forEach((songDoc) => {
        const id = songDoc.data().id;
        const songObj = songDoc.data();
        queue.doc(id).collection('likes').doc(uid).get()
          .then((like) => {
            if (like.exists) {
              songObj.liked = true;
              songObj.disliked = false;
              newSongs.push(songObj);
              setSongs(songs.concat(newSongs));
            } else {
              queue.doc(id).collection('dislikes').doc(uid).get()
                .then((dislike) => {
                  if (dislike.exists) {
                    songObj.liked = false;
                    songObj.disliked = true;
                    newSongs.push(songObj);
                    setSongs(songs.concat(newSongs));
                  } else {
                    songObj.liked = false;
                    songObj.disliked = false;
                    newSongs.push(songObj);
                    setSongs(songs.concat(newSongs));
                  }
                })
                .catch((err) => {
                  console.error('[Queue] Error checking for dislikes', err);
                });
            }
          })
          .catch((err) => {
            console.error('[Queue] Error checking for likes', err);
          });
      });
      // setSongs(songs.concat(newSongs));
    });

    return () => {
      unsubscribeParty();
    };
  }, []);

  // Make this more DRY?
  const changeVote = (up, down, id) => {
    const vote = queue.doc(id);
    const uid = firebase.currentUser().uid;
    if (up) {
      vote.collection('likes').doc(uid).set({})
        .then(() => {
          console.log('[Queue] Upvote added');
        })
        .catch((err) => {
          console.error('[Queue] Error adding upvote', err);
        });
    } else {
      vote.collection('likes').doc(uid).delete()
        .then(() => {
          console.log('[Queue] Upvote deleted');
        })
        .catch((err) => {
          console.error('[Queue] Error deleting upvote', err);
        });
    }
    if (down) {
      vote.collection('dislikes').doc(uid).set({})
        .then(() => {
          console.log('[Queue] Downvote added');
        })
        .catch((err) => {
          console.error('[Queue] Error adding downvote', err);
        });
    } else {
      vote.collection('dislikes').doc(uid).delete()
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
            upvoteBefore={song.liked}
            downvoteBefore={song.disliked}
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
