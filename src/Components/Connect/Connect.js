import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { Typography, withStyles, Grid, Card, CardMedia, Paper, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withSpotify } from '../../Spotify';
import { SpeakerRounded } from '@material-ui/icons';


const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit,
  },
  listItem: {
  },
  icon: {
    fontSize: 30,
  },
});

const Settings = (props) => {
  const { classes, spotify } = props;

  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState({ id: 0 });

  const handleSpeaker = () => {
    setDevice(spotify.currentlyPlaying.device);
  };

  const selectSpeaker = (id) => {
    console.log('[Connect][selectSpeaker] Selected', id);
    spotify.setSpeaker(id);
  };

  useEffect(() => {
    spotify.client.getMyDevices().then((newDev) => {
      setDevices(newDev.devices);
    });

    const speakerSub = spotify.addObserver(handleSpeaker, ['nowplaying']);

    return () => {
      speakerSub();
    };
  }, []);

  return (
    <div>
      <Typography variant="h5" className={classes.header}>Spotify Connect</Typography>
      <List divider="true">

        {devices ? devices.map(dev => (
          <ListItem
            button
            className={classes.listItem}
            onClick={() => selectSpeaker(dev.id)}
          >
            <ListItemIcon>
              <SpeakerRounded color={dev.id === device.id ? 'primary' : 'secondary'} className={classes.icon} />
            </ListItemIcon>
            <ListItemText>
              {dev.name}
            </ListItemText>
          </ListItem>
        )) : null}

      </List>
    </div>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(Settings);
