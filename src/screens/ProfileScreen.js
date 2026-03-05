// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows } from '../theme';
import { PROFILE_MENU } from '../data';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { value: '12', label: 'Bookings' },
  { value: '48h', label: 'Hours' },
  { value: '4', label: 'Branches' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userData, logout } = useAuth();

  return (
    <SafeAreaView style={S.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>

        {/* HERO */}
        <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.hero}>
          <LinearGradient colors={Gradients.avatar} style={S.ava}>
            <Text style={S.avaTxt}>{userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'ME'}</Text>
          </LinearGradient>
          <Text style={S.name}>{userData?.name || 'User Name'}</Text>
          <Text style={S.role}>{userData?.employee_role || 'Employee'}</Text>
          <Text style={S.dept}>{userData?.branch_name || 'Assigned Branch'}</Text>

          {/* Stats */}
          <View style={S.statsRow}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={S.statItem}>
                  <Text style={S.statNum}>{s.value}</Text>
                  <Text style={S.statLbl}>{s.label}</Text>
                </View>
                {i < STATS.length - 1 && <View style={S.vdiv} />}
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {/* MENU */}
        <View style={S.menu}>
          {PROFILE_MENU.map(item => (
            <TouchableOpacity key={item.id} style={[S.menuItem, Shadows.card]}
              onPress={() => Alert.alert(item.label, 'Coming soon!')}
              activeOpacity={0.85}>
              <View style={[S.menuIcon, { backgroundColor: item.color }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <Text style={S.menuLabel}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: Colors.txt3 }}>›</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[S.menuItem, { marginTop: 10, borderColor: '#FEE2E2' }]}
            onPress={logout}
            activeOpacity={0.85}
          >
            <View style={[S.menuIcon, { backgroundColor: '#FEE2E2' }]}>
              <Text style={{ fontSize: 16 }}>🚪</Text>
            </View>
            <Text style={[S.menuLabel, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={S.version}>Design and Developed by Kanishka Software</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  hero: { paddingTop: 54, paddingHorizontal: 22, paddingBottom: 28, alignItems: 'center' },
  ava: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)', marginBottom: 12, marginTop: "2%" },
  avaTxt: { color: '#fff', fontWeight: '700', fontSize: 26 },
  name: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 3 },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  dept: { fontSize: 11, color: 'rgba(255,255,255,0.55)' },
  statsRow: { flexDirection: 'row', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, gap: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statLbl: { fontSize: 10, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginTop: 2 },
  vdiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  menu: { padding: 18, gap: 9 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  menuIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 13.5, fontWeight: '500', color: Colors.txt },
  version: { textAlign: 'center', color: Colors.txt3, fontSize: 12, paddingBottom: 10 },
});
