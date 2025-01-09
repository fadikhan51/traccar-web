import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  IconButton,
  Avatar,
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
  ListItemButton,
  ListItemText
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../common/components/LocalizationProvider";
import CompanyLogo from "../resources/images/samplelogo.svg?react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import MainMap from "./MainMap";
import { useAttributePreference } from "../common/util/preferences";
import useFilter from "./useFilter";
import usePersistedState from "../common/util/usePersistedState";
import { devicesActions } from "../store";
import { useRecoilState, useRecoilValue } from "recoil";
import StatusCard from "../common/components/StatusCard";
import { companyLogoAtom } from "../recoil/atoms/companyLogoAtom";
import Base64Image from "../common/components/Base64Image";

import { colorsAtom } from "../recoil/atoms/colorsAtom";
import { useDeviceReadonly } from "../common/util/permissions";
import DeviceRow from "./DeviceRow";
import useStyles from "../common/theme/useMainPageStyling";
import {
  useAdministrator,
  useManager,
  useRestriction,
} from "../common/util/permissions";
import { nativePostMessage } from "../common/components/NativeInterface";

const NewMainPage = () => {
  const theme = useTheme();
  const t = useTranslation();
  const companyLogo = useRecoilValue(companyLogoAtom);

  const admin = useAdministrator();
  const manager = useManager();

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
  const [vehiclesAnchorEl, setVehiclesAnchorEl] = useState(null);
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
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
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
      <div className={classes.menuItem} onClick={() => navigate("/")}>
        <SpeedIcon />
        <span>Dashboard</span>
      </div>
      <div
        className={classes.menuItem}
        onClick={() => navigate("/reports/combined")}
      >
        <QueryStatsIcon />
        <span>Reports</span>
      </div>
      <div
        className={classes.menuItem}
        onClick={() => navigate("/settings/preferences")}
      >
        <DisplaySettingsIcon />
        <span>Settings</span>
      </div>

      <div
        ref={vehicleRef}
        onClick={handleVehicleClick}
        className={classes.menuItem}
      >
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
          vertical: "right",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              width: `calc(${
                toolbarRef.current?.clientWidth
              }px - ${theme.spacing(4)})`,
              maxHeight: '220px',
              overflowY: 'auto',
            },
          },
        }}
        elevation={1}
        disableAutoFocus
        disableEnforceFocus
      >
        {filteredDevices.map((_, index) => (
          <DeviceRow
            key={filteredDevices[index].id}
            data={filteredDevices}
            index={index}
          />
        ))}
      </Popover>
      <div
        className={`${classes.menuItem} ${classes.accountSettings}`}
        onClick={() => navigate(`/settings/user/${user.id}`)}
      >
        <ManageAccountsIcon />
        <span>Account Settings</span>
      </div>
    </div>
  );


  return (
    <div className={classes.mainContainer}>
      <nav className={classes.navbar} style={{ display: 'flex', alignItems: 'center !important', justifyContent: 'space-between' }}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              className={`${classes.menuButton} ${classes.addButton}`}
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </IconButton>
          <Base64Image
            base64String={companyLogo}
            altText={"Company Logo"}
            css={classes.logo}
          />
        </div>
        <div className={classes.rightSection} style={{ display: 'flex', alignItems: 'center !important', gap: '10px' }}>
          {isMediumScreen ? (
            <IconButton className={classes.addButton} onClick={toggleSearch}>
              <SearchIcon />
            </IconButton>
          ) : (
            <>
              <div ref={toolbarRef} className={classes.searchContainer} style={{ display: 'flex', alignItems: 'center !important' }}>
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
                        maxHeight: '220px',
                        overflowY: 'auto',
                      },
                    },
                  }}
                  elevation={1}
                  disableAutoFocus
                  disableEnforceFocus
                >
                  {filteredDevices.map((_, index) => (
                    <DeviceRow
                      key={filteredDevices[index].id}
                      data={filteredDevices}
                      index={index}
                    />
                  ))}
                  
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
          <IconButton
            onClick={() => navigate("/settings/device")}
            disabled={deviceReadonly}
            className={classes.addButton}
          >
            <Tooltip
              open={!deviceReadonly && Object.keys(devices).length === 0}
              title={t("deviceRegisterFirst")}
              arrow
            >
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
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(`/settings/user/${user.id}`);
              }}
              className={classes.menuItem}
            >
              Account
            </MenuItem>{" "}
            {admin && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate(`/branding`);
                }}
                className={classes.menuItem}
              >
                Branding Options
              </MenuItem>
            )}
            <MenuItem
              onClick={handleLogout}
              className={`${classes.menuItem} ${classes.logoutMenuItem}`}
            >
              Log out
            </MenuItem>
          </Menu>
        </div>
      </nav>
      <Paper 
        className={classes.sideDevices}
      >
        {filteredDevices.map((_, index) => (
          <DeviceRow
            key={filteredDevices[index].id}
            data={filteredDevices}
            index={index}
          />
        ))}
      </Paper>
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
                    invisible={!filter.statuses.length && !filter.groups.length}
                  >
                    <TuneIcon className={classes.configIcon} fontSize="small" />
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
            </div>
          </Drawer>
        </>
      ) : (
        <div
        style={{zIndex : 3}}>
        <Drawer
            anchor="left"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            variant="persistent"
            transitionDuration={300}
            SlideProps={{
              easing: theme.transitions.easing.easeInOut,
            }}
          >
        <SidebarContent />
        </Drawer>
        </div>
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
