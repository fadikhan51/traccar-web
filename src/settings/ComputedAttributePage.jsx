import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  createFilterOptions,
  Autocomplete,
  Button,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditItemView from "./components/EditItemView";
import { useTranslation } from "../common/components/LocalizationProvider";
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import NewSettingsMenu from "./components/NewSettingsMenu";
import SelectField from "../common/components/SelectField";
import { useCatch } from "../reactHelper";
import { snackBarDurationLongMs } from "../common/util/duration";
import { makeStyles } from "@mui/styles";

import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useStyles from "../common/theme/useGlobalStyles";

const allowedProperties = [
  "valid",
  "latitude",
  "longitude",
  "altitude",
  "speed",
  "course",
  "address",
  "accuracy",
];

const ComputedAttributePage = () => {
  const [colors, setColors] = useRecoilState(colorsAtom);

  const classes = useStyles(colors)();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [item, setItem] = useState();
  const [deviceId, setDeviceId] = useState();
  const [result, setResult] = useState();

  const options = Object.entries(positionAttributes)
    .filter(
      ([key, value]) => !value.property || allowedProperties.includes(key)
    )
    .map(([key, value]) => ({
      key,
      name: value.name,
      type: value.type,
    }));

  const filter = createFilterOptions({
    stringify: (option) => option.name,
  });

  const testAttribute = useCatch(async () => {
    const query = new URLSearchParams({ deviceId });
    const url = `/api/attributes/computed/test?${query.toString()}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (response.ok) {
      setResult(await response.text());
    } else {
      throw Error(await response.text());
    }
  });

  const validate = () => item && item.description && item.expression;

  return (
    <EditItemView
      endpoint="attributes/computed"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<NewSettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedComputedAttribute"]}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          {item && (
            <>
              <Grid item xs={12} lg={6} style={{display: "flex"}}>
                <Card className={classes.card} style={{height: "100%", width: "100%"}}>
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
                        value={item.description || ""}
                        onChange={(e) =>
                          setItem({ ...item, description: e.target.value })
                        }
                        label={t("sharedDescription")}
                      />
                      <Autocomplete
                        value={
                          options.find(
                            (option) => option.key === item.attribute
                          ) || item.attribute
                        }
                        onChange={(_, option) => {
                          const attribute = option
                            ? option.key || option
                            : null;
                          if (option && option.type) {
                            setItem({ ...item, attribute, type: option.type });
                          } else {
                            setItem({ ...item, attribute });
                          }
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);
                          if (params.inputValue) {
                            filtered.push({
                              key: params.inputValue,
                              name: params.inputValue,
                            });
                          }
                          return filtered;
                        }}
                        options={options}
                        getOptionLabel={(option) => option.name || option}
                        renderOption={(props, option) => (
                          <li {...props}>{option.name}</li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label={t("sharedAttribute")} />
                        )}
                        freeSolo
                      />
                      <TextField
                        value={item.expression || ""}
                        onChange={(e) =>
                          setItem({ ...item, expression: e.target.value })
                        }
                        label={t("sharedExpression")}
                        multiline
                        rows={4}
                      />
                      <FormControl
                        disabled={item.attribute in positionAttributes}
                      >
                        <InputLabel>{t("sharedType")}</InputLabel>
                        <Select
                          label={t("sharedType")}
                          value={item.type || ""}
                          onChange={(e) =>
                            setItem({ ...item, type: e.target.value })
                          }
                        >
                          <MenuItem value="string">
                            {t("sharedTypeString")}
                          </MenuItem>
                          <MenuItem value="number">
                            {t("sharedTypeNumber")}
                          </MenuItem>
                          <MenuItem value="boolean">
                            {t("sharedTypeBoolean")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item container xs={12} lg={6} direction="column" style={{ height: '100%' }}>
                <Grid item xs style={{ marginBottom: '16px' }}>
                  <Card className={classes.card} style={{ height: '100%' }}>
                    <Typography variant="h6" className={classes.cardTitle}>
                      {t("sharedExtra")}
                    </Typography>
                    <CardContent>
                      <FormControl
                        sx={classes.formControl}
                        fullWidth
                        className={classes.formControl}
                      >
                        <TextField
                          type="number"
                          value={item.priority || 0}
                          onChange={(e) =>
                            setItem({ ...item, priority: Number(e.target.value) })
                          }
                          label={t("sharedPriority")}
                        />
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs>
                  <Card className={classes.card} style={{ height: '100%' }}>
                    <Typography variant="h6" className={classes.cardTitle}>
                      {t("sharedTest")}
                    </Typography>
                    <CardContent>
                      <FormControl
                        sx={classes.formControl}
                        fullWidth
                        className={classes.formControl}
                      >
                        <SelectField
                          value={deviceId}
                          onChange={(e) => setDeviceId(Number(e.target.value))}
                          endpoint="/api/devices"
                          label={t("sharedDevice")}
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={testAttribute}
                          disabled={!deviceId}
                        >
                          {t("sharedTestExpression")}
                        </Button>
                        <Snackbar
                          open={!!result}
                          onClose={() => setResult(null)}
                          autoHideDuration={snackBarDurationLongMs}
                          message={result}
                        />
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </EditItemView>
  );
};

export default ComputedAttributePage;
