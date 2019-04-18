import React from 'react';
import { compose } from 'recompose';
import {
  List, ListItem, ListItemText, withStyles, ListItemIcon,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  PlaylistPlayRounded, ShareRounded, SettingsRounded, ArrowBackRounded,
} from '@material-ui/icons';
import { withSpotify } from '../../Spotify';


const styles = () => ({
  icons: {
    marginLeft: 8,
    marginRight: 8,
  },
});

const MenuItems = (props) => {
  const { spotify, partyId, classes } = props;

  return (
    <List>
      <ListItem button key="queue" component={Link} to={`/party/${partyId}`}>
        <ListItemIcon className={classes.icons}><PlaylistPlayRounded /></ListItemIcon>
        <ListItemText primary="Queue" />
      </ListItem>
      <ListItem button key="share" component={Link} to={`/party/${partyId}/share`}>
        <ListItemIcon className={classes.icons}><ShareRounded /></ListItemIcon>
        <ListItemText primary="Share" />
      </ListItem>

      {spotify.isHost() ? (
        <ListItem button key="settings" component={Link} to={`/party/${partyId}/settings`}>
          <ListItemIcon className={classes.icons}><SettingsRounded /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      ) : null};

      <ListItem button key="leaveparty" component={Link} to="/">
        <ListItemIcon className={classes.icons}><ArrowBackRounded /></ListItemIcon>
        <ListItemText primary="Leave party" />
      </ListItem>
    </List>
  );
};

export default compose(
  withSpotify,
  withStyles(styles),
)(MenuItems);
