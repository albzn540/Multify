import React from 'react';
import { compose } from 'recompose';
import {
  withStyles, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import Downvote from '../../Constants/Icons/Downvote';
import Upvote from '../../Constants/Icons/Upvote';


const ListItemHeight = 60;

const styles = theme => ({
  root: {
    height: `${ListItemHeight}px`,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  img: {
    maxHeight: `${ListItemHeight - 2 * theme.spacing.unit}px`,
    width: 'auto',
  },
  voteButton: {
    color: theme.palette.common.white,
  },
  primaryText: {
    color: theme.palette.common.white,
    // fontWeight: '600',
  },
  secondaryText: {
    color: theme.palette.common.white,
    // fontWeight: '600',
  },
});

const SongListItem = (props) => {
  let { theme, classes, title, artist, album, albumUrl } = props;

  albumUrl = "https://about.canva.com/wp-content/uploads/sites/3/2015/01/album-cover.png";
  title = "Cool beans";
  album = "Adventure";
  artist = "Pink guy";

  const artistAndAlbum = `${artist} - ${album}`;

  return (
    <ListItem className={classes.root}>
      <img
        alt="Album art"
        className={classes.img}
        src={albumUrl}
      />
      <ListItemText
        primary={title}
        secondary={artistAndAlbum}
        primaryTypographyProps={{ className: classes.primaryText }}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Downvote">
          <Downvote className={classes.voteButton} />
        </IconButton>
        <IconButton aria-label="Upvote">
          <Upvote className={classes.voteButton} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>

  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(SongListItem);
