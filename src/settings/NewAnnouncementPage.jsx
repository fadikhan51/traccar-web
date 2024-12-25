import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  TextField,
  Button,
  Card,
  Grid,
  FormControl,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "../common/components/LocalizationProvider";

import NewPageLayout from "../common/components/NewPageLayout";
import NewSettingsMenu from "./components/NewSettingsMenu";
import { useCatchCallback } from "../reactHelper";
import SelectField from "../common/components/SelectField";
import { prefixString } from "../common/util/stringUtils";
import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";


const AnnouncementPage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const [users, setUsers] = useState([]);
  const [notificator, setNotificator] = useState();
  const [message, setMessage] = useState({});

  const handleSend = useCatchCallback(async () => {
    const query = new URLSearchParams();
    users.forEach((userId) => query.append("userId", userId));
    const response = await fetch(
      `/api/notifications/send/${notificator}?${query.toString()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      }
    );
    if (response.ok) {
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  }, [users, notificator, message, navigate]);

  return (
    <NewPageLayout
      menu={<NewSettingsMenu />}
      breadcrumbs={["serverAnnouncement"]}
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
                  <SelectField
                    multiple
                    value={users}
                    onChange={(e) => setUsers(e.target.value)}
                    endpoint="/api/users"
                    label={t("settingsUsers")}
                  />
                  <SelectField
                    value={notificator}
                    onChange={(e) => setNotificator(e.target.value)}
                    endpoint="/api/notifications/notificators?announcement=true"
                    keyGetter={(it) => it.type}
                    titleGetter={(it) =>
                      t(prefixString("notificator", it.type))
                    }
                    label={t("notificationNotificators")}
                  />
                  <TextField
                    value={message.subject}
                    onChange={(e) =>
                      setMessage({ ...message, subject: e.target.value })
                    }
                    label={t("sharedSubject")}
                  />
                  <TextField
                    value={message.body}
                    onChange={(e) =>
                      setMessage({ ...message, body: e.target.value })
                    }
                    label={t("commandMessage")}
                  />
                </FormControl>

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
              disabled={!notificator || !message.subject || !message.body}
            >
              {t("commandSend")}
            </Button>
          </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </NewPageLayout>
  );
};

export default AnnouncementPage;