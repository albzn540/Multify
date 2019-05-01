import React from 'react';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  List,
  Grid,
} from '@material-ui/core';
import { compose } from 'recompose';
import Add from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotificationBar from '../NotificationBar';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    width: '100%',
    // height: '80vh',
    // overflow: 'auto',
  },
  list: {
    height: '70vh',
    overflow: 'auto',
    paddingBottom: theme.spacing.unit,
  },
  listText: {
    color: theme.palette.secondary.main,
  },
  listSubText: {
    color: theme.palette.common.lightGrey,
  },
  img: {
    maxHeight: `${5 * theme.spacing.unit}px`,
    width: 'auto',
  },
  directionButton: {
    color: theme.palette.secondary.main,
  },
});

class UserPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      next: '',
      prev: '',
      hasNext: false,
      hasPrev: false,
      notifs: [],
    };
  }

  componentDidMount() {
    const { spotify } = this.props;
    this.getPlaylists();
    this.removeObserver = spotify.addObserver(this.getPlaylists, ['accesstoken']);
  }

  componentWillUnmount() {
    this.removeObserver();
  }

  getPlaylists = () => {
    const { spotify } = this.props;

    spotify.client.getUserPlaylists()
      .then((data) => {
        if (data.next) {
          this.setState({
            playlists: data.items,
            next: data.next,
            hasNext: true,
          });
        } else {
          this.setState({
            playlists: data.items,
          });
        }
      });
  };

  /**
   * Search next or previous 20 playlists of current user
   */
  switchPlaylistsViewed = (url) => {
    const { spotify } = this.props;

    spotify.client.getGeneric(url)
      .then((data) => {
        let next = false;
        let prev = false;
        if (data.next) {
          next = true;
        }
        if (data.previous) {
          prev = true;
        }
        this.setState({
          playlists: data.items,
          hasNext: next,
          hasPrev: prev,
          next: next ? data.next : '',
          prev: prev ? data.previous : '',
        });
      });
  };

  /**
   * Add all tracks from a chosen playlists to queue
   */
  selectFallbackPlaylist = (id) => {
    const { spotify } = this.props;
    spotify.addFallbackTracks(id);
  };

  renderPlaylists = () => {
    const { classes } = this.props;
    const { playlists, notifs } = this.state;

    return playlists.map((list) => {
      let image = '';
      if (list.images.length <= 0) {
        // Add a defualt image if no playlist image is present
        image = 'https://spotify.i.lithium.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=1.0';
      } else {
        image = list.images[0].url;
      }
      return (
        <ListItem
          key={list.id}
          divider
        >
          <img
            alt="Album art"
            className={classes.img}
            src={image}
          />
          <ListItemText
            disableTypography
            primary={(
              <Typography
                className={classes.listText}
                noWrap
              >
                {list.name}
              </Typography>
            )}
            secondary={(
              <Typography
                className={classes.listSubText}
                noWrap
              >
                {`Created by: ${list.owner.display_name}`}
              </Typography>
            )}
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                this.selectFallbackPlaylist(list.id);
                this.setState({
                  notifs: [{
                    message: 'Tracks added from fallback playlist',
                    key: new Date().getTime(),
                  }, ...notifs],
                });
              }}
            >
              <Add />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  render() {
    const { classes } = this.props;
    const {
      notifs,
      next,
      prev,
      hasNext,
      hasPrev,
    } = this.state;

    return (
      <div className={classes.root}>
        <Grid container direction="column">
          <List dense={false} className={classes.list}>
            {this.renderPlaylists()}
          </List>

          <Grid container justify="space-around">
            <Button
              variant="contained"
              disabled={!hasPrev}
              onClick={() => {
                this.switchPlaylistsViewed(prev);
                window.scrollTo(0, 0);
              }}
              className={classes.directionButton}
              color="primary"
            >
              <ChevronLeftIcon />
              Previous
            </Button>

            <Button
              variant="contained"
              disabled={!hasNext}
              onClick={() => {
                this.switchPlaylistsViewed(next);
                window.scrollTo(0, 0);
              }}
              className={classes.directionButton}
              color="primary"
            >
              Next
              <ChevronRightIcon />
            </Button>
          </Grid>
        </Grid>
        <NotificationBar queue={notifs} />
      </div>
    );
  }
}

export default compose(
  withSpotify,
  withStyles(styles, { withTheme: true }),
)(UserPlaylists);
