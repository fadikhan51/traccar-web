import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import SettingsMenu from "./components/SettingsMenu";
import { useCatch } from "../reactHelper";
// import useSettingsStyles from './common/useSettingsStyles';
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

  const textEnabled = useSelector((state) => state.session.server.textEnabled);

  const [item, setItem] = useState({ type: "custom", attributes: {} });

  const handleSend = useCatch(async () => {
    const query = new URLSearchParams({ groupId: id });
    const response = await fetch(`/api/commands/send?${query.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <NewPageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "deviceCommand"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} lg={6}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.cardTitle}>
                {t("sharedRequired")}
              </Typography>
              <CardContent>
                <FormControl
                  sx={classes.formControl}
                  fullWidth
                  className={classes.formControl}
                >
                  <FormControl fullWidth>
                    <InputLabel>{t("sharedType")}</InputLabel>
                    <Select label={t("sharedType")} value="custom" disabled>
                      <MenuItem value="custom">{t("commandCustom")}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    value={item.attributes.data}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        attributes: {
                          ...item.attributes,
                          data: e.target.value,
                        },
                      })
                    }
                    label={t("commandData")}
                  />
                  {textEnabled && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.textChannel}
                          onChange={(event) =>
                            setItem({
                              ...item,
                              textChannel: event.target.checked,
                            })
                          }
                        />
                      }
                      label={t("commandSendSms")}
                    />
                  )}
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
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
                disabled={!item.attributes.data}
              >
                {t("commandSend")}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default CommandDevicePage;
