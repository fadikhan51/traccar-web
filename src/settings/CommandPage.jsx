import React, { useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, TextField,
  Card,
  CardContent,
  Grid,
  Container,
  FormControl
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import { useTranslation } from '../common/components/LocalizationProvider';
import BaseCommandView from './components/BaseCommandView';
import NewSettingsMenu from './components/NewSettingsMenu';
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from '../common/theme/useGlobalStyles';

const CommandPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.type;

  return (
    <EditItemView
      endpoint="commands"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<NewSettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedSavedCommand']}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          {item && (
            <>
              <Grid item xs={12} lg={6} style={{display: "flex"}}>
                <Card className={classes.card} style={{height: "100%"}}>
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
              value={item.description || ''}
              onChange={(event) => setItem({ ...item, description: event.target.value })}
              label={t('sharedDescription')}
            />
            <BaseCommandView item={item} setItem={setItem} />
                      </FormControl>
                      </CardContent>
                      </Card>
                      </Grid>
        </>
      )}
      </Grid>
      </Container>
    </EditItemView>
  );
};

export default CommandPage;
