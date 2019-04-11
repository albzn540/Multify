import React from 'react';
import { Button, Typography } from '@material-ui/core';

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

export default SpotifyButton;
