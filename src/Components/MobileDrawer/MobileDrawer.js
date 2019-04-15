import React from 'react';
import { compose } from 'recompose';
import {
  Divider, List, ListItem, ListItemText, withStyles, SwipeableDrawer,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

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
});

const MobileDrawer = (props) => {
  const {
    classes, open, handleOpen, handleClose,
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
      <div className={classes.drawerHeader} />
      <Divider />
      <List>
        <ListItem button key="queue" component={Link} to="/party">
          <ListItemText primary="Queue" />
        </ListItem>
        <ListItem button key="share" component={Link} to="/share">
          <ListItemText primary="Share" />
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
};

export default compose(
  withStyles(styles),
)(MobileDrawer);
