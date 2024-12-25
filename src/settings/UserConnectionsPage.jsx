import React from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkField from "../common/components/LinkField";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { formatNotificationTitle } from "../common/util/formatter";
import NewPageLayout from "../common/components/NewPageLayout";
import { makeStyles } from "@mui/styles";

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
  
const UserConnectionsPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const { id } = useParams();

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsUser", "sharedConnections"]}
    >
      <Container className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} md={6} lg={8}>
            <Card className={classes.card} style={{ overflowX: "auto" }}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("sharedConnections")}
              </Typography>
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                  <LinkField
                    endpointAll="/api/devices?all=true"
                    endpointLinked={`/api/devices?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="deviceId"
                    titleGetter={(it) => `${it.name} (${it.uniqueId})`}
                    label={t("deviceTitle")}
                  />
                  <LinkField
                    endpointAll="/api/groups?all=true"
                    endpointLinked={`/api/groups?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="groupId"
                    label={t("settingsGroups")}
                  />
                  <LinkField
                    endpointAll="/api/geofences?all=true"
                    endpointLinked={`/api/geofences?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="geofenceId"
                    label={t("sharedGeofences")}
                  />
                  <LinkField
                    endpointAll="/api/notifications?all=true"
                    endpointLinked={`/api/notifications?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="notificationId"
                    titleGetter={(it) => formatNotificationTitle(t, it, true)}
                    label={t("sharedNotifications")}
                  />
                  <LinkField
                    endpointAll="/api/calendars?all=true"
                    endpointLinked={`/api/calendars?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="calendarId"
                    label={t("sharedCalendars")}
                  />
                  <LinkField
                    endpointAll="/api/users?all=true"
                    endpointLinked={`/api/users?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="managedUserId"
                    label={t("settingsUsers")}
                  />
                  <LinkField
                    endpointAll="/api/attributes/computed?all=true"
                    endpointLinked={`/api/attributes/computed?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="attributeId"
                    titleGetter={(it) => it.description}
                    label={t("sharedComputedAttributes")}
                  />
                  <LinkField
                    endpointAll="/api/drivers?all=true"
                    endpointLinked={`/api/drivers?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="driverId"
                    titleGetter={(it) => `${it.name} (${it.uniqueId})`}
                    label={t("sharedDrivers")}
                  />
                  <LinkField
                    endpointAll="/api/commands?all=true"
                    endpointLinked={`/api/commands?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="commandId"
                    titleGetter={(it) => it.description}
                    label={t("sharedSavedCommands")}
                  />
                  <LinkField
                    endpointAll="/api/maintenance?all=true"
                    endpointLinked={`/api/maintenance?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="maintenanceId"
                    label={t("sharedMaintenance")}
                  />
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default UserConnectionsPage;
