import React from 'react';
import ReactDOM from 'react-dom';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@material-ui/core';
import { compose } from 'recompose';
import Add from '../../Constants/Icons/Add';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {
    position: 'absolute',
    touchAction: 'none',
    width: '500px',
    height: '100px',
    border: '1px solid #fff',
    backgroundColor: theme.palette.common.grey,
  },
  listText: {
    color: theme.palette.secondary.main,
  },
  listSubText: {
    color: theme.palette.common.lightGrey,
  },
  listItem: {
    backgroundColor: theme.palette.common.grey,
  },
});

class Draggable2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relX: 0,
      relY: 0,
      x: props.x,
      y: props.y,
      top: props.top,
      bottom: props.bottom,
      right: props.right,
      left: props.left,
    };
    this.gridX = props.gridX || 1;
    this.gridY = props.gridY || 1;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  onStart = (e) => {
    // eslint-disable-next-line react/no-find-dom-node
    const ref = ReactDOM.findDOMNode(this.handle);
    const body = document.body;
    const box = ref.getBoundingClientRect();
    this.setState({
      relX: e.pageX - (box.left + body.scrollLeft - body.clientLeft),
      relY: e.pageY - (box.top + body.scrollTop - body.clientTop),
    });
  }

  onMove = (e) => {
    const {
      relX,
      relY,
      x,
      y,
    } = this.state;
    const { onMove } = this.props;
    const newX = Math.trunc((e.pageX - relX) / this.gridX) * this.gridX;
    const newY = Math.trunc((e.pageY - relY) / this.gridY) * this.gridY;
    if (newX !== x || newY !== y) {
      this.setState({
        x: newX,
        y: newY,
      });
      // eslint-disable-next-line no-unused-expressions
      onMove && onMove(x, y);
    }
  }

  onMouseDown = (e) => {
    if (e.button !== 0) return;
    this.onStart(e);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    e.preventDefault();
  }

  onMouseUp = (e) => {
    const { onStop } = this.props;
    const { x, y } = this.state;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    // eslint-disable-next-line no-unused-expressions
    onStop && onStop(x, y);
    this.calculateLanding();
    e.preventDefault();
  }

  onMouseMove = (e) => {
    this.onMove(e);
    e.preventDefault();
  }

  // touch functions not used?

  onTouchStart = (e) => {
    console.debug('1');
    this.onStart(e.touches[0]);
    document.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    document.addEventListener('touchend', this.onTouchEnd, { passive: false });
    e.preventDefault();
  }

  onTouchMove = (e) => {
    console.debug('2');
    this.onMove(e.touches[0]);
    e.preventDefault();
  }

  onTouchEnd = (e) => {
    console.debug('3');
    const { onStop } = this.props;
    const { x, y } = this.state;
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
    // eslint-disable-next-line no-unused-expressions
    onStop && onStop(x, y);
    e.preventDefault();
  }

  componentDidUpdate = (prevProps) => {
    const {
      top,
      bottom,
      right,
      left,
    } = this.props;
    const {
      top: prevTop,
      bottom: prevBottom,
      right: prevRight,
      left: prevLeft,
    } = prevProps;
    const prevCoords = [prevTop, prevBottom, prevRight, prevLeft];
    const coords = [top, bottom, right, left];
    for (let i = 0; i < coords.length; i += 1) {
      if (coords[i] !== prevCoords[i]) {
        this.setState({
          top,
          bottom,
          right,
          left,
        });
      }
    }
  }

  calculateLanding = () => {
    const {
      x,
      y,
      top,
      bottom,
      right,
      left,
    } = this.state;
    const {
      spotify,
      album,
      artists,
      id,
      name,
      uri,
      partyId,
    } = this.props;

    if ((x > left && x < right) && (y > top && y < bottom)) {
      console.debug('inside');
      spotify.addTrack({
        id,
        artists,
        uri,
        name,
        album,
      }, partyId);
    }

    // console.debug('x', x, 'y', y, 'top', top, 'bottom', bottom, 'right', right, 'left', left);
  }

  render() {
    const { x, y } = this.state;
    const {
      album,
      artists,
      id,
      name,
      uri,
      classes,
      spotify,
      partyId,
    } = this.props;

    const track = {
      id,
      artists,
      uri,
      name,
      album,
    };

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        style={{
          left: x,
          top: y,
        }}
        className={classes.root}
        ref={(div) => {
          this.handle = div;
        }}
      >
        {/* <ListItem
          key={id}
          className={classes.listItem}
          divider
        >
          <ListItemText
            disableTypography
            primary={(
              <Typography
                className={classes.listText}
              >
                {name}
              </Typography>
            )}
            secondary={(
              <Typography
                className={classes.listSubText}
              >
                {`${album.name} -${artists.map(artist => ` ${artist.name}`)}`}
              </Typography>
              )}
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => spotify.addTrack(track, partyId)}
            >
              <Add />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem> */}
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withSpotify,
)(Draggable2);
