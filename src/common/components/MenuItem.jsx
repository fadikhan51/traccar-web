import makeStyles from "@mui/styles/makeStyles";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";

const useStyles = makeStyles((theme) => ({
    "@import": [
      "url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)",
    ],
    "@global": {
      "*": {
        fontFamily: "Poppins, sans-serif !important",
      },
    },
    menuItemText: {
      whiteSpace: "nowrap",
      fontSize: "0.8rem",
      "& .MuiTypography-root": {
        fontSize: "0.8rem",
      }
    }, 
  }));

const MenuItem = ({ title, link, icon, selected }) => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles();
  return (
    <ListItemButton sx={{
      margin: '4px 8px',
      borderRadius: '8px',
      "&:hover": {
        backgroundColor: `${colors.muted} !important`,
        borderRight: `2px solid ${colors.tertiary}`,
        "& *": {
          color: colors.darkgray,
          transition: 'color 0.3s ease',
        },
      },
    }} key={link} component={Link} to={link} selected={selected}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} className={classes.menuItemText} />
    </ListItemButton>
  );
};

export default MenuItem;