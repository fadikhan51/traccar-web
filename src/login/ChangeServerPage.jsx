import React from "react";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import { makeStyles } from "@mui/styles";
import {
  Autocomplete,
  Button,
  Container,
  createFilterOptions,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../common/components/LocalizationProvider";
import { colorsAtom } from "../recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useActiveTheme from "../common/theme/useActiveTheme";

const currentServer = `${window.location.protocol}//${window.location.host}`;

const officialServers = [
  currentServer,
  "https://demo.traccar.org",
  "https://demo2.traccar.org",
  "https://demo3.traccar.org",
  "https://demo4.traccar.org",
  "https://server.traccar.org",
  "http://localhost:8082",
  "http://localhost:3000",
  "http://139.59.171.130:8082",
];

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
    fontSize: {
      fontSize: "0.9rem !important",
    },
    container: {
      // marginTop: theme.spacing(2),
      textAlign: "center",
      // padding: theme.spacing(5, 3),
      height: "100%",
      backgroundColor: `${colors.accent} !important`,
      width: "100%",
    },
    card: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      backgroundColor: `${colors.white} !important`,
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
    },
    buttons: {
      display: "flex",
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    icon: {
      textAlign: "center",
      fontSize: "128px",
      color: theme.palette.neutral.main,
    },
    field: {
      margin: theme.spacing(3, 0),
    },
  }));

const ChangeServerPage = () => {
  useActiveTheme();
  const [colors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const filter = createFilterOptions();

  const handleSubmit = (url) => {
    if (window.webkit && window.webkit.messageHandlers.appInterface) {
      window.webkit.messageHandlers.appInterface.postMessage(`server|${url}`);
    } else if (window.appInterface) {
      window.appInterface.postMessage(`server|${url}`);
    } else {
      window.location.replace(url);
    }
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className={classes.gridContainer}
        sx={{alignContent: 'center', justifyContent: 'center'}}
      >
        {/* <Grid container  style={{ minHeight: '100vh' }}> */}
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card elevation={3} className={classes.card}>
            <CardContent>
              <ElectricalServicesIcon className={classes.icon} />
              <Autocomplete
                freeSolo
                className={classes.field}
                options={officialServers}
                renderInput={(params) => (
                  <TextField {...params} label={t("settingsServer")} />
                )}
                value={currentServer}
                onChange={(_, value) => value && handleSubmit(value)}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  if (
                    params.inputValue &&
                    !filtered.includes(params.inputValue)
                  ) {
                    filtered.push(params.inputValue);
                  }
                  return filtered;
                }}
              />
              <Button
                onClick={() => navigate(-1)}
                color="secondary"
                variant="contained"
                fullWidth
              >
                {t("sharedCancel")}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChangeServerPage;
