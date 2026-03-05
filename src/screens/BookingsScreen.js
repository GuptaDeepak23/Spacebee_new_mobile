// src/screens/BookingsScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GradHeader, StatusBadge } from '../components/Shared';
import { Colors, Shadows, statusStyle, Gradients } from '../theme';
import { ActivityIndicator, FlatList } from 'react-native';
import { useBookings, useAllBooking } from '../../api/hooks/useApi';


// ─── Constants ───────────────────────────────────────────────
const MAIN_TABS = ['My Booking', 'All Booking'];
const SUB_TABS = ['Upcoming', 'Ongoing', 'Past', 'Cancelled'];

const STATUS_MAP = {
  Upcoming: 'Upcoming',
  Ongoing: 'Started',
  Past: 'Completed',
  Cancelled: 'Cancelled',
};

const SUB_TAB_ICONS = {
  Upcoming: '🗓️',
  Ongoing: '⚡',
  Past: '📁',
  Cancelled: '✖️',
};

// ─── Main Screen ─────────────────────────────────────────────
export default function BookingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [mainTab, setMainTab] = useState(0); // 0 = My Booking, 1 = All Booking
  const [subTab, setSubTab] = useState(0); // 0-3 → Upcoming/Ongoing/Past/Cancelled

  const statusKey = STATUS_MAP[SUB_TABS[subTab]];

  const {
    data: myBookingsData,
    fetchNextPage: fetchNextMy,
    hasNextPage: hasNextMy,
    isFetchingNextPage: isFetchingNextMy,
    isLoading: isLoadingMy,
    refetch: refetchMy,
  } = useBookings(statusKey, { enabled: mainTab === 0 });

  const {
    data: allBookingsData,
    fetchNextPage: fetchNextAll,
    hasNextPage: hasNextAll,
    isFetchingNextPage: isFetchingNextAll,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useAllBooking(statusKey, { enabled: mainTab === 1 });

  const isLoading = mainTab === 0 ? isLoadingMy : isLoadingAll;
  const isFetchingNextPage = mainTab === 0 ? isFetchingNextMy : isFetchingNextAll;
  const hasNextPage = mainTab === 0 ? hasNextMy : hasNextAll;
  const fetchNextPage = mainTab === 0 ? fetchNextMy : fetchNextAll;
  const refetch = mainTab === 0 ? refetchMy : refetchAll;

  const bookings = mainTab === 0
    ? (myBookingsData?.pages.flatMap(page => page.bookings || page.data || []) || [])
    : (allBookingsData?.pages.flatMap(page => page.bookings || page.data || []) || []);

  const totalCount = mainTab === 0
    ? (myBookingsData?.pages[0]?.total || bookings.length)
    : (allBookingsData?.pages[0]?.total || bookings.length);

  const switchMain = (idx) => {
    setMainTab(idx);
  };

  return (
    <SafeAreaView style={S.safe} edges={['bottom']}>
      {/* ── GRADIENT HEADER ── */}
      <GradHeader style={S.header}>
        <View style={S.headerRow}>
          <View>
            <Text style={S.headTitle}>Bookings 📋</Text>
            <Text style={S.headSub}>
              {mainTab === 0 ? 'Your personal reservations' : 'All workspace bookings'}
            </Text>
          </View>
          <View style={S.countBubble}>
            <Text style={S.countBubbleTxt}>{totalCount}</Text>
            <Text style={S.countBubbleLbl}>Total</Text>
          </View>
        </View>

        {/* ── MAIN SWITCHER ── */}
        <View style={S.mainSwitcher}>
          {MAIN_TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[S.switchTab, i === mainTab && S.switchTabActive]}
              onPress={() => switchMain(i)}
              activeOpacity={0.85}
            >
              <Text style={[S.switchTxt, i === mainTab && S.switchTxtActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </GradHeader>

      {/* ── SUB-TABS (scrollable chips) ── */}
      <View style={S.subTabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.subTabRow}>
          {SUB_TABS.map((t, i) => {
            const active = i === subTab;
            const ss = statusStyle(STATUS_MAP[t].toLowerCase()); // Match theme keys
            return (
              <TouchableOpacity
                key={t}
                style={[S.subChip, active && { backgroundColor: ss.bg, borderColor: ss.txt }]}
                onPress={() => setSubTab(i)}
                activeOpacity={0.8}
              >
                <Text style={[S.subChipTxt, active && { color: ss.txt, fontWeight: '700' }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── BOOKING LIST ── */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[S.list, { paddingBottom: 100 + (insets.bottom || 0) }]}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={false}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => <EmptyState status={SUB_TABS[subTab]} />}
          ListFooterComponent={() => isFetchingNextPage ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 10 }} />
          ) : null}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('BookingDetail', { booking: item, isAllBooking: mainTab === 1 })}
              activeOpacity={0.85}
              style={{ marginBottom: 12 }}
            >
              <BookingCard booking={item} isAllBooking={mainTab === 1} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Booking Card ─────────────────────────────────────────────
function BookingCard({ booking, isAllBooking }) {
  const ss = statusStyle(booking.status.toLowerCase());
  const d = new Date(booking.start_time);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = months[d.getMonth()];

  const fmtHHMM = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };

  return (
    <View style={[BC.card, Shadows.card]}>
      {/* Left accent bar */}
      <LinearGradient colors={ss.bar} style={BC.accentBar} />

      {/* Date column */}
      <View style={BC.datecol}>
        <Text style={[BC.day, { color: ss.txt }]}>{day}</Text>
        <Text style={BC.mon}>{month}</Text>
      </View>

      {/* Divider */}
      <View style={BC.vdiv} />

      {/* Main info */}
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={BC.rname} numberOfLines={1}>{booking.room?.name || 'Meeting Room'}</Text>
        <Text style={BC.meta}>📍 {booking.room?.branch_name || 'Main Office'}</Text>
        <Text style={BC.meta}>⏰ {fmtHHMM(booking.start_time)} - {fmtHHMM(booking.end_time)} · {booking.booking_duration}</Text>
        {isAllBooking && booking.employee?.name && (
          <Text style={BC.otherUser}>👤 <Text style={{ fontWeight: 'bold' }}>Booked by :- </Text>{`${booking.employee.name}`}</Text>
        )}
        <View style={{ marginTop: 2, alignSelf: 'flex-start' }}>
          <StatusBadge status={booking.status.toLowerCase()} />
        </View>
      </View>

      <View style={BC.arrowWrap}>
        <Text style={BC.arrow}>›</Text>
      </View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────
function EmptyState({ status }) {
  const cfg = {
    Upcoming: { emoji: '🗓️', msg: 'No upcoming bookings', hint: 'Schedule a room to get started' },
    Ongoing: { emoji: '⚡', msg: 'No ongoing sessions', hint: 'Active bookings will appear here' },
    Past: { emoji: '📁', msg: 'No past bookings', hint: 'Your booking history will show here' },
    Cancelled: { emoji: '✖️', msg: 'No cancelled bookings', hint: 'All clear — nothing was cancelled!' },
  }[status] || { emoji: '📭', msg: 'No bookings', hint: '' };

  return (
    <View style={ES.wrap}>
      <View style={ES.iconWrap}>
        <Text style={ES.emoji}>{cfg.emoji}</Text>
      </View>
      <Text style={ES.msg}>{cfg.msg}</Text>
      <Text style={ES.hint}>{cfg.hint}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4, marginBottom: 14, marginTop: "10%" },
  headTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
  headSub: { fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  countBubble: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', minWidth: 54 },
  countBubbleTxt: { fontSize: 18, fontWeight: '800', color: '#fff' },
  countBubbleLbl: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginTop: 1 },

  // Main switcher
  mainSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginTop: 14,
  },
  switchTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
  },
  switchTabActive: {
    backgroundColor: '#fff',
    elevation: 3,
  },
  switchTxt: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  switchTxtActive: { color: Colors.primary, fontWeight: '800' },

  // Sub-tabs
  subTabWrapper: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  subTabRow: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  subChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  subChipIcon: { fontSize: 13 },
  subChipTxt: { fontSize: 12, color: Colors.txt2, fontWeight: '500' },
  badge: { minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '700' },

  // List
  list: { padding: 16, paddingTop: 14 },
});

const BC = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  accentBar: { width: 5, alignSelf: 'stretch' },
  datecol: { minWidth: 52, alignItems: 'center', paddingVertical: 16, paddingLeft: 12 },
  day: { fontSize: 22, fontWeight: '800', lineHeight: 25 },
  mon: { fontSize: 10, color: Colors.txt2, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  vdiv: { width: 1, height: 60, backgroundColor: Colors.border, marginHorizontal: 12 },
  rname: { fontSize: 13.5, fontWeight: '700', color: Colors.txt, marginBottom: 3 },
  meta: { fontSize: 11, color: Colors.txt2, marginBottom: 2 },
  otherUser: { fontSize: 10.5, color: Colors.purple, fontWeight: '500', marginBottom: 2 },
  arrowWrap: { paddingHorizontal: 14, justifyContent: 'center' },
  arrow: { fontSize: 20, color: Colors.txt3 },
});

const ES = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 32 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EBF2FC', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emoji: { fontSize: 38 },
  msg: { fontSize: 16, fontWeight: '700', color: Colors.txt, textAlign: 'center', marginBottom: 6 },
  hint: { fontSize: 12.5, color: Colors.txt2, textAlign: 'center', lineHeight: 18 },
});
