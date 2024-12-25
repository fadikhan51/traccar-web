import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Grid,
  Typography,
  Container,
  Button,
  CardContent,
  FormControl
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "../common/components/LocalizationProvider";
import BaseCommandView from "./components/BaseCommandView";
import SelectField from "../common/components/SelectField";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { useCatch } from "../reactHelper";
import { useRestriction } from "../common/util/permissions";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const CommandDevicePage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const { id } = useParams();

  const [savedId, setSavedId] = useState(0);
  const [item, setItem] = useState({});

  const limitCommands = useRestriction("limitCommands");

  const handleSend = useCatch(async () => {
    let command;
    if (savedId) {
      const response = await fetch(`/api/commands/${savedId}`);
      if (response.ok) {
        command = await response.json();
      } else {
        throw Error(await response.text());
      }
    } else {
      command = item;
    }

    command.deviceId = parseInt(id, 10);

    const response = await fetch("/api/commands/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });

    if (response.ok) {
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  const validate = () => savedId || (item && item.type);

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "deviceCommand"]}
    >
      <Container className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} md={6} lg={8}>
            <Card className={classes.card} style={{ overflowX: "auto" }}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("sharedRequired")}
              </Typography>
              <CardContent>
              <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                <SelectField
                  value={savedId}
                  emptyValue={limitCommands ? null : 0}
                  emptyTitle={t("sharedNew")}
                  onChange={(e) => setSavedId(e.target.value)}
                  endpoint={`/api/commands/send?deviceId=${id}`}
                  titleGetter={(it) => it.description}
                  label={t("sharedSavedCommand")}
                />
                {!limitCommands && !savedId && (
                  <BaseCommandView
                    deviceId={id}
                    item={item}
                    setItem={setItem}
                  />
                )}
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className={classes.buttons}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            {t("sharedCancel")}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={handleSend}
            disabled={!validate()}
          >
            {t("commandSend")}
          </Button>
        </div>
      </Container>
    </NewPageLayout>
  );
};

export default CommandDevicePage;
