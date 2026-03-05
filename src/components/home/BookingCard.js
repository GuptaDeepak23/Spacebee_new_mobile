// src/components/home/BookingCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBadge, MetaRow } from '../Shared';
import { Colors } from '../../theme';
import { statusStyle } from '../../theme';

export default function BookingCard({ booking }) {
    const ss = statusStyle(booking.status);
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

    return (
        <View style={S.card}>
            <LinearGradient colors={ss.bar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 3 }} />
            <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View style={S.icon}><Text style={{ fontSize: 16 }}>🏢</Text></View>
                    <StatusBadge status={booking.status} />
                </View>
                <Text style={S.name} numberOfLines={1}>{booking.room?.name || 'No Name'}</Text>
                <Text style={S.loc}>📍 {booking.room?.branch_name || 'No Location'}</Text>
                <MetaRow icon="📅" text={fmtDate(booking.start_time)} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={{ fontSize: 10, color: Colors.txt2, marginBottom: 10, marginTop: 2 }}>⏰ {fmtHHMM(booking.start_time)} - {fmtHHMM(booking.end_time)}</Text>
                    <Text style={{ fontSize: 12, color: Colors.txt2 }}>.</Text>
                    <Text style={{ fontSize: 10, color: Colors.txt2, marginBottom: 10, marginTop: 2 }}>{`${booking.booking_duration} `}</Text>
                </View>
            </View>
        </View>
    );
}

const S = StyleSheet.create({
    card: { width: 210, backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
    icon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EBF2FC', alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: 13, fontWeight: '700', color: Colors.txt },
    loc: { fontSize: 10.5, color: Colors.txt2, marginBottom: 10, marginTop: 2 },
});
