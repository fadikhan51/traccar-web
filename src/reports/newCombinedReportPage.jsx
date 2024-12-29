import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ReportFilter from "./components/ReportFilter";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "../settings/components/NewSettingsMenu";
import ReportsMenu from "./components/ReportsMenu";
import { useCatch } from "../reactHelper";
import MapView from "../map/core/MapView";
import TableShimmer from "../common/components/TableShimmer";
import MapCamera from "../map/MapCamera";
import MapGeofence from "../map/MapGeofence";
import { formatTime } from "../common/util/formatter";
import { prefixString } from "../common/util/stringUtils";
import MapMarkers from "../map/MapMarkers";
import MapRouteCoordinates from "../map/MapRouteCoordinates";
import MapScale from "../map/MapScale";
import { useRecoilState } from "recoil";
import { colorsAtom } from "../recoil/atoms/colorsAtom";
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
        'div[role="presentation"]': {
          // backgroundColor: `${colors.white} !important`,
          "& *": {
            color: `${colors.darkgray} !important`,
          },
        },
        ".MuiPaper-root": {
          backgroundColor: colors.white + " !important",
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
        ".MuiFormControlLabel-label": {
          fontSize: "0.9rem !important",
        },
        ".MuiAutocomplete-root": {
          marginBottom: theme.spacing(2),
          backgroundColor: `${colors.white} !important`,
          "& .MuiInputLabel-root": {
            color: colors.darkgray,
            "&.Mui-focused": {
              color: colors.highlight,
            },
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: colors.accent,
            "& fieldset": {
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
          "& .MuiAutocomplete-clearIndicator": {
            color: colors.darkgray,
          },
          "& .MuiAutocomplete-noOptions": {
            color: colors.darkgray,
            backgroundColor: `${colors.white} !important`,
          },
          "& .MuiAutocomplete-paper": {
            backgroundColor: colors.white,
          },
          
          "& .MuiAutocomplete-listbox": {
            backgroundColor: `${colors.white} !important`,
            "& .MuiAutocomplete-option": {
              color: `${colors.darkgray} !important`,
              "&[aria-selected='true']": {
                backgroundColor: colors.accent,
                color: `${colors.darkgray} !important`,
              },
              "&.Mui-focused": {
                backgroundColor: colors.accent,
                color: `${colors.darkgray} !important`,
              },
              "&:hover": {
                backgroundColor: colors.accent,
                color: `${colors.darkgray} !important`,
              },
            },
          },
        },
        "& .MuiAutocomplete-loading": {
            color: colors.darkgray,
            backgroundColor: `${colors.white} !important`,
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
        ".MuiTableCell-root": {
          color: `${colors.darkgray} !important`,
        },
        ".MuiList-root": {
          backgroundColor: `${colors.white} !important`,
        },
        ".MuiAutocomplete-listbox": {
          backgroundColor: `${colors.white} !important`,
        },
        ".MuiAutocomplete-noOptions": {
          color: colors.gray,
          backgroundColor: `${colors.white} !important`,
        },
      },
    container: {
      marginTop: theme.spacing(2),
    },
    card: {
      backgroundColor: `${colors.white} !important`,
      marginBottom: theme.spacing(2),
      boxShadow: "none",
      borderRadius: "8px",
      "& .MuiCardHeader-root": {
        display: "none",
      },
    },
    filterContainer: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2),
      flexWrap: "nowrap",
      padding: theme.spacing(3),
      "& > *": {
        flex: 1,
      },
    },
    mapContainer: {
      height: "400px",
      marginBottom: theme.spacing(2),
    },
    tableContainer: {
      padding: theme.spacing(2),
      "& .MuiTableCell-head": {
        backgroundColor: colors.accent,
        color: colors.darkgray,
        fontWeight: 500,
      },
      "& .MuiTableRow-root:nth-of-type(even)": {
        backgroundColor: colors.accent,
      },
    },
    noDataCell: {
      textAlign: 'center',
      padding: theme.spacing(2),
      color: colors.gray,
    },
  }));

const CombinedReportPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const theme = useTheme();
  const classes = useStyles(colors)();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsCoordinates = useMemo(
    () => items.flatMap((item) => item.route),
    [items]
  );

  const createMarkers = () =>
    items.flatMap((item) =>
      item.events
        .map((event) => item.positions.find((p) => event.positionId === p.id))
        .filter((position) => position != null)
        .map((position) => ({
          latitude: position.latitude,
          longitude: position.longitude,
        }))
    );

  const handleSubmit = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append("deviceId", deviceId));
    groupIds.forEach((groupId) => query.append("groupId", groupId));
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/combined?${query.toString()}`);
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <NewPageLayout
      menu={<ReportsMenu />}
      breadcrumbs={["reportTitle", "reportCombined"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.filterContainer}>
                <ReportFilter
                  handleSubmit={handleSubmit}
                  showOnly
                  multiDevice
                  includeGroups
                  loading={loading}
                />
              </CardContent>
            </Card>
          </Grid>

          

          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.tableContainer}>
                <Table sx={{ borderCollapse: "collapse" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "none" }}>{t("sharedDevice")}</TableCell>
                      <TableCell sx={{ border: "none" }}>{t("positionFixTime")}</TableCell>
                      <TableCell sx={{ border: "none" }}>{t("sharedType")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableShimmer columns={3} />
                    ) : items.length ? (
                      items.flatMap((item) =>
                        item.events.map((event, index) => (
                          <TableRow key={event.id}>
                            <TableCell sx={{ border: "none" }}>
                              {index ? "" : devices[item.deviceId].name}
                            </TableCell>
                            <TableCell sx={{ border: "none" }}>
                              {formatTime(event.eventTime, "seconds")}
                            </TableCell>
                            <TableCell sx={{ border: "none" }}>
                              {t(prefixString("event", event.type))}
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className={classes.noDataCell} sx={{ border: 'none', color: '#666666', textAlign: 'center' }}>
                          No data to show
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {Boolean(items.length) && (
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.mapContainer}>
                <MapView>
                  <MapGeofence />
                  {items.map((item) => (
                    <MapRouteCoordinates
                      key={item.deviceId}
                      name={devices[item.deviceId].name}
                      coordinates={item.route}
                      deviceId={item.deviceId}
                    />
                  ))}
                  <MapMarkers markers={createMarkers()} />
                </MapView>
                <MapScale />
                {items.length > 0 && <MapCamera coordinates={itemsCoordinates} />}
              </CardContent>
            </Card>
          </Grid>
          )}
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default CombinedReportPage;
