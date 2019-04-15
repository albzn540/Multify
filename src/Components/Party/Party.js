import React from 'react';
import {
  Grid, Typography, Fab, withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { compose } from 'recompose';
import Queue from '../Queue';
import NowPlayingSmall from '../NowPlaying';
import Search from '../Search';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.main,
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  fab: {
    zIndex: theme.zIndex.appBar,
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    margin: '16px',
    color: theme.palette.common.lightBlack,
    backgroundColor: theme.palette.common.green,
  },
});

const Party = (props) => {
  const {
    classes,
    match: { params: { partyId } },
  } = props;

  return (
    <main className={classes.root}>
      <div className={classes.toolbar} />
      <Grid
        container
        justify="center"
      >
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="h6" className={classes.text}>
            Now playing
          </Typography>
          <NowPlayingSmall />
          <Queue partyId={partyId} />
        </Grid>
      </Grid>
      <Fab
        aria-label="Add"
        className={classes.fab}
        component={Search}
        // onClick={startSearch}
      >
        <AddIcon />
      </Fab>
    </main>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(Party);
