import React from 'react';
import { withStyles } from '@material-ui/core';
import { Route } from 'react-router-dom';
import { compose } from 'recompose';
import PartyHome from '../PartyHome';
import Search from '../Search';
import Navigation from '../Navigation';
import ShareParty from '../ShareParty';
import FallbackPlaylist from '../FallbackPlaylist';
import StartParty from '../StartParty';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
  },
  toolbar: theme.mixins.toolbar,
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
      {/* Navigation panels (Appbar and drawer) */}
      <Navigation partyId={partyId} />

      <div className={classes.content}>
        <div className={classes.toolbar} />
        {/* Screen content */}
        <Route exact path={`${basePath}/:partyId`} component={PartyHome} />
        <Route path={`${basePath}/:partyId/search`} component={Search} />
        <Route path={`${basePath}/:partyId/share`} component={ShareParty} />
        <Route path={`${basePath}/:partyId/fallback-playlist`} component={FallbackPlaylist} />
        <Route path={`${basePath}/:partyId/play`} component={StartParty} />
      </div>
    </main>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(Party);
