import React from 'react';
import { compose } from 'recompose';
import {
  withStyles, Grid, Paper, Typography, ListItem, ListItemText, List,
} from '@material-ui/core';
import SpotifyButton from '../SpotifyButton';
import Connect from '../Connect';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.main,
  },
  stepsPaper: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  infoPaper: {
    padding: theme.spacing.unit * 2,
  },
});

const StartParty = (props) => {
  const { classes, spotify } = props;

  const startParty = () => {
    spotify.startParty();
  };

  return (
    <Grid container justify="center" className={classes.root} spacing={32}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">Start your party:</Typography>
        <Paper className={classes.stepsPaper}>
          <List>
            <ListItem>
              <ListItemText primary="1. Start Spotify on preffered speaker" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Choose that speaker from the menu" />
            </ListItem>
            <ListItem>
              <ListItemText primary='3. Press "Start party"!' />
            </ListItem>
          </List>
        </Paper>
        <Paper className={classes.infoPaper}>
          <Typography align="center">
            After following these steps you can start your party!
          </Typography>
          <Typography align="center">
            If you are having trouble finding songs to add you can add a
            fallback playlist from your library under "fallback playlist"
            in the menu
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Connect />
      </Grid>
      <Grid item xs={12} md={6}>
        <SpotifyButton value="Start party" onClick={startParty} />
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(StartParty);
