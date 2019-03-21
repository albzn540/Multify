import React from 'react';
import { compose } from 'recompose';
import { withStyles, TextField, Grid } from '@material-ui/core';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  textField: {
    margin: theme.spacing.unit,
  },
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

const SearchBar = (props) => {
  const { classes, onChange } = props;

  return (
    <Grid item>
      <TextField
        id="search-field"
        label="Search"
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
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            console.log('[SearchBar] Entered: ', ev.target.value);
            onChange(ev.target);
            ev.preventDefault();
          }
        }}
      />
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(SearchBar);
