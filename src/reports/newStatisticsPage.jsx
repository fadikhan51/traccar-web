import React, { useState } from 'react';
import {
  Table, TableRow, TableCell, TableHead, TableBody,
  Container, Grid, Card, CardContent,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useRecoilState } from 'recoil';
import { formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import NewPageLayout from '../common/components/NewPageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter from './components/ReportFilter';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch } from '../reactHelper';
import TableShimmer from '../common/components/TableShimmer';
import { colorsAtom } from "../recoil/atoms/colorsAtom";

const columnsArray = [
  ['captureTime', 'statisticsCaptureTime'],
  ['activeUsers', 'statisticsActiveUsers'],
  ['activeDevices', 'statisticsActiveDevices'],
  ['requests', 'statisticsRequests'],
  ['messagesReceived', 'statisticsMessagesReceived'],
  ['messagesStored', 'statisticsMessagesStored'],
  ['mailSent', 'notificatorMail'],
  ['smsSent', 'notificatorSms'],
  ['geocoderRequests', 'statisticsGeocoder'],
  ['geolocationRequests', 'statisticsGeolocation'],
];
const columnsMap = new Map(columnsArray);

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

const StatisticsPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)();
  const t = useTranslation();

  const [columns, setColumns] = usePersistedState('statisticsColumns', ['captureTime', 'activeUsers', 'activeDevices', 'messagesStored']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCatch(async ({ from, to }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ from, to });
      const response = await fetch(`/api/statistics?${query.toString()}`);
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
    <NewPageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.filterContainer}>
                <ReportFilter handleSubmit={handleSubmit} showOnly ignoreDevice loading={loading}>
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
                      {columns.map((key) => (
                        <TableCell key={key} sx={{ border: "none" }}>
                          {t(columnsMap.get(key))}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableShimmer columns={columns.length} />
                    ) : items.length ? (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          {columns.map((key) => (
                            <TableCell key={key} sx={{ border: "none" }}>
                              {key === 'captureTime' ? formatTime(item[key], 'date') : item[key]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className={classes.noDataCell} sx={{ border: 'none', color: '#666666', textAlign: 'center' }}>
                          No data to show
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default StatisticsPage;
