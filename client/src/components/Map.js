import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
import PinIcon from './PinIcon';
import { AuthContext } from '../AuthContext';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const Map = ({ classes }) => {
  const {
    state: { draft },
    createDraft,
    updateDraftLocation,
  } = useContext(AuthContext);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: 'calc(100vh - 64px)',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 15,
  });

  const [userPosition, setUserPosition] = useState(null);

  const handleClickOnMap = evt => {
    console.log(evt.lngLat);
    if (evt['leftButton']) {
      if (!draft) createDraft(evt);
      const [longitude, latitude] = evt.lngLat;
      updateDraftLocation({ latitude, longitude });
    }
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({
          ...viewport,
          latitude,
          longitude,
        });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className={classes.root}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={
          'pk.eyJ1IjoiaGFtZWQ0MDAwIiwiYSI6ImNrN2txZGN4NTA0aHEzaHF3MGJzampjdXkifQ.r9EDKOlihQG-cF1gMsv4Iw'
        }
        mapStyle={'mapbox://styles/mapbox/streets-v11'}
        onViewportChange={setViewport}
        onClick={handleClickOnMap}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={setViewport} />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <PinIcon size={40} color={'red'} />
          </Marker>
        )}
        {draft && (
          <Marker
            latitude={draft.latitude}
            longitude={draft.longitude}
            offsetLeft={-20}
            offsetTop={-37}
          >
            <PinIcon size={30} color={'hotpink'} />
          </Marker>
        )}
      </ReactMapGL>
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  deleteIcon: {
    color: 'red',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
};

export default withStyles(styles)(Map);
