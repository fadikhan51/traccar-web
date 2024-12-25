import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { useCatch } from "../reactHelper";
import { useAttributePreference } from "../common/util/preferences";
import {
  distanceFromMeters,
  distanceToMeters,
  distanceUnitString,
} from "../common/util/converter";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTheme } from "@emotion/react";
const useStyles = (colors) =>
  makeStyles((theme) => ({
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
          "& fieldset": {},
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
    container: {
      marginTop: theme.spacing(2),
      width: "100%",
      padding: theme.spacing(2),
    },
    card: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: `${colors.muted} !important`,
      width: "100%",
      "& > *:not(:last-child)": {
        marginBottom: theme.spacing(2),
      },
    },
    cardTitle: {
      marginBottom: theme.spacing(1),
      color: colors.darkgray,
    },
    gridContainer: {
      marginBottom: theme.spacing(2),
      width: "100%",
    },
  }));

const AccumulatorsPage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();

  const t = useTranslation();

  const distanceUnit = useAttributePreference("distanceUnit");

  const { deviceId } = useParams();
  const position = useSelector((state) => state.session.positions[deviceId]);

  const [item, setItem] = useState();

  useEffect(() => {
    if (position) {
      setItem({
        deviceId: parseInt(deviceId, 10),
        hours: position.attributes.hours || 0,
        totalDistance: position.attributes.totalDistance || 0,
      });
    }
  }, [deviceId, position]);

  const handleSave = useCatch(async () => {
    const response = await fetch(`/api/devices/${deviceId}/accumulators`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["sharedDeviceAccumulators"]}
    >
      {item && (
        <Container className={classes.container}>
          <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item xs={12} md={6} lg={6}>
              <Card className={classes.card} style={{ overflowX: "auto" }}>
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
                      type="number"
                      value={item.hours / 3600000}
                      onChange={(event) =>
                        setItem({
                          ...item,
                          hours: Number(event.target.value) * 3600000,
                        })
                      }
                      label={t("positionHours")}
                    />
                    <TextField
                      type="number"
                      value={distanceFromMeters(
                        item.totalDistance,
                        distanceUnit
                      )}
                      onChange={(event) =>
                        setItem({
                          ...item,
                          totalDistance: distanceToMeters(
                            Number(event.target.value),
                            distanceUnit
                          ),
                        })
                      }
                      label={`${t("deviceTotalDistance")} (${distanceUnitString(
                        distanceUnit,
                        t
                      )})`}
                    />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className={classes.buttons}>
                <Button
                  type="button"
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                >
                  {t("sharedCancel")}
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={handleSave}
                >
                  {t("sharedSave")}
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      )}
    </NewPageLayout>
  );
};

export default AccumulatorsPage;
