// src/screens/BookRoomScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, FlatList, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  BackHeader, RoomThumb, GradBtn, FormLabel, CtrBtn,
} from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';
import { AMENITIES, TIME_SLOTS_START, TIME_SLOTS_END, fmtDate, calcDuration, randomId } from '../data';

// FormLabel not exported from Shared, define inline
function FL({ text }) {
  return <Text style={{ fontSize: 10.5, color: Colors.txt2, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>{text.toUpperCase()}</Text>;
}

export default function BookRoomScreen({ route, navigation }) {
  const { room } = route.params;

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [participants, setParticipants] = useState(8);
  const [amenities, setAmenities] = useState(new Set());
  const [note, setNote] = useState('');

  const toggleAmenity = (a) => {
    setAmenities(prev => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });
  };

  const duration = calcDuration(startTime, endTime);

  const handleReview = () => {
    const booking = {
      room: room.name,
      location: room.floor,
      date: fmtDate(date),
      startTime,
      endTime,
      duration: `${duration}h`,
      participants,
      amenities: [...amenities],
      note,
      bookingId: randomId(),
    };
    navigation.navigate('Review', { booking });
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

        {/* DATE */}
        <View style={S.section}>
          <FL text="Select Date" />
          <TouchableOpacity style={S.pickField} onPress={() => setShowDate(true)}>
            <Text style={{ fontSize: 18 }}>📅</Text>
            <Text style={S.pickVal}>{fmtDate(date)}</Text>
            <Text style={{ color: Colors.txt3 }}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* START TIME */}
        <View style={S.section}>
          <FL text="Start Time" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {TIME_SLOTS_START.map(t => (
                <TouchableOpacity key={t}
                  style={[S.slot, t === startTime && S.slotActive]}
                  onPress={() => setStartTime(t)}>
                  <Text style={[S.slotTxt, t === startTime && S.slotTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* END TIME */}
        <View style={S.section}>
          <FL text="End Time" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {TIME_SLOTS_END.map(t => (
                <TouchableOpacity key={t}
                  style={[S.slot, t === endTime && S.slotActive]}
                  onPress={() => setEndTime(t)}>
                  <Text style={[S.slotTxt, t === endTime && S.slotTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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

        {/* AMENITIES */}
        <View style={S.section}>
          <FL text="Amenities (Optional)" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {AMENITIES.map(a => {
              const active = amenities.has(a);
              return (
                <TouchableOpacity key={a}
                  style={[S.amenChip, active && S.amenChipActive]}
                  onPress={() => toggleAmenity(a)}>
                  {active && <Text style={{ fontSize: 11 }}>✓ </Text>}
                  <Text style={[S.amenTxt, active && S.amenTxtActive]}>{a}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* NOTE */}
        <View style={S.section}>
          <FL text="Meeting Note (Optional)" />
          <TextInput
            style={S.noteInput}
            placeholder="Add agenda, instructions, or any note..."
            placeholderTextColor={Colors.txt3}
            multiline numberOfLines={3}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
        </View>

        {/* REVIEW BUTTON */}
        <GradBtn label="Review Booking →" colors={Gradients.green} onPress={handleReview} />
      </ScrollView>

      {showDate && (
        <DateTimePicker value={date} mode="date" minimumDate={new Date()}
          onChange={(_, d) => { setShowDate(false); if (d) setDate(d); }} />
      )}
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
  amenChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#fff' },
  amenChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  amenTxt: { fontSize: 12, color: Colors.txt2, fontWeight: '500' },
  amenTxtActive: { color: '#fff', fontWeight: '600' },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border, fontSize: 13, color: Colors.txt, height: 90 },
});
