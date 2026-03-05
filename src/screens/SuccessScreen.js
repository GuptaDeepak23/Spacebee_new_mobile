// src/screens/SuccessScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GradBtn } from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';
import { TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SuccessScreen({ route, navigation }) {
  const { booking } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, tension: 50, friction: 6, useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.spring(cardTranslateY, {
        toValue: 0, tension: 40, friction: 8, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  const goBookings = () =>
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: { screen: 'Bookings' }
        }
      ]
    });

  const dateDisplay = booking.fromDate === booking.toDate || !booking.toDate
    ? booking.fromDate
    : `${booking.fromDate} - ${booking.toDate}`;

  return (
    <View style={S.container}>
      {/* Background blobs for premium feel */}
      <View style={[S.blob, S.blob1]} />
      <View style={[S.blob, S.blob2]} />

      <SafeAreaView style={S.safe}>
        <View style={S.content}>
          {/* Animated Checkmark */}
          <Animated.View style={[S.checkWrap, { transform: [{ scale }] }]}>
            <LinearGradient colors={Gradients.green} style={[S.checkCircle, Shadows.green]}>
              <Ionicons name="checkmark" size={60} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* Title & Subtitle */}
          <Animated.View style={{ opacity, alignItems: 'center', width: '100%' }}>
            <Text style={S.title}>Booking Confirmed!</Text>
            <Text style={S.sub}>Your workspace is reserved and ready for you.</Text>

            {/* Glassmorphic card */}
            <Animated.View style={[S.glassCardContainer, Shadows.card, { transform: [{ translateY: cardTranslateY }] }]}>
              <BlurView intensity={90} tint="light" style={S.glassCard}>
                <Row icon="business" label="Room" value={booking.room} />
                <Row icon="location" label="Location" value={booking.location} />
                <Row icon="calendar" label="Date" value={dateDisplay} />
                <Row icon="time" label="Time" value={`${booking.startTime} – ${booking.endTime}`} />
                <Row icon="people" label="Participants" value={`${booking.participants} people`} />
                <Row icon="apps" label="Meeting Type" value={booking.meetingType.charAt(0).toUpperCase() + booking.meetingType.slice(1)} />
              </BlurView>
            </Animated.View>

            {/* Actions */}
            <View style={S.actionArea}>
              <GradBtn
                label="View My Bookings"
                colors={Gradients.green}
                onPress={goBookings}
                style={S.mainBtn}
              />
              <TouchableOpacity
                onPress={goHome}
                style={S.secondaryBtn}
                activeOpacity={0.7}
              >
                <Text style={S.secondaryBtnTxt}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Row({ icon, label, value }) {
  return (
    <View style={S.row}>
      <View style={S.rowLabelArea}>
        <Ionicons name={icon} size={16} color={Colors.primary} style={{ marginRight: 8 }} />
        <Text style={S.rowLabel}>{label}</Text>
      </View>
      <Text style={S.rowValue} numberOfLines={1}>{value || '--'}</Text>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  // Background blobs
  blob: { position: 'absolute', width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, opacity: 0.15 },
  blob1: { top: -100, left: -100, backgroundColor: '#10B981' },
  blob2: { bottom: -100, right: -100, backgroundColor: Colors.primary },

  checkWrap: { marginBottom: 28 },
  checkCircle: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },

  title: { fontSize: 28, fontWeight: '800', color: Colors.txt, textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  sub: { fontSize: 15, color: Colors.txt2, textAlign: 'center', marginBottom: 30, lineHeight: 22, paddingHorizontal: 20 },

  glassCardContainer: { width: '100%', marginBottom: 36, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  glassCard: { padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.75)' },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLabelArea: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: Colors.txt2, fontWeight: '500' },
  rowValue: { fontSize: 14, color: Colors.txt, fontWeight: '700', maxWidth: '60%', textAlign: 'right' },

  actionArea: { width: '100%', gap: 12 },
  mainBtn: { height: 56, borderRadius: 16 },
  secondaryBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  secondaryBtnTxt: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700'
  }
});
