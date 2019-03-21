import React from 'react';
import { compose } from 'recompose';
import { withStyles, Typography, List } from '@material-ui/core';
import SongListItem from '../SongListItem';

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexGrow: '1',
    height: `calc(100% - ${theme.spacing.unit * 8}px)`,
    padding: theme.spacing.unit,
  },
  text: {
    color: theme.palette.common.white,
  },
});

const Queue = (props) => {
  const { classes, partyId } = props;

  // TODO: Add listener to queue collection (based on party id)

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
        {/* TODO: Make sure they gather data from firestore */}
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
