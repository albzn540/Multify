import React, { Component } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import {
  withStyles, AppBar, Toolbar, IconButton, Typography, Grid,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
// import { isMobile } from 'react-device-detect';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withSpotify } from '../../Spotify';
import DesktopDrawer from '../DesktopDrawer';
import MobileDrawer from '../MobileDrawer';
import Search from '../Search';

const drawerWidth = 240;
const isMobile = true;

const styles = theme => ({
  root: {
    display: 'flex',
    overflowY: 'scroll',
    width: '100%',
    // flexGrow: '1', // might not be needed
    // height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  hide: {
    display: 'none',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
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
});

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: false,
      hideQueue: false,
      hideSearch: true,
      partyName: '',
    };
  }

  componentDidMount() {
    const {
      spotify,
      match: { params: { partyId } },
    } = this.props;

    spotify.getParty(partyId).then((party) => {
      this.setState({ partyName: party.name });
    }).catch((err) => {
      console.error('[Navigation]', err);
    });
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
          null
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
  withSpotify,
)(Navigation);
