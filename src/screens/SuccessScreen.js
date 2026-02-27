// src/screens/SuccessScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GradBtn, OutBtn } from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';

export default function SuccessScreen({ route, navigation }) {
  const { booking } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1, tension: 60, friction: 5, useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <SafeAreaView style={S.safe}>
      <View style={S.content}>
        {/* Check Circle */}
        <Animated.View style={[S.checkWrap, { transform: [{ scale }] }]}>
          <LinearGradient colors={Gradients.green} style={[S.checkCircle, Shadows.green]}>
            <Text style={S.checkMark}>✓</Text>
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity }}>
          <Text style={S.title}>Booking Confirmed!</Text>
          <Text style={S.sub}>Your workspace is ready. Have a great session!</Text>

          {/* Confirmation Card */}
          <LinearGradient colors={['#EBF2FC', '#F0F8FF']} style={[S.confCard, Shadows.card]}>
            <Text style={S.confId}>{booking.bookingId}</Text>
            <View style={S.divider} />
            <Row label="🏢 Room" value={booking.room} />
            <Row label="📍 Location" value={booking.location} />
            <Row label="📅 Date" value={booking.date} />
            <Row label="⏰ Time" value={`${booking.startTime} – ${booking.endTime}`} />
            <Row label="👥 People" value={`${booking.participants} participants`} />
          </LinearGradient>

          {/* Actions */}
          <View style={{ gap:10 }}>
            <GradBtn label="View My Bookings" colors={Gradients.green} onPress={goHome} />
            <GradBtn label="Back to Home" color={Colors.primary} onPress={goHome} />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
      <Text style={{ fontSize: 11.5, color: Colors.txt2 }}>{label}</Text>
      <Text style={{ fontSize: 11.5, color: Colors.txt, fontWeight: '600', maxWidth: '55%', textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 , gap:10 },
  checkWrap: { marginBottom: 24 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontSize: 48, color: '#fff', fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '700', color: Colors.txt, textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, color: Colors.txt2, textAlign: 'center', marginBottom: 22, lineHeight: 20 },
  confCard: { borderRadius: 20, padding: 18, width: '100%', borderWidth: 1, borderColor: Colors.border },
  confId: { fontSize: 18, fontWeight: '700', color: Colors.primary, textAlign: 'center', marginBottom: 10 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 10 },
});
