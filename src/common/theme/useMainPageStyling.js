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
        "& *": {
          color: `${colors.darkgray} !important`,
        },
      },
      ".MuiPaper-root": {
        backgroundColor: colors.white + " !important",
      },
      ".MuiTypography-root": {
        color: colors.darkgray + " !important",
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
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    navbar: {
      width: "100%",
      backgroundColor: colors.accent,
      padding: (props) => (props.isMediumScreen ? "8px 16px" : "12px 24px"),
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      position: "fixed",
      top: 0,
      zIndex: 1000,
      height: (props) => (props.isMediumScreen ? "56px" : "64px"),
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      height: (props) => (props.isMediumScreen ? "32px" : "40px"),
      width: "auto",
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "scale(1.02)",
      },
    },
    menuButton: {
      marginRight: "12px",
      color: colors.primary,
      "&:hover": {
        color: colors.secondary + "!important",
        backgroundColor: colors.muted + "!important",
      },
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: (props) => (props.isMediumScreen ? "12px" : "20px"),
    },
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "250px",
      height: "40px",
      padding: "0 20px 0 20px",
      backgroundColor: colors.white,
      border: `1.5px solid ${colors.gray}`,
      borderRadius: "40px",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.2s ease-in-out",
      "&:focus-within": {
        borderColor: colors.primary,
        boxShadow: `0 0 0 3px ${colors.shadow}`,
        transform: "translateY(-1px)",
      },
    },
    searchInput: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "14px",
      backgroundColor: "transparent",
      padding: "8px 0",
      "&::placeholder": {
        color: colors.darkgray,
      },
    },
    configIcon: {
      color: colors.primary,
      transition: "all 0.2s ease",
      "&:hover": {
        color: colors.secondary,
      },
      cursor: "pointer",
    },
    searchDrawer: {
      width: "100%",
      maxWidth: "300px",
      padding: "20px",
    },
    searchButton: {
      color: colors.primary,
      borderRadius: "50%",
      padding: (props) => (props.isMediumScreen ? "8px" : "12px"),
      transition: "all 0.2s ease",
      "&:hover": {
        color: colors.secondary,
        backgroundColor: colors.muted,
      },
      "& .MuiSvgIcon-root": {
        fontSize: (props) => (props.isMediumScreen ? "20px" : "24px"),
      },
    },
    addButton: {
      color: colors.primary,
      borderRadius: "50%",
      padding: (props) => (props.isMediumScreen ? "8px" : "12px"),
      transition: "all 0.2s ease",
      "&:hover": {
        color: colors.secondary,
        backgroundColor: colors.muted,
        transform: "translateZ(8px)",
      },
      "& .MuiSvgIcon-root": {
        color: colors.primary,
        transition: "transform 0.2s ease",
        fontSize: (props) => (props.isMediumScreen ? "24px" : "28px"),
      },
      "&:hover .MuiSvgIcon-root": {
        transform: "translateY(2px)",
      },
    },
    accountSection: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      padding: (props) => (props.isMediumScreen ? "2px 6px" : "4px 8px"),
      borderRadius: "20px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: colors.muted,
      },
      "& .MuiSvgIcon-root": {
        color: colors.primary,
        transition: "transform 0.2s ease",
      },
      "&:hover .MuiSvgIcon-root": {
        transform: "translateY(2px)",
      },
    },
    sidebar: {
      width: (props) => (props.isMediumScreen ? "200px" : "240px"),
      height: (props) => (props.isMediumScreen ? "100%" : "calc(100vh - 64px)"),
      backgroundColor: colors.white,
      borderRight: `1px solid ${colors.gray}`,
      padding: "40px 0px 0px 0px",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: (props) => (props.isMediumScreen ? "0" : "64px"),
      left: 0,
      transition: "transform 0.3s ease-in-out",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 24px",
      color: `${colors.darkgray} !important`,
      cursor: "pointer",
      transition: "background-color 0.2s ease, color 0.2s ease", // Specify the properties
      fontSize: "13px",
      "&:hover": {
        backgroundColor: `${colors.accent} !important`,
        "& *": {
          color: `${colors.primary} !important`,
          transition: "color 0.2s ease", // Add transition for nested elements
        },
      },
      "& .MuiSvgIcon-root": {
        marginRight: "12px",
        fontSize: "20px",
        width: "24px",
        transition: "color 0.2s ease", // Add transition for icons
      },
    },
    accountSettings: {
      marginTop: "auto",
      fontSize: "12px",
      marginBottom: "5px",
    },
    logoutMenuItem: {
      color: colors.red,
      borderTop: `1px solid ${colors.gray}`,
      marginTop: "4px",
    },
    mapContainer: {
      position: "fixed",
      top: (props) => (props.isMediumScreen ? "56px" : "64px"),
      left: (props) => (props.isMediumScreen ? "0" : "240px"),
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    filterPanel: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
      gap: theme.spacing(2),
      width: theme.dimensions.drawerWidthTablet,
    },
    contentList: {
      pointerEvents: "auto",
      gridArea: "1 / 1",
      zIndex: 9999,
    },
  }));

export default useStyles;
