import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid } from '@material-ui/core';
import SpotifyLogo from '../../Constants/SpotifyLogo';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  logo: {
    color: theme.palette.green.main,
    paddingBottom: '50px',
    fontSize: '160px',
  },
});

const Landing = (props) => {
  const { classes } = props;

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
        <SpotifyLogo
          className={classes.logo}
        />
      </Grid>
      <Grid item>
        Create
      </Grid>
      <Grid item>
        Join
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(Landing);
