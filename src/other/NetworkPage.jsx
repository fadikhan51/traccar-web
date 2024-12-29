import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import useStyles from '../common/theme/useGlobalStyles';
import { useRecoilState } from 'recoil';
import { colorsAtom } from '../recoil/atoms/colorsAtom';

const NetworkPage = () => {
  const [colors] = useRecoilState(colorsAtom);
  const classes = useStyles(colors)();
  const navigate = useNavigate();

  const { positionId } = useParams();

  const [item, setItem] = useState({});

  useEffectAsync(async () => {
    if (positionId) {
      const response = await fetch(`/api/positions?id=${positionId}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [positionId]);

  const deviceName = useSelector((state) => {
    if (item) {
      const device = state.devices.items[item.deviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  return (
    <div sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {deviceName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ overflow: 'auto', paddingTop: "1%", paddingBottom: "1%", display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Container maxWidth="sm">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MCC</TableCell>
                  <TableCell>MNC</TableCell>
                  <TableCell>LAC</TableCell>
                  <TableCell>CID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(item.network?.cellTowers || []).map((cell) => (
                  <TableRow key={cell.cellId}>
                    <TableCell>{cell.mobileCountryCode}</TableCell>
                    <TableCell>{cell.mobileNetworkCode}</TableCell>
                    <TableCell>{cell.locationAreaCode}</TableCell>
                    <TableCell>{cell.cellId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
        <Container maxWidth="sm">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MAC</TableCell>
                  <TableCell>RSSI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(item.network?.wifiAccessPoints || []).map((wifi) => (
                  <TableRow key={wifi.macAddress}>
                    <TableCell>{wifi.macAddress}</TableCell>
                    <TableCell>{wifi.signalStrength}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default NetworkPage;


// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';

// import {
//   Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffectAsync } from '../reactHelper';
// import useStyles from '../common/theme/useGlobalStyles';
// import { useRecoilState } from 'recoil';
// import { colorsAtom } from '../recoil/atoms/colorsAtom';

// const NetworkPage = () => {
//   const [colors] = useRecoilState(colorsAtom);
//   const classes = useStyles(colors)();
//   const navigate = useNavigate();

//   const { positionId } = useParams();

//   const [item, setItem] = useState({
//     network: {
//       cellTowers: [
//         { cellId: 1, mobileCountryCode: '234', mobileNetworkCode: '15', locationAreaCode: '1234' },
//         { cellId: 2, mobileCountryCode: '235', mobileNetworkCode: '16', locationAreaCode: '5678' },
//         { cellId: 3, mobileCountryCode: '236', mobileNetworkCode: '17', locationAreaCode: '9012' }
//       ],
//       wifiAccessPoints: [
//         { macAddress: '00:11:22:33:44:55', signalStrength: -65 },
//         { macAddress: 'AA:BB:CC:DD:EE:FF', signalStrength: -72 },
//         { macAddress: '11:22:33:44:55:66', signalStrength: -80 }
//       ]
//     },
//     deviceId: 'device1'
//   });

//   const deviceName = useSelector((state) => {
//     if (item) {
//       const device = state.devices.items[item.deviceId];
//       if (device) {
//         return device.name;
//       }
//     }
//     return 'Test Device';
//   });

//   return (
//     <div sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <AppBar position="sticky" color="inherit">
//         <Toolbar>
//           <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6">
//             {deviceName}
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <div style={{ overflow: 'auto', paddingTop: "1%", paddingBottom: "1%", display: 'flex', flexDirection: 'column', gap: 10 }}>
//         <Container maxWidth="sm">
//           <Paper>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>MCC</TableCell>
//                   <TableCell>MNC</TableCell>
//                   <TableCell>LAC</TableCell>
//                   <TableCell>CID</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {(item.network?.cellTowers || []).map((cell) => (
//                   <TableRow key={cell.cellId}>
//                     <TableCell>{cell.mobileCountryCode}</TableCell>
//                     <TableCell>{cell.mobileNetworkCode}</TableCell>
//                     <TableCell>{cell.locationAreaCode}</TableCell>
//                     <TableCell>{cell.cellId}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Paper>
//         </Container>
//         <Container maxWidth="sm">
//           <Paper>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>MAC</TableCell>
//                   <TableCell>RSSI</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {(item.network?.wifiAccessPoints || []).map((wifi) => (
//                   <TableRow key={wifi.macAddress}>
//                     <TableCell>{wifi.macAddress}</TableCell>
//                     <TableCell>{wifi.signalStrength}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Paper>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default NetworkPage;