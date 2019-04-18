import React, { Component } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import {
  withStyles, AppBar, Toolbar, IconButton, InputBase,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { isMobile } from 'react-device-detect';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withSpotify } from '../../Spotify';
import { DesktopDrawer, MobileDrawer } from '../Drawer';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    // flexGrow: '1', // might not be needed
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
    marginRight: 12,
  },
  partyNameField: {
    fontSize: 20,
  },
});

class Navigation extends Component {
  constructor(props) {
    super(props);

    const { partyId } = props;

    this.state = {
      drawerOpen: false,
      backButton: false,
      partyName: '',
      partyId,
    };
  }

  componentDidMount() {
    const { spotify, partyId } = this.props;

    spotify.setParty(partyId);
    this.unsubscribeName = spotify.addObserver(this.updateName, ['party']);
  }

  componentWillUnmount() {
    this.unsubscribeName();
  }

  updateName = () => {
    const { spotify } = this.props;
    this.setState({ partyName: spotify.party.name });
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handlePartyNameChange = (event) => {
    event.preventDefault();
    const { spotify } = this.props;
    const { partyName } = this.state;
    spotify.changePartyName(partyName);
  };

  toggleButton = (str) => {
    if (str === 'back') {
      this.setState({ backButton: true });
    } else if (str === 'hamburger') {
      this.setState({ backButton: false });
    } else {
      this.setState({ backButton: false });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      drawerOpen, partyName, partyId, backButton,
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
            {!backButton ? (
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
                aria-label="Back"
                color="inherit"
                onClick={() => this.toggleButton('back')}
                className={classes.toolbarButton}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}

            <InputBase
              className={classes.partyNameField}
              value={partyName}
              onChange={e => this.setState({ partyName: e.target.value })}
              onBlur={e => this.handlePartyNameChange(e)}
            />
          </Toolbar>
        </AppBar>

        {isMobile ? (
          <MobileDrawer
            partyId={partyId}
            open={drawerOpen}
            handleOpen={this.handleDrawerOpen}
            handleClose={this.handleDrawerClose}
          />
        ) : (
          <DesktopDrawer
            open={drawerOpen}
            partyId={partyId}
            handleClose={this.handleDrawerClose}
          />
        )}
      </div>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(Navigation);
