import React from 'react';
import { compose } from 'recompose';
import {
  Divider, withStyles, SwipeableDrawer, Typography,
} from '@material-ui/core';
import MenuItems from './MenuItems';
import SpotifyLogo from '../../Constants/SpotifyLogo';

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  logo: {
    marginLeft: 8,
    marginRight: 16,
  },
});

const MobileDrawer = (props) => {
  const {
    classes, open, handleOpen, handleClose, partyId,
  } = props;

  const handleDrawerClose = () => {
    handleClose();
  };

  return (
    <SwipeableDrawer
      open={open}
      onClose={handleDrawerClose}
      onOpen={handleOpen}
    >
      <div className={classes.drawerHeader}>
        <SpotifyLogo className={classes.logo} />
        <Typography variant="h5">Multify</Typography>
      </div>
      <Divider />
      <MenuItems partyId={partyId} />
    </SwipeableDrawer>
  );
};

export default compose(
  withStyles(styles),
)(MobileDrawer);
