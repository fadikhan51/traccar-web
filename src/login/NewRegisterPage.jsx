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
  mobileLoginText: {
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "5px",
      marginTop: "10px",
      fontSize: "12px",
      color: "#666666",
    },
  },
  mobileLoginLink: {
    color: "#6a5acd",
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const NewRegisterPage = () => {
  const classes = useStyles();
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
          <SampleLogo className={classes.sampleLogo} />
          <div className={classes.topRowRight}>
            <span>Already have an account?</span>
            <button
            onClick={()=> navigate('/test-login')} 
            className={classes.signInButton}>
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
                onClick={() => navigate('/test-login')}
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