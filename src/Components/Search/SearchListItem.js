import React from 'react';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  SvgIcon,
  IconButton,
} from '@material-ui/core';
import { compose } from 'recompose';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
});

const SearchListItem = (props) => {
  const {
    album,
    artists,
    id,
    name,
    uri,
  } = props;

  // Todo: fix space after last artist
  return (
    <ListItem>
      <ListItemText
        primary={name}
        secondary={`${album.name} - ${artists.map(artist => `${artist.name} `)}`}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete">
          <SvgIcon>
            <path
              fill="#FFFFFF"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </SvgIcon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default compose(
  withStyles(styles),
)(SearchListItem);
