// src/screens/ProfileScreen.js
import React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows } from '../theme';
import { PROFILE_MENU } from '../data';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../components/LogoutModal';
import { GradHeader } from '../components/Shared';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../api/hooks/useApi';







export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { userData, logout } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {data: profileData, isLoading: profileLoading} = useProfile();

  const handleMenuPress = (label) => {
    if (label === 'Booking History') {
      navigation.navigate('Bookings');
    } else if (label === 'Privacy & Security') {
      navigation.navigate('PrivacySecurity');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setLogoutVisible(false);
  };

  return (
    <SafeAreaView style={S.safe} edges={['bottom']} >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickyHeaderIndices={[0]}
        
      >
        {/* HERO */}
        <GradHeader style={[S.hero, { paddingTop: insets.top + 0 }]}>
          <View style={S.heroContent}>
            <View style={S.avaContainer}>
              <LinearGradient colors={Gradients.avatar} style={S.ava}>
                <Text style={S.avaTxt}>{profileData?.name ? profileData.name.substring(0, 2).toUpperCase() : 'ME'}</Text>
              </LinearGradient>
              <View style={S.onlineBadge} />
            </View>
            <Text style={S.name}>{profileData?.name || 'Vikas'}</Text>
            <Text style={S.role}>{profileData?.employee_role || 'Senior Developer'}</Text>
            

          </View>
        </GradHeader>

        {/* MENU */}
        <View style={S.menu}>
          {PROFILE_MENU.map(item => (
            <TouchableOpacity key={item.id} style={[S.menuItem, Shadows.card]}
              onPress={() => handleMenuPress(item.label)}
              activeOpacity={0.85}>
              <View style={[S.menuIcon, { backgroundColor: item.color }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <Text style={S.menuLabel}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: Colors.txt3 }}>›</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[S.menuItem, S.logoutBtn, Shadows.card]}
            onPress={() => setLogoutVisible(true)}
            activeOpacity={0.85}
          >
            <View style={[S.menuIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={20} color={Colors.sRed} />
            </View>
            <Text style={[S.menuLabel, { color: Colors.sRed }]}>Log Out</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(239, 68, 68, 0.3)" />
          </TouchableOpacity>
        </View>

        <LogoutModal
          visible={logoutVisible}
          onCancel={() => setLogoutVisible(false)}
          onConfirm={handleLogout}
          loading={isLoggingOut}
        />

        {/* Version */}
        <Text style={S.version}>Design and Developed by Kanishka Software</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  hero: { paddingBottom: 40, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' },
  heroContent: { alignItems: 'center' },
  avaContainer: { position: 'relative', marginBottom: 16 },
  ava: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)' },
  onlineBadge: { position: 'absolute', bottom: 5, right: 5, width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', borderWidth: 3, borderColor: '#12C9B8' },
  avaTxt: { color: '#fff', fontWeight: '800', fontSize: 32 },
  name: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  role: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 8 },
  branchTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  dept: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },

  menu: { padding: 24, gap: 12, marginTop: -20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 234, 244, 0.5)'
  },
  menuIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.txt },
  logoutBtn: { marginTop: 8, borderColor: 'rgba(239, 68, 68, 0.1)', backgroundColor: '#fff' },
  version: { textAlign: 'center', color: Colors.txt3, fontSize: 11, fontWeight: '500', marginTop: 10 },
});


