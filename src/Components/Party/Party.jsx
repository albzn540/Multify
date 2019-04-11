import React, { Component } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import {
  withStyles, AppBar, Toolbar, IconButton, Typography, Grid, Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
// import { isMobile } from 'react-device-detect';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withFirebase } from '../../Firebase';
import DesktopDrawer from '../DesktopDrawer';
import MobileDrawer from '../MobileDrawer';
import Queue from '../Queue';
import Search from '../Search';
import NowPlayingSmall from '../NowPlaying';


const drawerWidth = 240;
const isMobile = true;

const styles = theme => ({
  root: {
    display: 'flex',
    overflowY: 'scroll',
    // flexGrow: '1', // might not be needed
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  hide: {
    display: 'none',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
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
  toolbarButton: {
    marginLeft: 12,
    marginRight: 36,
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

class Party extends Component {
  constructor(props) {
    super(props);

    const { location: { pathname } } = props;

    // /party/12345 = ["", "party", "5LJ0rnLKhslTmW357AbS"]
    // If there's more than 2 arguments, a party code was sent!
    const urlParams = pathname.split('/');
    const partyId = urlParams.length > 2 ? urlParams[2] : null;
    if (partyId) console.info('[Party] Party id:', partyId);

    this.state = {
      drawerOpen: false,
      hideQueue: false,
      hideSearch: true,
      partyId,
      partyName: '',
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    const { partyId } = this.state;

    if (partyId) {
      firebase.partyRef(partyId)
        .get()
        .then((doc) => {
          this.setState({
            partyName: doc.data().name,
          });
        })
        .catch((err) => {
          console.error('[Party] Firestore get error:', err);
        });
    }
  }

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
    const { classes } = this.props;
    const {
      drawerOpen, hideSearch, partyName, partyId,
    } = this.state;

    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: isMobile ? false : drawerOpen,
          })}
        >
          <Toolbar disableGutters={isMobile ? true : !drawerOpen}>
            {hideSearch ? (
              <IconButton
                aria-label="Open dawer"
                color="inherit"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.toolbarButton, {
                  [classes.hide]: isMobile ? false : drawerOpen,
                })}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="Back to party"
                color="inherit"
                onClick={this.handleSwitchView}
                className={classes.toolbarButton}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}

            <Typography variant="h5">
              {partyName}
            </Typography>
          </Toolbar>
        </AppBar>

        {isMobile ? (
          <MobileDrawer
            open={drawerOpen}
            handleClose={this.handleDrawerClose}
          />
        ) : (
          <DesktopDrawer
            open={drawerOpen}
            handleClose={this.handleDrawerClose}
          />
        )}

        {hideSearch ? (
          <main className={classes.content}>
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
              onClick={this.handleSwitchView}
            >
              <AddIcon />
            </Fab>
          </main>
        ) : (
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid
              container
              justify="center"
            >
              <Grid item xs={12} sm={8} md={6}>
                <Search partyId={partyId} />
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
