// src/data/index.js





export const BOOKINGS = [
  {
    id: '1', room: 'Orion Meeting Room', location: 'HQ – Andheri East',
    date: 'Mon, 26 Feb 2025', day: '26', month: 'FEB',
    timeRange: '10:00 AM – 12:00 PM', duration: '2h',
    attendeeCount: 8, avatars: ['JM', 'AS', 'RK', '+5'], status: 'upcoming',
    bookedBy: 'me',
  },
  {
    id: '2', room: 'Nebula Conference', location: 'Powai – Floor 3',
    date: 'Wed, 28 Feb 2025', day: '28', month: 'FEB',
    timeRange: '2:00 PM – 5:00 PM', duration: '3h',
    attendeeCount: 16, avatars: ['JM', 'PD', '+14'], status: 'ongoing',
    bookedBy: 'me',
  },
  {
    id: '3', room: 'Atlas Private Cabin', location: 'HQ – Andheri East',
    date: 'Fri, 23 Feb 2025', day: '23', month: 'FEB',
    timeRange: '9:00 AM – 11:00 AM', duration: '2h',
    attendeeCount: 2, avatars: ['JM', 'SR'], status: 'cancelled',
    bookedBy: 'me',
  },
  {
    id: '4', room: 'Zenith Boardroom', location: 'BKC – Tower C',
    date: 'Thu, 6 Mar 2025', day: '6', month: 'MAR',
    timeRange: '11:00 AM – 1:00 PM', duration: '2h',
    attendeeCount: 12, avatars: ['JM', 'TK', 'MD', '+9'], status: 'past',
    bookedBy: 'me',
  },
  {
    id: '5', room: 'Sirius Meeting Room', location: 'Powai – Floor 3',
    date: 'Tue, 27 Feb 2025', day: '27', month: 'FEB',
    timeRange: '9:00 AM – 10:00 AM', duration: '1h',
    attendeeCount: 5, avatars: ['PD', 'SR', 'TK', '+2'], status: 'upcoming',
    bookedBy: 'other',
  },
  {
    id: '6', room: 'Lyra Private Cabin', location: 'HQ – Andheri East',
    date: 'Mon, 24 Feb 2025', day: '24', month: 'FEB',
    timeRange: '3:00 PM – 4:00 PM', duration: '1h',
    attendeeCount: 3, avatars: ['AS', 'RK', 'MD'], status: 'ongoing',
    bookedBy: 'other',
  },
  {
    id: '7', room: 'Vega Training Room', location: 'Bangalore – Koramangala',
    date: 'Sat, 22 Feb 2025', day: '22', month: 'FEB',
    timeRange: '10:00 AM – 2:00 PM', duration: '4h',
    attendeeCount: 20, avatars: ['TK', '+19'], status: 'past',
    bookedBy: 'other',
  },
  {
    id: '8', room: 'Andromeda Hot Desk', location: 'Pune – Hinjewadi Phase 1',
    date: 'Thu, 20 Feb 2025', day: '20', month: 'FEB',
    timeRange: '8:00 AM – 9:00 AM', duration: '1h',
    attendeeCount: 1, avatars: ['SR'], status: 'cancelled',
    bookedBy: 'other',
  },
];

export const ROOMS = [
  {
    id: '1', name: 'Sirius Meeting Room', floor: 'Floor 4, Tower A',
    theme: 'blue', tags: ['Video Call', 'Whiteboard', 'AC'],
    capacity: 10, isAvailable: true,
  },
  {
    id: '2', name: 'Vega Training Room', floor: 'Floor 2, Tower B',
    theme: 'teal', tags: ['Projector', 'Flip Chart', 'Mic'],
    capacity: 30, isAvailable: true,
  },
  {
    id: '3', name: 'Lyra Private Cabin', floor: 'Floor 5, Executive Wing',
    theme: 'purple', tags: ['Smart TV', 'Standing Desk'],
    capacity: 4, isAvailable: true,
  },
  {
    id: '4', name: 'Andromeda Hot Desk', floor: 'Floor 1, Open Area',
    theme: 'blue', tags: ['Fast WiFi', 'Charging'],
    capacity: 1, isAvailable: false,
  },
  {
    id: '5', name: 'Zenith Boardroom', floor: 'Floor 7, Executive Suite',
    theme: 'teal', tags: ['Video Wall', 'Catering', 'Secretariat'],
    capacity: 20, isAvailable: true,
  },
  {
    id: '6', name: 'Orion Pod', floor: 'Floor 3, Collaboration Zone',
    theme: 'purple', tags: ['Writable Wall', 'Lounge Seating'],
    capacity: 6, isAvailable: true,
  },
];

export const AMENITIES = [
  'Video Call', 'Whiteboard', 'Projector',
  'Coffee/Tea', 'Catering', 'Lounge Setup', 'Recording',
];

export const TIME_SLOTS_START = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];
export const TIME_SLOTS_END = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

export const FILTER_CHIPS = [
  'All', 'Meeting Room', 'Conference', 'Private Cabin', 'Hot Desk', 'Training',
];

export const NOTIFICATIONS = [
  { id: '1', icon: '🔔', color: '#1A4D8F', title: 'Booking Confirmed', sub: 'Orion Meeting Room · Mon 26 Feb 10:00 AM', time: '2 min ago', unread: true },
  { id: '2', icon: '⏰', color: '#F59E0B', title: 'Reminder: Meeting in 30m', sub: 'Nebula Conference · Wed 28 Feb 2:00 PM', time: '28 min ago', unread: true },
  { id: '3', icon: '❌', color: '#EF4444', title: 'Booking Cancelled', sub: 'Atlas Private Cabin · Fri 23 Feb 9:00 AM', time: '1 hour ago', unread: false },
  { id: '4', icon: '✅', color: '#10B981', title: 'Check-in Successful', sub: 'Sirius Meeting Room · Floor 4, Tower A', time: 'Yesterday', unread: false },
  { id: '5', icon: '✏️', color: '#7C3AED', title: 'Booking Modified', sub: 'Zenith Boardroom · Thu 6 Mar 11:00 AM', time: '2 days ago', unread: false },
];

export const PROFILE_MENU = [
  { id: '2', icon: '📅', color: '#0AAFA0', label: 'Booking History' },
  { id: '4', icon: '🔒', color: '#7C3AED', label: 'Privacy & Security' },
];




// ── Helpers ────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fmtDate = (d) =>
  `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;

export const fmtDateFull = (d) =>
  `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export const toMins = (t) => {
  const [hm, p] = t.split(' ');
  const [h, m] = hm.split(':').map(Number);
  return (h % 12 + (p === 'PM' ? 12 : 0)) * 60 + m;
};

export const calcDuration = (s, e) => {
  const d = toMins(e) - toMins(s);
  return d > 0 ? d / 60 : 1;
};

export const randomId = () =>
  `#WS-2025-0${10 + Math.floor(Math.random() * 89)}`;
