import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  SvgIcon,
  IconButton,
} from '@material-ui/core';

const QueueListItem = (props) => {
  const {
    artist,
    title,
    album,
    picture,
  } = props;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          {picture}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={`${artist} - ${album}`}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete">
          <SvgIcon>
            <path
              fill="#FFFFFF"
              d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
            />
          </SvgIcon>
        </IconButton>
        <IconButton aria-label="Delete">
          <SvgIcon>
            <path
              fill="#FFFFFF"
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </SvgIcon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
export default QueueListItem;
