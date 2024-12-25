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
import { useAdministrator } from "../common/util/permissions";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const NewComputedAttributesPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const administrator = useAdministrator();

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/attributes/computed");
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
      breadcrumbs={["settingsTitle", "sharedComputedAttributes"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                  <SearchHeader
                    keyword={searchKeyword}
                    setKeyword={setSearchKeyword}
                  />
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("sharedDescription")}</TableCell>
                        <TableCell>{t("sharedAttribute")}</TableCell>
                        <TableCell>{t("sharedExpression")}</TableCell>
                        <TableCell>{t("sharedType")}</TableCell>
                        {administrator && (
                          <TableCell className={classes.columnAction} />
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading ? (
                        items.filter(filterByKeyword(searchKeyword))
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.attribute}</TableCell>
                              <TableCell>{item.expression}</TableCell>
                              <TableCell style={{width:"25%"}}>{item.type}</TableCell>
                              {administrator && (
                                <TableCell
                                  className={classes.columnAction}
                                  padding="none"
                                >
                                  <CollectionActions
                                    itemId={item.id}
                                    editPath="/settings/attribute"
                                    endpoint="attributes/computed"
                                    setTimestamp={setTimestamp}
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                      ) : (
                        <TableShimmer
                          columns={administrator ? 5 : 4}
                          endAction={administrator}
                        />
                      )}
                    </TableBody>
                  </Table>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <CollectionFab editPath="/settings/attribute" disabled={!administrator} />
    </NewPageLayout>
  );
};

export default NewComputedAttributesPage;
