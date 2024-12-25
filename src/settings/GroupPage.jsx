import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Grid,
  FormControl,
  CardContent,
  Card,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditItemView from "./components/EditItemView";
import EditAttributesCard from "./components/EditAttributesCard";
import SelectField from "../common/components/SelectField";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewSettingsMenu from "./components/NewSettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import useGroupAttributes from "../common/attributes/useGroupAttributes";
import { useCatch } from "../reactHelper";
import { groupsActions } from "../store";
// import useSettingsStyles from './common/useSettingsStyles';
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const GroupPage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const dispatch = useDispatch();
  const t = useTranslation();

  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const groupAttributes = useGroupAttributes(t);

  const [item, setItem] = useState();

  const onItemSaved = useCatch(async () => {
    const response = await fetch("/api/groups");
    if (response.ok) {
      dispatch(groupsActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  });

  const validate = () => item && item.name;

  return (
    <EditItemView
      endpoint="groups"
      item={item}
      setItem={setItem}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "groupDialog"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          {item && (
            <>
              <Grid item xs={12} lg={6} style={{ display: 'flex' }}>
                <Card className={classes.card} style={{ width: '100%' }}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedRequired")}
                  </Typography>
                  <CardContent>
                    <FormControl
                      sx={classes.formControl}
                      fullWidth
                      className={classes.formControl}
                    >
                      <TextField
                        value={item.name || ""}
                        onChange={(event) =>
                          setItem({ ...item, name: event.target.value })
                        }
                        label={t("sharedName")}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6} style={{ display: 'flex' }}>
                <Card className={classes.card} style={{ width: '100%' }}>
                  <Typography variant="h6" className={classes.cardTitle}>
                    {t("sharedExtra")}
                  </Typography>
                  <CardContent>
                    <FormControl
                      sx={classes.formControl}
                      fullWidth
                      className={classes.formControl}
                    >
                      <SelectField
                        value={item.groupId}
                        onChange={(event) =>
                          setItem({
                            ...item,
                            groupId: Number(event.target.value),
                          })
                        }
                        endpoint="/api/groups"
                        label={t("groupParent")}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <EditAttributesCard
                attributes={item.attributes}
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={{ ...commonDeviceAttributes, ...groupAttributes }}
              />
            </>
          )}
        </Grid>      </Container>
    </EditItemView>
  );
};

export default GroupPage;
