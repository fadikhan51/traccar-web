import React from 'react';
import { Paper, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: theme.palette.background.default,
  },
  paper: {
    display: 'flex',
    flexDirection: 'row',
    width: '70%',
    height: '75%',
    border: '1px solid #E0E0E0',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      height: '80%',
    },
  },
  formSection: {
    flex: 7, // 70% height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.primary.main,
    paddingBottom: theme.spacing(5),
    width: theme.dimensions.sidebarWidth,
    [theme.breakpoints.down('lg')]: {
      width: theme.dimensions.sidebarWidthTablet,
    },
    [theme.breakpoints.down('sm')]: {
      width: '0px',
    },
  },
  logoSection: {
    flex: 3, // 30% height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.grey[200],
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.formSection}>
          {children}
        </div>
        <div className={classes.sidebar}>
        {!useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.secondary.contrastText} />}
      </div>
      </Paper>
    </main>
  );
};

export default LoginLayout;
