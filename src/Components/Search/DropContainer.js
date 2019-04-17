import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    maxHeight: '100%',
    height: '120px',
    backgroundColor: theme.palette.common.grey,
    overflow: 'auto',
    border: '1px dashed #fff',
  },
  text: {},
});

const DropContainer = (props) => {
  const {
    classes,
    onDragOver,
    onDrop,
  } = props;

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      justify="center"
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e)}
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
