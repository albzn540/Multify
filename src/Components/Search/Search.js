import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
import SearchBar from './SearchBar';
import SearchList from './SearchList';
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
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTrack = this.addTrack.bind(this);
  }

  keyPress = (event, onChange) => {
    if (event.key === 'Enter') {
      onChange(event.target);
      this.setState({
        loading: true,
      });
      event.preventDefault();
    }
  };

  handleChange(event) {
    const searchStr = event.value;
    const { spotify } = this.props;
    const items = [];
    spotify.client.searchTracks(searchStr)
      .then((data) => {
        console.info('[SearchList] Found tracks', data);
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
        });
      }, (err) => {
        console.error('[SearchList] Search error:', err);
      });
  }

  addTrack(track) {
    const { partyId } = this.state;
    const reducedTrack = {
      id: track.id,
      uri: track.uri,
      artists: track.artists.map(artist => artist.name),
      name: track.name,
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
    const { classes } = this.props;
    const { tracks, loading } = this.state;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.root}
        spacing={16}
      >
        <SearchBar onChange={this.handleChange} keyPress={this.keyPress} />
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <SearchList tracks={tracks} addTrack={this.addTrack} />
        )}
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
  withFirebase,
)(Search);
