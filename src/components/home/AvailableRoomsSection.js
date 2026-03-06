import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, IS_TABLET } from '../../theme';

import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SecHd } from '../Shared';
import RoomCard from './RoomCard';

export default function AvailableRoomsSection({
    hasSearched,
    searchQueryLabel,
    rooms,
    onBookRoom,
    onSeeAll,
    onClearSearch,
    isLoading,
}) {
    const title = hasSearched ? `Available for ${searchQueryLabel}` : "Available Now ✨";

    return (
        <Animated.View
            layout={LinearTransition.springify().damping(15).stiffness(120)}
            style={S.sec}
        >
            <SecHd
                title={title}
                action="See all"
                onAction={onSeeAll}
                secondaryAction={hasSearched ? "Clear" : null}
                onSecondaryAction={onClearSearch}

            />

            {/* We use a key based on hasSearched to force a re-render animation when searching happens */}
            <Animated.View key={hasSearched ? 'searched' : 'default'} entering={FadeInDown.duration(400).springify()}>
                {isLoading ? (
                    <View style={S.center}>
                        <ActivityIndicator color={Colors.primary} size="large" />
                        <Text style={S.infoTxt}>Searching for spaces...</Text>
                    </View>
                ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <TouchableOpacity
                            key={room.id}
                            onPress={() => onBookRoom(room)}
                            activeOpacity={0.85}
                            style={{ marginBottom: 10 }}
                        >
                            <RoomCard room={room} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={S.center}>
                        <Text style={S.noRoomIco}>🔍</Text>
                        <Text style={S.infoTxt}>No rooms available for these criteria.</Text>
                    </View>
                )}
            </Animated.View>
        </Animated.View>
    );
}

const S = StyleSheet.create({
    sec: { paddingHorizontal: IS_TABLET ? '8%' : 18, marginTop: 22 },
    center: { alignItems: 'center', paddingVertical: 40, gap: 10 },

    infoTxt: { fontSize: 13, color: Colors.txt3, fontWeight: '500' },
    noRoomIco: { fontSize: 32 },
});
