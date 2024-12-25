import dayjs from "dayjs";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DropzoneArea } from "react-mui-dropzone";
import EditItemView from "./components/EditItemView";
import EditAttributesCard from "./components/EditAttributesCard";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { prefixString } from "../common/util/stringUtils";
import { calendarsActions } from "../store";
import { useCatch } from "../reactHelper";
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
      backgroundColor: `${colors.white} !important`,
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

const formatCalendarTime = (time) => {
  const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `TZID=${tzid}:${time.locale("en").format("YYYYMMDDTHHmmss")}`;
};

const parseRule = (rule) => {
  if (rule.endsWith("COUNT=1")) {
    return { frequency: "ONCE" };
  }
  const fragments = rule.split(";");
  const frequency = fragments[0].substring(11);
  const by =
    fragments.length > 1 ? fragments[1].split("=")[1].split(",") : null;
  return { frequency, by };
};

const formatRule = (rule) => {
  const by = rule.by && rule.by.join(",");
  switch (rule.frequency) {
    case "DAILY":
      return `RRULE:FREQ=${rule.frequency}`;
    case "WEEKLY":
      return `RRULE:FREQ=${rule.frequency};BYDAY=${by || "SU"}`;
    case "MONTHLY":
      return `RRULE:FREQ=${rule.frequency};BYMONTHDAY=${by || 1}`;
    default:
      return "RRULE:FREQ=DAILY;COUNT=1";
  }
};

const updateCalendar = (lines, index, element) =>
  window.btoa(lines.map((e, i) => (i !== index ? e : element)).join("\n"));

const simpleCalendar = () =>
  window.btoa(
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Traccar//NONSGML Traccar//EN",
      "BEGIN:VEVENT",
      "UID:00000000-0000-0000-0000-000000000000",
      `DTSTART;${formatCalendarTime(dayjs())}`,
      `DTEND;${formatCalendarTime(dayjs().add(1, "hours"))}`,
      "RRULE:FREQ=DAILY",
      "SUMMARY:Event",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n")
  );

const CalendarPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const t = useTranslation();

  const [item, setItem] = useState();

  const decoded = item && item.data && window.atob(item.data);

  const simple = decoded && decoded.indexOf("//Traccar//") > 0;

  const lines = decoded && decoded.split("\n");

  const rule = simple && parseRule(lines[7]);

  const handleFiles = (files) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const { result } = event.target;
        setItem({ ...item, data: result.substr(result.indexOf(",") + 1) });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onItemSaved = useCatch(async () => {
    const response = await fetch("/api/calendars");
    if (response.ok) {
      dispatch(calendarsActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  });

  const validate = () => item && item.name && item.data;

  return (
    <EditItemView
      endpoint="calendars"
      item={item}
      setItem={setItem}
      defaultItem={{ data: simpleCalendar() }}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedCalendar"]}
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
                      <TextField
                        value={item.name || ""}
                        onChange={(event) =>
                          setItem({ ...item, name: event.target.value })
                        }
                        label={t("sharedName")}
                      />
                      <FormControl>
                        <InputLabel>{t("sharedType")}</InputLabel>
                        <Select
                          label={t("sharedType")}
                          value={simple ? "simple" : "custom"}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              data:
                                e.target.value === "simple"
                                  ? simpleCalendar()
                                  : null,
                            })
                          }
                        >
                          <MenuItem value="simple">
                            {t("calendarSimple")}
                          </MenuItem>
                          <MenuItem value="custom">
                            {t("reportCustom")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {simple ? (
                        <>
                          <TextField
                            label={t("reportFrom")}
                            type="datetime-local"
                            value={dayjs(lines[5].slice(-15))
                              .locale("en")
                              .format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                              const time = formatCalendarTime(
                                dayjs(e.target.value, "YYYY-MM-DDTHH:mm")
                              );
                              setItem({
                                ...item,
                                data: updateCalendar(
                                  lines,
                                  5,
                                  `DTSTART;${time}`
                                ),
                              });
                            }}
                          />
                          <TextField
                            label={t("reportTo")}
                            type="datetime-local"
                            value={dayjs(lines[6].slice(-15))
                              .locale("en")
                              .format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                              const time = formatCalendarTime(
                                dayjs(e.target.value, "YYYY-MM-DDTHH:mm")
                              );
                              setItem({
                                ...item,
                                data: updateCalendar(lines, 6, `DTEND;${time}`),
                              });
                            }}
                          />
                          <FormControl>
                            <InputLabel>{t("calendarRecurrence")}</InputLabel>
                            <Select
                              label={t("calendarRecurrence")}
                              value={rule.frequency}
                              onChange={(e) =>
                                setItem({
                                  ...item,
                                  data: updateCalendar(
                                    lines,
                                    7,
                                    formatRule({ frequency: e.target.value })
                                  ),
                                })
                              }
                            >
                              {["ONCE", "DAILY", "WEEKLY", "MONTHLY"].map(
                                (it) => (
                                  <MenuItem key={it} value={it}>
                                    {t(
                                      prefixString("calendar", it.toLowerCase())
                                    )}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                          {["WEEKLY", "MONTHLY"].includes(rule.frequency) && (
                            <FormControl>
                              <InputLabel>{t("calendarDays")}</InputLabel>
                              <Select
                                multiple
                                label={t("calendarDays")}
                                value={rule.by}
                                onChange={(e) =>
                                  setItem({
                                    ...item,
                                    data: updateCalendar(
                                      lines,
                                      7,
                                      formatRule({
                                        ...rule,
                                        by: e.target.value,
                                      })
                                    ),
                                  })
                                }
                              >
                                {rule.frequency === "WEEKLY"
                                  ? [
                                      "sunday",
                                      "monday",
                                      "tuesday",
                                      "wednesday",
                                      "thursday",
                                      "friday",
                                      "saturday",
                                    ].map((it) => (
                                      <MenuItem
                                        key={it}
                                        value={it.substring(0, 2).toUpperCase()}
                                      >
                                        {t(prefixString("calendar", it))}
                                      </MenuItem>
                                    ))
                                  : Array.from(
                                      { length: 31 },
                                      (_, i) => i + 1
                                    ).map((it) => (
                                      <MenuItem key={it} value={String(it)}>
                                        {it}
                                      </MenuItem>
                                    ))}
                              </Select>
                            </FormControl>
                          )}
                        </>
                      ) : (
                        <DropzoneArea
                          dropzoneText={t("sharedDropzoneText")}
                          filesLimit={1}
                          onChange={handleFiles}
                          showAlerts={false}
                        />
                      )}
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

export default CalendarPage;
