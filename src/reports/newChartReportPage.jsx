import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, useTheme, Grid, Card, CardContent,
} from '@mui/material';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import makeStyles from "@mui/styles/makeStyles";
import { useRecoilState } from 'recoil';
import ReportFilter from './components/ReportFilter';
import { formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import NewPageLayout from '../common/components/NewPageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import { useAttributePreference } from '../common/util/preferences';
import {
  altitudeFromMeters, distanceFromMeters, speedFromKnots, volumeFromLiters,
} from '../common/util/converter';
import { colorsAtom } from "../recoil/atoms/colorsAtom";

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
    chart: {
      height: 400,
    },
  }));

const ChartReportPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)();
  
  const theme = useTheme();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const distanceUnit = useAttributePreference('distanceUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');


  const [items, setItems] = useState([]);
  const [types, setTypes] = useState(['speed']);
  const [type, setType] = useState('speed');
  const [timeType, setTimeType] = useState('fixTime');

  const values = items.map((it) => it[type]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  const handleSubmit = useCatch(async ({ deviceId, from, to }) => {
    const query = new URLSearchParams({ deviceId, from, to });
    const response = await fetch(`/api/reports/route?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const positions = await response.json();
      const keySet = new Set();
      const keyList = [];
      const formattedPositions = positions.map((position) => {
        const data = { ...position, ...position.attributes };
        const formatted = {};
        formatted.fixTime = dayjs(position.fixTime).valueOf();
        formatted.deviceTime = dayjs(position.deviceTime).valueOf();
        formatted.serverTime = dayjs(position.serverTime).valueOf();
        Object.keys(data).filter((key) => !['id', 'deviceId'].includes(key)).forEach((key) => {
          const value = data[key];
          if (typeof value === 'number') {
            keySet.add(key);
            const definition = positionAttributes[key] || {};
            switch (definition.dataType) {
              case 'speed':
                formatted[key] = speedFromKnots(value, speedUnit).toFixed(2);
                break;
              case 'altitude':
                formatted[key] = altitudeFromMeters(value, altitudeUnit).toFixed(2);
                break;
              case 'distance':
                formatted[key] = distanceFromMeters(value, distanceUnit).toFixed(2);
                break;
              case 'volume':
                formatted[key] = volumeFromLiters(value, volumeUnit).toFixed(2);
                break;
              case 'hours':
                formatted[key] = (value / 1000).toFixed(2);
                break;
              default:
                formatted[key] = value;
                break;
            }
          }
        });
        return formatted;
      });
      Object.keys(positionAttributes).forEach((key) => {
        if (keySet.has(key)) {
          keyList.push(key);
          keySet.delete(key);
        }
      });
      setTypes([...keyList, ...keySet]);
      setItems(formattedPositions);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <NewPageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <div style={{ padding: '16px' }}>
              <CardContent className={classes.filterContainer}>
                <ReportFilter handleSubmit={handleSubmit} showOnly>
                  <div className={classes.filterItem}>
                    <FormControl fullWidth>
                      <InputLabel>{t('reportChartType')}</InputLabel>
                      <Select
                        label={t('reportChartType')}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        disabled={!items.length}
                      >
                        {types.map((key) => (
                          <MenuItem key={key} value={key}>{positionAttributes[key]?.name || key}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className={classes.filterItem}>
                    <FormControl fullWidth>
                      <InputLabel>{t('reportTimeType')}</InputLabel>
                      <Select
                        label={t('reportTimeType')}
                        value={timeType}
                        onChange={(e) => setTimeType(e.target.value)}
                        disabled={!items.length}
                      >
                        <MenuItem value="fixTime">{t('positionFixTime')}</MenuItem>
                        <MenuItem value="deviceTime">{t('positionDeviceTime')}</MenuItem>
                        <MenuItem value="serverTime">{t('positionServerTime')}</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </ReportFilter>
              </CardContent>
            </div>
          </Card>
        </Grid>
        {items.length > 0 && (
        <Grid item xs={12}>
          <Card className={classes.card}>
            <div style={{ padding: '16px' }}>
              <CardContent className={classes.chart}>
                <ResponsiveContainer>
                  <LineChart
                    data={items}
                    margin={{
                      top: 10, right: 40, left: 0, bottom: 10,
                    }}
                  >
                    <XAxis
                      stroke={colors.darkgray}
                      dataKey={timeType}
                      type="number"
                      tickFormatter={(value) => formatTime(value, 'time')}
                      domain={['dataMin', 'dataMax']}
                      scale="time"
                    />
                    <YAxis
                      stroke={colors.darkgray}
                      type="number"
                      tickFormatter={(value) => value.toFixed(2)}
                      domain={items.length ? [minValue - valueRange / 5, maxValue + valueRange / 5] : [0, 100]}
                    />
                    <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                    <Tooltip
                      contentStyle={{ backgroundColor: `${colors.highlight}`, color: `${colors.darkgray}` }}
                      formatter={(value, key) => [value, positionAttributes[key]?.name || key]}
                      labelFormatter={(value) => formatTime(value, 'seconds')}
                    />
                    <Line type="monotone" dataKey={type} stroke={theme.palette.primary.main} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </div>
          </Card>
        </Grid>
        )}
      </Grid>
    </NewPageLayout>
  );
};

export default ChartReportPage;
