import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  withStyles, AppBar, Toolbar, IconButton, Typography,
} from '@material-ui/core';
// import { isMobile } from 'react-device-detect';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Link } from 'react-router-dom';
import { withSpotify } from '../../Spotify';
import Search from './Search';

const drawerWidth = 240;
const isMobile = true;

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.main,
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
  },
  appBarWrapper: {
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
});

class Navigation extends Component {
  constructor(props) {
    super(props);

    const { match: { params: { partyId } } } = this.props;

    this.state = {
      partyName: '',
      partyId,
    };

    this.PartyHomeLink = props => <Link to={`/party/${partyId}`} {...props} />;
  }

  componentDidMount() {
    const { spotify } = this.props;
    const { partyId } = this.state;

    spotify.getParty(partyId).then((party) => {
      this.setState({ partyName: party.name });
    }).catch((err) => {
      console.error('[Navigation]', err);
    });
  }

  render() {
    const { classes } = this.props;
    const {
      partyName, partyId,
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.appBarWrapper}>
          <AppBar
            position="fixed"
            className={classes.appBar}
          >
            <Toolbar disableGutters={isMobile}>
              <IconButton
                aria-label="Back"
                color="inherit"
                component={this.PartyHomeLink}
                className={classes.toolbarButton}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h5">
                {partyName}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>

        <div className={classes.toolbar} />
        <Search partyId={partyId} />
      </div>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(Navigation);
