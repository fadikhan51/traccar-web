import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
  Container, Card, CardContent, Grid,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import {
  formatDistance, formatVolume, formatTime, formatNumericHours,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import NewPageLayout from '../common/components/NewPageLayout';
import ReportsMenu from './components/ReportsMenu';
import ColumnSelect from './components/ColumnSelect';
import usePersistedState from '../common/util/usePersistedState';
import { useCatch } from '../reactHelper';
import MapPositions from '../map/MapPositions';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import AddressValue from '../common/components/AddressValue';
import TableShimmer from '../common/components/TableShimmer';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import { useRecoilState } from 'recoil';
import { colorsAtom } from "../recoil/atoms/colorsAtom";
import { useTheme } from '@emotion/react';

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

const columnsArray = [
  ['startTime', 'reportStartTime'],
  ['startOdometer', 'positionOdometer'],
  ['address', 'positionAddress'],
  ['endTime', 'reportEndTime'],
  ['duration', 'reportDuration'],
  ['engineHours', 'reportEngineHours'],
  ['spentFuel', 'reportSpentFuel'],
];
const columnsMap = new Map(columnsArray);

const StopReportPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const theme = useTheme();
  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const distanceUnit = useAttributePreference('distanceUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [columns, setColumns] = usePersistedState('stopColumns', ['startTime', 'endTime', 'startOdometer', 'address']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = useCatch(async ({ deviceId, from, to, type }) => {
    const query = new URLSearchParams({ deviceId, from, to });
    if (type === 'export') {
      window.location.assign(`/api/reports/stops/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/stops/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/stops?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          setItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'stops';
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'startTime':
      case 'endTime':
        return formatTime(value, 'minutes');
      case 'startOdometer':
        return formatDistance(value, distanceUnit, t);
      case 'duration':
        return formatNumericHours(value, t);
      case 'engineHours':
        return value > 0 ? formatNumericHours(value, t) : null;
      case 'spentFuel':
        return value > 0 ? formatVolume(value, volumeUnit, t) : null;
      case 'address':
        return (<AddressValue latitude={item.latitude} longitude={item.longitude} originalAddress={value} />);
      default:
        return value;
    }
  };

  return (
    <NewPageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportStops']}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.filterContainer}>
                <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} loading={loading}>
                  <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
                </ReportFilter>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.tableContainer}>
                <Table sx={{ borderCollapse: "collapse" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "none" }} className={classes.columnAction} />
                      {columns.map((key) => (<TableCell key={key} sx={{ border: "none" }}>{t(columnsMap.get(key))}</TableCell>))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableShimmer columns={columns.length + 1} startAction />
                    ) : items.length ? (
                      items.map((item) => (
                        <TableRow key={item.positionId}>
                          <TableCell className={classes.columnAction} sx={{ border: "none" }} padding="none">
                            {selectedItem === item ? (
                              <IconButton size="small" onClick={() => setSelectedItem(null)}>
                                <GpsFixedIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <IconButton size="small" onClick={() => setSelectedItem(item)}>
                                <LocationSearchingIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                          {columns.map((key) => (
                            <TableCell key={key} sx={{ border: "none" }}>
                              {formatValue(item, key)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} className={classes.noDataCell} sx={{ border: 'none', color: '#666666', textAlign: 'center' }}>
                          No data to show
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {selectedItem && (
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardContent className={classes.mapContainer}>
                  <MapView>
                    <MapGeofence />
                    <MapPositions
                      positions={[{
                        deviceId: selectedItem.deviceId,
                        fixTime: selectedItem.startTime,
                        latitude: selectedItem.latitude,
                        longitude: selectedItem.longitude,
                      }]}
                      titleField="fixTime"
                    />
                  </MapView>
                  <MapScale />
                  <MapCamera latitude={selectedItem.latitude} longitude={selectedItem.longitude} />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default StopReportPage;
