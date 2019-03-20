import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  SvgIcon,
  IconButton,
  TextField,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  textTitle: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
  textBody: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
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

const Search = (props) => {
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
        />
      </Grid>
      <Grid item>
        <List dense={false}>
          {songs.map(song => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  {/** Add song pic here */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={song.title}
                secondary={song.artist}
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete">
                  <SvgIcon>
                    <path
                      fill="#FFFFFF"
                      d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                    />
                  </SvgIcon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(Search);
