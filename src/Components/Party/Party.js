import React, { Component } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import {
  withStyles, AppBar, Toolbar, IconButton, Typography, Drawer,
  Divider, List, ListItem, ListItemText, Grid,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { withFirebase } from '../../Firebase';
import Queue from '../Queue2';

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

});

class Party extends Component {
  constructor(props) {
    super(props);

    const { firebase, classes, location: { pathname } } = props;

    // /party/12345 = ["", "party", "12345"]
    // If there's more than 2 arguments, a party code was sent!
    const urlParams = pathname.split('/');
    const partyCode = urlParams.length > 2 ? urlParams[2] : null;
    if (partyCode) console.info('[Party] Party code:', partyCode);

    this.state = {
      user: null,
      drawerOpen: false,
      partyCode,
    };

    // TODO: Retrieve party from firestore IN CASE OF CODE
  }

  /*
    Things that should be implemented in this component (some things will
    be broken out in the future)

    Drawer      - ish done
    Queue list  - ish done
    TODO: Fab button (add tracks, search for tracks)
    TODO: Display party code on top (in case youre logged in as party amdin)
    TODO: Add share button to sidebar
    TODO: Customize sidebar for admin and anonomous users
  */


  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { classes, theme } = this.props;
    const { drawerOpen } = this.state;

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

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Grid
            container
            justify="center"
          >
            <Grid item xs={12} sm={8} md={6}>
              <Queue />
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(Party);
