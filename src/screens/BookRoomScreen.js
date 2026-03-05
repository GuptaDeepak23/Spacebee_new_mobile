// src/screens/BookRoomScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, FlatList, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  BackHeader, RoomThumb, GradBtn, FormLabel, CtrBtn,
} from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';
import { fmtDate, calcDuration, randomId } from '../data';
import { useBookRoom } from '../../api/hooks/useApi';
import { useAuth } from '../context/AuthContext';
import TimePickerModal from '../components/home/TimePickerModal';
import CalendarModal from '../components/home/CalendarModal';

let CalendarComponent = null;
if (Platform.OS !== 'web') {
  try { CalendarComponent = require('react-native-calendars').Calendar; } catch (_) { }
}

// FormLabel not exported from Shared, define inline
function FL({ text }) {
  return <Text style={{ fontSize: 10.5, color: Colors.txt2, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>{text.toUpperCase()}</Text>;
}

export default function BookRoomScreen({ route, navigation }) {
  const { room, searchData } = route.params;
  const { userData } = useAuth();

  // Initialize state from searchData if available
  const today = new Date().toISOString().split('T')[0];
  const initialFrom = searchData?.fromDate || today;
  const initialTo = searchData?.toDate || initialFrom;

  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);
  const [dateStep, setDateStep] = useState('from');
  const [showCalModal, setShowCalModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Time state matching TimePickerModal structure
  const [startH, setStartH] = useState(searchData?.startH || 10);
  const [startM, setStartM] = useState(searchData?.startM || 0);
  const [startAP, setStartAP] = useState(searchData?.startAP || 'AM');
  const [endH, setEndH] = useState(searchData?.endH || 11);
  const [endM, setEndM] = useState(searchData?.endM || 0);
  const [endAP, setEndAP] = useState(searchData?.endAP || 'AM');

  // Modal local state
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeStep, setTimeStep] = useState('start'); // 'start' or 'end'
  const [pickH, setPickH] = useState(10);
  const [pickM, setPickM] = useState(0);
  const [pickAP, setPickAP] = useState('AM');

  const initialPart = searchData?.participants || 8;
  const [participants, setParticipants] = useState(initialPart);
  const [meetingType, setMeetingType] = useState('internal'); // 'internal' or 'external'

  const startTime = `${startH}:${startM.toString().padStart(2, '0')} ${startAP}`;
  const endTime = `${endH}:${endM.toString().padStart(2, '0')} ${endAP}`;

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
      // Automatically prep for End Time
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

  // ── Calendar range logic ──────────────────────────────────────
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
    setShowCalModal(false); setShowCalendar(false); setDateStep('from');
  };

  const markedDates = {
    [fromDate]: { startingDay: true, color: Colors.primary, textColor: '#fff' },
    [toDate]: { endingDay: true, color: Colors.primary, textColor: '#fff' },
  };
  if (fromDate && toDate) {
    let curr = new Date(fromDate);
    const last = new Date(toDate);
    while (curr < last) {
      curr.setDate(curr.getDate() + 1);
      const ds = curr.toISOString().split('T')[0];
      if (ds !== toDate) {
        markedDates[ds] = { color: Colors.primary + '30', textColor: Colors.primary };
      }
    }
  }

  const toISO = (dateStr, h, m, ap) => {
    let hh = parseInt(h, 10);
    if (ap === 'PM' && hh < 12) hh += 12;
    if (ap === 'AM' && hh === 12) hh = 0;
    return `${dateStr}T${hh.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };



  const duration = calcDuration(startTime, endTime);

  const { mutate: book, isPending: bookingInProgress } = useBookRoom();

  const toISODateTime = (d, timeStr) => {
    const [hm, ap] = timeStr.split(' ');
    let [h, m] = hm.split(':').map(Number);
    if (ap === 'PM' && h < 12) h += 12;
    if (ap === 'AM' && h === 12) h = 0;

    // BUILD LOCAL DATE STRING (YYYY-MM-DD) to avoid UTC shifts
    const YYYY = d.getFullYear();
    const MM = (d.getMonth() + 1).toString().padStart(2, '0');
    const DD = d.getDate().toString().padStart(2, '0');
    const dateStr = `${YYYY}-${MM}-${DD}`;

    return `${dateStr}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const handleAction = () => {
    const booking = {
      room_id: room.id,
      room: room.name,
      location: room.floor,
      fromDate,
      toDate,
      startTime,
      endTime,
      isoStartTime: toISO(fromDate, startH, startM, startAP),
      isoEndTime: toISO(toDate, endH, endM, endAP),
      duration: `${duration}h`,
      participants,
      meetingType,
      bookingId: randomId(),
    };

    // Direct API Confirm - matching the requested layout
    const payload = {
      capacity: booking.participants,
      employee_id: userData?.id || 34,
      end_time: booking.isoEndTime,
      meeting_type: booking.meetingType,
      room_id: room.id,
      start_time: booking.isoStartTime
    };

    console.log('🚀 SENDING PAYLOAD:', JSON.stringify(payload, null, 2));

    book(payload, {
      onSuccess: () => navigation.navigate('Success', { booking }),
      onError: (err) => console.log('Booking Error:', err)
    });
  };

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <BackHeader title="Book a Room" subtitle={room.name} onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>

        {/* ROOM INFO */}
        <View style={[S.roomCard, Shadows.card]}>
          <RoomThumb theme={room.theme} size={64} />
          <View style={{ marginLeft: 13, flex: 1 }}>
            <Text style={S.roomName}>{room.name}</Text>
            <Text style={S.roomFloor}>🏠 {room.floor}</Text>
            <Text style={{ fontSize: 11, color: Colors.txt2 }}>👥 Capacity: {room.capacity}</Text>
          </View>
        </View>

        {/* SEARCH AND CONFIG SUMMARY */}
        {searchData?.hasSearched ? (
          <View style={[S.summaryCard, Shadows.card]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontWeight: '700', fontSize: 14, color: Colors.primary }}>✨ Your Selection</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: '#22BF96', fontWeight: '700', fontSize: 13 }}>✏️ Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={S.summaryRow}>
              <Text style={S.summaryTxt}>📅  {fromDate === toDate ? fmtDate(new Date(fromDate)) : `${fmtDate(new Date(fromDate))} - ${fmtDate(new Date(toDate))}`}</Text>
              <Text style={S.summaryTxt}>⏰  {startTime} – {endTime}</Text>
            </View>
            <View style={S.summaryRow}>
              <Text style={S.summaryTxt}>👥  {participants} people</Text>
              <Text style={S.summaryTxt}>⏳  {duration} hour{duration > 1 ? 's' : ''}</Text>
            </View>
          </View>
        ) : (
          <>
            {/* DATE RANGE */}
            <View style={S.section}>
              <FL text="Select Date Range" />
              <TouchableOpacity style={S.pickField} onPress={() => setShowCalModal(true)}>
                <Text style={{ fontSize: 18 }}>📅</Text>
                <Text style={S.pickVal}>
                  {fromDate === toDate ? fmtDate(new Date(fromDate)) : `${fmtDate(new Date(fromDate))} - ${fmtDate(new Date(toDate))}`}
                </Text>
                <Text style={{ color: Colors.txt3 }}>▾</Text>
              </TouchableOpacity>
            </View>

            {/* TIME PICKER */}
            <View style={S.section}>
              <FL text="Select Time" />
              <TouchableOpacity style={S.pickField} onPress={() => openTimePicker('start')}>
                <Text style={{ fontSize: 18 }}>⏰</Text>
                <Text style={S.pickVal}>{startTime} – {endTime}</Text>
                <Text style={{ color: Colors.txt3 }}>✏️</Text>
              </TouchableOpacity>
            </View>

            {/* DURATION PILL */}
            {duration > 0 && (
              <View style={S.durPill}>
                <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 12 }}>
                  ⌛ Duration: {duration} hour{duration > 1 ? 's' : ''}
                </Text>
              </View>
            )}

            {/* PARTICIPANTS */}
            <View style={S.section}>
              <FL text="Number of Participants" />
              <View style={S.ctrRow}>
                <CtrBtn icon="−" onPress={() => setParticipants(p => Math.max(1, p - 1))} />
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={S.ctrNum}>{participants}</Text>
                  <Text style={{ color: Colors.txt2, fontSize: 11 }}>participants</Text>
                </View>
                <CtrBtn icon="+" onPress={() => setParticipants(p => Math.min(room.capacity, p + 1))} />
              </View>
            </View>
          </>
        )}

        {/* MEETING TYPE */}
        <View style={S.section}>
          <FL text="Meeting Type" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[S.typeBtn, meetingType === 'internal' && S.typeBtnActive]}
              onPress={() => setMeetingType('internal')}
            >
              <Text style={[S.typeBtnTxt, meetingType === 'internal' && S.typeBtnTxtActive]}>🏠 Internal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.typeBtn, meetingType === 'external' && S.typeBtnActive]}
              onPress={() => setMeetingType('external')}
            >
              <Text style={[S.typeBtnTxt, meetingType === 'external' && S.typeBtnTxtActive]}>🌐 External</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* ACTION BUTTON */}
        <GradBtn
          label="✓  Confirm Booking"
          colors={Gradients.green}
          onPress={handleAction}
          loading={bookingInProgress}
        />
      </ScrollView>

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
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  roomCard: { backgroundColor: '#fff', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  roomName: { fontSize: 13.5, fontWeight: '700', color: Colors.txt },
  roomFloor: { fontSize: 11, color: Colors.txt2, marginTop: 2, marginBottom: 4 },
  section: { marginBottom: 18 },
  pickField: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border },
  pickVal: { flex: 1, fontSize: 14, color: Colors.txt, fontWeight: '500' },
  slot: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#fff' },
  slotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotTxt: { fontSize: 12, color: Colors.txt2, fontWeight: '500' },
  slotTxtActive: { color: '#fff', fontWeight: '600' },
  durPill: { backgroundColor: '#EBF2FC', borderRadius: 12, padding: 11, marginBottom: 18, alignItems: 'center' },
  ctrRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border },
  ctrNum: { fontSize: 36, fontWeight: '700', color: Colors.primary, lineHeight: 40 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#fff', alignItems: 'center' },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnTxt: { fontSize: 13, color: Colors.txt2, fontWeight: '600' },
  typeBtnTxtActive: { color: '#fff' },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border, fontSize: 13, color: Colors.txt, height: 90 },
  summaryCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dotted' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryTxt: { fontSize: 13, color: Colors.txt, fontWeight: '600' },
});
