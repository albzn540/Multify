import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  Typography,
  Paper,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    maxHeight: '100%',
    height: '120px',
    backgroundColor: theme.palette.common.grey,
    overflow: 'auto',
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
    <Paper className={classes.root}>
      <Grid
        container
        alignItems="center"
        justify="center"
        onDragOver={e => onDragOver(e)}
        onDrop={e => onDrop(e)}
        className={classes.root}
      >
        <Typography>
          Drag a song here or click the + to add it to the queue!
        </Typography>
      </Grid>
    </Paper>
  );
};

export default compose(
  withStyles(styles),
)(DropContainer);
