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
} from '@material-ui/core';
import { compose } from 'recompose';
import Add from '../../Constants/Icons/Add';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    width: '95%',
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
});

class UserPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      next: '',
      hasNext: false,
    };
    this.getPlaylists();
  }

  getPlaylists = () => {
    const { spotify } = this.props;
    const { playlists } = this.state;

    spotify.client.getUserPlaylists()
      .then((data) => {
        console.debug(data);
        if (data.next) {
          this.setState({
            playlists: [...playlists, ...data.items],
            next: data.next,
            hasNext: true,
          });
        } else {
          this.setState({
            playlists: [...playlists, ...data.items],
          });
        }
      });
  };

  getMore = (url) => {
    const { spotify } = this.props;
    const { playlists } = this.state;

    spotify.client.getGeneric(url)
      .then((data) => {
        if (data.next) {
          this.setState({
            playlists: [...playlists, ...data.items],
            next: data.next,
            hasNext: true,
          });
        } else {
          this.setState({
            playlists: [...playlists, ...data.items],
            hasNext: false,
            next: '',
          });
        }
      });
  };

  selectFallbackPlaylist = (id) => {
    const { spotify } = this.props;
    spotify.addFallbackTracks(id);
  };

  render() {
    const { classes } = this.props;
    const { playlists, hasNext, next } = this.state;

    const disabled = !hasNext;

    return (
      <div>
        <Button
          onClick={() => this.getPlaylists()}
        >
          Get playlists
        </Button>
        <Button
          disabled={disabled}
          onClick={() => this.getMore(next)}
        >
          Get more
        </Button>
        <List
          dense={false}
          className={classes.root}
        >
          {playlists.map((list) => {
            let image = '';
            if (list.images.length <= 0) {
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
                    }}
                  >
                    <Add />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default compose(
  withSpotify,
  withStyles(styles),
)(UserPlaylists);
