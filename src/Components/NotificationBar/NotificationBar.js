import React, { useState } from 'react';
import {
  Snackbar,
  withStyles,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import { isMobile } from 'react-device-detect';

// theme removed temporarily
// find good padding
const styles = () => ({
  close: {
    padding: 1,
  },
});

const NotificationBar = (props) => {
  const { classes } = props;

  const isMobile = false;
  const direction = isMobile ? 'center' : 'left';

  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState({});
  const queue = [];

  // Return a function that uses message?
  const handleActivation = (message) => {
    queue.push({
      message,
      key: new Date().getTime(),
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  /**
   * Move the notification queue forward one step
   */
  const handleExited = () => {
    if (queue.length > 0) {
      setMessageInfo(queue.shift());
      setOpen(true);
    }
  };

  return (
    <Snackbar
      key={messageInfo.key}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: direction,
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onExited={handleExited}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{messageInfo.message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
};

export default withStyles(styles)(NotificationBar);
