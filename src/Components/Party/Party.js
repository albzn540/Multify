import React, { Component, useState, useEffect } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import {
  withStyles, AppBar, Toolbar, IconButton, Typography, Drawer,
  Divider, List, ListItem, ListItemText, Grid, Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { withFirebase } from '../../Firebase';
import Queue from '../Queue2';
import Search from '../Search';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    // flexGrow: '1', // might not be needed
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  hide: {
    display: 'none',
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3, // BREAKS CHILD COMPONENTS IN MY OPINION
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: '0 8px', // uncomment for more 'room' in the drawer
    ...theme.mixins.toolbar,
  },
  // Make sure app bar renders ABOVE drawer
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },

  // Drawer css
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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

  fab: {
    margin: theme.spacing.unit,
    color: theme.palette.common.lightBlack,
    backgroundColor: theme.palette.common.green,
  },

});

class Party extends Component {
  constructor(props) {
    super(props);

    const { firebase, classes, location: { pathname } } = props;

    // /party/12345 = ["", "party", "5LJ0rnLKhslTmW357AbS"]
    // If there's more than 2 arguments, a party code was sent!
    const urlParams = pathname.split('/');
    const partyId = urlParams.length > 2 ? urlParams[2] : null;
    if (partyId) console.info('[Party] Party code:', partyId);

    this.state = {
      user: null,
      drawerOpen: false,
      hideQueue: false,
      hideSearch: true,
      partyId,
      partyName: 'default name',
    };

    // TODO: Retrieve party from firestore IN CASE OF CODE
  }

  componentDidMount() {
    const { firebase } = this.props;
    const { partyId } = this.state;

    firebase.db.collection('parties').doc(partyId)
      .get()
      .then((doc) => {
        this.setState({
          partyName: doc.name,
        });
      })
      .catch((err) => {
        console.error('[Party] Firestore get error:', err);
      });
  }

  /*
    Things that should be implemented in this component (some things will
    be broken out in the future)

    Drawer      - ish done
    Queue list  - ish done
    Fab button (add tracks, search for tracks) - done
    Add button in search so we can go back to queue - done

    // later
    TODO: Display party code on top (in case youre logged in as party amdin)
    TODO: Add share button to sidebar
    TODO: Customize sidebar for admin and anonomous users
    TODO: Spacing 0 to remove scroll issues?
  */


  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleSwitchView = () => {
    const { hideQueue, hideSearch } = this.state;
    this.setState({
      hideQueue: !hideQueue,
      hideSearch: !hideSearch,
    });
  };

  render() {
    const { classes, theme } = this.props;
    const { drawerOpen, hideQueue, hideSearch, partyId } = this.state;

    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: drawerOpen,
          })}
        >
          <Toolbar disableGutters={!drawerOpen}>
            <IconButton
              aria-label="Open dawer"
              color="inherit"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: drawerOpen,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5">
              Party {/* TODO: Take name from party */}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={drawerOpen}
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Divider />

          <List>
            {['Queue', 'Party Settings', 'Logout'].map(text => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        { hideSearch ? (
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid
              container
              justify="center"
            >
              <Grid item xs={12} sm={8} md={6}>
                <Queue />
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-end"
                >
                  <Fab
                    aria-label="Add"
                    className={classes.fab}
                    onClick={this.handleSwitchView}
                  >
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
          </main>
        ) : (
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid
              container
              justify="center"
            >
              <Grid item xs={12} sm={8} md={6}>
                <Search switchView={this.handleSwitchView} />
              </Grid>
            </Grid>
          </main>
        )}
      </div>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(Party);
