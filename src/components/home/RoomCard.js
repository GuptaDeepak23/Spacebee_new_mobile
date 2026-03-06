// src/components/home/RoomCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoomThumb } from '../Shared';
import { Colors, IS_TABLET } from '../../theme';


export default function RoomCard({ room }) {
    const isAvailable = room.is_available === true || room.status === 'available';
    return (
        <View style={S.card}>
            <RoomThumb theme={room.theme} />
            <View style={{ flex: 1, marginLeft: IS_TABLET ? 16 : 11 }}>
                <Text style={[S.name, IS_TABLET && { fontSize: 16 }]} numberOfLines={1}>{room.name}</Text>
                <Text style={[S.floor, IS_TABLET && { fontSize: 13 }]} numberOfLines={1}>🏠 {room.floor}</Text>
                <Text style={{ fontSize: IS_TABLET ? 13 : 10.5, color: Colors.txt2 }}>👥 Up to {room.capacity} people</Text>
            </View>
            <View style={[S.avail, IS_TABLET && { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }, { backgroundColor: isAvailable ? '#D1FAE5' : '#FEE2E2' }]}>
                <Text style={{ fontSize: IS_TABLET ? 13 : 10.5, fontWeight: '600', color: isAvailable ? Colors.sGreen : Colors.sRed }}>
                    {isAvailable ? 'Available' : 'Occupied'}
                </Text>
            </View>

        </View>
    );
}

const S = StyleSheet.create({
    card: { backgroundColor: '#fff', borderRadius: 18, padding: 13, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: Colors.border },
    name: { fontSize: 12.5, fontWeight: '700', color: Colors.txt },
    floor: { fontSize: 10.5, color: Colors.txt2, marginBottom: 6, marginTop: 2 },
    avail: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-end' },
});
