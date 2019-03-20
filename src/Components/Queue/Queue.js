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
  AddIcon,
  Fab,
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
  fab: {
    margin: theme.spacing.unit,
    color: theme.palette.green.main,
  },
});

const Queue = (props) => {
  const { classes } = props;

  // Request songs from spotify api every second
  let songs = [];

  return (
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
      <Grid item>
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
          ))}
        </List>
      </Grid>
      <Grid item>
        <IconButton aria-label="Delete">
          <SvgIcon>
            <path
              fill="#FFFFFF"
              d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
            />
          </SvgIcon>
        </IconButton>
        <Fab
          aria-label="Add"
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(Queue);
