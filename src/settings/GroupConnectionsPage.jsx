import React from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkField from "../common/components/LinkField";
import { useTranslation } from "../common/components/LocalizationProvider";
import SettingsMenu from "./components/SettingsMenu";
import { formatNotificationTitle } from "../common/util/formatter";
import NewPageLayout from "../common/components/NewPageLayout";
import useFeatures from "../common/util/useFeatures";
// import useSettingsStyles from "./common/useSettingsStyles";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const GroupConnectionsPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const { id } = useParams();

  const features = useFeatures();

  return (
    <NewPageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "groupDialog", "sharedConnections"]}
    >
      <Container className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} lg={6}>
            <Card className={classes.card}>
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
                    endpointAll="/api/geofences"
                    endpointLinked={`/api/geofences?groupId=${id}`}
                    baseId={id}
                    keyBase="groupId"
                    keyLink="geofenceId"
                    label={t("sharedGeofences")}
                  />
                  <LinkField
                    endpointAll="/api/notifications"
                    endpointLinked={`/api/notifications?groupId=${id}`}
                    baseId={id}
                    keyBase="groupId"
                    keyLink="notificationId"
                    titleGetter={(it) => formatNotificationTitle(t, it)}
                    label={t("sharedNotifications")}
                  />
                  {!features.disableDrivers && (
                    <LinkField
                      endpointAll="/api/drivers"
                      endpointLinked={`/api/drivers?groupId=${id}`}
                      baseId={id}
                      keyBase="groupId"
                      keyLink="driverId"
                      titleGetter={(it) => `${it.name} (${it.uniqueId})`}
                      label={t("sharedDrivers")}
                    />
                  )}
                  {!features.disableComputedAttributes && (
                    <LinkField
                      endpointAll="/api/attributes/computed"
                      endpointLinked={`/api/attributes/computed?groupId=${id}`}
                      baseId={id}
                      keyBase="groupId"
                      keyLink="attributeId"
                      titleGetter={(it) => it.description}
                      label={t("sharedComputedAttributes")}
                    />
                  )}
                  {!features.disableSavedCommands && (
                    <LinkField
                      endpointAll="/api/commands"
                      endpointLinked={`/api/commands?groupId=${id}`}
                      baseId={id}
                      keyBase="groupId"
                      keyLink="commandId"
                      titleGetter={(it) => it.description}
                      label={t("sharedSavedCommands")}
                    />
                  )}
                  {!features.disableMaintenance && (
                    <LinkField
                      endpointAll="/api/maintenance"
                      endpointLinked={`/api/maintenance?groupId=${id}`}
                      baseId={id}
                      keyBase="groupId"
                      keyLink="maintenanceId"
                      label={t("sharedMaintenance")}
                    />
                  )}
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default GroupConnectionsPage;
