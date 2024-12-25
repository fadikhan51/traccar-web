import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Typography,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "../common/components/LocalizationProvider";
import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { useCatchCallback } from "../reactHelper";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const SharePage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const { id } = useParams();

  const device = useSelector((state) => state.devices.items[id]);

  const [expiration, setExpiration] = useState(
    dayjs().add(1, "week").locale("en").format("YYYY-MM-DD")
  );
  const [link, setLink] = useState();

  const handleShare = useCatchCallback(async () => {
    const expirationTime = dayjs(expiration).toISOString();
    const response = await fetch("/api/devices/share", {
      method: "POST",
      body: new URLSearchParams(`deviceId=${id}&expiration=${expirationTime}`),
    });
    if (response.ok) {
      const token = await response.text();
      setLink(`${window.location.origin}?token=${token}`);
    } else {
      throw Error(await response.text());
    }
  }, [id, expiration, setLink]);

  return (
    <NewPageLayout menu={<NewSettingsMenu />} breadcrumbs={["deviceShare"]}>
      <Container className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} md={6} lg={6}>
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
                  <TextField
                    value={device.name}
                    label={t("sharedDevice")}
                    disabled
                  />
                  <TextField
                    label={t("userExpirationTime")}
                    type="date"
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleShare}
                  >
                    {t("reportShow")}
                  </Button>
                  <TextField
                    value={link || ""}
                    onChange={(e) => setLink(e.target.value)}
                    label={t("sharedLink")}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
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
                onClick={() => navigator.clipboard?.writeText(link)}
                disabled={!link}
              >
                {t("sharedCopy")}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default SharePage;
