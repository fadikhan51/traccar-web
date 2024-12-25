import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Card,
  Container,
  CardContent,
  Grid,
  FormControl,
} from "@mui/material";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import { formatBoolean } from "../common/util/formatter";
import { prefixString } from "../common/util/stringUtils";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import { useRestriction } from "../common/util/permissions";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const CommandsPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();

  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const limitCommands = useRestriction("limitCommands");

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/commands");
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
      breadcrumbs={["settingsTitle", "sharedSavedCommands"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <SearchHeader
                keyword={searchKeyword}
                setKeyword={setSearchKeyword}
              />
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("sharedDescription")}</TableCell>
                        <TableCell>{t("sharedType")}</TableCell>
                        <TableCell>{t("commandSendSms")}</TableCell>
                        {!limitCommands && (
                          <TableCell className={classes.columnAction} />
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading ? (
                        items
                          .filter(filterByKeyword(searchKeyword))
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>
                                {t(prefixString("command", item.type))}
                              </TableCell>
                              <TableCell style={{ width: "35%" }}>
                                {formatBoolean(item.textChannel, t)}
                              </TableCell>
                              {!limitCommands && (
                                <TableCell
                                  className={classes.columnAction}
                                  padding="none"
                                >
                                  <CollectionActions
                                    itemId={item.id}
                                    editPath="/settings/command"
                                    endpoint="commands"
                                    setTimestamp={setTimestamp}
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                      ) : (
                        <TableShimmer
                          columns={limitCommands ? 3 : 4}
                          endAction
                        />
                      )}{" "}
                    </TableBody>
                  </Table>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <CollectionFab editPath="/settings/command" disabled={limitCommands} />
    </NewPageLayout>
  );
};

export default CommandsPage;
