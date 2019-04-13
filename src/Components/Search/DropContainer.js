import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '500px',
    height: '80px',
    position: 'relative',
    backgroundColor: theme.palette.common.grey,
  },
});

const DropContainer = (props) => {
  const { classes, onDragOver, onDrop } = props;

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      justify="center"
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e, 'drop test data')}
    >
      <Typography>
        Drag a song here or click the + to add it to the queue!
      </Typography>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(DropContainer);
