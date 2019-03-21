import React from 'react';
import { compose } from 'recompose';
import { withStyles, TextField, Grid } from '@material-ui/core';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  textField: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    color: theme.palette.secondary.main,
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.common.green} !important`,
    },
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: '1px',
    borderColor: `${theme.palette.secondary.main} !important`,
  },
  multilineColor: {
    color: theme.palette.secondary.main,
  },
});

const SearchBar = (props) => {
  const { classes, onChange, keyPress } = props;

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
          keyPress(ev, onChange);
        }}
      />
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(SearchBar);
