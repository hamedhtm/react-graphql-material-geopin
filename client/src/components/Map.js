import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import PinIcon from './PinIcon';
import { Context } from '../Context';
import Blog from './Blog';
import { graphQLClient } from '../utils/graphQLClient';
import { GET_PINS } from '../graphql/queries';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import { DELETE_PIN } from '../graphql/mutations';
// import Typography from "@material-ui/core/Typography";

const Map = ({ classes }) => {
  const {
    state: { draft, pins, currentUser },
    createDraft,
    updateDraftLocation,
    getPinsContext,
    setCurrentPin,
    deletePinContext,
  } = useContext(Context);

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

  const getAllPins = async () => {
    const client = graphQLClient();
    const { getPins } = await client.request(GET_PINS);
    // console.log(getPins);
    getPinsContext(getPins);
  };

  useEffect(() => {
    getUserLocation();
    getAllPins();
  }, []);

  const highlightNewPin = pin => {
    // اگر پین کمتر از 30دقیقه پیش ایجاد شده باشد رنگش سبز و در غیر این صورت ابی هست
    const isNewPin =
      differenceInMinutes(new Date(), Number(pin.createdAt)) <= 30;
    return isNewPin ? 'limegreen' : 'darkblue';
  };

  const [popup, setPopup] = useState(null);
  const handleSelectPin = pin => {
    setPopup(pin);
    setCurrentPin(pin);
  };
  const handleDeletePin = async pin => {
    const client = graphQLClient();
    const variables = { pinId: pin._id };
    const { deletePin } = await client.request(DELETE_PIN, variables);
    deletePinContext(deletePin);
    setPopup(null);
  };

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
        {pins &&
          pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-20}
              offsetTop={-37}
            >
              <PinIcon
                size={30}
                color={highlightNewPin(pin)}
                onClick={() => handleSelectPin(pin)}
              />
            </Marker>
          ))}

        {popup && (
          <Popup
            anchor={'top'}
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
            style={{ zIndex: 1 }}
          >
            <img
              src={popup.image}
              alt={popup.title}
              className={classes.popupImage}
            />
            <div className={classes.popupTab}>
              {currentUser._id === popup.author._id && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Blog />
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
