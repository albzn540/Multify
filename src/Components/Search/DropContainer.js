import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '50vh',
    position: 'relative',
    maxHeight: '50vh',
    backgroundcolor: theme.palette.common.lightGrey,
  },
});

const DropContainer = (props) => {
  const { classes, onDragOver, onDrop } = props;

  // Does grid have dragOver? Use a div?
  return (
    <Grid
      item
      className={classes.root}
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
