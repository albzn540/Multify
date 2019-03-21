import React from 'react';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  SvgIcon,
  IconButton,
  Typography,
} from '@material-ui/core';
import { compose } from 'recompose';

const styles = theme => ({
  listText: {
    color: theme.palette.white.main,
  },
  listSubText: {
    color: theme.palette.lightGrey.main,
  },
});

const SearchListItem = (props) => {
  const {
    album,
    artists,
    id,
    name,
    uri,
    classes,
    addTrack,
  } = props;

  // Todo: fix space after last artist
  return (
    <ListItem>
      <ListItemText
        disableTypography
        primary={(
          <Typography
            className={classes.listText}
          >
            {name}
          </Typography>
        )}
        secondary={(
          <Typography
            className={classes.listSubText}
          >
            {`${album.name} - ${artists.map(artist => `${artist.name} `)}`}
          </Typography>
        )}
      />
      <ListItemSecondaryAction>
        <IconButton
          aria-label="Delete"
          onClick={() => addTrack({
            id,
            artists,
            name,
            album,
          }, uri)}
        >
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
