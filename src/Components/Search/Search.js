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
import DropContainer from './DropContainer';
import SearchList from './SearchList';
import Queue from '../Queue';
import UserPlaylists from '../UserPlaylists';
import NotificationBar from '../NotificationBar';
import { withSpotify } from '../../Spotify';
import { withFirebase } from '../../Firebase';

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
      noResults: false,
      notifs: [],
    };
  }

  onDragStart = (e, draggedTrack) => {
    const stringified = JSON.stringify(draggedTrack);
    e.dataTransfer.setData('track', stringified);
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDrop = (e) => {
    const { notifs } = this.state;
    const { spotify, partyId } = this.props;
    const droppedTrack = JSON.parse(e.dataTransfer.getData('track'));
    console.debug('Track data:', droppedTrack);
    spotify.addTrack(droppedTrack, partyId);
    this.setState({
      notifs: [{
        message: 'Track added',
        key: new Date().getTime(),
      }, ...notifs],
    });
  }

  /**
   * Handles searches
   */
  formSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { searchQuery, notifs } = this.state;
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
            noResults: true,
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
            noResults: false,
          });
        }
      }, (err) => {
        console.error('[SearchList] Search error:', err);
        this.setState({
          notifs: [{
            message: 'Could not search for tracks',
            key: new Date().getTime(),
          }, ...notifs],
        });
      });
  };

  render() {
    const {
      tracks,
      isLoading,
      searchQuery,
      noResults,
      notifs,
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

        <UserPlaylists />

        <Hidden only={['sm', 'xs']}>
          <div className={classes.desktopWrapper}>
            <Grid
              container
              direction="row"
              spacing={32}
            >
              <Grid item md={6}>
                <DropContainer
                  onDragOver={this.onDragOver}
                  onDrop={this.onDrop}
                />
                <Queue partyId={partyId} />
              </Grid>
              <Grid item md={6}>
                {isLoading ? (
                  <CircularProgress color="primary" />
                ) : (
                  <div>
                    {noResults ? (
                      <Typography color="primary">No results</Typography>
                    ) : (
                      <SearchList
                        tracks={tracks}
                        onDragStart={this.onDragStart}
                        partyId={partyId}
                      />
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </Hidden>

        <Hidden only={['lg', 'md', 'xl']}>
          <Grid item xs={12}>
            {isLoading ? (
              <CircularProgress color="primary" />
            ) : (
              <div>
                {noResults ? (
                  <Typography color="primary">No results</Typography>
                ) : (
                  <SearchList
                    tracks={tracks}
                    onDragStart={this.onDragStart}
                    partyId={partyId}
                  />
                )}
              </div>
            )}
          </Grid>
        </Hidden>
        <NotificationBar queue={notifs} />
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
  withFirebase,
)(Search);
