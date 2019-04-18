import React from 'react';
import { Grid, Fab, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { compose } from 'recompose';
import NowPlaying from '../NowPlaying';
import Queue from '../Queue';

const styles = theme => ({
  root: {},
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

const PartyHome = (props) => {
  const {
    classes,
    match: { params: { partyId } },
  } = props;

  const SearchLink = searchProps => <Link to={`/search/${partyId}`} {...searchProps} />;

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
      >
        <Grid item xs={12} sm={8} md={6}>
          <NowPlaying />
          <Queue partyId={partyId} />
        </Grid>
      </Grid>


      <Fab
        aria-label="Add"
        className={classes.fab}
        component={SearchLink}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(PartyHome);
