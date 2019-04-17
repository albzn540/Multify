import React, { useState } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import SpotifyLogo from '../../Constants/SpotifyLogo';
import SpotifyButton from '../SpotifyButton';
import NotificationBar from '../NotificationBar';
import { withFirebase } from '../../Firebase';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  logo: {
    color: theme.palette.common.green,
    paddingBottom: '80px',
    fontSize: '260px',
  },
  textField: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    color: theme.palette.common.white,
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.common.green} !important`,
    },
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: '1px',
    borderColor: `${theme.palette.common.white} !important`,
  },
  multilineColor: {
    color: theme.palette.common.white,
  },
});

const JoinParty = (props) => {
  const { classes, spotify, history } = props;
  const [partyCode, setPartyCode] = useState('');
  const [notifs, setNotifs] = useState([]);

  /**
   * Redirects user to selected party if partycode exists
   * @param {Event} e
   */
  const formSubmit = (e) => {
    e.preventDefault(); // prevents page refreshing

    spotify.getPartyId(partyCode).then((partyId) => {
      history.push({ pathname: `/party/${partyId}` });
    }).catch((err) => {
      console.error(err);
      setNotifs([{
        message: 'Could not find party',
        key: new Date().getTime(),
      }, ...notifs]);
    });
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <SpotifyLogo
          className={classes.logo}
        />
      </Grid>

      <Grid container direction="column" alignItems="center">
        <form onSubmit={e => formSubmit(e)}>
          <Grid item>
            <TextField
              id="party-code-field"
              label="Enter room code"
              value={partyCode}
              onChange={e => setPartyCode(e.target.value)}
              variant="outlined"
              className={classes.textField}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                  input: classes.multilineColor,
                },
              }}
            />
          </Grid>
          <Grid item>
            <SpotifyButton
              id="join-party-button"
              value="Enter the party"
              type="submit"
            />
          </Grid>
        </form>
      </Grid>
      <NotificationBar queue={notifs} />
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withFirebase,
  withSpotify,
  withRouter,
)(JoinParty);
