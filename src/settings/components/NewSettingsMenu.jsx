import React from 'react';
import SimpleBar from 'simplebar-react';
import {
  Divider, List,
} from '@mui/material';

import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import HelpIcon from '@mui/icons-material/Help';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';
import MenuItem from '../../common/components/MenuItem';
import { BlurOnRounded, BookmarkBorderRounded, EditNoteRounded, QueryBuilderRounded } from '@mui/icons-material';

const NewSettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const manager = useManager();
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);

  const features = useFeatures();

  return (
    <>
      <List>
        <MenuItem
          title={t('sharedPreferences')}
          link="/settings/preferences"
          icon={<PublishedWithChangesRoundedIcon fontSize="small" />}
          selected={location.pathname === '/settings/preferences'}
        />
        {!readonly && (
          <>
            <MenuItem
              title={t('sharedNotifications')}
              link="/settings/notifications"
              icon={<NotificationsNoneRoundedIcon fontSize="small" />}
              selected={location.pathname.startsWith('/settings/notification')}
            />
            <MenuItem
              title={t('settingsUser')}
              link={`/settings/user/${userId}`}
              icon={<PersonOutlineRoundedIcon fontSize="small" />}
              selected={location.pathname === `/settings/user/${userId}`}
            />
            <MenuItem
              title={t('deviceTitle')}
              link="/settings/devices"
              icon={<DevicesRoundedIcon fontSize="small" />}
              selected={location.pathname.startsWith('/settings/device')}
            />
            <MenuItem
              title={t('sharedGeofences')}
              link="/geofences"
              icon={<EditNoteRoundedIcon fontSize="small" />}
              selected={location.pathname.startsWith('/settings/geofence')}
            />
            {!features.disableGroups && (
              <MenuItem
                title={t('settingsGroups')}
                link="/settings/groups"
                icon={<FolderOpenRoundedIcon fontSize="small" />}
                selected={location.pathname.startsWith('/settings/group')}
                />
              )}
            {!features.disableDrivers && (
              <MenuItem
              title={t('sharedDrivers')}
              link="/settings/drivers"
              icon={<Groups2RoundedIcon fontSize="small" />}
                selected={location.pathname.startsWith('/settings/driver')}
              />
            )}
            {!features.disableCalendars && (
              <MenuItem
                title={t('sharedCalendars')}
                link="/settings/calendars"
                icon={<TodayIcon fontSize="small" />}
                selected={location.pathname.startsWith('/settings/calendar')}
              />
            )}
            {!features.disableComputedAttributes && (
              <MenuItem
                title={t('sharedComputedAttributes')}
                link="/settings/attributes"
                icon={<BlurOnRoundedIcon fontSize="small" />}
                selected={location.pathname.startsWith('/settings/attribute')}
              />
            )}
            {!features.disableMaintenance && (
              <MenuItem
                title={t('sharedMaintenance')}
                link="/settings/maintenances"
                icon={<QueryBuilderRoundedIcon fontSize="small" />}
                selected={location.pathname.startsWith('/settings/maintenance')}
              />
            )}
            {!features.disableSavedCommands && (
              <MenuItem
                title={t('sharedSavedCommands')}
                link="/settings/commands"
                icon={<BookmarkBorderRoundedIcon fontSize="small" />}
                selected={location.pathname.startsWith('/settings/command')}
              />
            )}
            {supportLink && (
              <MenuItem
                title={t('settingsSupport')}
                link={supportLink}
                icon={<HelpIcon fontSize="small" />}
              />
            )}
          </>
        )}
      </List>
      {manager && (
        <>
          <Divider />
          <List>
            <MenuItem
              title={t('serverAnnouncement')}
              link="/settings/announcement"
              icon={<CampaignRoundedIcon fontSize="small" />}
              selected={location.pathname === '/settings/announcement'}
            />
            {admin && (
              <MenuItem
                title={t('settingsServer')}
                link="/settings/server"
                icon={<FolderOpenRoundedIcon fontSize="small" />}
                selected={location.pathname === '/settings/server'}
              />
            )}
            <MenuItem
              title={t('settingsUsers')}
              link="/settings/users"
              icon={<PeopleIcon fontSize="small" />}
              selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
            />
          </List>
        </>
      )}
    </>
  );
};

export default NewSettingsMenu;