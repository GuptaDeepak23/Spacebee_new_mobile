// src/screens/HomeScreen.js
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, FlatList, Alert, StyleSheet, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors, Shadows, IS_TABLET } from '../theme';

import { SecHd } from '../components/Shared';
import { ROOMS } from '../data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStats, useBranch, useFindAvailableRoom, useMyBookingHome, useExploreRooms, useUpdateActiveBranch, usecancelbooking } from '../../api/hooks/useApi';



// ── Home sub-components
import HeroSection from '../components/home/HeroSection';
import CalendarModal from '../components/home/CalendarModal';
import TimePickerModal from '../components/home/TimePickerModal';
import BranchModal from '../components/home/BranchModal';
import ParticipantsModal from '../components/home/ParticipantsModal';
import BookingCard from '../components/home/BookingCard';
import RoomCard from '../components/home/RoomCard';
import AvailableRoomsSection from '../components/home/AvailableRoomsSection';




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
  const [branch, setBranch] = useState(null);
  const [participants, setParticipants] = useState(8);
  const [tempPart, setTempPart] = useState(8);
  const [foundRooms, setFoundRooms] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);


  // ── Date range
  const today = toDateStr(new Date());
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState('');
  const [dateStep, setDateStep] = useState('from');
  const [showCalModal, setShowCalModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // ── Time (dynamic based on current hour)
  const now = new Date();
  const curH = now.getHours(); // 0-23

  const getInitialTime = (offset = 0) => {
    let h = (curH + offset) % 24;
    const ap = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return { h: h12, m: 0, ap };
  };

  const startT = getInitialTime(1);
  const endT = getInitialTime(2);

  const [startH, setStartH] = useState(startT.h);
  const [startM, setStartM] = useState(0);
  const [startAP, setStartAP] = useState(startT.ap);
  const [endH, setEndH] = useState(endT.h);
  const [endM, setEndM] = useState(0);
  const [endAP, setEndAP] = useState(endT.ap);

  // Custom time picker modal state
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeStep, setTimeStep] = useState('start');
  const [pickH, setPickH] = useState(startT.h);
  const [pickM, setPickM] = useState(0);
  const [pickAP, setPickAP] = useState(startT.ap);

  // Modal flags
  const [showBranch, setShowBranch] = useState(false);
  const [showPart, setShowPart] = useState(false);



  const { mutate: findRooms, isLoading: roomLoading } = useFindAvailableRoom();
  const { data: myBookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useMyBookingHome();
  const { data: exploreData, isLoading: exploreLoading, refetch: refetchExplore } = useExploreRooms('available');
  const { mutate: updateBranch } = useUpdateActiveBranch();
  const { mutate: cancelBooking } = usecancelbooking();
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useStats();
  const { data: branchData, isLoading: branchLoading, refetch: refetchBranch } = useBranch();

  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = async () => {
    console.log('REFRESHING...');
    setRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchBranch(),
        refetchBookings(),
        refetchExplore()
      ]);
    } catch (e) {
      console.log('Refresh error:', e);
    }
    setRefreshing(false);
  };

  const handleHeroFindRooms = (payload) => {
    const toISO = (dateStr, h, m, ap) => {
      let hh = parseInt(h, 10);
      if (ap === 'PM' && hh < 12) hh += 12;
      if (ap === 'AM' && hh === 12) hh = 0;
      return `${dateStr}T${hh.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
    };

    const searchData = {
      branch_id: payload.branch?.id,
      start_time: toISO(payload.fromDate, payload.startH, payload.startM, payload.startAP),
      end_time: toISO(payload.toDate || payload.fromDate, payload.endH, payload.endM, payload.endAP),
      capacity: payload.participants,
    };

    findRooms(searchData, {
      onSuccess: (res) => {
        setFoundRooms(res.rooms || res.data || []);
        setHasSearched(true);
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            y: 500, // adjust this value based on where your result section starts
            animated: true,
          });
        }, 100);
      }
    });
  };

  React.useEffect(() => {
    if (branchData?.length > 0 && !branch) {
      setBranch(branchData[0]);
    }
  }, [branchData, branch]);

  // ── Room booking ─────────────────────────────────────────────
  const handleBookRoom = (room) => {
    const isAvail = room.is_available === true || room.status === 'available';
    if (!isAvail) { Alert.alert('Unavailable', 'This room is currently busy.'); return; }
    navigation.navigate('BookRoom', {
      room,
      searchData: {
        fromDate,
        toDate: toDate || fromDate,
        startH, startM, startAP,
        endH, endM, endAP,
        participants,
        hasSearched
      }
    });
  };

  const handleCancelBooking = (booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id, {
              onSuccess: () => {
                onRefresh();
              }
            });
          }
        },
      ]
    );
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
  const HERO_MAX = IS_TABLET ? 530 : 450;
  const HERO_MIN = IS_TABLET ? 150 : 100;
  const SCROLL_DIST = HERO_MAX - HERO_MIN;



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



  const handleClearSearch = () => {
    setHasSearched(false);
    setFoundRooms([]);
  };

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
        onFindRooms={handleHeroFindRooms}
        startH={startH} startM={startM} startAP={startAP}
        endH={endH} endM={endM} endAP={endAP}
        isLoading={roomLoading}
      />

      {/* ── SCROLLABLE CONTENT ── */}
      <Animated.ScrollView
        ref={scrollRef}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={HERO_MIN + 20}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* ── QUICK STATS ── */}

        <View style={S.statsRow}>
          {statsData?.stat?.map((s, i) => (
            <View key={i} style={[S.statCard, Shadows.card]}>
              <Text style={[S.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={S.statLbl}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <View style={S.sec}>
          <SecHd title="Ongoing & Upcoming 🔔" action="See all"
            onAction={() => navigation.navigate('Bookings')} />
          {bookingsLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={myBookingsData?.bookings || []}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              ItemSeparatorComponent={() => <View style={{ width: 11 }} />}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 12 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('BookingDetail', { booking: item })} activeOpacity={0.85}>
                    <BookingCard booking={item} onCancel={handleCancelBooking} />
                  </TouchableOpacity>
                </View>
              )}

              ListEmptyComponent={() => (
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 13, color: Colors.txt3 }}>No bookings found.</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* ── AVAILABLE ROOMS ── */}

        <AvailableRoomsSection
          hasSearched={hasSearched}
          searchQueryLabel={`${dateLabel} at ${fmtTime(startH, startM, startAP)}`}
          rooms={hasSearched ? foundRooms : (Array.isArray(exploreData) ? exploreData : [])}
          onSeeAll={() => navigation.navigate('Explore', {
            searchData: {
              branch,
              fromDate,
              toDate,
              startH, startM, startAP,
              endH, endM, endAP,
              participants,
              hasSearched
            }
          })}
          onBookRoom={handleBookRoom}
          onClearSearch={handleClearSearch}
          isLoading={roomLoading || exploreLoading}
        />

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
        onSetH={setPickH}
        onSetM={setPickM}
        onSetAP={setPickAP}
        onNextOrConfirm={onNextOrConfirm}
        onCancel={onCancelTime}
      />

      <BranchModal
        visible={showBranch}
        branches={branchData || []}
        selected={branch}
        onSelect={(b) => {
          console.log('Branch Selected:', b);
          setBranch(b);
          const bId = b?.id || b?._id;
          if (bId) {
            console.log('Calling updateBranch with ID:', bId);
            updateBranch(bId);
          } else {
            console.log('No Branch ID found for selection');
          }
        }}

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: '2%',
    paddingHorizontal: IS_TABLET ? '10%' : '2%',
    maxWidth: IS_TABLET ? 1000 : '100%',
    alignSelf: 'center'
  },
  statCard: {
    flex: 1,
    minWidth: IS_TABLET ? 150 : 80,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: IS_TABLET ? 20 : 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border
  },
  statNum: { fontSize: IS_TABLET ? 28 : 22, fontWeight: '700', lineHeight: IS_TABLET ? 32 : 24 },

  statLbl: { fontSize: IS_TABLET ? 12 : 9.5, color: Colors.txt2, fontWeight: '500', letterSpacing: 0.3, marginTop: 3, textAlign: 'center' },
  sec: { paddingHorizontal: IS_TABLET ? '8%' : 18, marginTop: 22 },
});

