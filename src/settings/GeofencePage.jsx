import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography, TextField, Container,
  Card,  CardContent, Grid, FormControl
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import EditAttributesCard from './components/EditAttributesCard';
import { useTranslation } from '../common/components/LocalizationProvider';
import useGeofenceAttributes from '../common/attributes/useGeofenceAttributes';
import NewSettingsMenu from './components/NewSettingsMenu';
import SelectField from '../common/components/SelectField';
import { geofencesActions } from '../store';

import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from '../common/theme/useGlobalStyles';
  
const GeofencePage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const t = useTranslation();

  const geofenceAttributes = useGeofenceAttributes(t);

  const [item, setItem] = useState();

  const onItemSaved = (result) => {
    dispatch(geofencesActions.update([result]));
  };

  const validate = () => item && item.name;

  return (
    <EditItemView
      endpoint="geofences"
      item={item}
      setItem={setItem}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<NewSettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedGeofence']}
    ><Container maxWidth="lg" className={classes.container}>
    <Grid container spacing={2} className={classes.gridContainer}>
      {item && (
        <>
          <Grid item xs={12} lg={6} style={{ display: 'flex' }}>
            <Card className={classes.card} style={{ width: '100%' }}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("sharedRequired")}
              </Typography>
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                  <TextField
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
              />
                  </FormControl>
                  </CardContent>
                  </Card>
                  </Grid>

                  <Grid item xs={12} lg={6} style={{ display: 'flex' }}>
            <Card className={classes.card} style={{ width: '100%' }}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("sharedExtra")}
              </Typography>
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                <TextField
                value={item.description || ''}
                onChange={(event) => setItem({ ...item, description: event.target.value })}
                label={t('sharedDescription')}
              />
              <SelectField
                value={item.calendarId}
                onChange={(event) => setItem({ ...item, calendarId: Number(event.target.value) })}
                endpoint="/api/calendars"
                label={t('sharedCalendar')}
              />
                  </FormControl>
                  </CardContent>
                  </Card>
                  </Grid>

          <EditAttributesCard
            attributes={item.attributes}
            setAttributes={(attributes) => setItem({ ...item, attributes })}
            definitions={geofenceAttributes}
          />
        </>
      )}
      </Grid>
      </Container>
    </EditItemView>
  );
};

export default GeofencePage;
