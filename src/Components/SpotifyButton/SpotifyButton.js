import React from 'react';
import { compose } from 'recompose';
import { Button, withStyles, Typography } from '@material-ui/core';

const styles = theme => ({
  button: {
    borderRadius: '50px',
    marginBottom: '10px',
  }
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
      <Typography>
        {value}
      </Typography>
    </Button>
  );
};

export default compose(
  withStyles(styles),
)(SpotifyButton);
