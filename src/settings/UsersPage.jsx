import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Switch,
  TableFooter,
  FormControlLabel,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LinkIcon from "@mui/icons-material/Link";
import { useCatch, useEffectAsync } from "../reactHelper";
import { formatBoolean, formatTime } from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import { useManager } from "../common/util/permissions";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";

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
      ".MuiFormControl-root": {
        marginBottom: `${theme.spacing(1)} !important`,
        "& .MuiInputLabel-root": {
          color: colors.darkgray,
          "&.Mui-focused": {
            color: colors.highlight,
          },
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: colors.gray,
          },
          "&:hover fieldset": {
            borderColor: colors.secondary,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.accent,
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
        "& .MuiAutocomplete-paper": {
          backgroundColor: colors.darkgray,
        },
        "& .MuiAutocomplete-listbox": {
          "& .MuiAutocomplete-option": {
            color: colors.darkgray,
          },
        },
      },
      ".MuiTableCell-root": {
        color: `${colors.darkgray} !important`,
      },
    },
    fontSize: {
      fontSize: "0.9rem !important",
    },
    container: {
      marginTop: theme.spacing(2),
      width: "100%",
      padding: theme.spacing(2),
    },
    card: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: `${colors.white} !important`,
      width: "100%",
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
      width: "100%",
    },
  }));

const UsersPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const manager = useManager();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [temporary, setTemporary] = useState(false);

  const handleLogin = useCatch(async (userId) => {
    const response = await fetch(`/api/session/${userId}`);
    if (response.ok) {
      window.location.replace("/");
    } else {
      throw Error(await response.text());
    }
  });

  const actionLogin = {
    key: "login",
    title: t("loginLogin"),
    icon: <LoginIcon fontSize="small" />,
    handler: handleLogin,
  };

  const actionConnections = {
    key: "connections",
    title: t("sharedConnections"),
    icon: <LinkIcon fontSize="small" />,
    handler: (userId) => navigate(`/settings/user/${userId}/connections`),
  };

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsUsers"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12}>
            <Card className={classes.card} style={{overflowX: "auto"}}>
              <SearchHeader
                keyword={searchKeyword}
                setKeyword={setSearchKeyword}
              />
              <CardContent>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("sharedName")}</TableCell>
                      <TableCell>{t("userEmail")}</TableCell>
                      <TableCell>{t("userAdmin")}</TableCell>
                      <TableCell>{t("sharedDisabled")}</TableCell>
                      <TableCell>{t("userExpirationTime")}</TableCell>
                      <TableCell className={classes.columnAction} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading ? (
                      items
                        .filter((u) => temporary || !u.temporary)
                        .filter(filterByKeyword(searchKeyword))
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                              {formatBoolean(item.administrator, t)}
                            </TableCell>
                            <TableCell>
                              {formatBoolean(item.disabled, t)}
                            </TableCell>
                            <TableCell>
                              {formatTime(item.expirationTime, "date")}
                            </TableCell>
                            <TableCell
                              className={classes.columnAction}
                              padding="none"
                            >
                              <CollectionActions
                                itemId={item.id}
                                editPath="/settings/user"
                                endpoint="users"
                                setTimestamp={setTimestamp}
                                customActions={
                                  manager
                                    ? [actionLogin, actionConnections]
                                    : [actionConnections]
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableShimmer columns={6} endAction />
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={6} align="right">
                        <FormControlLabel
                          control={
                            <Switch
                              value={temporary}
                              onChange={(e) => setTemporary(e.target.checked)}
                              size="small"
                            />
                          }
                          label={t("userTemporary")}
                          labelPlacement="start"
                        />
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <CollectionFab editPath="/settings/user" />
    </NewPageLayout>
  );
};

export default UsersPage;