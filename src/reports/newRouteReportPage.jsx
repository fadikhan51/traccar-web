import React, { Fragment, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Table, TableBody, TableCell, TableHead, TableRow,
  Container, Card, CardContent, Grid
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import NewPageLayout from '../common/components/NewPageLayout';
import ReportsMenu from './components/ReportsMenu';
import PositionValue from '../common/components/PositionValue';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapPositions from '../map/MapPositions';
import TableShimmer from '../common/components/TableShimmer';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import { useRecoilState } from 'recoil';
import { colorsAtom } from '../recoil/atoms/colorsAtom';
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
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
        border: 'none',
      },
      "& .MuiTableRow-root:nth-of-type(even)": {
        backgroundColor: colors.accent,
      },
      "& .MuiTableCell-root": {
        border: 'none',
      },
      "& .MuiTableRow-root:hover": {
        backgroundColor: `${colors.accent} !important`,
      }
    },
    columnAction: {
      width: theme.spacing(1),
      padding: theme.spacing(0, 1),
    },
    noDataCell: {
      textAlign: 'center',
      padding: theme.spacing(2),
      color: '#666666',
    }
  }));

const RouteReportPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const theme = useTheme();
  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);
  const devices = useSelector((state) => state.devices.items);

  const [available, setAvailable] = useState([]);
  const [columns, setColumns] = useState(['fixTime', 'latitude', 'longitude', 'speed', 'address']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const onMapPointClick = useCallback((positionId) => {
    setSelectedItem(items.find((it) => it.id === positionId));
  }, [items, setSelectedItem]);

  const handleSubmit = useCatch(async ({ deviceIds, from, to, type }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    if (type === 'export') {
      window.location.assign(`/api/reports/route/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/route/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/route?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          const keySet = new Set();
          const keyList = [];
          data.forEach((position) => {
            Object.keys(position).forEach((it) => keySet.add(it));
            Object.keys(position.attributes).forEach((it) => keySet.add(it));
          });
          ['id', 'deviceId', 'outdated', 'network', 'attributes'].forEach((key) => keySet.delete(key));
          Object.keys(positionAttributes).forEach((key) => {
            if (keySet.has(key)) {
              keyList.push(key);
              keySet.delete(key);
            }
          });
          setAvailable([...keyList, ...keySet].map((key) => [key, positionAttributes[key]?.name || key]));
          setItems(data);
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'route';
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  return (
    <NewPageLayout
      menu={<ReportsMenu />}
      breadcrumbs={["reportTitle", "reportRoute"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.filterContainer}>
                <ReportFilter 
                  handleSubmit={handleSubmit} 
                  handleSchedule={handleSchedule} 
                  multiDevice 
                  loading={loading}
                >
                  <ColumnSelect
                    columns={columns}
                    setColumns={setColumns}
                    columnsArray={available}
                    rawValues
                    disabled={!items.length}
                  />
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
                      <TableCell className={classes.columnAction} />
                      <TableCell>{t('sharedDevice')}</TableCell>
                      {columns.map((key) => (<TableCell key={key}>{positionAttributes[key]?.name || key}</TableCell>))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableShimmer columns={columns.length + 2} startAction />
                    ) : items.length ? (
                      items.slice(0, 4000).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className={classes.columnAction} padding="none">
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
                          <TableCell sx={{ border: "none" }}>{devices[item.deviceId].name}</TableCell>
                          {columns.map((key) => (
                            <TableCell key={key} sx={{ border: "none" }}>
                              <PositionValue
                                position={item}
                                property={item.hasOwnProperty(key) ? key : null}
                                attribute={item.hasOwnProperty(key) ? null : key}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 2} className={classes.noDataCell} sx={{ border: 'none', color: '#666666', textAlign: 'center' }}>
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
                    {[...new Set(items.map((it) => it.deviceId))].map((deviceId) => {
                      const positions = items.filter((position) => position.deviceId === deviceId);
                      return (
                        <Fragment key={deviceId}>
                          <MapRoutePath positions={positions} />
                          <MapRoutePoints positions={positions} onClick={onMapPointClick} />
                        </Fragment>
                      );
                    })}
                    <MapPositions positions={[selectedItem]} titleField="fixTime" />
                  </MapView>
                  <MapScale />
                  <MapCamera positions={items} />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default RouteReportPage;
