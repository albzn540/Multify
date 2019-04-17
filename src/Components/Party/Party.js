import React from 'react';
import { withStyles } from '@material-ui/core';
import { Route } from 'react-router-dom';
import { compose } from 'recompose';
import PartyHome from '../PartyHome';
import Search from '../Search';
import Navigation from '../Navigation';
import ShareParty from '../ShareParty';

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

  const basePath = '/party';

  return (
    <main className={classes.root}>
      <div className={classes.toolbar} />

      {/* Navigation panels (Appbar and drawer) */}
      <Navigation partyId={partyId} />

      {/* Screen content */}
      <Route exact path={`${basePath}/:partyId`} component={PartyHome} />
      <Route path={`${basePath}/:partyId/search`} component={Search} />
      <Route path={`${basePath}/:partyId/share`} component={ShareParty} />
    </main>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(Party);
