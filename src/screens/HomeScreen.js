// src/screens/HomeScreen.js
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, FlatList, Alert, StyleSheet, Text } from 'react-native';
import { Colors, Shadows } from '../theme';
import { SecHd } from '../components/Shared';
import { BOOKINGS, ROOMS, BRANCHES, QUICK_STATS } from '../data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStats } from '../../api/hooks/useApi';

// ── Home sub-components
import HeroSection from '../components/home/HeroSection';
import CalendarModal from '../components/home/CalendarModal';
import TimePickerModal from '../components/home/TimePickerModal';
import BranchModal from '../components/home/BranchModal';
import ParticipantsModal from '../components/home/ParticipantsModal';
import BookingCard from '../components/home/BookingCard';
import RoomCard from '../components/home/RoomCard';

// ─── Date helpers ────────────────────────────────────────────
const toDateStr = (d) => d.toISOString().split('T')[0];

const fmtLabel = (dateStr) => {
  if (!dateStr) return '—';
  const [, m, d] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]}`;
};

const buildRange = (start, end) => {
  if (!start) return {};
  const PRIMARY = Colors.primary;
  const marked = {};
  if (!end || start === end) {
    marked[start] = { startingDay: true, endingDay: true, color: PRIMARY, textColor: '#fff' };
    return marked;
  }
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    const key = toDateStr(cur);
    const isStart = key === start, isEnd = key === end;
    marked[key] = {
      startingDay: isStart, endingDay: isEnd,
      color: isStart || isEnd ? PRIMARY : PRIMARY + '33',
      textColor: isStart || isEnd ? '#fff' : Colors.txt,
    };
    cur.setDate(cur.getDate() + 1);
  }
  return marked;
};

// ─── Time helpers ────────────────────────────────────────────
const fmtTime = (h, m, ap) => `${h}:${m.toString().padStart(2, '0')} ${ap}`;

const timeDiffHrs = (sh, sm, sap, eh, em, eap) => {
  const toMins = (h, m, ap) => ((h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + m;
  const diff = toMins(eh, em, eap) - toMins(sh, sm, sap);
  return diff > 0 ? diff / 60 : 0;
};

// ─── Main Screen ─────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [participants, setParticipants] = useState(8);
  const [tempPart, setTempPart] = useState(8);

  // ── Date range
  const today = toDateStr(new Date());
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState('');
  const [dateStep, setDateStep] = useState('from');
  const [showCalModal, setShowCalModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // ── Time (stored as components for custom picker)
  const [startH, setStartH] = useState(10);
  const [startM, setStartM] = useState(0);
  const [startAP, setStartAP] = useState('AM');
  const [endH, setEndH] = useState(12);
  const [endM, setEndM] = useState(0);
  const [endAP, setEndAP] = useState('PM');

  // Custom time picker modal state
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeStep, setTimeStep] = useState('start');
  const [pickH, setPickH] = useState(10);
  const [pickM, setPickM] = useState(0);
  const [pickAP, setPickAP] = useState('AM');

  // Modal flags
  const [showBranch, setShowBranch] = useState(false);
  const [showPart, setShowPart] = useState(false);

  const upcomings = BOOKINGS.filter(b => b.status !== 'cancelled');

  const { data: statsData, isLoading: statsLoading, error: statsError } = useStats();

  // ── Room booking ─────────────────────────────────────────────
  const handleBookRoom = (room) => {
    if (!room.isAvailable) { Alert.alert('Unavailable', 'This room is currently busy.'); return; }
    navigation.navigate('BookRoom', { room });
  };

  // ── Calendar logic ──────────────────────────────────────────
  const onDayPress = (day) => {
    if (dateStep === 'from') {
      setFromDate(day.dateString); setToDate(''); setDateStep('to');
    } else {
      if (day.dateString < fromDate) {
        setFromDate(day.dateString); setToDate(''); setDateStep('to');
      } else {
        setToDate(day.dateString); setDateStep('from');
      }
    }
  };

  const confirmCalendar = () => {
    if (!toDate) setToDate(fromDate);
    setShowCalModal(false); setDateStep('from');
  };

  // ── Custom time picker logic ────────────────────────────────
  const openTimePicker = (step) => {
    if (step === 'start') {
      setPickH(startH); setPickM(startM); setPickAP(startAP);
    } else {
      setPickH(endH); setPickM(endM); setPickAP(endAP);
    }
    setTimeStep(step);
    setShowTimeModal(true);
  };

  const onNextOrConfirm = () => {
    if (timeStep === 'start') {
      setStartH(pickH); setStartM(pickM); setStartAP(pickAP);
      setPickH(endH); setPickM(endM); setPickAP(endAP);
      setTimeStep('end');
    } else {
      setEndH(pickH); setEndM(pickM); setEndAP(pickAP);
      setShowTimeModal(false);
    }
  };

  const onCancelTime = () => {
    if (timeStep === 'end') {
      setPickH(startH); setPickM(startM); setPickAP(startAP);
      setTimeStep('start');
    } else {
      setShowTimeModal(false);
    }
  };

  // ── Computed labels ──────────────────────────────────────────
  const markedDates = buildRange(fromDate, toDate);
  const dateLabel = toDate && toDate !== fromDate
    ? `${fmtLabel(fromDate)}  →  ${fmtLabel(toDate)}`
    : fmtLabel(fromDate);
  const timeLabel = `${fmtTime(startH, startM, startAP)}  →  ${fmtTime(endH, endM, endAP)}`;

  // Lazy-load Calendar
  let CalendarComponent = null;
  if (showCalModal) {
    try { CalendarComponent = require('react-native-calendars').Calendar; } catch (_) { }
  }

  // ── Sliver / collapsing hero ──────────────────────────────
  const HERO_MAX = 520;
  const HERO_MIN = 88;
  const SCROLL_DIST = HERO_MAX - HERO_MIN;
  const scrollY = useRef(new Animated.Value(0)).current;

  const heroHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DIST],
    outputRange: [HERO_MAX, HERO_MIN],
    extrapolate: 'clamp',
  });
  const formOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DIST * 0.55],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

 

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>

      {/* ── COLLAPSING HERO ── */}
      <HeroSection
        heroHeight={heroHeight}
        formOpacity={formOpacity}
        branch={branch}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        toDate={toDate}
        fromDate={fromDate}
        participants={participants}
        onBranchPress={() => setShowBranch(true)}
        onDatePress={() => setShowCalModal(true)}
        onTimePress={() => openTimePicker('start')}
        onParticipantsPress={() => { setTempPart(participants); setShowPart(true); }}
        onFindRooms={() => navigation.navigate('Explore')}
      />

      {/* ── SCROLLABLE CONTENT ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HERO_MAX,
          paddingBottom: 90 + insets.bottom // Dynamic padding for floating nav
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* ── QUICK STATS ── */}
        <View style={S.statsRow}>
          {QUICK_STATS.map((s, i) => (
            <View key={i} style={[S.statCard, Shadows.card]}>
              <Text style={[S.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={S.statLbl}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* ── UPCOMING BOOKINGS ── */}
        <View style={S.sec}>
          <SecHd title="Upcoming Bookings 🔔" action="See all"
            onAction={() => navigation.navigate('Bookings')} />
          <FlatList horizontal showsHorizontalScrollIndicator={false}
            data={upcomings} keyExtractor={i => i.id}
            ItemSeparatorComponent={() => <View style={{ width: 11 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('BookingDetail', { booking: item })} activeOpacity={0.85}>
                <BookingCard booking={item} />
              </TouchableOpacity>
            )} />
        </View>

        {/* ── AVAILABLE ROOMS ── */}
        <View style={S.sec}>
          <SecHd title="Available Now ✨" action="See all"
            onAction={() => navigation.navigate('Explore')} />
          {ROOMS.slice(0, 3).map(room => (
            <TouchableOpacity key={room.id} onPress={() => handleBookRoom(room)}
              activeOpacity={0.85} style={{ marginBottom: 10 }}>
              <RoomCard room={room} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* ── MODALS ── */}
      <CalendarModal
        visible={showCalModal}
        showCalendar={showCalendar}
        CalendarComponent={CalendarComponent}
        fromDate={fromDate}
        toDate={toDate}
        today={today}
        dateStep={dateStep}
        markedDates={markedDates}
        onDayPress={onDayPress}
        onShow={() => setShowCalendar(true)}
        onConfirm={confirmCalendar}
        onCancel={() => { setShowCalModal(false); setShowCalendar(false); setDateStep('from'); }}
      />

      <TimePickerModal
        visible={showTimeModal}
        timeStep={timeStep}
        pickH={pickH} pickM={pickM} pickAP={pickAP}
        startH={startH} startM={startM} startAP={startAP}
        endH={endH} endM={endM} endAP={endAP}
        onIncH={() => setPickH(h => h >= 12 ? 1 : h + 1)}
        onDecH={() => setPickH(h => h <= 1 ? 12 : h - 1)}
        onIncM={() => setPickM(m => m >= 55 ? 0 : m + 5)}
        onDecM={() => setPickM(m => m <= 0 ? 55 : m - 5)}
        onSetAP={setPickAP}
        onNextOrConfirm={onNextOrConfirm}
        onCancel={onCancelTime}
      />

      <BranchModal
        visible={showBranch}
        branches={BRANCHES}
        selected={branch}
        onSelect={setBranch}
        onClose={() => setShowBranch(false)}
      />

      <ParticipantsModal
        visible={showPart}
        tempPart={tempPart}
        onDecrement={() => setTempPart(p => Math.max(1, p - 1))}
        onIncrement={() => setTempPart(p => Math.min(100, p + 1))}
        onConfirm={() => { setParticipants(tempPart); setShowPart(false); }}
        onClose={() => setShowPart(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const S = StyleSheet.create({
  statsRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    gap: 8, marginTop: '2%', marginLeft: '2%', marginRight: '2%',
  },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 15, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statNum: { fontSize: 22, fontWeight: '700', lineHeight: 24 },
  statLbl: { fontSize: 9.5, color: Colors.txt2, fontWeight: '500', letterSpacing: 0.3, marginTop: 3, textAlign: 'center' },
  sec: { paddingHorizontal: 18, marginTop: 22 },
});
