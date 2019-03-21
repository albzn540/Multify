import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  SvgIcon,
  IconButton,
} from '@material-ui/core';

const SearchListItem = (props) => {
  const { album, artist, id, is_playable, name, uri } = props;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          {}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary="tmp"
        secondary="lorem"
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

export default SearchListItem;
