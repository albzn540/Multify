import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { withSpotify } from '../../Spotify';

const styles = () => ({
  descriptionText: {
    marginBottom: '20px',
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
      <Typography align="center" variant="h5" className={classes.descriptionText}>
        Share this party with your friends and let them put their favourite songs into the queue!
      </Typography>
      <Typography variant="h5">Party Code:</Typography>
      <Typography variant="h5" color="primary">{code}</Typography>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(ShareParty);
