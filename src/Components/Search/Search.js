import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
} from '@material-ui/core';

import SearchBar from './SearchBar';
import SearchList from './SearchList';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
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
  }

  handleChange(event) {
    console.log('handling');
    const searchStr = event.value;
    const { spotify } = this.props;
    const items = [];
    spotify.client.searchTracks(searchStr)
      .then((data) => {
        console.log('[SearchList] Found tracks', data);
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
      }, (err) => {
        console.log('[SearchList] Search error:', err);
      });

    this.setState({
      tracks: items,
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
        <SearchList tracks={tracks} />
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
)(Search);
