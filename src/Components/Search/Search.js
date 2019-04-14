import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import isMobile from 'react-device-detect';
import SearchBar from './SearchBar';
import SearchList from './SearchList';
import DropContainer from './DropContainer';
import Queue from '../Queue';
import { withSpotify } from '../../Spotify';
import { withFirebase } from '../../Firebase';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
});

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      partyId: props.partyId,
      loading: false,
      noResults: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTrack = this.addTrack.bind(this);
  }

  // Drag and drop logic starts here

  onDragStart = (e, draggedTrack) => {
    console.debug('Started dragging');
    const stringified = JSON.stringify(draggedTrack);
    e.dataTransfer.setData('track', stringified);
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDrop = (e) => {
    const droppedTrack = JSON.parse(e.dataTransfer.getData('track'));
    console.debug('Track data:', droppedTrack);
    this.addTrack(droppedTrack);
  }

  /**
   * Initiates loading when user has pressed enter to confirm search
   */
  keyPress = (event, onChange) => {
    if (event.key === 'Enter') {
      onChange(event.target);
      this.setState({
        loading: true,
      });
      event.preventDefault();
    }
  };

  /**
   * Searches for tracks when the keyPress function is fired
   * @param {Event} event
   */
  handleChange(event) {
    const searchStr = event.value;
    const { spotify } = this.props;
    const items = [];
    spotify.client.searchTracks(searchStr)
      .then((data) => {
        console.info('[SearchList] Found tracks', data);
        if (data.tracks.items.length === 0) {
          this.setState({
            noResults: true,
            loading: false,
          });
        } else {
          data.tracks.items.forEach((track) => {
            const item = {
              album: track.album,
              artists: track.artists,
              id: track.id,
              name: track.name,
              uri: track.uri,
            };
            items.push(item);
          });
          this.setState({
            tracks: items,
            loading: false,
            noResults: false,
          });
        }
      }, (err) => {
        console.error('[SearchList] Search error:', err);
      });
  }

  /**
   * A track has its important features stripped and added to firestore
   * @param {Object} track
   */
  addTrack(track) {
    const { partyId } = this.state;
    const reducedTrack = {
      id: track.id,
      uri: track.uri,
      artists: track.artists.map(artist => artist.name),
      name: track.name,
      likes: 0,
      album: {
        images: track.album.images,
        name: track.album.name,
      },
      timeStamp: Date.now(),
    };
    const { firebase } = this.props;
    firebase.db.collection('parties').doc(partyId)
      .collection('queue').doc(track.id)
      .set(reducedTrack)
      .then(() => {
        console.log('[Search] Track added!');
      })
      .catch((err) => {
        console.error('[Search] Error adding track!', err);
      });
  }

  render() {
    const { classes, partyId } = this.props;
    const { tracks, loading, noResults } = this.state;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.root}
        spacing={24}
      >
        <SearchBar onChange={this.handleChange} keyPress={this.keyPress} />
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="center"
          spacing={24}
        >
          {isMobile ? (
            <div />
          ) : (
            <Grid item xs={6}>
              <DropContainer
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
              />
              <Queue partyId={partyId} />
            </Grid>
          )}
          <Grid item xs={6}>
            {loading ? (
              <Grid
                container
                alignItems="center"
                justify="center"
              >
                <CircularProgress color="primary" />
              </Grid>
            ) : (
              <div>
                {noResults ? (
                  <Grid
                    container
                    alignItems="center"
                    justify="center"
                  >
                    <Typography>No results</Typography>
                  </Grid>
                ) : (
                  <Grid
                    container
                    alignItems="center"
                    justify="center"
                  >
                    <SearchList
                      tracks={tracks}
                      addTrack={this.addTrack}
                      onDragStart={this.onDragStart}
                    />
                  </Grid>
                )}
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
  withFirebase,
)(Search);
