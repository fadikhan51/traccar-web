import React, { useState } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddAttributeDialog from "./AddAttributeDialog";
import { useTranslation } from "../../common/components/LocalizationProvider";
import { useAttributePreference } from "../../common/util/preferences";
import {
  distanceFromMeters,
  distanceToMeters,
  distanceUnitString,
  speedFromKnots,
  speedToKnots,
  speedUnitString,
  volumeFromLiters,
  volumeToLiters,
  volumeUnitString,
} from "../../common/util/converter";
import useFeatures from "../../common/util/useFeatures";

import makeStyles from "@mui/styles/makeStyles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";

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
      //Checkbox style
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
          "& fieldset": {
            // borderColor: colors.darkgray, // Sets the borderColor of autocomplete to gray when not focused
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
        "& .MuiAutocomplete-paper": {
          backgroundColor: colors.white,
        },
        "& .MuiAutocomplete-listbox": {
          "& .MuiAutocomplete-option": {
            color: colors.darkgray,
          },
        },
      },
      ".MuiList-root": {
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
      ".MuiDialog-paper": {
        backgroundColor: colors.white,
        "& .MuiDialogTitle-root": {
          color: colors.darkgray,
        },
        "& .MuiDialogContent-root": {
          backgroundColor: colors.white,
        },
        "& .MuiDialogActions-root": {
          backgroundColor: colors.white,
          padding: theme.spacing(2),
        },
        "& .MuiMenuItem-root": {
          color: colors.darkgray,
          "&:hover": {
            backgroundColor: colors.accent,
          },
        },
      },
      ".MuiDropzoneArea-root": {
        backgroundColor: `${colors.accent} !important`,
        border: `2px dashed ${colors.gray} !important`,
        "&:hover": {
          borderColor: `${colors.secondary} !important`,
        },
      },
      ".MuiDropzoneArea-text": {
        color: `${colors.darkgray} !important`,
      },
      ".MuiDropzoneArea-icon": {
        color: `${colors.darkgray} !important`,
      },
    },
    fontSize: {
      fontSize: "0.9rem !important",
    },
    container: {
      marginTop: theme.spacing(2),
    },
    card: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
  }));

const EditAttributesCard = ({
  attribute,
  attributes,
  setAttributes,
  definitions,
  focusAttribute,
}) => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const features = useFeatures();

  const speedUnit = useAttributePreference("speedUnit");
  const distanceUnit = useAttributePreference("distanceUnit");
  const volumeUnit = useAttributePreference("volumeUnit");

  const [addDialogShown, setAddDialogShown] = useState(false);

  const updateAttribute = (key, value, type, subtype) => {
    const updatedAttributes = { ...attributes };
    switch (subtype) {
      case "speed":
        updatedAttributes[key] = speedToKnots(Number(value), speedUnit);
        break;
      case "distance":
        updatedAttributes[key] = distanceToMeters(Number(value), distanceUnit);
        break;
      case "volume":
        updatedAttributes[key] = volumeToLiters(Number(value), volumeUnit);
        break;
      default:
        updatedAttributes[key] = type === "number" ? Number(value) : value;
        break;
    }
    setAttributes(updatedAttributes);
  };

  const deleteAttribute = (key) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setAttributes(updatedAttributes);
  };

  const getAttributeName = (key, subtype) => {
    const definition = definitions[key];
    const name = definition ? definition.name : key;
    switch (subtype) {
      case "speed":
        return `${name} (${speedUnitString(speedUnit, t)})`;
      case "distance":
        return `${name} (${distanceUnitString(distanceUnit, t)})`;
      case "volume":
        return `${name} (${volumeUnitString(volumeUnit, t)})`;
      default:
        return name;
    }
  };

  const getAttributeType = (value) => {
    if (typeof value === "number") {
      return "number";
    }
    if (typeof value === "boolean") {
      return "boolean";
    }
    return "string";
  };

  const getAttributeSubtype = (key) => {
    const definition = definitions[key];
    return definition && definition.subtype;
  };

  const getDisplayValue = (value, subtype) => {
    if (value) {
      switch (subtype) {
        case "speed":
          return speedFromKnots(value, speedUnit);
        case "distance":
          return distanceFromMeters(value, distanceUnit);
        case "volume":
          return volumeFromLiters(value, volumeUnit);
        default:
          return value;
      }
    }
    return "";
  };

  const convertToList = (attributes) => {
    const booleanList = [];
    const otherList = [];
    const excludeAttributes = [
      "speedUnit",
      "distanceUnit",
      "volumeUnit",
      "timezone",
    ];
    Object.keys(attributes || [])
      .filter((key) => !excludeAttributes.includes(key))
      .forEach((key) => {
        const value = attributes[key];
        const type = getAttributeType(value);
        const subtype = getAttributeSubtype(key);
        if (type === "boolean") {
          booleanList.push({
            key,
            value,
            type,
            subtype,
          });
        } else {
          otherList.push({
            key,
            value,
            type,
            subtype,
          });
        }
      });
    return [...otherList, ...booleanList];
  };

  const handleAddResult = (definition) => {
    setAddDialogShown(false);
    if (definition) {
      switch (definition.type) {
        case "number":
          updateAttribute(definition.key, 0);
          break;
        case "boolean":
          updateAttribute(definition.key, false);
          break;
        default:
          updateAttribute(definition.key, "");
          break;
      }
    }
  };

  return features.disableAttributes ? (
    ""
  ) : (
    <Grid item xs={12} md={6}>
    <Card className={classes.card}>
                <Typography variant="h6" className={classes.cardTitle}>
                  {t("sharedAttributes")}
                </Typography>
                <CardContent>
                  <FormControl
                    sx={classes.formControl}
                    fullWidth
                    className={classes.formControl}
                  >
                    {convertToList(attributes).map(({ key, value, type, subtype }) => {
          if (type === "boolean") {
            return (
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                key={key}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => updateAttribute(key, e.target.checked)}
                    />
                  }
                  label={getAttributeName(key, subtype)}
                />
                <IconButton
                  size="small"
                  className={classes.removeButton}
                  onClick={() => deleteAttribute(key)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Grid>
            );
          }
          return (
            <FormControl key={key}>
              <InputLabel>{getAttributeName(key, subtype)}</InputLabel>
              <OutlinedInput
                label={getAttributeName(key, subtype)}
                type={type === "number" ? "number" : "text"}
                value={getDisplayValue(value, subtype)}
                onChange={(e) =>
                  updateAttribute(key, e.target.value, type, subtype)
                }
                autoFocus={focusAttribute === key}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => deleteAttribute(key)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          );
        })}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddDialogShown(true)}
          startIcon={<AddIcon />}
        >
          {t("sharedAdd")}
        </Button>
        <AddAttributeDialog
          open={addDialogShown}
          onResult={handleAddResult}
          definitions={definitions}
        />
                  </FormControl>
                  </CardContent>
                  </Card>
                  </Grid>
  );
};

export default EditAttributesCard;