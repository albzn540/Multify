import React from 'react';
import { compose } from 'recompose';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
});

const Settings = (props) => {
  return (
    <div>
      <Typography variant="h4">Settings</Typography>
    </div>
  );
};

export default compose(
  withStyles(styles),
)(Settings);
