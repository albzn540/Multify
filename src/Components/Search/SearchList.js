import React from 'react';
import { compose } from 'recompose';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  SvgIcon,
  IconButton,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';

const SearchList = (props) => {
  const { spotify, searchString } = props;

  const songs = [];

  console.log('[SearchList] got:', searchString);

  return (
    <Grid item>
      <List dense={false}>
        {songs.map(song => (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                {}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={song.title}
              secondary={song.artist}
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
        ))}
      </List>
    </Grid>
  );
};

export default compose(
  withSpotify,
)(SearchList);
