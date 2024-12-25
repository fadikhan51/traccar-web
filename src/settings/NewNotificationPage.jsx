import React, { useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  TextField,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  useTranslation,
  useTranslationKeys,
} from "../common/components/LocalizationProvider";
import EditItemView from "./components/EditItemView";
import { prefixString, unprefixString } from "../common/util/stringUtils";
import SelectField from "../common/components/SelectField";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { useCatch } from "../reactHelper";
import useSettingsStyles from "./common/useSettingsStyles";

import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const NotificationPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const [item, setItem] = useState();

  const alarms = useTranslationKeys((it) => it.startsWith("alarm")).map(
    (it) => ({
      key: unprefixString("alarm", it),
      name: t(it),
    })
  );

  const testNotificators = useCatch(async () => {
    await Promise.all(
      item.notificators.split(/[, ]+/).map(async (notificator) => {
        const response = await fetch(`/api/notifications/test/${notificator}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!response.ok) {
          throw Error(await response.text());
        }
      })
    );
  });

  const validate = () =>
    item &&
    item.type &&
    item.notificators &&
    (!item.notificators?.includes("command") || item.commandId);

  return (
    <EditItemView
      endpoint="notifications"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedNotification"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          {item && (
            <>
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
                      <SelectField
                        value={item.type}
                        onChange={(e) =>
                          setItem({ ...item, type: e.target.value })
                        }
                        endpoint="/api/notifications/types"
                        keyGetter={(it) => it.type}
                        titleGetter={(it) => t(prefixString("event", it.type))}
                        label={t("sharedType")}
                      />
                      {item.type === "alarm" && (
                        <SelectField
                          multiple
                          value={
                            item.attributes && item.attributes.alarms
                              ? item.attributes.alarms.split(/[, ]+/)
                              : []
                          }
                          onChange={(e) =>
                            setItem({
                              ...item,
                              attributes: {
                                ...item.attributes,
                                alarms: e.target.value.join(),
                              },
                            })
                          }
                          data={alarms}
                          keyGetter={(it) => it.key}
                          label={t("sharedAlarms")}
                        />
                      )}
                      <SelectField
                        multiple
                        value={
                          item.notificators
                            ? item.notificators.split(/[, ]+/)
                            : []
                        }
                        onChange={(e) =>
                          setItem({
                            ...item,
                            notificators: e.target.value.join(),
                          })
                        }
                        endpoint="/api/notifications/notificators"
                        keyGetter={(it) => it.type}
                        titleGetter={(it) =>
                          t(prefixString("notificator", it.type))
                        }
                        label={t("notificationNotificators")}
                      />
                      {item.notificators?.includes("command") && (
                        <SelectField
                          value={item.commandId}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              commandId: Number(e.target.value),
                            })
                          }
                          endpoint="/api/commands"
                          titleGetter={(it) => it.description}
                          label={t("sharedSavedCommand")}
                        />
                      )}
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={testNotificators}
                        disabled={!item.notificators}
                      >
                        {t("sharedTestNotificators")}
                      </Button>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.always}
                              onChange={(e) =>
                                setItem({ ...item, always: e.target.checked })
                              }
                            />
                          }
                          label={t("notificationAlways")}
                        />
                      </FormGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card className={classes.card}>
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
                        value={item.description || ""}
                        onChange={(e) =>
                          setItem({ ...item, description: e.target.value })
                        }
                        label={t("sharedDescription")}
                      />
                      <SelectField
                        value={item.calendarId}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            calendarId: Number(e.target.value),
                          })
                        }
                        endpoint="/api/calendars"
                        label={t("sharedCalendar")}
                      />
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

export default NotificationPage;
