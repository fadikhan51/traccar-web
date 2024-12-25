import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Container,
  Grid,
  Card,
  CardContent,
  FormControl,
} from "@mui/material";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
// import useSettingsStyles from './common/useSettingsStyles';
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const NewDriversPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/drivers");
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
      breadcrumbs={["settingsTitle", "sharedDrivers"]}
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
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("sharedName")}</TableCell>
                      <TableCell>{t("deviceIdentifier")}</TableCell>
                      <TableCell className={classes.columnAction} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading ? items.filter(filterByKeyword(searchKeyword))
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell style={{ width: "33%" }}>
                            {item.name}
                          </TableCell>
                          <TableCell style={{ width: "66%" }}>
                            {item.uniqueId}
                          </TableCell>
                          <TableCell
                            className={classes.columnAction}
                            padding="none"
                            style={{ width: "100%" }}
                            align="right"
                          >
                            <CollectionActions
                              itemId={item.id}
                              editPath="/settings/driver"
                              endpoint="drivers"
                              setTimestamp={setTimestamp}
                            />
                          </TableCell>
                        </TableRow>
                      )) : (<TableShimmer columns={3} endAction />) }
                  </TableBody>
                </Table>{" "}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <CollectionFab editPath="/settings/driver" />
    </NewPageLayout>
  );
};

export default NewDriversPage;
