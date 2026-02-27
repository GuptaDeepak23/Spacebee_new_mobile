import { Platform } from 'react-native';

export const Colors = {
  primary: '#22BF96',
  primaryDark: '#22BF96',
  primaryLight: '#45c6a4ff',
  teal: '#0AAFA0',
  tealLight: '#E0F7F5',
  mint: '#12C9B8',
  green: '#1DB954',
  greenDark: '#15A349',
  bg: '#F0F4F8',
  white: '#FFFFFF',
  txt: '#0D1B2A',
  txt2: '#6B7C93',
  txt3: '#A0AFBE',
  border: '#E2EAF4',
  sGreen: '#10B981',
  sYellow: '#F59E0B',
  sRed: '#EF4444',
  purple: '#7C3AED',
};

export const Gradients = {
  hero: ['#0F2F28', '#0d352bff', '#1C4A3D'],
  blue: ['#1A4D8F', '#2E6BB5'],
  teal: ['#0AAFA0', '#0D8A7C'],
  purple: ['#7C3AED', '#A855F7'],
  green: ['#1DB954', '#15A349'],
  avatar: ['#0AAFA0', '#12C9B8'],
};

export const roomColors = (theme) => {
  if (theme === 'teal') return Gradients.teal;
  if (theme === 'purple') return Gradients.purple;
  return Gradients.blue;
};

export const statusStyle = (status) => {
  switch (status) {
    case 'confirmed':
    case 'upcoming':
      return { bg: '#EBF2FC', txt: '#1A4D8F', bar: ['#1A4D8F', '#2E6BB5'] };
    case 'ongoing':
      return { bg: '#D1FAE5', txt: '#065F46', bar: ['#10B981', '#34D399'] };
    case 'pending':
      return { bg: '#FEF3C7', txt: '#92400E', bar: ['#F59E0B', '#FBBF24'] };
    case 'past':
      return { bg: '#F3F4F6', txt: '#6B7280', bar: ['#9CA3AF', '#D1D5DB'] };
    case 'cancelled':
    default:
      return { bg: '#FEE2E2', txt: '#991B1B', bar: ['#EF4444', '#F87171'] };
  }
};

const iosShadow = (color, height, opacity, radius) =>
  Platform.OS === 'ios'
    ? { shadowColor: color, shadowOffset: { width: 0, height }, shadowOpacity: opacity, shadowRadius: radius }
    : {};

export const Shadows = {
  card: {
    ...iosShadow('#1A4D8F', 4, 0.10, 10),
    elevation: 4,
  },
  lg: {
    ...iosShadow('#1A4D8F', 8, 0.16, 20),
    elevation: 8,
  },
  green: {
    ...iosShadow('#1DB954', 6, 0.30, 10),
    elevation: 6,
  },
  nav: {
    ...iosShadow('#1A4D8F', -4, 0.07, 10),
    elevation: 8,
  },
};

export const AVATAR_PALETTE = [
  ['#6366F1', '#8B5CF6'],
  ['#0AAFA0', '#12C9B8'],
  ['#F59E0B', '#EF4444'],
  ['#1A4D8F', '#2E6BB5'],
];
