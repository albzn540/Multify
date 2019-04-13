import React from 'react';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@material-ui/core';
import { compose } from 'recompose';
import Add from '../../Constants/Icons/Add';

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
    addTrack,
    onDragStart,
  } = props;

  return (
    <ListItem
      onDragStart={e => onDragStart(e, 'drag test data')}
      draggable="true"
      className={classes.draggable}
    >
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
            {`${album.name} -${artists.map(artist => ` ${artist.name}`)}`}
          </Typography>
          )}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => addTrack({
            id,
            artists,
            uri,
            name,
            album,
          })}
        >
          <Add />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default compose(
  withStyles(styles),
)(Draggable);
