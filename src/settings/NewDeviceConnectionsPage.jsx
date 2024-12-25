import React from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  FormControl,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkField from "../common/components/LinkField";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { formatNotificationTitle } from "../common/util/formatter";
import NewPageLayout from "../common/components/NewPageLayout";
import useFeatures from "../common/util/useFeatures";
import { makeStyles } from "@mui/styles";
import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "/src/common/theme/useGlobalStyles";

const DeviceConnectionsPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const { id } = useParams();

  const features = useFeatures();

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedDevice", "sharedConnections"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item xs={12} md={6} lg={8}>
          <Card className={classes.card}>
            <Typography variant="h6" className={classes.cardTitle}>
              {t("sharedPreferences")}
            </Typography>
            <CardContent>
              <LinkField
                endpointAll="/api/geofences"
                endpointLinked={`/api/geofences?deviceId=${id}`}
                baseId={id}
                keyBase="deviceId"
                keyLink="geofenceId"
                label={t("sharedGeofences")}
              />
              <LinkField
                endpointAll="/api/notifications"
                endpointLinked={`/api/notifications?deviceId=${id}`}
                baseId={id}
                keyBase="deviceId"
                keyLink="notificationId"
                titleGetter={(it) => formatNotificationTitle(t, it)}
                label={t("sharedNotifications")}
              />
              {!features.disableDrivers && (
                <LinkField
                  endpointAll="/api/drivers"
                  endpointLinked={`/api/drivers?deviceId=${id}`}
                  baseId={id}
                  keyBase="deviceId"
                  keyLink="driverId"
                  titleGetter={(it) => `${it.name} (${it.uniqueId})`}
                  label={t("sharedDrivers")}
                />
              )}
              {!features.disableComputedAttributes && (
                <LinkField
                  endpointAll="/api/attributes/computed"
                  endpointLinked={`/api/attributes/computed?deviceId=${id}`}
                  baseId={id}
                  keyBase="deviceId"
                  keyLink="attributeId"
                  titleGetter={(it) => it.description}
                  label={t("sharedComputedAttributes")}
                />
              )}
              {!features.disableSavedCommands && (
                <LinkField
                  endpointAll="/api/commands"
                  endpointLinked={`/api/commands?deviceId=${id}`}
                  baseId={id}
                  keyBase="deviceId"
                  keyLink="commandId"
                  titleGetter={(it) => it.description}
                  label={t("sharedSavedCommands")}
                />
              )}
              {!features.disableMaintenance && (
                <LinkField
                  endpointAll="/api/maintenance"
                  endpointLinked={`/api/maintenance?deviceId=${id}`}
                  baseId={id}
                  keyBase="deviceId"
                  keyLink="maintenanceId"
                  label={t("sharedMaintenance")}
                />
              )}
            </CardContent>
          </Card>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default DeviceConnectionsPage;
