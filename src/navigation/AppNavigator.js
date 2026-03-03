// src/navigation/AppNavigator.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

// Auth
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginEmailScreen from '../screens/LoginEmailScreen';
import LoginOTPScreen from '../screens/LoginOTPScreen';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import BookRoomScreen from '../screens/BookRoomScreen';
import ReviewScreen from '../screens/ReviewScreen';
import SuccessScreen from '../screens/SuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

// ── NAV TAB CONFIG ──────────────────────────────────────
const NAV_TABS = [
  { name: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'Explore', label: 'Explore', icon: 'search-outline', iconActive: 'search' },
  { name: 'Bookings', label: 'Bookings', icon: 'bar-chart-outline', iconActive: 'bar-chart' },
  { name: 'Profile', label: 'Profile', icon: 'person-circle-outline', iconActive: 'person-circle' },
];

const NAV_BG = '#111827';               // Soft Elevated Bar Background
const NAV_BG_GLASS = 'rgba(17, 24, 39, 0.7)'; // Transparent glass effect
const ICON_OFF = 'rgba(255,255,255,0.6)'; // inactive icon colour

// ── CUSTOM PILL TAB BAR ─────────────────────────────────
function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[TB.safeWrap, { bottom: Math.max(insets.bottom, 16) + 10 }]}
      pointerEvents="box-none"
    >
      <View style={TB.pillShadowContainer} pointerEvents="auto">
        <BlurView intensity={40} tint="dark" style={TB.pill}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const tabInfo = NAV_TABS.find(t => t.name === route.name) || NAV_TABS[0];
            const onPress = () => { if (!focused) navigation.navigate(route.name); };

            return (
              <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.85}>
                <Animated.View
                  layout={LinearTransition.springify().damping(15).stiffness(120)}
                  style={focused ? TB.activeCapsule : TB.iconBtn}
                >
                  <Ionicons
                    name={focused ? tabInfo.iconActive : tabInfo.icon}
                    size={focused ? 18 : 22}
                    color={focused ? NAV_BG : ICON_OFF}
                  />
                  {focused && (
                    <Animated.Text
                      entering={FadeIn.duration(200)}
                      exiting={FadeOut.duration(200)}
                      style={TB.activeLabel}
                      numberOfLines={1}
                    >
                      {tabInfo.label}
                    </Animated.Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

const TB = StyleSheet.create({
  safeWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 1000 },
  pillShadowContainer: {
    borderRadius: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 8,
  },
  pill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: NAV_BG_GLASS,
    borderRadius: 30, paddingVertical: 8, paddingHorizontal: 10, gap: 4,
    overflow: 'hidden',
  },
  iconBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  activeCapsule: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, paddingVertical: 10, paddingHorizontal: 16, gap: 7 },
  activeLabel: { fontSize: 13, fontWeight: '700', color: NAV_BG, letterSpacing: 0.1 },
});

// ── AUTH NAVIGATOR ──────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <AuthStack.Screen name="LoginEmail" component={LoginEmailScreen} />
      <AuthStack.Screen name="LoginOTP" component={LoginOTPScreen} />
    </AuthStack.Navigator>
  );
}

// ── MAIN TAB NAVIGATOR ──────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ── APP SCREENS (Stack) ──────────────────────────────────
function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="BookRoom" component={BookRoomScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// ── ROOT NAVIGATION CONTROL ─────────────────────────────
function NavigationContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={NAV_BG} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContent />
    </AuthProvider>
  );
}
