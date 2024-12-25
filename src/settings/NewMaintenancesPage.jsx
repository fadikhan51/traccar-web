import React, { useState } from "react";
import dayjs from "dayjs";
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
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import { formatDistance, formatSpeed } from "../common/util/formatter";
import { useAttributePreference } from "../common/util/preferences";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const NewMaintenacesPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const speedUnit = useAttributePreference("speedUnit");
  const distanceUnit = useAttributePreference("distanceUnit");

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/maintenance");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const convertAttribute = (key, start, value) => {
    const attribute = positionAttributes[key];
    if (key.endsWith("Time")) {
      if (start) {
        return dayjs(value).locale("en").format("YYYY-MM-DD");
      }
      return `${value / 86400000} ${t("sharedDays")}`;
    }
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case "speed":
          return formatSpeed(value, speedUnit, t);
        case "distance":
          return formatDistance(value, distanceUnit, t);
        case "hours":
          return `${value / 3600000} ${t("sharedHours")}`;
        default:
          return value;
      }
    }

    return value;
  };

  return (
    <>
      <NewPageLayout
        menu={<NewSettingsMenu />}
        breadcrumbs={["settingsTitle", "sharedMaintenance"]}
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
                          <TableCell>{t("sharedName")}</TableCell>
                          <TableCell>{t("sharedType")}</TableCell>
                          <TableCell>{t("maintenanceStart")}</TableCell>
                          <TableCell>{t("maintenancePeriod")}</TableCell>
                          <TableCell className={classes.columnAction} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!loading ? (
                          items.filter(filterByKeyword(searchKeyword))
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>
                                  {convertAttribute(
                                    item.type,
                                    true,
                                    item.start
                                  )}
                                </TableCell>
                                <TableCell style={{ width: "30%" }}>
                                  {convertAttribute(
                                    item.type,
                                    false,
                                    item.period
                                  )}
                                </TableCell>
                                <TableCell
                                  className={classes.columnAction}
                                  padding="none"
                                >
                                  <CollectionActions
                                    itemId={item.id}
                                    editPath="/settings/maintenance"
                                    endpoint="maintenance"
                                    setTimestamp={setTimestamp}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableShimmer columns={5} endAction />
                        )}
                      </TableBody>
                    </Table>                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <CollectionFab editPath="/settings/maintenance" />
      </NewPageLayout>
    </>
  );
};

export default NewMaintenacesPage;
