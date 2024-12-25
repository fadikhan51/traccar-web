import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  TextField,
  Card,
  CardContent,
  Container,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CachedIcon from "@mui/icons-material/Cached";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import EditItemView from "./components/EditItemView";
import EditAttributesCard from "./components/EditAttributesCard";
import { useTranslation } from "../common/components/LocalizationProvider";
import useUserAttributes from "../common/attributes/useUserAttributes";
import { sessionActions } from "../store";
import SelectField from "../common/components/SelectField";
import SettingsMenu from "./components/SettingsMenu";
import NewSettingsMenu from "./components/NewSettingsMenu";
import useCommonUserAttributes from "../common/attributes/useCommonUserAttributes";
import {
  useAdministrator,
  useRestriction,
  useManager,
} from "../common/util/permissions";
import useQuery from "../common/util/useQuery";
import { useCatch } from "../reactHelper";
import useMapStyles from "../map/core/useMapStyles";
import { map } from "../map/core/MapView";

import makeStyles from "@mui/styles/makeStyles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";

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

const NewUserPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const manager = useManager();
  const fixedEmail = useRestriction("fixedEmail");

  const currentUser = useSelector((state) => state.session.user);
  const registrationEnabled = useSelector(
    (state) => state.session.server.registration
  );
  const openIdForced = useSelector((state) => state.session.server.openIdForce);
  const totpEnable = useSelector(
    (state) => state.session.server.attributes.totpEnable
  );
  const totpForce = useSelector(
    (state) => state.session.server.attributes.totpForce
  );

  const mapStyles = useMapStyles();
  const commonUserAttributes = useCommonUserAttributes(t);
  const userAttributes = useUserAttributes(t);

  const { id } = useParams();
  const [item, setItem] = useState(
    id === currentUser.id.toString() ? currentUser : null
  );

  const [deleteEmail, setDeleteEmail] = useState();
  const [deleteFailed, setDeleteFailed] = useState(false);

  const handleDelete = useCatch(async () => {
    if (deleteEmail === currentUser.email) {
      setDeleteFailed(false);
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/login");
        dispatch(sessionActions.updateUser(null));
      } else {
        throw Error(await response.text());
      }
    } else {
      setDeleteFailed(true);
    }
  });

  const handleGenerateTotp = useCatch(async () => {
    const response = await fetch("/api/users/totp", { method: "POST" });
    if (response.ok) {
      setItem({ ...item, totpKey: await response.text() });
    } else {
      throw Error(await response.text());
    }
  });

  const query = useQuery();
  const [queryHandled, setQueryHandled] = useState(false);
  const attribute = query.get("attribute");

  useEffect(() => {
    if (!queryHandled && item && attribute) {
      if (!item.attributes.hasOwnProperty("attribute")) {
        const updatedAttributes = { ...item.attributes };
        updatedAttributes[attribute] = "";
        setItem({ ...item, attributes: updatedAttributes });
      }
      setQueryHandled(true);
    }
  }, [item, queryHandled, setQueryHandled, attribute]);

  const onItemSaved = (result) => {
    if (result.id === currentUser.id) {
      dispatch(sessionActions.updateUser(result));
    }
  };

  const validate = () =>
    item &&
    item.name &&
    item.email &&
    (item.id || item.password) &&
    (admin || !totpForce || item.totpKey);

  return (
    <EditItemView
      endpoint="users"
      item={item}
      setItem={setItem}
      defaultItem={admin ? { deviceLimit: -1 } : {}}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsUser"]}
    >
      {item && (
        <>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={2} className={classes.gridContainer}>
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
                        value={item.phone || ""}
                        onChange={(e) =>
                          setItem({ ...item, phone: e.target.value })
                        }
                        label={t("sharedPhone")}
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
                          onChange={(e) =>
                            setItem({
                              ...item,
                              coordinateFormat: e.target.value,
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
                          value={
                            (item.attributes && item.attributes.speedUnit) ||
                            "kn"
                          }
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
                          value={
                            (item.attributes && item.attributes.distanceUnit) ||
                            "km"
                          }
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
                          value={
                            (item.attributes && item.attributes.altitudeUnit) ||
                            "m"
                          }
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
                          value={
                            (item.attributes && item.attributes.volumeUnit) ||
                            "ltr"
                          }
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
                        value={item.attributes && item.attributes.timezone}
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
                        onChange={(e) =>
                          setItem({ ...item, poiLayer: e.target.value })
                        }
                        label={t("mapPoiLayer")}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
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
                      <TextField
                        label={t("userExpirationTime")}
                        type="date"
                        value={
                          item.expirationTime
                            ? item.expirationTime.split("T")[0]
                            : "2099-01-01"
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            setItem({
                              ...item,
                              expirationTime: new Date(
                                e.target.value
                              ).toISOString(),
                            });
                          }
                        }}
                        disabled={!manager}
                      />
                      <TextField
                        type="number"
                        value={item.deviceLimit || 0}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            deviceLimit: Number(e.target.value),
                          })
                        }
                        label={t("userDeviceLimit")}
                        disabled={!admin}
                      />
                      <TextField
                        type="number"
                        value={item.userLimit || 0}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            userLimit: Number(e.target.value),
                          })
                        }
                        label={t("userUserLimit")}
                        disabled={!admin}
                      />
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.disabled}
                              onChange={(e) =>
                                setItem({ ...item, disabled: e.target.checked })
                              }
                            />
                          }
                          label={t("sharedDisabled")}
                          disabled={!manager}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.administrator}
                              onChange={(e) =>
                                setItem({
                                  ...item,
                                  administrator: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userAdmin")}
                          disabled={!admin}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.readonly}
                              onChange={(e) =>
                                setItem({ ...item, readonly: e.target.checked })
                              }
                            />
                          }
                          label={t("serverReadonly")}
                          disabled={!manager}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.deviceReadonly}
                              onChange={(e) =>
                                setItem({
                                  ...item,
                                  deviceReadonly: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userDeviceReadonly")}
                          disabled={!manager}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.limitCommands}
                              onChange={(e) =>
                                setItem({
                                  ...item,
                                  limitCommands: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userLimitCommands")}
                          disabled={!manager}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.disableReports}
                              onChange={(e) =>
                                setItem({
                                  ...item,
                                  disableReports: e.target.checked,
                                })
                              }
                            />
                          }
                          label={t("userDisableReports")}
                          disabled={!manager}
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
                          disabled={!manager}
                        />
                      </FormGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
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
                        onChange={(e) =>
                          setItem({ ...item, latitude: Number(e.target.value) })
                        }
                        label={t("positionLatitude")}
                      />
                      <TextField
                        type="number"
                        value={item.longitude || 0}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            longitude: Number(e.target.value),
                          })
                        }
                        label={t("positionLongitude")}
                      />
                      <TextField
                        type="number"
                        value={item.zoom || 0}
                        onChange={(e) =>
                          setItem({ ...item, zoom: Number(e.target.value) })
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

              <Grid item xs={12} lg={6}>
                <Card className={classes.card}>
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
                        onChange={(e) =>
                          setItem({ ...item, name: e.target.value })
                        }
                        label={t("sharedName")}
                      />
                      <TextField
                        value={item.email || ""}
                        onChange={(e) =>
                          setItem({ ...item, email: e.target.value })
                        }
                        label={t("userEmail")}
                        disabled={fixedEmail && item.id === currentUser.id}
                      />
                      {!openIdForced && (
                        <TextField
                          type="password"
                          onChange={(e) =>
                            setItem({ ...item, password: e.target.value })
                          }
                          label={t("userPassword")}
                        />
                      )}
                      {totpEnable && (
                        <FormControl>
                          <InputLabel>{t("loginTotpKey")}</InputLabel>
                          <OutlinedInput
                            readOnly
                            label={t("loginTotpKey")}
                            value={item.totpKey || ""}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  edge="end"
                                  onClick={handleGenerateTotp}
                                >
                                  <CachedIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  edge="end"
                                  onClick={() =>
                                    setItem({ ...item, totpKey: null })
                                  }
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      )}
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              

              <EditAttributesCard
                attribute={attribute}
                attributes={item.attributes}
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={{ ...commonUserAttributes, ...userAttributes }}
                focusAttribute={attribute}
              />

              {registrationEnabled &&
                item.id === currentUser.id &&
                !manager && (
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
                            value={deleteEmail}
                            onChange={(e) => setDeleteEmail(e.target.value)}
                            label={t("userEmail")}
                            error={deleteFailed}
                          />
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            startIcon={<DeleteForeverIcon />}
                          >
                            {t("userDeleteAccount")}
                          </Button>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
            </Grid>
          </Container>
        </>
      )}
    </EditItemView>
  );
};

export default NewUserPage;
