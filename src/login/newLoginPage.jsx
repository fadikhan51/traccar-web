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
import { useRecoilState, useRecoilValue } from "recoil";

import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import usePersistedState from "../common/util/usePersistedState";
import {
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from "../common/components/NativeInterface";
import Loader from "../common/components/Loader";

import { colorsAtom } from "../recoil/atoms/colorsAtom";
import { companyLogoAtom } from "../recoil/atoms/companyLogoAtom";
import Base64Image from "../common/components/Base64Image";
import useActiveTheme from "../common/theme/useActiveTheme";
import useCompanyLogo from "../common/theme/useCompanyLogo";

const useStyles = (colors) => makeStyles((theme) => ({
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
    color: colors.darkgray,
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

const NewLoginPage = () => {
  useActiveTheme();
  useCompanyLogo();
  const [colors] = useRecoilState(colorsAtom);
  const companyLogo = useRecoilValue(companyLogoAtom);
  

  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({
    code: values[0],
    country: values[1].country,
    name: values[1].name,
  }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const registrationEnabled = useSelector(
    (state) => state.session.server.registration
  );
  const languageEnabled = useSelector(
    (state) => !state.session.server.attributes["ui.disableLoginLanguage"]
  );
  const changeEnabled = useSelector(
    (state) => !state.session.server.attributes.disableChange
  );
  const emailEnabled = useSelector(
    (state) => state.session.server.emailEnabled
  );
  const openIdEnabled = useSelector(
    (state) => state.session.server.openIdEnabled
  );
  const openIdForced = useSelector(
    (state) =>
      state.session.server.openIdEnabled && state.session.server.openIdForce
  );
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector(
    (state) => state.session.server.announcement
  );

  const generateLoginToken = async () => {
    if (nativeEnvironment) {
      let token = "";
      try {
        const expiration = dayjs().add(6, "months").toISOString();
        const response = await fetch("/api/session/token", {
          method: "POST",
          body: new URLSearchParams(`expiration=${expiration}`),
        });
        if (response.ok) {
          token = await response.text();
        }
      } catch (error) {
        token = "";
      }
      nativePostMessage(`login|${token}`);
    }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;
      const response = await fetch("/api/session", {
        method: "POST",
        body: new URLSearchParams(
          code.length ? `${query}&code=${code}` : query
        ),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        navigate("/");
      } else if (
        response.status === 401 &&
        response.headers.get("WWW-Authenticate") === "TOTP"
      ) {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch (error) {
      setFailed(true);
      setPassword("");
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetch(
      `/api/session?token=${encodeURIComponent(token)}`
    );
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      navigate("/");
    } else {
      throw Error(await response.text());
    }
  });

  const handleOpenIdLogin = () => {
    document.location = "/api/session/openid/auth";
  };

  useEffect(() => nativePostMessage("authentication"), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  if (openIdForced) {
    handleOpenIdLogin();
    return <Loader />;
  }

  return (
    <main className={classes.root}>
      <div className={classes.container}>
        <div className={classes.topRow}>
        {/* <Base64Image
            base64String={companyLogo}
            altText={"Company Logo"}
            css={classes.sampleLogo}
          /> */}
          <span className={classes.leftTitle}>Authentication Gateway</span>
          {/* <SampleLogo className={} /> */}
          <div className={classes.topRowRight}>
            <span>Don't have an account?</span>
            <button
              onClick={() => navigate("/register")}
              className={classes.signInButton}
            >
              Register
            </button>
          </div>
        </div>
        <div className={classes.bottomRow}>
          <div className={classes.logo}>
          <Base64Image
            base64String={companyLogo}
            altText={"Company Logo"}
            css={classes.logoImage}
          />
            {/* <img src={Logo} alt="Logo" className={classes.logoImage} /> */}
          </div>
          <div className={classes.form}>
            <h1 className={classes.heading}>Welcome to BoxTech</h1>
            <p className={classes.subheading}>Login to your account</p>
            <div style={{ width: "100%" }}>
              <label className={classes.inputLabel}>Email</label>
              <input
                required
                error={failed}
                name="email"
                value={email}
                autoComplete="email"
                autoFocus={!email}
                className={classes.input}
                onChange={(e) => setEmail(e.target.value)}
                helperText={failed && "Invalid username or password"}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label className={classes.inputLabel}>Password</label>
              <input
                required
                error={failed}
                name="password"
                value={password}
                type="password"
                autoComplete="current-password"
                className={classes.input}
                autoFocus={!!email}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handlePasswordLogin}
              disabled={!email || !password || (codeEnabled && !code)}
              className={classes.loginButton}
            >
              Login
            </button>
            <div className={classes.mobileRegister}>
              <span>Don't have an account?</span>
              <a href="#" onClick={() => navigate("/register")}>
                Register
              </a>
            </div>
          </div>
          <Snackbar
            open={!!announcement && !announcementShown}
            message={announcement}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setAnnouncementShown(true)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </div>
      </div>
    </main>
  );
};
export default NewLoginPage;
