// src/screens/ReviewScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader, DetailRow, GradBtn, OutBtn } from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';
import { useBookRoom } from '../../api/hooks/useApi';

export default function ReviewScreen({ route, navigation }) {
  const { booking } = route.params;
  const { mutate: book, isLoading: bookingInProgress } = useBookRoom();

  const handleConfirm = () => {
    // Format payload for API
    const payload = {
      room_id: booking.room_id, // assuming room contains id from prev screen
      booking_date: booking.booking_date,
      start_time: booking.isoStartTime,
      end_time: booking.isoEndTime,
      meeting_type: booking.meetingType,
      capacity: booking.participants,
      remark: booking.note || ''
    };

    book(payload, {
      onSuccess: () => {
        navigation.navigate('Success', { booking });
      },
      onError: (err) => {
        console.log('Booking Error:', err);
      }
    });
  };

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <BackHeader title="Review Booking" subtitle="Confirm your details"
        onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>

        {/* SUMMARY */}
        <View style={[S.card, Shadows.card]}>
          <Text style={S.cardTitle}>📋 Booking Summary</Text>
          <DetailRow label="🏢  Room" value={booking.room} />
          <DetailRow label="📍  Location" value={booking.location} />
          <DetailRow label="📅  Date" value={booking.fromDate === booking.toDate || !booking.toDate ? booking.fromDate : `${booking.fromDate} - ${booking.toDate}`} />
          <DetailRow label="⏰  Time" value={`${booking.startTime} – ${booking.endTime}`} />
          <DetailRow label="⌛  Duration" value={booking.duration} />
          <DetailRow label="👥  Participants" value={`${booking.participants} people`} />
          <DetailRow label="🏢  Meeting Type" value={booking.meetingType.charAt(0).toUpperCase() + booking.meetingType.slice(1)} />
          {booking.note !== '' && (
            <DetailRow label="📝  Note" value={booking.note} />
          )}
        </View>





        {/* ACTIONS */}
        <View style={{ marginTop: 22, gap: 12 }}>
          <GradBtn label="✓  Confirm Booking" colors={Gradients.green}
            loading={bookingInProgress} onPress={handleConfirm} />
          <OutBtn label="← Edit Details" color={Colors.primary}
            onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.txt, marginBottom: 6 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, backgroundColor: '#EBF2FC', borderRadius: 14, padding: 13 },
  idLbl: { fontSize: 12, color: Colors.txt2 },
  idVal: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  policy: { flexDirection: 'row', backgroundColor: '#FFFBEB', borderRadius: 14, padding: 13, marginTop: 14, borderWidth: 1, borderColor: '#FDE68A' },
  policyTxt: { fontSize: 11.5, color: '#92400E', flex: 1, lineHeight: 17 },
});
