import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Container,
  Grid,
  CardContent,
  Card,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DropzoneArea } from "react-mui-dropzone";
import EditItemView from "./components/EditItemView";
import EditAttributesCard from "./components/EditAttributesCard";
import SelectField from "../common/components/SelectField";
import deviceCategories from "../common/util/deviceCategories";
import { useTranslation } from "../common/components/LocalizationProvider";
import useDeviceAttributes from "../common/attributes/useDeviceAttributes";
import { useAdministrator } from "../common/util/permissions";
import NewSettingsMenu from "./components/NewSettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import { useCatch } from "../reactHelper";
import useQuery from "../common/util/useQuery";

import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "/src/common/theme/useGlobalStyles";

  const DevicePage = () => {
    const [colors, setColors] = useRecoilState(colorsAtom);

    const classes = useStyles(colors)();
    const t = useTranslation();

    const admin = useAdministrator();

    const commonDeviceAttributes = useCommonDeviceAttributes(t);
    const deviceAttributes = useDeviceAttributes(t);

    const query = useQuery();
    const uniqueId = query.get("uniqueId");

    const [item, setItem] = useState(uniqueId ? { uniqueId } : null);

    const handleFiles = useCatch(async (files) => {
      if (files.length > 0) {
        const response = await fetch(`/api/devices/${item.id}/image`, {
          method: "POST",
          body: files[0],
        });
        if (response.ok) {
          setItem({
            ...item,
            attributes: {
              ...item.attributes,
              deviceImage: await response.text(),
            },
          });
        } else {
          throw Error(await response.text());
        }
      }
    });

    const validate = () => item && item.name && item.uniqueId;

    return (
      <EditItemView
        endpoint="devices"
        item={item}
        setItem={setItem}
        validate={validate}
        menu={<NewSettingsMenu />}
        breadcrumbs={["settingsTitle", "sharedDevice"]}
      >
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2} className={classes.gridContainer}>
            {item && (
              <>
                <Grid item xs={12} lg={6} style={{ display: 'flex' }}>
                  <Card className={classes.card} style={{ flex: 1 }}>
                    <Typography variant="h6" className={classes.cardTitle}>
                      {t("sharedExtra")}
                    </Typography>
                    <CardContent>
                      <FormControl
                        sx={classes.formControl}
                        fullWidth
                        className={classes.formControl}
                      >
                        <SelectField
                          value={item.groupId}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              groupId: Number(event.target.value),
                            })
                          }
                          endpoint="/api/groups"
                          label={t("groupParent")}
                        />
                        <TextField
                          value={item.phone || ""}
                          onChange={(event) =>
                            setItem({ ...item, phone: event.target.value })
                          }
                          label={t("sharedPhone")}
                        />
                        <TextField
                          value={item.model || ""}
                          onChange={(event) =>
                            setItem({ ...item, model: event.target.value })
                          }
                          label={t("deviceModel")}
                        />
                        <TextField
                          value={item.contact || ""}
                          onChange={(event) =>
                            setItem({ ...item, contact: event.target.value })
                          }
                          label={t("deviceContact")}
                        />
                        <SelectField
                          value={item.category || "default"}
                          onChange={(event) =>
                            setItem({ ...item, category: event.target.value })
                          }
                          data={deviceCategories.map((category) => ({
                            id: category,
                            name: t(
                              `category${category.replace(/^\w/, (c) =>
                                c.toUpperCase()
                              )}`
                            ),
                          }))}
                          label={t("deviceCategory")}
                        />
                        <SelectField
                          value={item.calendarId}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              calendarId: Number(event.target.value),
                            })
                          }
                          endpoint="/api/calendars"
                          label={t("sharedCalendar")}
                        />
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
                          disabled={!admin}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.disabled}
                              onChange={(event) =>
                                setItem({
                                  ...item,
                                  disabled: event.target.checked,
                                })
                              }
                            />
                          }
                          label={t("sharedDisabled")}
                          disabled={!admin}
                        />
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
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
                          helperText={t("deviceIdentifierHelp")}
                          disabled={Boolean(uniqueId)}
                        />
                      </FormControl>
                    </CardContent>
                  </Card>

                  {item.id && (
                    <Card className={classes.card} style={{ flex: 1, marginTop: '16px' }}>
                      <Typography variant="h6" className={classes.cardTitle}>
                        {t("attributeDeviceImage")}
                      </Typography>
                      <CardContent>
                        <FormControl
                          sx={classes.formControl}
                          fullWidth
                          className={classes.formControl}
                        >
                          <DropzoneArea
                            dropzoneText={t("sharedDropzoneText")}
                            acceptedFiles={["image/*"]}
                            filesLimit={1}
                            onChange={handleFiles}
                            showAlerts={false}
                            maxFileSize={500000}
                          />
                        </FormControl>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              <EditAttributesCard
                attributes={item.attributes}
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={{ ...commonDeviceAttributes, ...deviceAttributes }}
              />
            </>
          )}
        </Grid>
      </Container>
    </EditItemView>
  );
};

export default DevicePage;
