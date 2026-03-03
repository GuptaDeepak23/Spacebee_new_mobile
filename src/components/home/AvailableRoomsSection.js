import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SecHd } from '../Shared';
import RoomCard from './RoomCard';

export default function AvailableRoomsSection({
    hasSearched,
    searchQueryLabel,
    rooms,
    onBookRoom,
    onSeeAll,
}) {
    const title = hasSearched ? `Available for ${searchQueryLabel}` : "Available Now ✨";

    return (
        <Animated.View
            layout={LinearTransition.springify().damping(15).stiffness(120)}
            style={S.sec}
        >
            <SecHd title={title} action="See all" onAction={onSeeAll} />

            {/* We use a key based on hasSearched to force a re-render animation when searching happens */}
            <Animated.View key={hasSearched ? 'searched' : 'default'} entering={FadeInDown.duration(400).springify()}>
                {rooms.map((room) => (
                    <TouchableOpacity
                        key={room.id}
                        onPress={() => onBookRoom(room)}
                        activeOpacity={0.85}
                        style={{ marginBottom: 10 }}
                    >
                        <RoomCard room={room} />
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </Animated.View>
    );
}

const S = StyleSheet.create({
    sec: { paddingHorizontal: 18, marginTop: 22 },
});
