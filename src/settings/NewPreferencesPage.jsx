import React, { useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Autocomplete,
  TextField,
  createFilterOptions,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CachedIcon from "@mui/icons-material/Cached";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  useTranslation,
  useTranslationKeys,
} from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import { prefixString, unprefixString } from "../common/util/stringUtils";
import SelectField from "../common/components/SelectField";
import useMapStyles from "../map/core/useMapStyles";
import useMapOverlays from "../map/overlay/useMapOverlays";
import { useCatch } from "../reactHelper";
import { sessionActions } from "../store";
import { useAdministrator, useRestriction } from "../common/util/permissions";
// import useSettingsStyles from "./common/useSettingsStyles";
import makeStyles from "@mui/styles/makeStyles";

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

const deviceFields = [
  { id: "name", name: "sharedName" },
  { id: "uniqueId", name: "deviceIdentifier" },
  { id: "phone", name: "sharedPhone" },
  { id: "model", name: "deviceModel" },
  { id: "contact", name: "deviceContact" },
];

const NewPreferencesPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const theme = useTheme();
  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const admin = useAdministrator();
  const readonly = useRestriction("readonly");

  const user = useSelector((state) => state.session.user);
  const [attributes, setAttributes] = useState(user.attributes);

  const versionApp = import.meta.env.VITE_APP_VERSION.slice(0, -2);
  const versionServer = useSelector((state) => state.session.server.version);
  const socket = useSelector((state) => state.session.socket);

  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(
    dayjs().add(1, "week").locale("en").format("YYYY-MM-DD")
  );

  const mapStyles = useMapStyles();
  const mapOverlays = useMapOverlays();

  const positionAttributes = usePositionAttributes(t);

  const filter = createFilterOptions();

  const generateToken = useCatch(async () => {
    const expiration = dayjs(tokenExpiration, "YYYY-MM-DD").toISOString();
    const response = await fetch("/api/session/token", {
      method: "POST",
      body: new URLSearchParams(`expiration=${expiration}`),
    });
    if (response.ok) {
      setToken(await response.text());
    } else {
      throw Error(await response.text());
    }
  });

  const alarms = useTranslationKeys((it) => it.startsWith("alarm")).map(
    (it) => ({
      key: unprefixString("alarm", it),
      name: t(it),
    })
  );

  const handleSave = useCatch(async () => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, attributes }),
    });
    if (response.ok) {
      dispatch(sessionActions.updateUser(await response.json()));
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  const handleReboot = useCatch(async () => {
    const response = await fetch("/api/server/reboot", { method: "POST" });
    throw Error(response.statusText);
  });

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedPreferences"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} lg={6}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("mapTitle")}
              </Typography>
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel className={classes.inputLabel}>
                    {t("mapActive")}
                  </InputLabel>
                  <Select
                    label={t("mapActive")}
                    value={
                      attributes.activeMapStyles?.split(",") || [
                        "locationIqStreets",
                        "locationIqDark",
                        "openFreeMap",
                      ]
                    }
                    onChange={(e, child) => {
                      const clicked = mapStyles.find(
                        (s) => s.id === child.props.value
                      );
                      if (clicked.available) {
                        setAttributes({
                          ...attributes,
                          activeMapStyles: e.target.value.join(","),
                        });
                      } else if (clicked.id !== "custom") {
                        const query = new URLSearchParams({
                          attribute: clicked.attribute,
                        });
                        navigate(
                          `/settings/user/${user.id}?${query.toString()}`
                        );
                      }
                    }}
                    multiple
                  >
                    {mapStyles.map((style) => (
                      <MenuItem key={style.id} value={style.id}>
                        <Typography
                          className={classes.fontSize}
                          component="span"
                          color={
                            style.available ? `${colors.darkgray}` : "error"
                          }
                        >
                          {style.title}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel>{t("mapOverlay")}</InputLabel>
                  <Select
                    label={t("mapOverlay")}
                    value={attributes.selectedMapOverlay || ""}
                    onChange={(e) => {
                      const clicked = mapOverlays.find(
                        (o) => o.id === e.target.value
                      );
                      if (!clicked || clicked.available) {
                        setAttributes({
                          ...attributes,
                          selectedMapOverlay: e.target.value,
                        });
                      } else if (clicked.id !== "custom") {
                        const query = new URLSearchParams({
                          attribute: clicked.attribute,
                        });
                        navigate(
                          `/settings/user/${user.id}?${query.toString()}`
                        );
                      }
                    }}
                  >
                    <MenuItem value="">{"\u00a0"}</MenuItem>
                    {mapOverlays.map((overlay) => (
                      <MenuItem key={overlay.id} value={overlay.id}>
                        <Typography
                          className={classes.fontSize}
                          component="span"
                          color={
                            overlay.available ? `${colors.darkgray}` : "error"
                          }
                        >
                          {overlay.title}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Autocomplete
                  className={classes.autocomplete}
                  multiple
                  freeSolo
                  options={Object.keys(positionAttributes)}
                  getOptionLabel={(option) =>
                    positionAttributes[option]?.name || option
                  }
                  value={
                    attributes.positionItems?.split(",") || [
                      "fixTime",
                      "address",
                      "speed",
                      "totalDistance",
                    ]
                  }
                  onChange={(_, option) => {
                    setAttributes({
                      ...attributes,
                      positionItems: option.join(","),
                    });
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (
                      params.inputValue &&
                      !filtered.includes(params.inputValue)
                    ) {
                      filtered.push(params.inputValue);
                    }
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("attributePopupInfo")} />
                  )}
                />
                <FormControl
                  className={classes.formControl}
                  style={{ marginRight: "16px" }}
                >
                  <InputLabel>{t("mapLiveRoutes")}</InputLabel>
                  <Select
                    label={t("mapLiveRoutes")}
                    className={classes.fontSize}
                    value={attributes.mapLiveRoutes || "none"}
                    onChange={(e) =>
                      setAttributes({
                        ...attributes,
                        mapLiveRoutes: e.target.value,
                      })
                    }
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                  >
                    <MenuItem className={classes.fontSize} value="none">
                      {t("sharedDisabled")}
                    </MenuItem>
                    <MenuItem className={classes.fontSize} value="selected">
                      {t("deviceSelected")}
                    </MenuItem>
                    <MenuItem className={classes.fontSize} value="all">
                      {t("notificationAlways")}
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t("mapDirection")}</InputLabel>
                  <Select
                    label={t("mapDirection")}
                    className={classes.fontSize}
                    value={attributes.mapDirection || "selected"}
                    onChange={(e) =>
                      setAttributes({
                        ...attributes,
                        mapDirection: e.target.value,
                      })
                    }
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                  >
                    <MenuItem className={classes.fontSize} value="none">
                      {t("sharedDisabled")}
                    </MenuItem>
                    <MenuItem className={classes.fontSize} value="selected">
                      {t("deviceSelected")}
                    </MenuItem>
                    <MenuItem className={classes.fontSize} value="all">
                      {t("notificationAlways")}
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          attributes.hasOwnProperty("mapGeofences")
                            ? attributes.mapGeofences
                            : true
                        }
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            mapGeofences: e.target.checked,
                          })
                        }
                      />
                    }
                    label={t("attributeShowGeofences")}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          attributes.hasOwnProperty("mapFollow")
                            ? attributes.mapFollow
                            : false
                        }
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            mapFollow: e.target.checked,
                          })
                        }
                      />
                    }
                    label={t("deviceFollow")}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          attributes.hasOwnProperty("mapCluster")
                            ? attributes.mapCluster
                            : true
                        }
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            mapCluster: e.target.checked,
                          })
                        }
                      />
                    }
                    label={t("mapClustering")}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          attributes.hasOwnProperty("mapOnSelect")
                            ? attributes.mapOnSelect
                            : true
                        }
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            mapOnSelect: e.target.checked,
                          })
                        }
                      />
                    }
                    label={t("mapOnSelect")}
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card className={classes.card}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("deviceTitle")}
                  </Typography>
                  <CardContent>
                    <FormControl fullWidth>
                      <SelectField
                        value={attributes.devicePrimary || "name"}
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            devicePrimary: e.target.value,
                          })
                        }
                        data={deviceFields}
                        titleGetter={(it) => t(it.name)}
                        label={t("devicePrimaryInfo")}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <SelectField
                        value={attributes.deviceSecondary}
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            deviceSecondary: e.target.value,
                          })
                        }
                        data={deviceFields}
                        titleGetter={(it) => t(it.name)}
                        label={t("deviceSecondaryInfo")}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.card}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedSound")}
                  </Typography>
                  <CardContent>
                    <FormControl fullWidth>
                      <SelectField
                        multiple
                        value={attributes.soundEvents?.split(",") || []}
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            soundEvents: e.target.value.join(","),
                          })
                        }
                        endpoint="/api/notifications/types"
                        keyGetter={(it) => it.type}
                        titleGetter={(it) => t(prefixString("event", it.type))}
                        label={t("eventsSoundEvents")}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <SelectField
                        multiple
                        value={attributes.soundAlarms?.split(",") || ["sos"]}
                        onChange={(e) =>
                          setAttributes({
                            ...attributes,
                            soundAlarms: e.target.value.join(","),
                          })
                        }
                        data={alarms}
                        keyGetter={(it) => it.key}
                        label={t("eventsSoundAlarms")}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("userToken")}
              </Typography>
              <CardContent>
                <TextField
                  fullWidth
                  label={t("userExpirationTime")}
                  type="date"
                  value={tokenExpiration}
                  onChange={(e) => {
                    setTokenExpiration(e.target.value);
                    setToken(null);
                  }}
                />
                <FormControl fullWidth>
                  <OutlinedInput
                    multiline
                    rows={6}
                    readOnly
                    type="text"
                    value={token || ""}
                    endAdornment={
                      <InputAdornment position="end">
                        <div className={classes.verticalActions}>
                          <IconButton
                            size="small"
                            edge="end"
                            onClick={generateToken}
                            disabled={!!token}
                          >
                            <CachedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            edge="end"
                            onClick={() => navigator.clipboard.writeText(token)}
                            disabled={!token}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {!readonly && (
            <>
              <Grid item xs={12} lg={6}>
                <Card className={classes.card}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedInfoTitle")}
                  </Typography>
                  <CardContent>
                    <TextField
                      value={versionApp}
                      label={t("settingsAppVersion")}
                      disabled
                    />
                    <TextField
                      value={versionServer || "-"}
                      label={t("settingsServerVersion")}
                      disabled
                    />
                    <TextField
                      value={
                        socket
                          ? t("deviceStatusOnline")
                          : t("deviceStatusOffline")
                      }
                      label={t("settingsConnection")}
                      disabled
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate("/emulator")}
                    >
                      {t("sharedEmulator")}
                    </Button>
                    {admin && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReboot}
                      >
                        {t("serverReboot")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
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
            </>
          )}
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default NewPreferencesPage;
