import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  SvgIcon,
  IconButton,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  textTitle: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
  textBody: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
});

const Queue = (props) => {
  const { classes } = props;

  // Request songs from spotify api every second
  let songs = [];

  return (
    <div>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.root}
        spacing={16}
      >
        <Grid item>
          <Typography
            className={classes.textTitle}
          >
            Now playing
          </Typography>
          <Typography
            className={classes.textBody}
          >
            {}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.root}
        spacing={16}
      >
        <List dense={false}>
          {songs.map(song => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  {/** Add song pic here */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={song.title}
                secondary={song.artist}
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete">
                  <SvgIcon>
                    <path fill="#FFFFFF" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                  </SvgIcon>
                </IconButton>
                <IconButton aria-label="Delete">
                  <SvgIcon>
                    <path fill="#FFFFFF" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                  </SvgIcon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </div>
  );
};

export default compose(
  withStyles(styles),
)(Queue);