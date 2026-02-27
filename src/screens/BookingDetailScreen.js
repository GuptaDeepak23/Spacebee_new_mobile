// src/screens/BookingDetailScreen.js
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader, StatusBadge, AvatarStack, DetailRow, GradBtn, OutBtn, Divider } from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';

export default function BookingDetailScreen({ route, navigation }) {
  const { booking } = route.params;
  const isActive = booking.status !== 'cancelled';

  const handleCancel = () =>
    Alert.alert('Cancel Booking', 'Are you sure?', [
      { text: 'No', style:'cancel' },
      { text: 'Yes, Cancel', style:'destructive', onPress: () => {
        Alert.alert('Cancelled', 'Booking has been cancelled.');
        navigation.goBack();
      }},
    ]);

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <BackHeader
        title={booking.room}
        subtitle={booking.location}
        onBack={() => navigation.goBack()}
        statusBadge={<StatusBadge status={booking.status} />}
      />
      <ScrollView contentContainerStyle={{ padding:18, paddingBottom:30 }}>

        {/* DETAILS CARD */}
        <View style={[S.card, Shadows.card]}>
          <Text style={S.cardTitle}>Booking Details</Text>
          <DetailRow label="📅  Date"         value={booking.date} />
          <DetailRow label="⏰  Time"         value={booking.timeRange} />
          <DetailRow label="⌛  Duration"     value={booking.duration} />
          <DetailRow label="👥  Attendees"    value={`${booking.attendeeCount} people`} />
          <DetailRow label="📍  Location"     value={booking.location} />
        </View>

        {/* ATTENDEES */}
        <View style={[S.card, Shadows.card, { marginTop:14 }]}>
          <Text style={S.cardTitle}>Attendees</Text>
          <View style={{ flexDirection:'row', alignItems:'center', gap:14, paddingTop:8 }}>
            <AvatarStack avatars={booking.avatars} />
            <Text style={{ color:Colors.txt2, fontSize:12 }}>
              {booking.attendeeCount} participants invited
            </Text>
          </View>
        </View>

        {/* POLICY NOTE */}
        <View style={S.policy}>
          <Text style={{ fontSize:13 }}>⚠️</Text>
          <Text style={S.policyTxt}>
            Cancellations must be made at least 2 hours before the booking time to avoid penalties.
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={{ marginTop:20 }}>
          {isActive ? (
            <View style={{ flexDirection:'row', gap:12 }}>
              <TouchableOpacity style={[S.cancelBtn, { flex:1 }]} onPress={handleCancel}>
                <Text style={S.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <GradBtn label="Edit Booking" colors={Gradients.blue}
                style={{ flex:1 }} onPress={() => Alert.alert('Edit', 'Edit flow coming soon')} />
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
  safe:      { flex:1, backgroundColor:Colors.bg },
  card:      { backgroundColor:'#fff', borderRadius:18, padding:16, borderWidth:1, borderColor:Colors.border },
  cardTitle: { fontSize:14, fontWeight:'700', color:Colors.txt, marginBottom:4 },
  policy:    { flexDirection:'row', gap:9, backgroundColor:'#FFFBEB', borderRadius:14, padding:13, marginTop:14, borderWidth:1, borderColor:'#FDE68A', alignItems:'flex-start' },
  policyTxt: { fontSize:11.5, color:'#92400E', lineHeight:17, flex:1 },
  cancelBtn: { borderWidth:1.5, borderColor:Colors.sRed, borderRadius:16, paddingVertical:15, alignItems:'center' },
  cancelTxt: { color:Colors.sRed, fontWeight:'600', fontSize:13 },
});
