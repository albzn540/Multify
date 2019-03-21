import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  SvgIcon,
  IconButton,
  Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
});

const QueueMenu = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <IconButton aria-label="Delete">
        <SvgIcon>
          <path
            fill="#FFFFFF"
            d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
          />
        </SvgIcon>
      </IconButton>
      <Fab
        aria-label="Add"
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(QueueMenu);
