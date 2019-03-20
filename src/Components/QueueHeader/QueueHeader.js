import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';

const styles = theme => ({
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

const QueueHeader = (props) => {
  const { classes } = props;

  return (
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
  );
};

export default compose(
  withStyles(styles),
)(QueueHeader);
