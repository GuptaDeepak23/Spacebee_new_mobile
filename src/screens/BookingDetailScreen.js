// src/screens/BookingDetailScreen.js
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader, StatusBadge, AvatarStack, DetailRow, GradBtn, OutBtn, Divider } from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';

export default function BookingDetailScreen({ route, navigation }) {
  const { booking, isAllBooking } = route.params;
  const status = booking.status.toLowerCase();
  const isActive = status !== 'cancelled' && status !== 'completed';

  const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const fmtHHMM = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };

  const handleCancel = () =>
    Alert.alert('Cancel Booking', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive', onPress: () => {
          Alert.alert('Cancelled', 'Booking has been cancelled.');
          navigation.goBack();
        }
      },
    ]);

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <BackHeader
        title={booking.room?.name || 'Meeting Room'}
        subtitle={booking.room?.branch_name || 'Main Office'}
        onBack={() => navigation.goBack()}
        statusBadge={<StatusBadge status={status} />}
      />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>

        {/* DETAILS CARD */}
        <View style={[S.card, Shadows.card]}>
          <Text style={S.cardTitle}>Booking Details</Text>
          <DetailRow label="📅  Date" value={fmtDate(booking.start_time)} />
          <DetailRow label="⏰  Time" value={`${fmtHHMM(booking.start_time)} - ${fmtHHMM(booking.end_time)}`} />
          <DetailRow label="⌛  Duration" value={booking.booking_duration} />
          <DetailRow label="👥  Attendees" value={`${booking.capacity || 0} people`} />
          <DetailRow label="📍  Location" value={booking.room?.branch_name || 'Main Office'} />
          {isAllBooking && booking.employee?.name && (
            <DetailRow label="👤  Booked by" value={booking.employee.name} />
          )}
        </View>

        {/* ATTENDEES */}
        <View style={[S.card, Shadows.card, { marginTop: 14 }]}>
          <Text style={S.cardTitle}>Attendees</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 8 }}>
            <AvatarStack avatars={[]} />
            <Text style={{ color: Colors.txt2, fontSize: 12 }}>
              {booking.capacity || 0} participants invited
            </Text>
          </View>
        </View>

        {/* POLICY NOTE */}
        <View style={S.policy}>
          <Text style={{ fontSize: 13 }}>⚠️</Text>
          <Text style={S.policyTxt}>
            Cancellations must be made at least 2 hours before the booking time to avoid penalties.
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={{ marginTop: 20 }}>
          {isActive ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[S.cancelBtn, { flex: 1 }]} onPress={handleCancel}>
                <Text style={S.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <GradBtn label="Edit Booking" colors={Gradients.blue}
                style={{ flex: 1 }} onPress={() => Alert.alert('Edit', 'Edit flow coming soon')} />
            </View>
          ) : (
            <GradBtn label="Book Again ↻" colors={Gradients.green}
              onPress={() => navigation.navigate('Explore')} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.txt, marginBottom: 4 },
  policy: { flexDirection: 'row', gap: 9, backgroundColor: '#FFFBEB', borderRadius: 14, padding: 13, marginTop: 14, borderWidth: 1, borderColor: '#FDE68A', alignItems: 'flex-start' },
  policyTxt: { fontSize: 11.5, color: '#92400E', lineHeight: 17, flex: 1 },
  cancelBtn: { borderWidth: 1.5, borderColor: Colors.sRed, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  cancelTxt: { color: Colors.sRed, fontWeight: '600', fontSize: 13 },
});
