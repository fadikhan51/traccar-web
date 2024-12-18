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
import useQuery from "../common/util/useQuery";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(to right, #d8bfd8, #dda0dd)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "75%",
    height: "75%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
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
    color: "#666666",
    fontSize: "12px",
  },
  signInButton: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    border: "1px solid #6a5acd",
    color: "#6a5acd",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    "&:hover": {
      backgroundColor: "#6a5acd",
      color: "#fff",
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
    color: "#333",
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
    color: "#888",
    fontSize: "14px",
    margin: 0,
    alignSelf: "flex-start",
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },
  inputLabel: {
    color: "#333",
    fontSize: "12px",
    marginBottom: "3px",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "13px",
    "&:focus": {
      outline: "none",
      borderColor: "#6a5acd",
      boxShadow: "0 0 0 2px rgba(106, 90, 205, 0.2)",
    },
  },
  loginButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#6a5acd",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#5a4abd",
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
      color: "#666666",
      fontSize: "12px",
      "& a": {
        color: "#6a5acd",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  },
}));

const NewResetPasswordPage = () => {
  const classes = useStyles();
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
          <SampleLogo className={classes.sampleLogo} />
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
            <img src={Logo} alt="Logo" className={classes.logoImage} />
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
              <a href="#" onClick={() => navigate("/test-login")}>
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
