import React from 'react';
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
  } = props;

  const code = 'lel';

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
