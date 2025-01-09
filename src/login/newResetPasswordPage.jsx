import React, { useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../resources/images/logo.png";
import SampleLogo from "../resources/images/samplelogo.svg?react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { snackBarDurationShortMs } from "../common/util/duration";
import { useCatch, useEffectAsync } from "../reactHelper";
import { sessionActions } from "../store";
import { companyLogoAtom } from "../recoil/atoms/companyLogoAtom";
import { colorsAtom } from "../recoil/atoms/colorsAtom";

import Base64Image from "../common/components/Base64Image";
import useActiveTheme from "../common/theme/useActiveTheme";
import useCompanyLogo from "../common/theme/useCompanyLogo";
import useQuery from "../common/util/useQuery";
import { useRecoilState, useRecoilValue } from "recoil";

const useStyles = (colors) =>
  makeStyles((theme) => ({
    root: {
      width: "100%",
      height: "100%",
      background: `linear-gradient(to bottom right, ${colors.highlight}, ${colors.accent}) !important`,
      backdropFilter: "blur(15px)",
      WebkitBackdropFilter: "blur(15px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      width: "75%",
      height: "75%",
      backgroundColor: colors.white,
      borderRadius: "10px",
      boxShadow: `0px 0px 5px ${colors.gray}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      paddingBottom: "20px",
      [theme.breakpoints.down("md")]: {
        width: "90%",
        height: "90%",
        paddingBottom: "10px",
      },
    },
    topRow: {
      height: "15%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
    leftTitle: {
      color: colors.darkgray,
      fontSize: "12px",
      fontWeight: "bold",
    },
    topRowRight: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: colors.darkgray,
      fontSize: "12px",
    },
    signInButton: {
      padding: "8px 16px",
      backgroundColor: colors.white,
      border: `1px solid ${colors.primary}`,
      color: colors.primary,
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "12px",
      "&:hover": {
        backgroundColor: colors.primary,
        color: colors.white,
      },
    },
    sampleLogo: {
      height: "30px",
      width: "auto",
    },
    bottomRow: {
      height: "85%",
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.down("md")]: {
        height: "100%",
        flexDirection: "column",
        padding: "20px",
      },
    },
    logo: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
    form: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: "15px",
      padding: "0 40px",
      overflow: "auto",
      [theme.breakpoints.down("md")]: {
        padding: "0",
        width: "100%",
        gap: "10px",
        justifyContent: "flex-start",
        paddingTop: "20px",
      },
    },
    logoImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    },
    heading: {
      color: colors.darkgray,
      fontSize: "20px",
      fontWeight: "bold",
      margin: 0,
      alignSelf: "flex-start",
      marginBottom: "-5px",
      [theme.breakpoints.down("md")]: {
        marginBottom: "0",
        fontSize: "18px",
      },
    },
    subheading: {
      color: colors.darkgray,
      fontSize: "14px",
      margin: 0,
      alignSelf: "flex-start",
      [theme.breakpoints.down("md")]: {
        fontSize: "13px",
      },
    },
    inputLabel: {
      color: colors.darkgray,
      fontSize: "12px",
      marginBottom: "3px",
      alignSelf: "flex-start",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: `1px solid ${colors.gray}`,
      borderRadius: "5px",
      fontSize: "13px",
      "&:focus": {
        outline: "none",
        borderColor: colors.primary,
        boxShadow: `0 0 0 2px ${colors.shadow}`,
      },
    },
    loginButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: colors.primary,
      color: colors.white,
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: colors.tertiary,
      },
    },
    mobileRegister: {
      display: "none",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginTop: "15px",
        color: colors.darkgray,
        fontSize: "12px",
        "& a": {
          color: colors.primary,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  }));

const NewResetPasswordPage = () => {
  useActiveTheme();
  useCompanyLogo();
  const [colors] = useRecoilState(colorsAtom);
  const companyLogo = useRecoilValue(companyLogoAtom);

  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const query = useQuery();

  const token = query.get("passwordReset");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();
    let response;
    if (!token) {
      response = await fetch("/api/password/reset", {
        method: "POST",
        body: new URLSearchParams(`email=${encodeURIComponent(email)}`),
      });
    } else {
      response = await fetch("/api/password/update", {
        method: "POST",
        body: new URLSearchParams(
          `token=${encodeURIComponent(token)}&password=${encodeURIComponent(
            password
          )}`
        ),
      });
    }
    if (response.ok) {
      setSnackbarOpen(true);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <main className={classes.root}>
      <div className={classes.container}>
        <div className={classes.topRow}>
          <span className={classes.leftTitle}>Authentication Gateway</span>

          <div className={classes.topRowRight}>
            <span>Got the password?</span>
            <button
              onClick={() => navigate("/login")}
              className={classes.signInButton}
            >
              Sign in
            </button>
          </div>
        </div>
        <div className={classes.bottomRow}>
          <div className={classes.logo}>
            <Base64Image
              base64String={companyLogo}
              altText={"Company Logo"}
              css={classes.logoImage}
            />{" "}
          </div>
          <div className={classes.form}>
            <h1 className={classes.heading}>Reset Password</h1>
            <p className={classes.subheading}>Provide your valid credentials</p>
            <div style={{ width: "100%" }}>
              {!token ? (
                <>
                  <label className={classes.inputLabel}>Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    autoComplete="email"
                    autoFocus={!email}
                    className={classes.input}
                    onChange={(e) => setEmail(e.target.value)}
                  />{" "}
                </>
              ) : (
                <>
                  <label className={classes.inputLabel}>Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={password}
                    autoComplete="current-password"
                    autoFocus={!email}
                    className={classes.input}
                    onChange={(event) => setPassword(event.target.value)}
                  />{" "}
                </>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!/(.+)@(.+)\.(.{2,})/.test(email) && !password}
              className={classes.loginButton}
            >
              Reset Password
            </button>
            <div className={classes.mobileRegister}>
              <span>Got the password?</span>
              <a href="#" onClick={() => navigate("/login")}>
                Login
              </a>
            </div>
          </div>
          <Snackbar
            open={snackbarOpen}
            onClose={() => navigate("/login")}
            autoHideDuration={snackBarDurationShortMs}
            message={!token ? "Login Reset Success" : "Login Update Success"}
          />
        </div>
      </div>
    </main>
  );
};

export default NewResetPasswordPage;
