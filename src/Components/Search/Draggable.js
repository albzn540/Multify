import React, { useState } from 'react';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@material-ui/core';
import { compose } from 'recompose';
import NotificationBar from '../NotificationBar';
import Add from '../../Constants/Icons/Add';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  listText: {
    color: theme.palette.secondary.main,
  },
  listSubText: {
    color: theme.palette.common.lightGrey,
  },
});

const Draggable = (props) => {
  const {
    album,
    artists,
    id,
    name,
    uri,
    classes,
    onDragStart,
    spotify,
    partyId,
  } = props;

  const track = {
    id,
    artists,
    uri,
    name,
    album,
  };
  const [notifs, setNotifs] = useState([]);

  return (
    <ListItem
      key={id}
      onDragStart={e => onDragStart(e, track)}
      draggable="true"
      divider
    >
      <ListItemText
        disableTypography
        primary={(
          <Typography
            className={classes.listText}
            noWrap
          >
            {name}
          </Typography>
        )}
        secondary={(
          <Typography
            className={classes.listSubText}
            noWrap
          >
            {`${album.name} -${artists.map(artist => ` ${artist.name}`)}`}
          </Typography>
          )}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => {
            spotify.addTrack(track, partyId);
            setNotifs([{
              message: 'Track added!',
              key: new Date().getTime(),
            }, ...notifs]);
          }}
        >
          <Add />
        </IconButton>
      </ListItemSecondaryAction>
      <NotificationBar queue={notifs} />
    </ListItem>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(Draggable);
