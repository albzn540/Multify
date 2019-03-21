import React from 'react';
import { compose } from 'recompose';
import { withStyles, Typography, List } from '@material-ui/core';
import SingListItem from '../SongListItem';
import SongListItem from '../SongListItem';

const styles = theme => ({
  root: {
    height: `calc(100% - ${theme.spacing.unit * 8}px)`,
    // display: 'flex',
    // flexGrow: '1',
    // backgroundColor: theme.palette.black.main,
    padding: theme.spacing.unit,
    // backgroundColor: 'pink',
  },
  text: {
    color: theme.palette.common.white,
  },
});

const Queue = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.text}>
        Now playing
      </Typography>

      <List>
        <SongListItem />
      </List>

      <Typography variant="h6" className={classes.text}>
        Queue
      </Typography>

      <List>
        <SongListItem />
        <SongListItem />
        <SongListItem />
        <SongListItem />
        <SongListItem />
        <SongListItem />
      </List>
    </div>
  );
};

export default compose(
  withStyles(styles),
)(Queue);
