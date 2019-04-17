import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  CircularProgress,
  Typography,
  TextField,
  Hidden,
} from '@material-ui/core';
// import isMobile from 'react-device-detect';
import SearchList from './SearchList';
import DropContainer from './DropContainer';
import Queue from '../Queue';
import { withSpotify } from '../../Spotify';
import { withFirebase } from '../../Firebase';
// import Draggable2 from './Draggable2';

const isMobile = false;

const styles = theme => ({
  textField: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    width: '90vw',
  },
  cssLabel: {
    color: theme.palette.secondary.main,
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.common.green} !important`,
    },
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: '1px',
    borderColor: `${theme.palette.secondary.main} !important`,
  },
  multilineColor: {
    color: theme.palette.secondary.main,
  },
  progressWrapper: {
    height: '80vh',
  },
  desktopWrapper: {
    width: '100vw',
    paddingLeft: theme.spacing.unit * 8,
    paddingRight: theme.spacing.unit * 8,
  },
});

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      isLoading: false,
      searchQuery: '',
    };
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
   * Handles searches
   */
  formSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { searchQuery } = this.state;
    const { spotify } = this.props;

    const items = [];
    spotify.client.searchTracks(searchQuery)
      .then((data) => {
        console.info('[SearchList] Found tracks', data);
        const searchResult = data.tracks.items;
        if (searchResult.length === 0) {
          this.setState({
            tracks: [],
            isLoading: false,
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
            isLoading: false,
          });
        }
      }, (err) => {
        console.error('[SearchList] Search error:', err);
      });
  };

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
      tracks,
      isLoading,
      searchQuery,
      noResults,
      top,
      bottom,
      right,
      left,
    } = this.state;
    const { classes, partyId } = this.props;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
      >
        <Grid item>
          <form onSubmit={e => this.formSubmit(e)}>
            <TextField
              id="search-field"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={e => this.setState({ searchQuery: e.target.value })}
              className={classes.textField}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                  input: classes.multilineColor,
                },
              }}
            />
          </form>
        </Grid>

        {isLoading ? <CircularProgress color="primary" /> : null}

        <Hidden only={['sm', 'xs']}>
          <div className={classes.desktopWrapper}>
            <Grid
              container
              direction="row"
              spacing={32}
            >
              <Grid item md={6}>
                <Queue partyId={partyId} />
              </Grid>
              <Grid item md={6}>
                {tracks.length > 0 ? (
                  <SearchList
                    tracks={tracks}
                    onDragStart={this.onDragStart}
                    partyId={partyId}
                  />
                ) : (
                  <Typography color="primary">No results</Typography>
                )}
              </Grid>
            </Grid>
          </div>
        </Hidden>

        <Hidden only={['lg', 'md', 'xl']}>
          <Grid item xs={12}>
            {tracks.length > 0 ? (
              <SearchList
                tracks={tracks}
                onDragStart={this.onDragStart}
                partyId={partyId}
              />
            ) : (
              <Typography color="primary">No results</Typography>
            )}
          </Grid>
        </Hidden>
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
  withFirebase,
)(Search);
