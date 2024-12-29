import { atom } from 'recoil';

export const colorsAtom = atom({
  key: 'colorsAtom', // Unique identifier for this atom
  default: {
    primary: '#4fba96',
    secondary: '#7ccdb3',
    tertiary: '#66c4a4',
    accent: '#eef8f5',
    highlight: '#8fd3bc',
    muted: '#b7e2d3',
    shadow: 'rgba(79, 186, 150, 0.08)',
    white: '#FFFFFF',
    gray: '#E8E8E8',
    darkgray: '#4A4A4A',
    red: '#FF4444',
    active: true,
  },
});
