import React from 'react';
import { compose } from 'recompose';
import { Button, withStyles, Typography } from '@material-ui/core';

const styles = theme => ({
  button: {
    borderRadius: '50px',
    marginBottom: '10px',
  },
  buttonText: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
});

const SpotifyButton = (props) => {
  const { classes, value } = props;

  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      size="large"
      className={classes.button}
      fullWidth
    >
      <Typography
        className={classes.buttonText}
      >
        {value}
      </Typography>
    </Button>
  );
};

export default compose(
  withStyles(styles),
)(SpotifyButton);
