import { makeStyles } from "@mui/styles";

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

export default useStyles;