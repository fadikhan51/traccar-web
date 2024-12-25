import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Divider, Typography, IconButton, Toolbar,
  Paper,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import MapView from '../map/core/MapView';
import MapCurrentLocation from '../map/MapCurrentLocation';
import MapGeofenceEdit from '../map/draw/MapGeofenceEdit';
import GeofencesList from './GeofencesList';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import { errorsActions } from '../store';
import MapScale from '../map/MapScale';

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";

const useStyles = (colors) => makeStyles((theme) => ({
  "@import": [
      "url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)",
    ],
    "@global": {
      "*": {
        fontFamily: "Poppins, sans-serif",
        color: colors.darkgray,
      },
      ".MuiFormControl-root": {
        marginBottom: `${theme.spacing(1)} !important`,
        "& .MuiInputLabel-root": {
          color: colors.darkgray,
          "&.Mui-focused": {
            color: colors.highlight,
          },
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: colors.gray,
          },
          "&:hover fieldset": {
            borderColor: colors.secondary,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.accent,
          },
        },
        "& .MuiSelect-select": {
          color: colors.darkgray,
          backgroundColor: colors.accent,
        },
      },
      //Checkbox style
      ".MuiFormControlLabel-label": {
        fontSize: "0.9rem !important",
      },
      ".MuiAutocomplete-root": {
        marginBottom: theme.spacing(2),
        "& .MuiInputLabel-root": {
          color: colors.darkgray,
          "&.Mui-focused": {
            color: colors.highlight,
          },
        },
        "& .MuiOutlinedInput-root": {
          backgroundColor: colors.accent,
          "& fieldset": {
            // borderColor: colors.darkgray, // Sets the borderColor of autocomplete to gray when not focused
          },
          "&:hover fieldset": {
            borderColor: colors.secondary,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.accent,
          },
        },
        "& .MuiAutocomplete-tag": {
          color: colors.darkgray,
          backgroundColor: colors.muted,
        },
        "& .MuiAutocomplete-popupIndicator": {
          color: colors.accent,
        },
        "& .MuiAutocomplete-paper": {
          backgroundColor: colors.darkgray,
        },
        "& .MuiAutocomplete-listbox": {
          "& .MuiAutocomplete-option": {
            color: colors.darkgray,
          },
        },
      },
    },
    fontSize: {
      fontSize: "0.9rem !important",
    },
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white + ' !important',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.up('sm')]: {
      width: theme.dimensions.drawerWidthDesktop,
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.dimensions.drawerHeightPhone,
    },
  },
  mapContainer: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  fileInput: {
    display: 'none',
  },
}));

const GeofencesPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    const reader = new FileReader();
    reader.onload = async () => {
      const xml = new DOMParser().parseFromString(reader.result, 'text/xml');
      const segment = xml.getElementsByTagName('trkseg')[0];
      const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
        .map((point) => `${point.getAttribute('lat')} ${point.getAttribute('lon')}`)
        .join(', ');
      const area = `LINESTRING (${coordinates})`;
      const newItem = { name: t('sharedGeofence'), area };
      try {
        const response = await fetch('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (response.ok) {
          const item = await response.json();
          navigate(`/settings/geofence/${item.id}`);
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };
    reader.onerror = (event) => {
      dispatch(errorsActions.push(event.target.error));
    };
    reader.readAsText(file);
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Paper square className={classes.drawer}>
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>{t('sharedGeofences')}</Typography>
            <label htmlFor="upload-gpx">
              <input accept=".gpx" id="upload-gpx" type="file" className={classes.fileInput} onChange={handleFile} />
              <IconButton edge="end" component="span" onClick={() => {}}>
                <Tooltip title={t('sharedUpload')}>
                  <UploadFileIcon />
                </Tooltip>
              </IconButton>
            </label>
          </Toolbar>
          <Divider />
          <GeofencesList onGeofenceSelected={setSelectedGeofenceId} />
        </Paper>
        <div className={classes.mapContainer}>
          <MapView>
            <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
          </MapView>
          <MapScale />
          <MapCurrentLocation />
          <MapGeocoder />
        </div>
      </div>
    </div>
  );
};

export default GeofencesPage;
