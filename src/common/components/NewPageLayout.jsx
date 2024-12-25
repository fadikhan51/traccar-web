import React, { useState } from "react";
import {
  AppBar,
  Breadcrumbs,
  colors,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import makeStyles from "@mui/styles/makeStyles";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./LocalizationProvider";

const useStyles = (colors) => makeStyles((theme) => ({
  "@import": [
    "url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)",
  ],
  "@global": {
    "*": {
      fontFamily: "Poppins, sans-serif",
      color: colors.darkgray,
    },
  },
  desktopRoot: {
    height: "100%",
    display: "flex",
    backgroundColor: `${colors.accent}`,
  },
  mobileRoot: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: `${colors.accent}`,
  },
  desktopDrawer: {
    backgroundColor: `${colors.accent} !important`,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.24)',
    width: (props) =>
      props.miniVariant
        ? `calc(${theme.spacing(9)} + 1px)`
        : theme.dimensions.drawerWidthDesktop,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowY: "auto",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "5px", // Scrollbar width
      margin: "2px", // Add spacing around scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: colors.muted, // Light gray scrollbar
      borderRadius: "4px", // Rounded edges
      margin: "2px", // Add spacing around thumb
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
      margin: "2px", // Add spacing around track
    },
  },  mobileDrawer: {
    width: theme.dimensions.drawerWidthTablet,
    backgroundColor: `${colors.accent} !important`,
  },
  mobileToolbar: {
    backgroundColor: `${colors.accent} !important`,
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
}));

const PageTitle = ({ breadcrumbs }) => {
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  if (desktop) {
    return (
      <Typography variant="h7" noWrap>
        {t(breadcrumbs[0])}
      </Typography>
    );
  }
  return (
    <Breadcrumbs>
      {breadcrumbs.slice(0, -1).map((breadcrumb) => (
        <Typography variant="h7" color="inherit" key={breadcrumb}>
          {t(breadcrumb)}
        </Typography>
      ))}
      <Typography sx={{color: colors.darkgray}} variant="h7" color="textPrimary">
        {t(breadcrumbs[breadcrumbs.length - 1])}
      </Typography>
    </Breadcrumbs>
  );
};

const NewPageLayout = ({ menu, breadcrumbs, children }) => {
  const [miniVariant, setMiniVariant] = useState(false);
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)({ miniVariant });
  const theme = useTheme();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setMiniVariant(!miniVariant);

  return desktop ? (
    <div className={classes.desktopRoot}>
      <Drawer
        variant="permanent"
        className={classes.desktopDrawer}
        classes={{ paper: classes.desktopDrawer }}
      >
        <Toolbar>
          {!miniVariant && (
            <>
              <IconButton
                color="inherit"
                edge="start"
                sx={{ mr: 2 }}
                onClick={() => navigate("/")}
              >
                <KeyboardBackspaceRoundedIcon />
              </IconButton>
              <PageTitle breadcrumbs={breadcrumbs} />
            </>
          )}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ ml: miniVariant ? -2 : "auto" }}
            onClick={toggleDrawer}
          >
            {miniVariant ? (
              <KeyboardArrowRightRoundedIcon />
            ) : (
              <KeyboardArrowLeftRoundedIcon />
            )}
          </IconButton>
        </Toolbar>
        <Divider />
        {menu}
      </Drawer>
      <div className={classes.content}>{children}</div>
    </div>
  ) : (
    <div className={classes.mobileRoot}>
      <Drawer
        variant="temporary"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{ paper: classes.mobileDrawer }}
      >
        {menu}
      </Drawer>
      <AppBar
        className={classes.mobileToolbar}
        position="static"
        color="inherit"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <PageTitle breadcrumbs={breadcrumbs} />
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default NewPageLayout;
