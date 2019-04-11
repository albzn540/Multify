import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { withFirebase } from '../../Firebase';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  logo: {
    color: theme.palette.primary.main,
    paddingBottom: '80px',
    fontSize: '260px',
  },
  text: {
    color: theme.palette.primary.main,
  },
});

const ShareParty = (props) => {
  const {
    spotify, classes, location,
  } = props;

  useEffect(() => {
    const url = location.pathname + location.search;
    spotify.loginUser(url).then(() => {
      console.debug('[Login] Creating party...');
      spotify.createParty(`${spotify.spotifyUser.display_name}'s party`).then((partyData) => {
        const { data: { code } } = partyData;
        console.debug('[Login] Party created', partyData);
        spotify.getPartyId(code).then((partyId) => {
          window.location.assign(`/party/${partyId}`);
        });
      });
    }).catch((e) => {
      console.log('[Login]', e);
    });
  }, []);

  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Typography>Paty Code:</Typography>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withFirebase,
)(ShareParty);
