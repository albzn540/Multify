import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
} from '@material-ui/core';

import QueueHeader from './QueueHeader';
import QueueMenu from './QueueMenu';
import QueueList from './QueueList';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
});

const Queue = (props) => {
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
      <QueueHeader />
      <QueueList />
      <QueueMenu />
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(Queue);
