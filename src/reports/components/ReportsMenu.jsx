import React from 'react';
import { Divider, List } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TimelineIcon from '@mui/icons-material/Timeline';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import RouteIcon from '@mui/icons-material/Route';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import NotesIcon from '@mui/icons-material/Notes';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAdministrator, useRestriction } from '../../common/util/permissions';
import MenuItem from '../../common/components/MenuItem';

import MergeTypeRoundedIcon from '@mui/icons-material/MergeTypeRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ModeOfTravelRoundedIcon from '@mui/icons-material/ModeOfTravelRounded';
import PivotTableChartRoundedIcon from '@mui/icons-material/PivotTableChartRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';

const ReportsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const admin = useAdministrator();
  const readonly = useRestriction('readonly');

  return (
    <>
      <List>
        <MenuItem
          title={t('reportCombined')}
          link="/reports/combined"
          icon={<MergeTypeRoundedIcon />}
          selected={location.pathname === '/reports/combined'}
        />
        <MenuItem
          title={t('reportRoute')}
          link="/reports/route"
          icon={<RouteRoundedIcon />}
          selected={location.pathname === '/reports/route'}
        />
        <MenuItem
          title={t('reportEvents')}
          link="/reports/event"
          icon={<TodayRoundedIcon />}
          selected={location.pathname === '/reports/event'}
        />
        <MenuItem
          title={t('reportTrips')}
          link="/reports/trip"
          icon={<ModeOfTravelRoundedIcon />}
          selected={location.pathname === '/reports/trip'}
        />
        <MenuItem
          title={t('reportStops')}
          link="/reports/stop"
          icon={<CancelPresentationRoundedIcon />}
          selected={location.pathname === '/reports/stop'}
        />
        <MenuItem
          title={t('reportSummary')}
          link="/reports/summary"
          icon={<SummarizeRoundedIcon />}
          selected={location.pathname === '/reports/summary'}
        />
        <MenuItem
          title={t('reportChart')}
          link="/reports/chart"
          icon={<BarChartRoundedIcon />}
          selected={location.pathname === '/reports/chart'}
        />
        <MenuItem
          title={t('reportReplay')}
          link="/replay"
          icon={<ReplayRoundedIcon />}
        />
      </List>
      <Divider />
      <List>
        <MenuItem
          title={t('sharedLogs')}
          link="/reports/logs"
          icon={<DescriptionRoundedIcon />}
          selected={location.pathname === '/reports/logs'}
        />
        {!readonly && (
          <MenuItem
            title={t('reportScheduled')}
            link="/reports/scheduled"
            icon={<ScheduleRoundedIcon />}
            selected={location.pathname === '/reports/scheduled'}
          />
        )}
        {admin && (
          <MenuItem
            title={t('statisticsTitle')}
            link="/reports/statistics"
            icon={<PivotTableChartRoundedIcon />}
            selected={location.pathname === '/reports/statistics'}
          />
        )}
      </List>
    </>
  );
};

export default ReportsMenu;
