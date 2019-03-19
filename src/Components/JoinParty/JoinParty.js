import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Button, Typography, TextField } from '@material-ui/core';
import SpotifyLogo from '../../Constants/SpotifyLogo';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  logo: {
    color: theme.palette.green.main,
    paddingBottom: '80px',
    fontSize: '160px',
  },
  button: {
    borderRadius: '50px',
    marginBottom: '10px',
  },
  buttonText: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
  textField: {},

  cssLabel: {
    color: theme.palette.white.main,
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.green.main} !important`,
    },
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: '1px',
    borderColor: `${theme.palette.white.main} !important`,
  },
  multilineColor: {
    color: theme.palette.white.main,
  },
});

const JoinParty = (props) => {
  const { classes } = props;

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
      spacing={16}
    >
      <Grid item>
        <SpotifyLogo
          className={classes.logo}
        />
      </Grid>
      <Grid item>
        <TextField
          id="standard-name"
          label="Enter room code"
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

        <Button
          id="join-party-button"
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          fullWidth
        >
          <Typography
            className={classes.buttonText}
          >
            Enter the party
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(JoinParty);
