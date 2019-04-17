import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';
// import isMobile from 'react-device-detect';
import SearchBar from './SearchBar';
import SearchList from './SearchList';
import DropContainer from './DropContainer';
import Queue from '../Queue';
import { withSpotify } from '../../Spotify';
import { withFirebase } from '../../Firebase';
// import Draggable2 from './Draggable2';

const isMobile = false;

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.main,
  },
});

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      loading: false,
      noResults: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onDragStart = (e, draggedTrack) => {
    console.debug('Started dragging');
    const stringified = JSON.stringify(draggedTrack);
    e.dataTransfer.setData('track', stringified);
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDrop = (e) => {
    const { spotify, partyId } = this.props;
    const droppedTrack = JSON.parse(e.dataTransfer.getData('track'));
    console.debug('Track data:', droppedTrack);
    spotify.addTrack(droppedTrack, partyId);
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
  handleChange = (event) => {
    const searchStr = event.value;
    const { spotify } = this.props;
    const items = [];
    spotify.client.searchTracks(searchStr)
      .then((data) => {
        console.info('[SearchList] Found tracks', data);
        const searchResult = data.tracks.items;
        if (searchResult.length === 0) {
          this.setState({
            noResults: true,
            loading: false,
          });
        } else {
          searchResult.forEach((track) => {
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

  getCoords = () => {
    const el = document.getElementById('DropWrapper');
    let coords = null;
    if (el) {
      coords = el.getBoundingClientRect();
      this.setState({
        top: coords.top,
        bottom: coords.bottom,
        right: coords.right,
        left: coords.left,
      });
    }
  }

  componentDidMount = () => {
    this.getCoords();
    window.addEventListener('resize', this.getCoords);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.getCoords);
  }

  render() {
    const {
      classes,
      partyId,
    } = this.props;
    const {
      tracks,
      loading,
      noResults,
      top,
      bottom,
      right,
      left,
    } = this.state;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.root}
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
            null
          ) : (
            <Grid item xs={6}>
              <div id="DropWrapper">
                <DropContainer
                  onDragOver={this.onDragOver}
                  onDrop={this.onDrop}
                />
              </div>
              <Queue partyId={partyId} />
            </Grid>
          )}
          <Grid item xs={12} md={12}>
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
                      onDragStart={this.onDragStart}
                      partyId={partyId}
                      top={top}
                      bottom={bottom}
                      right={right}
                      left={left}
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
