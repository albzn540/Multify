import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
});

const ShareParty = (props) => {
  const {
    classes, spotify,
    match: { params: { partyId } },
  } = props;

  const [code, setCode] = useState('Loading...');

  useEffect(() => {
    spotify.getParty(partyId).then((party) => {
      console.log(party.code);
      setCode(party.code);
    }).catch(err => console.error(err));
  }, []);


  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Typography
        variant="h5"
      >
        Paty Code:
      </Typography>
      <Typography
        variant="h5"
        color="primary"
      >
        {code}
      </Typography>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(ShareParty);
