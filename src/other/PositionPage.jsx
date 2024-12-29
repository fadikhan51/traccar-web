import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PositionValue from '../common/components/PositionValue';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import useStyles from "../common/theme/useGlobalStyles";
import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

const PositionPage = () => {
  const [doc_colors, setDoc_Colors] = useRecoilState(colorsAtom);
  const classes = useStyles(doc_colors)();
  const navigate = useNavigate();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const { id } = useParams();

  const [item, setItem] = useState();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/positions?id=${id}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [id]);

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
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
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
      <div style={{
    overflow: 'auto',
    paddingTop: '20px',
    paddingBottom: '20px',
  }}>
        <Container maxWidth="md">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('stateName')}</TableCell>
                  <TableCell>{t('sharedName')}</TableCell>
                  <TableCell>{t('stateValue')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item && Object.getOwnPropertyNames(item).filter((it) => it !== 'attributes').map((property) => (
                  <TableRow key={property}>
                    <TableCell>{property}</TableCell>
                    <TableCell><strong>{positionAttributes[property]?.name}</strong></TableCell>
                    <TableCell><PositionValue position={item} property={property} /></TableCell>
                  </TableRow>
                ))}
                {item && Object.getOwnPropertyNames(item.attributes).map((attribute) => (
                  <TableRow key={attribute}>
                    <TableCell>{attribute}</TableCell>
                    <TableCell><strong>{positionAttributes[attribute]?.name}</strong></TableCell>
                    <TableCell><PositionValue position={item} attribute={attribute} /></TableCell>
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

export default PositionPage;


// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';

// import {
//   Typography, Container, Paper, AppBar, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
// } from '@mui/material';
// import makeStyles from '@mui/styles/makeStyles';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffectAsync } from '../reactHelper';
// import { useTranslation } from '../common/components/LocalizationProvider';
// import PositionValue from '../common/components/PositionValue';
// import usePositionAttributes from '../common/attributes/usePositionAttributes';




// // const useStyles = makeStyles((theme) => ({
// //   root: {
// //     height: '100%',
// //     display: 'flex',
// //     flexDirection: 'column',
// //   },
// //   content: {
// //     overflow: 'auto',
// //     paddingTop: theme.spacing(2),
// //     paddingBottom: theme.spacing(2),
// //   },
// // }));

// const PositionPage = () => {
//   const [doc_colors, setDoc_Colors] = useRecoilState(colorsAtom);
//   const classes = useStyles(doc_colors)();
//   const navigate = useNavigate();
//   const t = useTranslation();

//   const positionAttributes = usePositionAttributes(t);

//   const { id } = useParams();

//   const [item, setItem] = useState();

//   useEffectAsync(async () => {
//     if (id) {
//       // Using dummy data instead of fetch
//       const dummyPosition = {
//         id: 1,
//         deviceId: 1,
//         latitude: 51.5074,
//         longitude: -0.1278,
//         speed: 60,
//         course: 180,
//         altitude: 100,
//         accuracy: 10,
//         attributes: {
//           batteryLevel: 85,
//           temperature: 25,
//           fuel: 75
//         }
//       };
//       setItem(dummyPosition);
//     }
//   }, [id]);

//   const deviceName = useSelector((state) => {
//     if (item) {
//       // Using dummy device name
//       return "Dummy Device";
//     }
//     return null;
//   });

//   return (
//     <div className={classes.root}>
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
//       <div style={{
//     overflow: 'auto',
//     paddingTop: '20px',
//     paddingBottom: '20px',
//   }}>
//         <Container maxWidth="sm">
//           <Paper>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>{t('stateName')}</TableCell>
//                   <TableCell>{t('sharedName')}</TableCell>
//                   <TableCell>{t('stateValue')}</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {item && Object.getOwnPropertyNames(item).filter((it) => it !== 'attributes').map((property) => (
//                   <TableRow key={property}>
//                     <TableCell>{property}</TableCell>
//                     <TableCell><strong>{positionAttributes[property]?.name}</strong></TableCell>
//                     <TableCell><PositionValue position={item} property={property} /></TableCell>
//                   </TableRow>
//                 ))}
//                 {item && Object.getOwnPropertyNames(item.attributes).map((attribute) => (
//                   <TableRow key={attribute}>
//                     <TableCell>{attribute}</TableCell>
//                     <TableCell><strong>{positionAttributes[attribute]?.name}</strong></TableCell>
//                     <TableCell><PositionValue position={item} attribute={attribute} /></TableCell>
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

// export default PositionPage;