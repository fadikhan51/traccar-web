import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  Grid,
  FormControl,
  CardContent,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditItemView from "./components/EditItemView";
import EditAttributesCard from "./components/EditAttributesCard";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewSettingsMenu from "./components/NewSettingsMenu";
// import useSettingsStyles from './common/useSettingsStyles';
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const DriverPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.name && item.uniqueId;

  return (
    <EditItemView
      endpoint="drivers"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedDriver"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          {item && (
            <>
              <Grid item xs={12} lg={6} style={{ display: "flex" }}>
                <Card className={classes.card} style={{ flex: 1 }}>
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
                        value={item.name || ""}
                        onChange={(event) =>
                          setItem({ ...item, name: event.target.value })
                        }
                        label={t("sharedName")}
                      />
                      <TextField
                        value={item.uniqueId || ""}
                        onChange={(event) =>
                          setItem({ ...item, uniqueId: event.target.value })
                        }
                        label={t("deviceIdentifier")}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <EditAttributesCard
                attributes={item.attributes}
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={{}}
              />
            </>
          )}
        </Grid>
      </Container>
    </EditItemView>
  );
};

export default DriverPage;
