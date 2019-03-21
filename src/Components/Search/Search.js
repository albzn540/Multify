import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid } from '@material-ui/core';
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

const keyPress = (event, onChange) => {
  if (event.key === 'Enter') {
    onChange(event.target);
    event.preventDefault();
  }
};

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addTrack = this.addTrack.bind(this);
  }

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
        });
      }, (err) => {
        console.error('[SearchList] Search error:', err);
      });
  }

  addTrack(track, uri) {
    const reducedTrack = {
      id: track.id,
      artists: track.artists.map(artist => artist.name),
      name: track.name,
      album: {
        images: track.album.images,
        name: track.album.name,
      },
    };
    const { firebase } = this.props;
    firebase.db.collection('parties').doc('c9fjG0WmJ2BxWa9id1Rw')
      .collection('queue').doc(uri)
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
    const { tracks } = this.state;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.root}
        spacing={16}
      >
        <SearchBar onChange={this.handleChange} keyPress={keyPress} />
        <SearchList tracks={tracks} addTrack={this.addTrack} />
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
  withFirebase,
)(Search);
