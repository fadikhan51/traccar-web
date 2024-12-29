import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Snackbar } from "@mui/material";
import Logo from "../resources/images/logo.png";
import SampleLogo from "../resources/images/samplelogo.svg?react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { snackBarDurationShortMs } from "../common/util/duration";
import { useCatch, useEffectAsync } from "../reactHelper";
import { sessionActions } from "../store";
import { colorsAtom } from "../recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useActiveTheme from "../common/theme/useActiveTheme";
import useCompanyLogo from "../common/theme/useCompanyLogo";
import { companyLogoAtom } from "../recoil/atoms/companyLogoAtom";
import Base64Image from "../common/components/Base64Image";

const useStyles = (colors) =>
  makeStyles((theme) => ({
    root: {
      width: "100%",
      height: "100%",
      background: `linear-gradient(to bottom right, ${colors.highlight}, ${colors.accent})`,
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
    mobileLoginText: {
      display: "none",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        marginTop: "10px",
        fontSize: "12px",
        color: colors.darkgray,
      },
    },
    mobileLoginLink: {
      color: colors.primary,
      textDecoration: "none",
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  }));

const NewRegisterPage = () => {
  useActiveTheme();
  useCompanyLogo();
  const [colors] = useRecoilState(colorsAtom);
  const companyLogo = useRecoilValue(companyLogoAtom);

  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const server = useSelector((state) => state.session.server);
  const totpForce = useSelector(
    (state) => state.session.server.attributes.totpForce
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpKey, setTotpKey] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffectAsync(async () => {
    if (totpForce) {
      const response = await fetch("/api/users/totp", { method: "POST" });
      if (response.ok) {
        setTotpKey(await response.text());
      } else {
        throw Error(await response.text());
      }
    }
  }, [totpForce, setTotpKey]);

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, totpKey }),
    });
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
        <Base64Image
            base64String={companyLogo}
            altText={"Company Logo"}
            css={classes.sampleLogo}
          />
          {/* <SampleLogo className={classes.sampleLogo} /> */}
          <div className={classes.topRowRight}>
            <span>Already have an account?</span>
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
            <img src={Logo} alt="Logo" className={classes.logoImage} />
          </div>
          <div className={classes.form}>
            <h1 className={classes.heading}>Welcome to BoxTechAI</h1>
            <p className={classes.subheading}>Register your account</p>
            <div style={{ width: "100%" }}>
              <label className={classes.inputLabel}>Name</label>
              <input
                required
                autoFocus
                name="name"
                value={name}
                autoComplete="name"
                type="text"
                className={classes.input}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label className={classes.inputLabel}>Email</label>
              <input
                required
                type="email"
                className={classes.input}
                name="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label className={classes.inputLabel}>Password</label>
              <input
                required
                type="password"
                className={classes.input}
                name="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={
                !name ||
                !password ||
                !(server.newServer || /(.+)@(.+)\.(.{2,})/.test(email))
              }
              className={classes.loginButton}
            >
              Register
            </button>
            <div className={classes.mobileLoginText}>
              <span>Already have an account?</span>
              <span
                className={classes.mobileLoginLink}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
          </div>
          <Snackbar
            open={snackbarOpen}
            onClose={() => {
              dispatch(
                sessionActions.updateServer({ ...server, newServer: false })
              );
              navigate("/login");
            }}
            autoHideDuration={snackBarDurationShortMs}
            message="Account Created"
          />
        </div>
      </div>
    </main>
  );
};
export default NewRegisterPage;
