import React, { useCallback, useState } from 'react';

import {
  Typography, AppBar, Toolbar, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import MapPositions from '../map/MapPositions';
import MapGeofence from '../map/MapGeofence';
import StatusCard from '../common/components/StatusCard';
import { formatNotificationTitle } from '../common/util/formatter';
import MapScale from '../map/MapScale';
import useStyles from '../common/theme/useGlobalStyles';
import { useRecoilState } from 'recoil';
import { colorsAtom } from '../recoil/atoms/colorsAtom';

const EventPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const { id } = useParams();

  const [event, setEvent] = useState();
  const [position, setPosition] = useState();
  const [showCard, setShowCard] = useState(false);

  const formatType = (event) => formatNotificationTitle(t, {
    type: event.type,
    attributes: {
      alarms: event.attributes.alarm,
    },
  });

  const onMarkerClick = useCallback((positionId) => {
    setShowCard(!!positionId);
  }, [setShowCard]);

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        setEvent(await response.json());
      } else {
        throw Error(await response.text());
      }
    }
  }, [id]);

  useEffectAsync(async () => {
    if (event && event.positionId) {
      const response = await fetch(`/api/positions?id=${event.positionId}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setPosition(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [event]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar color="inherit" position="static" sx={{ zIndex: 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{event && formatType(event)}</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ flexGrow: 1 }}>
        <MapView>
          <MapGeofence />
          {position && <MapPositions positions={[position]} onClick={onMarkerClick} titleField="fixTime" />}
        </MapView>
        <MapScale />
        {position && <MapCamera latitude={position.latitude} longitude={position.longitude} />}
        {position && showCard && (
          <StatusCard
            deviceId={position.deviceId}
            position={position}
            onClose={() => setShowCard(false)}
            disableActions
          />
        )}
      </div>
    </div>
  );
};

export default EventPage;