import React from 'react';
import {
  Snackbar,
  withStyles,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { isMobile } from 'react-device-detect';

const styles = theme => ({
  root: {
    background: theme.palette.common.grey,
  },
  close: {
    padding: 5,
    color: theme.palette.common.lightGrey,
  },
  message: {
    color: theme.palette.secondary.main,
  },
});

class NotificationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      messageInfo: {},
    };
  }

  componentDidUpdate() {
    this.processQueue();
  }

  processQueue = () => {
    const { queue } = this.props;
    if (queue.length > 0) {
      this.setState({
        messageInfo: queue.shift(),
        open: true,
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  handleExited = () => {
    this.processQueue();
  };

  render() {
    const { classes } = this.props;
    const { messageInfo, open } = this.state;

    const direction = isMobile ? 'center' : 'left';

    return (
      <Snackbar
        key={messageInfo.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction,
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        onExited={this.handleExited}
        ContentProps={{
          classes: {
            root: classes.root,
            message: classes.message,
          },
        }}
        message={<span id="message-id">{messageInfo.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

export default withStyles(styles)(NotificationBar);
