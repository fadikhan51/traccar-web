import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import LinkIcon from "@mui/icons-material/Link";
import PublishIcon from "@mui/icons-material/Publish";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
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

const NewGroupsPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const limitCommands = useRestriction("limitCommands");

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/groups");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const actionCommand = {
    key: "command",
    title: t("deviceCommand"),
    icon: <PublishIcon fontSize="small" />,
    handler: (groupId) => navigate(`/settings/group/${groupId}/command`),
  };

  const actionConnections = {
    key: "connections",
    title: t("sharedConnections"),
    icon: <LinkIcon fontSize="small" />,
    handler: (groupId) => navigate(`/settings/group/${groupId}/connections`),
  };

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsGroups"]}
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
                        <TableCell>{t("sharedName")}</TableCell>
                        <TableCell className={classes.columnAction} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading ? (
                        items.filter(filterByKeyword(searchKeyword))
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell style={{ width: "100%" }}>
                                {item.name}
                              </TableCell>
                              <TableCell
                                className={classes.columnAction}
                                padding="none"
                                style={{ width: "auto" }}
                              >
                                <CollectionActions
                                  itemId={item.id}
                                  editPath="/settings/group"
                                  endpoint="groups"
                                  setTimestamp={setTimestamp}
                                  customActions={
                                    limitCommands
                                      ? [actionConnections]
                                      : [actionConnections, actionCommand]
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableShimmer columns={2} endAction />
                      )}
                    </TableBody>
                  </Table>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <CollectionFab editPath="/settings/group" />
    </NewPageLayout>
  );
};
export default NewGroupsPage;
