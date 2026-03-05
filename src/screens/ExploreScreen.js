// src/screens/ExploreScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradHeader, RoomThumb, RoomTag, StatusBadge, GradBtn } from '../components/Shared';
import { Colors, Shadows, Gradients } from '../theme';
import { ROOMS } from '../data';
import { useExploreRooms } from '../../api/hooks/useApi';
import { ActivityIndicator } from 'react-native';

export default function ExploreScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const searchData = route.params?.searchData;
  const [query, setQuery] = useState('');
  const [avail, setAvail] = useState('all'); // 'all' | 'available' | 'occupied'

  const { data: exploreData, isLoading } = useExploreRooms(avail);

  const rooms = Array.isArray(exploreData) ? exploreData : [];

  const filtered = useMemo(() => {
    let list = rooms;
    if (query) list = list.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
    );
    return list;
  }, [query, rooms]);

  const handleBook = (room) => {
    const isAvail = room.is_available === true || room.status === 'available';
    if (!isAvail) { Alert.alert('Unavailable', 'This room is currently busy.'); return; }
    navigation.navigate('BookRoom', { room, searchData });
  };

  return (
    <SafeAreaView style={S.safe} edges={['bottom']}>
      {/* HEADER */}
      <GradHeader>
        <Text style={S.headTitle}>Explore Rooms</Text>
        <View style={S.searchBar}>
          <Text style={{ fontSize: 14 }}>🔍</Text>
          <TextInput
            style={S.searchInput}
            placeholder="Search rooms"
            placeholderTextColor="rgba(255,255,255,0.55)"
            value={query}
            onChangeText={setQuery}
          />
          {query !== '' && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </GradHeader>

      {/* AVAILABILITY FILTER */}
      <View style={S.filterWrap}>
        <View style={S.filterRow}>
          {['all', 'available', 'occupied'].map(opt => {
            const isActive = avail === opt;
            const label = opt.charAt(0).toUpperCase() + opt.slice(1);
            const dotColor = opt === 'available' ? Colors.sGreen : opt === 'occupied' ? Colors.sRed : Colors.primary;
            return (
              <TouchableOpacity
                key={opt}
                style={[S.chip, isActive && S.chipActive]}
                onPress={() => setAvail(opt)}
              >
                {opt !== 'all' && (
                  <Text style={{ fontSize: 8, color: isActive ? '#fff' : dotColor, marginRight: 4 }}>●</Text>
                )}
                <Text style={[S.chipTxt, isActive && S.chipTxtActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ROOM LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[S.grid, { paddingBottom: 100 + (insets.bottom || 0) }]}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={S.empty}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={S.emptyTxt}>No rooms found</Text>
            <Text style={{ color: Colors.txt3, fontSize: 13 }}>Try different search terms</Text>
          </View>
        ) : (
          filtered.map(room => (
            <TouchableOpacity key={room.id} onPress={() => handleBook(room)}
              activeOpacity={0.85} style={{ marginBottom: 11 }}>
              <ExploreRoomCard room={room} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ExploreRoomCard({ room }) {
  return (
    <View style={[RC.card, Shadows.card]}>
      {/* Left thumb */}
      <RoomThumb theme={room.theme} size={80} />
      <View style={{ flex: 1, marginLeft: 13 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={RC.name} numberOfLines={1}>{room.name}</Text>
            <Text style={RC.floor} numberOfLines={1}>🏠 {room.floor}</Text>
          </View>
          <View style={[RC.avail, { backgroundColor: (room.is_available === true || room.status === 'available') ? '#D1FAE5' : '#FEE2E2' }]}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: (room.is_available === true || room.status === 'available') ? Colors.sGreen : Colors.sRed }}>
              {(room.is_available === true || room.status === 'available') ? '● Available' : '● Occupied'}
            </Text>
          </View>
        </View>
        {/* <View style={{ flexDirection:'row', flexWrap:'wrap', marginBottom:6 }}>
          {room.tags.map((t, i) => <RoomTag key={i} label={t} blue={i%2 === 0} />)}
        </View> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: Colors.txt2 }}>👥 Up to {room.capacity} people</Text>
          {(room.is_available === true || room.status === 'available') && (
            <View style={RC.bookHint}>
              <Text style={{ fontSize: 10, color: Colors.primary, fontWeight: '600' }}>Book Now +</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const RC = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 14, flexDirection: 'row', borderWidth: 1, borderColor: Colors.border },
  name: { fontSize: 13, fontWeight: '700', color: Colors.txt, marginRight: 8 },
  floor: { fontSize: 10.5, color: Colors.txt2, marginBottom: 7, marginTop: 2 },
  avail: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  bookHint: { backgroundColor: '#EBF2FC', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
});

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  headTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: "10%", marginBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },
  filterWrap: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterRow: { flexDirection: 'row', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#fff' },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipTxt: { fontSize: 11.5, color: Colors.txt2, fontWeight: '500' },
  chipTxtActive: { color: '#fff', fontWeight: '600' },
  grid: { padding: 18, paddingTop: 14 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTxt: { fontSize: 16, fontWeight: '700', color: Colors.txt },
});
