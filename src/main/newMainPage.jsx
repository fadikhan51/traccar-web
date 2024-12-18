import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  IconButton,
  Avatar,
  InputAdornment,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  Menu,
  MenuItem,
  Tooltip,
  Popover,
  Paper,
  FormControl,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../common/components/LocalizationProvider";
import CompanyLogo from "../resources/images/samplelogo.svg?react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from '@mui/icons-material/Speed';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import MainMap from "./MainMap";
import { useAttributePreference } from "../common/util/preferences";
import useFilter from "./useFilter";
import usePersistedState from "../common/util/usePersistedState";
import { devicesActions } from "../store";
import { useRecoilState, useRecoilValue } from "recoil";
import StatusCard from "../common/components/StatusCard";
import { colorsAtom } from "../recoil/atoms/colorsAtom";
import { useDeviceReadonly } from '../common/util/permissions';
import DeviceRow from "./DeviceRow";
import DeviceList from "./DeviceList";

const useStyles = (colors) =>
  makeStyles((theme) => ({
    '@import': [
      'url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)',
    ],
    '@global': {
      '*': {
        fontFamily: 'Poppins, sans-serif',
      },
    },
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    navbar: {
      width: "100%",
      backgroundColor: colors.accent,
      padding: (props) => (props.isMediumScreen ? "8px 16px" : "12px 24px"),
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      position: "fixed",
      top: 0,
      zIndex: 1000,
      height: (props) => (props.isMediumScreen ? "56px" : "64px"),
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      height: (props) => (props.isMediumScreen ? "32px" : "40px"),
      width: "auto",
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "scale(1.02)",
      },
    },
    menuButton: {
      marginRight: "12px",
      color: colors.primary,
      "&:hover": {
        color: colors.secondary,
        backgroundColor: colors.muted,
      },
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: (props) => (props.isMediumScreen ? "12px" : "20px"),
    },
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "250px",
      height: "40px",
      padding: "0 20px 0 20px", 
      backgroundColor: colors.white,
      border: `1.5px solid ${colors.gray}`,
      borderRadius: "40px",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.2s ease-in-out",
      "&:focus-within": {
        borderColor: colors.primary,
        boxShadow: `0 0 0 3px ${colors.shadow}`,
        transform: "translateY(-1px)",
      },
    },
    searchInput: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "14px",
      backgroundColor: "transparent",
      padding: "8px 0",
      "&::placeholder": {
        color: colors.darkgray,
      },
    },
    configIcon: {
      color: colors.primary,
      transition: "all 0.2s ease",
      "&:hover": {
        color: colors.secondary,
      },
      cursor: "pointer",
    },
    searchDrawer: {
      width: "100%",
      maxWidth: "300px",
      padding: "20px",
    },
    searchButton: {
      color: colors.primary,
      borderRadius: "50%",
      padding: (props) => (props.isMediumScreen ? "8px" : "12px"),
      transition: "all 0.2s ease",
      "&:hover": {
        color: colors.secondary,
        backgroundColor: colors.muted,
      },
      "& .MuiSvgIcon-root": {
        fontSize: (props) => (props.isMediumScreen ? "20px" : "24px"),
      },
    },
    addButton: {
      color: colors.primary,
      borderRadius: "50%",
      padding: (props) => (props.isMediumScreen ? "8px" : "12px"),
      transition: "all 0.2s ease",
      "&:hover": {
        color: colors.secondary,
        backgroundColor: colors.muted,
        transform: "translateZ(8px)",
      },
      "& .MuiSvgIcon-root": {
        color: colors.primary,
        transition: "transform 0.2s ease",
        fontSize: (props) => (props.isMediumScreen ? "24px" : "28px"),
      },
      "&:hover .MuiSvgIcon-root": {
        transform: "translateY(2px)",
      },
    },
    accountSection: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      padding: (props) => (props.isMediumScreen ? "2px 6px" : "4px 8px"),
      borderRadius: "20px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: colors.muted,
      },
      "& .MuiSvgIcon-root": {
        color: colors.primary,
        transition: "transform 0.2s ease",
      },
      "&:hover .MuiSvgIcon-root": {
        transform: "translateY(2px)",
      },
    },
    sidebar: {
      width: (props) => (props.isMediumScreen ? "200px" : "240px"),
      height: (props) => (props.isMediumScreen ? "100%" : "calc(100vh - 64px)"),
      backgroundColor: colors.white,
      borderRight: `1px solid ${colors.gray}`,
      padding: "40px 0px 0px 0px",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: (props) => (props.isMediumScreen ? "0" : "64px"),
      left: 0,
      transition: "transform 0.3s ease-in-out",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 24px",
      color: colors.darkgray,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "13px",
      "&:hover": {
        backgroundColor: colors.accent,
        color: colors.primary,
      },
      "& .MuiSvgIcon-root": {
        marginRight: "12px",
        fontSize: "20px",
        width: "24px",
      },
    },
    accountSettings: {
      marginTop: "auto",
      fontSize: "12px",
      marginBottom: "5px",
    },
    logoutMenuItem: {
      color: colors.red,
      borderTop: `1px solid ${colors.gray}`,
      marginTop: "4px",
    },
    mapContainer: {
      position: "fixed",
      top: (props) => (props.isMediumScreen ? "56px" : "64px"),
      left: (props) => (props.isMediumScreen ? "0" : "240px"),
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    filterPanel: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      gap: theme.spacing(2),
      width: theme.dimensions.drawerWidthTablet,
    },
    contentList: {
      pointerEvents: 'auto',
      gridArea: '1 / 1',
      zIndex: 9999,
    },
  }));
