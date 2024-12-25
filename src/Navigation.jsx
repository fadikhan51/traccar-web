import React, { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import NewRegisterPage from "./login/NewRegisterPage";
import NewLoginPage from "./login/newLoginPage";
import NewResetPasswordPage from "./login/newResetPasswordPage";
import NewMainPage from "./main/newMainPage";
import MainPage from "./main/MainPage";
import CombinedReportPage from "./reports/CombinedReportPage";
import RouteReportPage from "./reports/RouteReportPage";

import ServerPage from "./settings/ServerPage";
import NewServerPage from "./settings/NewServerPage";

import UsersPage from "./settings/UsersPage";

import DevicePage from "./settings/DevicePage";
import NewDevicePage from "./settings/NewDevicePage";

import UserPage from "./settings/UserPage";

import NewUserPage from "./settings/NewUserPage";
import NotificationsPage from "./settings/NotificationsPage";
import NewNotificationsPage from "./settings/NewNotificationsPage";

import NotificationPage from "./settings/NotificationPage";
import NewNotificationPage from "./settings/NewNotificationPage";

import GroupsPage from "./settings/GroupsPage";
import NewGroupsPage from "./settings/NewGroupsPage";

import GroupPage from "./settings/GroupPage";
import PositionPage from "./other/PositionPage";
import NetworkPage from "./other/NetworkPage";
import EventReportPage from "./reports/EventReportPage";
import ReplayPage from "./other/ReplayPage";
import TripReportPage from "./reports/TripReportPage";
import StopReportPage from "./reports/StopReportPage";
import SummaryReportPage from "./reports/SummaryReportPage";
import ChartReportPage from "./reports/ChartReportPage";

import NewDriversPage from "./settings/NewDriversPage";
import DriversPage from "./settings/DriversPage";
import DriverPage from "./settings/DriverPage";

import CalendarsPage from "./settings/CalendarsPage";
import NewCalendarsPage from "./settings/NewCalendarsPage";

import CalendarPage from "./settings/CalendarPage";

import NewComputedAttributesPage from "./settings/NewComputedAttributesPage";
import ComputedAttributesPage from "./settings/ComputedAttributesPage";
import ComputedAttributePage from "./settings/ComputedAttributePage";

import NewMaintenacesPage from "./settings/NewMaintenancesPage";
import MaintenancesPage from "./settings/MaintenancesPage";
import MaintenancePage from "./settings/MaintenancePage";

import NewCommandsPage from "./settings/NewCommandsPage";
import CommandsPage from "./settings/CommandsPage";
import CommandPage from "./settings/CommandPage";

import StatisticsPage from "./reports/StatisticsPage";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";
import ResetPasswordPage from "./login/ResetPasswordPage";
import GeofencesPage from "./other/GeofencesPage";
import GeofencePage from "./settings/GeofencePage";
import useQuery from "./common/util/useQuery";
import { useEffectAsync } from "./reactHelper";
import { devicesActions } from "./store";
import EventPage from "./other/EventPage";
import PreferencesPage from "./settings/PreferencesPage";
import NewPreferencesPage from "./settings/NewPreferencesPage";
import AccumulatorsPage from "./settings/AccumulatorsPage";
import CommandDevicePage from "./settings/CommandDevicePage";
import CommandGroupPage from "./settings/CommandGroupPage";
import App from "./App";
import ChangeServerPage from "./login/ChangeServerPage";

import NewDevicesPage from "./settings/NewDevicesPage";
import DevicesPage from "./settings/DevicesPage";

import ScheduledPage from "./reports/ScheduledPage";

import NewDeviceConnectionsPage from './settings/NewDeviceConnectionsPage';
import DeviceConnectionsPage from "./settings/DeviceConnectionsPage";
import GroupConnectionsPage from "./settings/GroupConnectionsPage";
import UserConnectionsPage from "./settings/UserConnectionsPage";
import LogsPage from "./reports/LogsPage";
import SharePage from "./settings/SharePage";

import AnnouncementPage from "./settings/AnnouncementPage";
import NewAnnouncementPage from "./settings/NewAnnouncementPage";

import EmulatorPage from "./other/EmulatorPage";
import Loader from "./common/components/Loader";

import BrandingOptions from "./main/BrandingOptions";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [redirectsHandled, setRedirectsHandled] = useState(false);

  const { pathname } = useLocation();
  const query = useQuery();

  useEffectAsync(async () => {
    if (query.get("token")) {
      const token = query.get("token");
      await fetch(`/api/session?token=${encodeURIComponent(token)}`);
      navigate(pathname);
    } else if (query.get("deviceId")) {
      const deviceId = query.get("deviceId");
      const response = await fetch(`/api/devices?uniqueId=${deviceId}`);
      if (response.ok) {
        const items = await response.json();
        if (items.length > 0) {
          dispatch(devicesActions.selectId(items[0].id));
        }
      } else {
        throw Error(await response.text());
      }
      navigate("/");
    } else if (query.get("eventId")) {
      const eventId = parseInt(query.get("eventId"), 10);
      navigate(`/event/${eventId}`);
    } else {
      setRedirectsHandled(true);
    }
  }, [query]);

  if (!redirectsHandled) {
    return <Loader />;
  }
  return (
    <Routes>
      <Route path="/test-login" element={<NewLoginPage />} />
      <Route path="/test-register" element={<NewRegisterPage />} />
      <Route path="/test-reset-password" element={<NewResetPasswordPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/change-server" element={<ChangeServerPage />} />
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="/test-main" element={<NewMainPage />} />
        <Route path="/branding" element={<BrandingOptions />} />

        <Route path="position/:id" element={<PositionPage />} />
        <Route path="network/:positionId" element={<NetworkPage />} />
        <Route path="event/:id" element={<EventPage />} />
        <Route path="replay" element={<ReplayPage />} />
        <Route path="geofences" element={<GeofencesPage />} />
        <Route path="emulator" element={<EmulatorPage />} />

        <Route path="settings">
          <Route path="accumulators/:deviceId" element={<AccumulatorsPage />} />
          <Route path="announcement" element={<AnnouncementPage />} />
          <Route path="newannouncement" element={<NewAnnouncementPage />} />

          {/* <Route path="newcalendars" element={<NewCalendarsPage />} /> */}
          <Route path="calendars" element={<NewCalendarsPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="calendar" element={<CalendarPage />} />

          {/* Commands Pages */}
          {/* <Route path="newcommands" element={<NewCommandsPage />} /> */}
          <Route path="commands" element={<NewCommandsPage />} />
          <Route path="command/:id" element={<CommandPage />} />
          <Route path="command" element={<CommandPage />} />

          {/* <Route path="newattributes" element={<NewComputedAttributesPage />} /> */}
          <Route path="attributes" element={<NewComputedAttributesPage />} />
          <Route path="attribute/:id" element={<ComputedAttributePage />} />
          <Route path="attribute" element={<ComputedAttributePage />} />

          {/* <Route path="newdevices" element={<NewDevicesPage />} /> */}
          <Route path="devices" element={<NewDevicesPage />} />

          {/* <Route
            path="device/:id/connections"
            element={<DeviceConnectionsPage />}
          /> */}
          <Route
            path="device/:id/connections"
            element={<NewDeviceConnectionsPage />}
          />

          <Route path="device/:id/command" element={<CommandDevicePage />} />
          <Route path="device/:id/share" element={<SharePage />} />

          {/* <Route path="device/:id" element={<DevicePage />} /> */}
          <Route path="device/:id" element={<NewDevicePage />} /> 
          <Route path="device" element={<NewDevicePage />} />
          
          {/* Drivers Pages */}
          {/* <Route path="newdrivers" element={<NewDriversPage />} /> */}
          <Route path="drivers" element={<NewDriversPage />} />
          <Route path="driver/:id" element={<DriverPage />} />
          <Route path="driver" element={<DriverPage />} />

          <Route path="geofence/:id" element={<GeofencePage />} />
          <Route path="geofence" element={<GeofencePage />} />

          {/* Group Pages */}
          {/* <Route path="newgroups" element={<NewGroupsPage />} /> */}
          <Route path="groups" element={<NewGroupsPage />} />

          <Route
            path="group/:id/connections"
            element={<GroupConnectionsPage />}
          />
          <Route path="group/:id/command" element={<CommandGroupPage />} />
          <Route path="group/:id" element={<GroupPage />} />
          <Route path="group" element={<GroupPage />} />

          {/* <Route path="newmaintenances" element={<NewMaintenacesPage />} /> */}
          <Route path="maintenances" element={<NewMaintenacesPage />} />
          <Route path="maintenance/:id" element={<MaintenancePage />} />
          <Route path="maintenance" element={<MaintenancePage />} />

          <Route path="notifications" element={<NewNotificationsPage />} />
          {/* <Route path="newnotifications" element={<NewNotificationsPage />} /> */}
          
          {/* <Route path="notification/:id" element={<NotificationPage />} /> */}
          <Route path="notification/:id" element={<NewNotificationPage />} />

          {/* <Route path="newnotification" element={<NewNotificationPage />} /> */}
          <Route path="notification" element={<NewNotificationPage />} />
          
          <Route path="preferences" element={<NewPreferencesPage />} />  {/* Done */}
          {/* <Route path="new-preferences" element={<NewPreferencesPage />} /> */}

          {/* <Route path="newserver" element={<NewServerPage />} /> */}
          <Route path="server" element={<NewServerPage />} />  {/* Done */}

          {/* Users Pages */}
          <Route path="users" element={<UsersPage />} />
          <Route
            path="user/:id/connections"
            element={<UserConnectionsPage />}
          />
          {/* Single User */}
          <Route path="user/:id" element={<NewUserPage />} />
          {/* <Route path="newuser/:id" element={<NewUserPage />} /> */}
          <Route path="user" element={<NewUserPage />} />
        </Route>

        <Route path="reports">
          <Route path="combined" element={<CombinedReportPage />} />
          <Route path="chart" element={<ChartReportPage />} />
          <Route path="event" element={<EventReportPage />} />
          <Route path="route" element={<RouteReportPage />} />
          <Route path="stop" element={<StopReportPage />} />
          <Route path="summary" element={<SummaryReportPage />} />
          <Route path="trip" element={<TripReportPage />} />
          <Route path="scheduled" element={<ScheduledPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
