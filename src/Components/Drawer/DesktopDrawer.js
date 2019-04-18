import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import {
  Drawer, Divider, IconButton, withStyles, Typography,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
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
  closeDrawerHeader: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  multifyHeader: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
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
    marginRight: 16,
    marginLeft: 8,
  },
});

const DesktopDrawer = (props) => {
  const {
    classes, open, handleClose, partyId,
  } = props;

  const handleDrawerClose = () => {
    handleClose();
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.drawerHeader}>
        <div className={classes.multifyHeader}>
          <SpotifyLogo className={classes.logo} />
          <Typography variant="h5">Multify</Typography>
        </div>
        <div className={classes.closeDrawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
      </div>
      <Divider />
      <MenuItems partyId={partyId} />
    </Drawer>
  );
};

export default compose(
  withStyles(styles),
)(DesktopDrawer);