const NewMainPage = () => {
  const theme = useTheme();
  const t = useTranslation();

  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [colors, setColors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)({ isMediumScreen });
  
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const mapOnSelect = useAttributePreference("mapOnSelect", true);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = usePersistedState("filter", {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState("filterSort", "");
  const [filterMap, setFilterMap] = usePersistedState("filterMap", false);
  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [devicesAnchorEl, setDevicesAnchorEl] = useState(null);
  const [vehiclesAnchorEl ,setVehiclesAnchorEl] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState(null);

  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const deviceReadonly = useDeviceReadonly();

  const deviceStatusCount = (status) =>
    Object.values(devices).filter((d) => d.status === status).length;

  const inputRef = useRef();
  const toolbarRef = useRef();
  const vehicleRef = useRef();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  const handleVehicleClick = () => {
    const rect = vehicleRef.current.getBoundingClientRect();
    setPopoverPosition({
      top: rect.top,
      left: rect.left + rect.width + 3,
    });
    setVehiclesAnchorEl(vehicleRef.current);
  };

  const SidebarContent = () => (
    <div className={classes.sidebar}>
      <div className={classes.menuItem}>
        <SpeedIcon />
        <span>Dashboard</span>
      </div>
      <div className={classes.menuItem}>
        <QueryStatsIcon />
        <span>Reports</span>
      </div>
      <div className={classes.menuItem}>
        <DisplaySettingsIcon />
        <span>Settings</span>
      </div>
      
      <div ref={vehicleRef} onClick={handleVehicleClick} className={classes.menuItem}>
        <AirportShuttleIcon />
        <span>Vehicles</span>
      </div>
      <Popover
                    open={!!vehiclesAnchorEl}
                    anchorEl={vehiclesAnchorEl}
                    onClose={() => setVehiclesAnchorEl(null)}
                    anchorReference="anchorPosition"
                    anchorPosition={popoverPosition}
                    anchorOrigin={{
                      vertical: 'right',
                      horizontal: 'right',
                    }}
                    slotProps={{
                      paper: {
                        style: {
                          width: `calc(${
                            toolbarRef.current?.clientWidth
                          }px - ${theme.spacing(4)})`,
                        },
                      },
                    }}
                    elevation={1}
                    disableAutoFocus
                    disableEnforceFocus
                  >
                    {filteredDevices.slice(0, 3).map((_, index) => (
                      <DeviceRow
                        key={filteredDevices[index].id}
                        data={filteredDevices}
                        index={index}
                      />
                    ))}
                    {filteredDevices.length > 3 && (
                      <ListItemButton
                        alignItems="center"
                        onClick={() => setDevicesOpen(true)}
                      >
                        <ListItemText
                          primary={t("notificationAlways")}
                          style={{ textAlign: "center" }}
                        />
                      </ListItemButton>
                    )}
                  </Popover>      
      <div className={`${classes.menuItem} ${classes.accountSettings}`}>
        <ManageAccountsIcon />
        <span>Account Settings</span>
      </div>
    </div>
  );

  return (
    <div className={classes.mainContainer}>
      <nav className={classes.navbar}>
        <div className={classes.container}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {isMediumScreen && (
              <IconButton
                className={`${classes.menuButton} ${classes.addButton}`}
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>
            )}
            <CompanyLogo className={classes.logo} />
          </div>
          <div className={classes.rightSection}>
            {isMediumScreen ? (
              <IconButton className={classes.addButton} onClick={toggleSearch}>
                <SearchIcon />
              </IconButton>
            ) : (
              <>
                <div ref={toolbarRef} className={classes.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search for vehicles"
                    className={classes.searchInput}
                    ref={inputRef}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => setDevicesAnchorEl(toolbarRef.current)}
                    onBlur={() => setDevicesAnchorEl(null)}
                  />
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => setFilterAnchorEl(inputRef.current)}
                  >
                    <Badge
                      color="info"
                      variant="dot"
                      invisible={
                        !filter.statuses.length && !filter.groups.length
                      }
                    >
                      <TuneIcon
                        className={classes.configIcon}
                        fontSize="small"
                      />
                    </Badge>
                  </IconButton>
                  <Popover
                    open={!!devicesAnchorEl}
                    anchorEl={devicesAnchorEl}
                    onClose={() => setDevicesAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: Number(theme.spacing(2).slice(0, -2)),
                    }}
                    marginThreshold={0}
                    slotProps={{
                      paper: {
                        style: {
                          width: `calc(${
                            toolbarRef.current?.clientWidth
                          }px - ${theme.spacing(4)})`,
                        },
                      },
                    }}
                    elevation={1}
                    disableAutoFocus
                    disableEnforceFocus
                  >
                    {filteredDevices.slice(0, 3).map((_, index) => (
                      <DeviceRow
                        key={filteredDevices[index].id}
                        data={filteredDevices}
                        index={index}
                      />
                    ))}
                    {filteredDevices.length > 3 && (
                      <ListItemButton
                        alignItems="center"
                        onClick={() => setDevicesOpen(true)}
                      >
                        <ListItemText
                          primary={t("notificationAlways")}
                          style={{ textAlign: "center" }}
                        />
                      </ListItemButton>
                    )}
                  </Popover>
                  <Popover
                    open={!!filterAnchorEl}
                    anchorEl={filterAnchorEl}
                    onClose={() => setFilterAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }} 
                    
                  >
                    <div className={classes.filterPanel}>
                      <FormControl>
                        <InputLabel>{t("deviceStatus")}</InputLabel>
                        <Select
                          label={t("deviceStatus")}
                          value={filter.statuses}
                          onChange={(e) =>
                            setFilter({ ...filter, statuses: e.target.value })
                          }
                          multiple
                        >
                          <MenuItem value="online">{`${t(
                            "deviceStatusOnline"
                          )} (${deviceStatusCount("online")})`}</MenuItem>
                          <MenuItem value="offline">{`${t(
                            "deviceStatusOffline"
                          )} (${deviceStatusCount("offline")})`}</MenuItem>
                          <MenuItem value="unknown">{`${t(
                            "deviceStatusUnknown"
                          )} (${deviceStatusCount("unknown")})`}</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("settingsGroups")}</InputLabel>
                        <Select
                          label={t("settingsGroups")}
                          value={filter.groups}
                          onChange={(e) =>
                            setFilter({ ...filter, groups: e.target.value })
                          }
                          multiple
                        >
                          {Object.values(groups)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((group) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel>{t("sharedSortBy")}</InputLabel>
                        <Select
                          label={t("sharedSortBy")}
                          value={filterSort}
                          onChange={(e) => setFilterSort(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">{"\u00a0"}</MenuItem>
                          <MenuItem value="name">{t("sharedName")}</MenuItem>
                          <MenuItem value="lastUpdate">
                            {t("deviceLastUpdate")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filterMap}
                              onChange={(e) => setFilterMap(e.target.checked)}
                            />
                          }
                          label={t("sharedFilterMap")}
                        />
                      </FormGroup>
                    </div>
                  </Popover>
                </div>
              </>
            )}
            <IconButton onClick={() => navigate('/settings/device')} disabled={deviceReadonly} className={classes.addButton}>
            <Tooltip open={!deviceReadonly && Object.keys(devices).length === 0} title={t('deviceRegisterFirst')} arrow>
              <AddIcon />
            </Tooltip>
            </IconButton>
            <div className={classes.accountSection} onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  width: isMediumScreen ? 28 : 32,
                  height: isMediumScreen ? 28 : 32,
                  bgcolor: colors.primary,
                }}
              >
                U
              </Avatar>
              <ArrowDropDownIcon />
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: "8px",
                  "& .MuiList-root": {
                    padding: "8px 0",
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
                Account
              </MenuItem>
              <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
                Branding Options
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                className={`${classes.menuItem} ${classes.logoutMenuItem}`}
              >
                Log out
              </MenuItem>
            </Menu>
          </div>
        </div>
      </nav>

      {isMediumScreen ? (
        <>
          <Drawer
            anchor="left"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            variant="temporary"
            transitionDuration={300}
            SlideProps={{
              easing: theme.transitions.easing.easeInOut,
            }}
          >
            <SidebarContent />
          </Drawer>
          <Drawer
            anchor="right"
            open={isSearchOpen}
            onClose={toggleSearch}
            variant="temporary"
            transitionDuration={300}
            SlideProps={{
              easing: theme.transitions.easing.easeInOut,
            }}
          >
            <div className={classes.searchDrawer}>
              <div className={classes.searchContainer}>
                <input
                  type="text"
                  placeholder="Search for vehicles"
                  className={classes.searchInput}
                />
                <TuneIcon className={classes.configIcon} />
              </div>
            </div>
          </Drawer>
        </>
      ) : (
        <SidebarContent />
      )}

      <div className={classes.mapContainer}>
        <MainMap
          filteredPositions={filteredPositions}
          selectedPosition={selectedPosition}
          onEventsClick={onEventsClick}
        />
      </div>

      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default NewMainPage;
