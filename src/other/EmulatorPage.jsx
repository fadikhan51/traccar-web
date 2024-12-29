import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider, Typography, IconButton, useMediaQuery, Toolbar,
  List,
  ListItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MapView from '../map/core/MapView';
import MapCurrentLocation from '../map/MapCurrentLocation';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import SelectField from '../common/components/SelectField';
import { devicesActions } from '../store';
import MapPositions from '../map/MapPositions';
import { useCatch } from '../reactHelper';
import MapScale from '../map/MapScale';

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from '../common/theme/useGlobalStyles';

const EmulatorPage = () => {
  const theme = useTheme();
  const [colors, setColors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const devices = useSelector((state) => state.devices.items);
  const deviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);

  const handleClick = useCatch(async (latitude, longitude) => {
    if (deviceId) {
      let response;
      if (window.location.protocol === 'https:') {
        const formData = new FormData();
        formData.append('id', devices[deviceId].uniqueId);
        formData.append('lat', latitude);
        formData.append('lon', longitude);
        response = await fetch(window.location.origin, {
          method: 'POST',
          body: formData,
        });
      } else {
        const params = new URLSearchParams();
        params.append('id', devices[deviceId].uniqueId);
        params.append('lat', latitude);
        params.append('lon', longitude);
        response = await fetch(`http://${window.location.hostname}:5055?${params.toString()}`, {
          method: 'POST',
          mode: 'no-cors',
        });
      }
      if (!response.ok) {
        throw Error(await response.text());
      }
    }
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        flexGrow: 1, 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: isPhone ? 'column-reverse' : 'row' 
      }}>
        <Drawer
          style={{ zIndex: 1 }}
          anchor={isPhone ? 'bottom' : 'left'}
          variant="permanent"
          PaperProps={{
            style: {
              position: 'relative',
              width: isPhone ? 'auto' : theme.dimensions.drawerWidthDesktop,
              height: isPhone ? theme.dimensions.drawerHeightPhone : 'auto'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
              <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" style={{ flexGrow: 1 }}>{t('sharedEmulator')}</Typography>
            </Toolbar>
            <Divider />
            <List style={{ flexGrow: 1 }}>
              <ListItem>
                <SelectField
                  label={t('reportDevice')}
                  data={Object.values(devices).sort((a, b) => a.name.localeCompare(b.name))}
                  value={deviceId}
                  onChange={(e) => dispatch(devicesActions.selectId(e.target.value))}
                  fullWidth
                />
              </ListItem>
            </List>
          </div>
        </Drawer>
        <div style={{ flexGrow: 1 }}>
          <MapView>
            <MapPositions
              positions={Object.values(positions)}
              onClick={handleClick}
              showStatus
            />
          </MapView>
          <MapScale />
          <MapCurrentLocation />
          <MapGeocoder />
        </div>
      </div>
    </div>
  );
};

export default EmulatorPage;