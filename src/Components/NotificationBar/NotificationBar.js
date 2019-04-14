import React, { useState } from 'react';
import {
  Snackbar,
  withStyles,
  IconButton,
  CloseIcon,
} from '@material-ui/core';
// import { isMobile } from 'react-device-detect';

// theme removed temporarily
// find good spacing
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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
