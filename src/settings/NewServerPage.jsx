import React, { useState } from "react";
import TextField from "@mui/material/TextField";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  FormControl,
  Container,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Card,
  Grid,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DropzoneArea } from "react-mui-dropzone";
import { sessionActions } from "../store";
import EditAttributesCard from "./components/EditAttributesCard";
import EditAttributesAccordion from "./components/EditAttributesAccordion";
import { useTranslation } from "../common/components/LocalizationProvider";
import SelectField from "../common/components/SelectField";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import useCommonUserAttributes from "../common/attributes/useCommonUserAttributes";
import { useCatch } from "../reactHelper";
import useServerAttributes from "../common/attributes/useServerAttributes";
import useMapStyles from "../map/core/useMapStyles";
import { map } from "../map/core/MapView";
import useSettingsStyles from "./common/useSettingsStyles";
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
          "&.Mui-disabled": {
            color: `${colors.darkgray} !important`,
            "&:hover": {
              color: `${colors.highlight} !important`,
            },
          },
        },
        "& .MuiOutlinedInput-root": {
          backgroundColor: colors.accent,
          "& fieldset": {
            borderColor: colors.gray,
          },
          "&:hover fieldset": {
            borderColor: colors.secondary,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.accent,
          },
          "& .MuiInputBase-input": {
            color: colors.darkgray,
            "&.Mui-disabled": {
              color: `${colors.darkgray} !important`,
              "-webkit-text-fill-color": `${colors.darkgray} !important`,
            },
          },
          "&.Mui-disabled .MuiInputLabel-root": {
            color: `${colors.darkgray} !important`,
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
      ".MuiButton-root": {
        color: `${colors.darkgray} !important`,
        "&.MuiButton-outlined": {
          borderColor: colors.gray,
          "&:hover": {
            borderColor: colors.secondary,
            backgroundColor: colors.accent,
          },
        },
        "&.MuiButton-contained": {
          backgroundColor: `${colors.accent} !important`,
          "&:hover": {
            backgroundColor: `${colors.secondary} !important`,
          },
          "&:disabled": {
            backgroundColor: `${colors.muted} !important`,
            color: `${colors.gray} !important`,
          },
        },
      },
      ".MuiDropzoneArea-root": {
        backgroundColor: `${colors.accent} !important`,
        border: `2px dashed ${colors.gray} !important`,
        "&:hover": {
          borderColor: `${colors.secondary} !important`,
        },
      },
      ".MuiDropzoneArea-text": {
        color: `${colors.darkgray} !important`,
      },
      ".MuiDropzoneArea-icon": {
        color: `${colors.darkgray} !important`,
      },
      ".MuiTableCell-root": {
        color: `${colors.darkgray} !important`,
      },
    },
    fontSize: {
      fontSize: "0.9rem !important",
    },
    container: {
      marginTop: theme.spacing(2),
    },
    card: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: `${colors.white} !important`,
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
    },
    buttons: {
      display: "flex",
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  }));

const ServerPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const mapStyles = useMapStyles();
  const commonUserAttributes = useCommonUserAttributes(t);
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const serverAttributes = useServerAttributes(t);

  const original = useSelector((state) => state.session.server);
  const [item, setItem] = useState({ ...original });

  const handleFiles = useCatch(async (files) => {
    if (files.length > 0) {
      const file = files[0];
      const response = await fetch(`/api/server/file/${file.path}`, {
        method: "POST",
        body: file,
      });
      if (!response.ok) {
        throw Error(await response.text());
      }
    }
  });

  const handleSave = useCatch(async () => {
    const response = await fetch("/api/server", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      dispatch(sessionActions.updateServer(await response.json()));
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsServer"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          {item && (
            <>
              <Grid item xs={12} lg={6}>
                <Card className={classes.card}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedPreferences")}
                  </Typography>
                  <CardContent>
                    <FormControl
                      sx={classes.formControl}
                      fullWidth
                      className={classes.formControl}
                    >
                      <TextField
                        value={item.mapUrl || ""}
                        onChange={(event) =>
                          setItem({ ...item, mapUrl: event.target.value })
                        }
                        label={t("mapCustomLabel")}
                      />
                      <TextField
                        value={item.overlayUrl || ""}
                        onChange={(event) =>
                          setItem({ ...item, overlayUrl: event.target.value })
                        }
                        label={t("mapOverlayCustom")}
                      />
                      <FormControl>
                        <InputLabel>{t("mapDefault")}</InputLabel>
                        <Select
                          label={t("mapDefault")}
                          value={item.map || "locationIqStreets"}
                          onChange={(e) =>
                            setItem({ ...item, map: e.target.value })
                          }
                        >
                          {mapStyles
                            .filter((style) => style.available)
                            .map((style) => (
                              <MenuItem key={style.id} value={style.id}>
                                <Typography component="span">
                                  {style.title}
                                </Typography>
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("settingsCoordinateFormat")}</InputLabel>
                        <Select
                          label={t("settingsCoordinateFormat")}
                          value={item.coordinateFormat || "dd"}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              coordinateFormat: event.target.value,
                            })
                          }
                        >
                          <MenuItem value="dd">
                            {t("sharedDecimalDegrees")}
                          </MenuItem>
                          <MenuItem value="ddm">
                            {t("sharedDegreesDecimalMinutes")}
                          </MenuItem>
                          <MenuItem value="dms">
                            {t("sharedDegreesMinutesSeconds")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("settingsSpeedUnit")}</InputLabel>
                        <Select
                          label={t("settingsSpeedUnit")}
                          value={item.attributes.speedUnit || "kn"}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              attributes: {
                                ...item.attributes,
                                speedUnit: e.target.value,
                              },
                            })
                          }
                        >
                          <MenuItem value="kn">{t("sharedKn")}</MenuItem>
                          <MenuItem value="kmh">{t("sharedKmh")}</MenuItem>
                          <MenuItem value="mph">{t("sharedMph")}</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("settingsDistanceUnit")}</InputLabel>
                        <Select
                          label={t("settingsDistanceUnit")}
                          value={item.attributes.distanceUnit || "km"}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              attributes: {
                                ...item.attributes,
                                distanceUnit: e.target.value,
                              },
                            })
                          }
                        >
                          <MenuItem value="km">{t("sharedKm")}</MenuItem>
                          <MenuItem value="mi">{t("sharedMi")}</MenuItem>
                          <MenuItem value="nmi">{t("sharedNmi")}</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("settingsAltitudeUnit")}</InputLabel>
                        <Select
                          label={t("settingsAltitudeUnit")}
                          value={item.attributes.altitudeUnit || "m"}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              attributes: {
                                ...item.attributes,
                                altitudeUnit: e.target.value,
                              },
                            })
                          }
                        >
                          <MenuItem value="m">{t("sharedMeters")}</MenuItem>
                          <MenuItem value="ft">{t("sharedFeet")}</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("settingsVolumeUnit")}</InputLabel>
                        <Select
                          label={t("settingsVolumeUnit")}
                          value={item.attributes.volumeUnit || "ltr"}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              attributes: {
                                ...item.attributes,
                                volumeUnit: e.target.value,
                              },
                            })
                          }
                        >
                          <MenuItem value="ltr">{t("sharedLiter")}</MenuItem>
                          <MenuItem value="usGal">
                            {t("sharedUsGallon")}
                          </MenuItem>
                          <MenuItem value="impGal">
                            {t("sharedImpGallon")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <SelectField
                        value={item.attributes.timezone}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            attributes: {
                              ...item.attributes,
                              timezone: e.target.value,
                            },
                          })
                        }
                        endpoint="/api/server/timezones"
                        keyGetter={(it) => it}
                        titleGetter={(it) => it}
                        label={t("sharedTimezone")}
                      />
                      <TextField
                        value={item.poiLayer || ""}
                        onChange={(event) =>
                          setItem({ ...item, poiLayer: event.target.value })
                        }
                        label={t("mapPoiLayer")}
                      />
                      <TextField
                        value={item.announcement || ""}
                        onChange={(event) =>
                          setItem({ ...item, announcement: event.target.value })
                        }
                        label={t("serverAnnouncement")}
                      />
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.forceSettings}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  forceSettings: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("serverForceSettings")}
                        />
                      </FormGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Grid item xs={12} lg={12}>
                  <Card className={classes.card}>
                    <Typography variant="h6" className={classes.cardTitle}>
                      {t("sharedLocation")}
                    </Typography>
                    <CardContent>
                      <FormControl
                        sx={classes.formControl}
                        fullWidth
                        className={classes.formControl}
                      >
                        <TextField
                          type="number"
                          value={item.latitude || 0}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              latitude: Number(event.target.value),
                            })
                          }
                          label={t("positionLatitude")}
                        />
                        <TextField
                          type="number"
                          value={item.longitude || 0}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              longitude: Number(event.target.value),
                            })
                          }
                          label={t("positionLongitude")}
                        />
                        <TextField
                          type="number"
                          value={item.zoom || 0}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              zoom: Number(event.target.value),
                            })
                          }
                          label={t("serverZoom")}
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            const { lng, lat } = map.getCenter();
                            setItem({
                              ...item,
                              latitude: Number(lat.toFixed(6)),
                              longitude: Number(lng.toFixed(6)),
                              zoom: Number(map.getZoom().toFixed(1)),
                            });
                          }}
                        >
                          {t("mapCurrentLocation")}
                        </Button>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} >
                <Card className={classes.card}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedFile")}
                  </Typography>
                  <CardContent>
                    <DropzoneArea
                      dropzoneText={t("sharedDropzoneText")}
                      filesLimit={1}
                      onChange={handleFiles}
                      showAlerts={false}
                    />
                  </CardContent>
                </Card>
              </Grid>
              </Grid> 

              <Grid item xs={12} lg={6}>
                <Card className={classes.card}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedPermissions")}
                  </Typography>
                  <CardContent>
                    <FormControl
                      sx={classes.formControl}
                      fullWidth
                      className={classes.formControl}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.registration}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  registration: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("serverRegistration")}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.readonly}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  readonly: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("serverReadonly")}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.deviceReadonly}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  deviceReadonly: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userDeviceReadonly")}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.limitCommands}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  limitCommands: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userLimitCommands")}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.disableReports}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  disableReports: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userDisableReports")}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.fixedEmail}
                              onChange={(e) =>
                                setItem({
                                  ...item,
                                  fixedEmail: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userFixedEmail")}
                        />
                      </FormGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <EditAttributesCard
                    attributes={item.attributes}
                    setAttributes={(attributes) =>
                      setItem({ ...item, attributes })
                    }
                    definitions={{
                      ...commonUserAttributes,
                      ...commonDeviceAttributes,
                      ...serverAttributes,
                    }}
                  />
            </>
          )}
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
      </Container>
    </NewPageLayout>
  );
};

export default ServerPage;
