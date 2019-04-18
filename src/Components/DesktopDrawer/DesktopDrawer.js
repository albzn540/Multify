import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import {
  Drawer, Divider, List, ListItem, ListItemText, IconButton, withStyles, ListItemIcon,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Link } from 'react-router-dom';
import {
  PlaylistPlayRounded, ShareRounded, SettingsRounded,
} from '@material-ui/icons';
import { withSpotify } from '../../Spotify';

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
    justifyContent: 'flex-end',
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
  icons: {
    marginLeft: 8,
    marginRight: 8,
  },
});

const DesktopDrawer = (props) => {
  const {
    classes, open, handleClose, partyId, spotify,
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
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />

      <List>
        <ListItem button key="queue" component={Link} to={`/party/${partyId}`}>
          <ListItemIcon className={classes.icons}><PlaylistPlayRounded /></ListItemIcon>
          <ListItemText primary="Queue" />
        </ListItem>
        <ListItem button key="share" component={Link} to={`/party/${partyId}/share`}>
          <ListItemIcon className={classes.icons}><ShareRounded /></ListItemIcon>
          <ListItemText primary="Share" />
        </ListItem>

        {spotify.isHost() ? (
          <ListItem button key="settings" component={Link} to={`/party/${partyId}/settings`}>
            <ListItemIcon className={classes.icons}><SettingsRounded /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        ) : null}
      </List>
    </Drawer>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(DesktopDrawer);
