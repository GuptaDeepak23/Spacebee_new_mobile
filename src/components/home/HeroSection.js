// src/components/home/HeroSection.js
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradBtn } from '../Shared';
import { Colors, Gradients, IS_TABLET } from '../../theme';

import { ActivityIndicator } from 'react-native';
import { useProfile } from '../../../api/hooks/useApi';
export default function HeroSection({
    heroHeight,
    formOpacity,
    branch,
    dateLabel,
    timeLabel,
    toDate,
    fromDate,
    participants,
    onBranchPress,
    onDatePress,
    onTimePress,
    onParticipantsPress,
    onFindRooms,
    startH, startM, startAP,
    endH, endM, endAP,
    isLoading
}) {
    const handleFindRooms = () => {
        onFindRooms({
            branch,
            dateLabel,
            timeLabel,
            toDate,
            fromDate,
            participants,
            startH, startM, startAP,
            endH, endM, endAP,
        });
    };

      const { data: profileData, isLoading: profileLoading } = useProfile();

    return (

      

        <Animated.View style={[S.heroAnimWrap, { height: heroHeight }]}>
            <ImageBackground
                source={require('../../../assets/dum.jpg')}
                style={{ flex: 1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' }}
                resizeMode="cover"
            >
                <View style={[S.heroOverlay, { flex: 1 }]}>

                    {/* Top row — always visible even when collapsed */}
                    {/* Top row — always visible even when collapsed */}
                    <View style={S.heroTop}>
                        {/* Left: Hello Message */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                            <LinearGradient colors={Gradients.avatar} style={S.ava}>
                                <Text style={S.avaTxt}>{profileData?.name.charAt(0).toUpperCase()}</Text>
                            </LinearGradient>
                            <View style={{ marginLeft: IS_TABLET ? 16 : 10 }}>
                                <Text style={[S.hiSub, IS_TABLET && { fontSize: 13 }]}>Hello,</Text>
                                <Text style={[S.hiName, IS_TABLET && { fontSize: 16 }]} numberOfLines={1}>{profileData?.name} 👋</Text>
                            </View>
                        </View>

                        {/* Right: Branch Selector */}
                        <TouchableOpacity style={S.branchSelector} onPress={onBranchPress} activeOpacity={0.8}>
                            <Text style={S.glassIconSmall}>📍</Text>
                            <View style={{ marginLeft: 8, flexShrink: 1 }}>
                                <Text style={S.glassLblSmall}>OFFICE BRANCH</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <Text style={S.glassValSmall} numberOfLines={1}>
                                        {branch?.name || branch || 'Select Branch'}
                                    </Text>
                                    <Text style={S.glassCaretSmall}>▾</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>


                    {/* Title + form — fade out as hero collapses */}
                    <Animated.View style={[{ opacity: formOpacity }, IS_TABLET && { alignItems: 'center' }]}>
                        <Text style={[S.heroTitle, IS_TABLET && { textAlign: 'center', fontSize: 32, marginBottom: 30 }]}>
                            Which workspace do you{'\n'}want to book?
                        </Text>

                        {/* ── GLASS SEARCH CARD ── */}
                        <View style={[S.glassCard, IS_TABLET && { width: '80%', maxWidth: 700 }]}>


                            {/* 1. Branch */}




                            {/* 2. Date Range */}
                            <TouchableOpacity style={S.glassRowFull} onPress={onDatePress} activeOpacity={0.8}>
                                <Text style={S.glassIcon}>📅</Text>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={S.glassLbl}>DATE RANGE</Text>
                                    <Text style={S.glassVal} numberOfLines={1}>{dateLabel}</Text>
                                </View>
                                <View style={S.glassTag}>
                                    <Text style={S.glassTagTxt}>
                                        {toDate && toDate !== fromDate ? 'Multi-day' : 'Single'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={S.glassDivider} />

                            {/* 3. Time + 4. Participants */}
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <TouchableOpacity style={[S.glassField, { flex: 6 }]} onPress={onTimePress} activeOpacity={0.8}>
                                    <Text style={S.glassLbl}>⏰  TIME</Text>
                                    <Text style={S.glassVal} numberOfLines={1}>{timeLabel}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[S.glassField, { flex: 4 }]} onPress={onParticipantsPress} activeOpacity={0.8}>
                                    <Text style={S.glassLbl}>👥  PEOPLE</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                        <Text style={S.glassVal}>{participants}</Text>
                                        <Text style={[S.glassVal, { fontSize: 11, opacity: 0.7, marginLeft: 4 }]}>▾</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 16 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#22BF96', padding: 12, borderRadius: 12, opacity: isLoading ? 0.7 : 1 }}
                                    onPress={handleFindRooms}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center' }}>🔍 Find Available Rooms</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>

                </View>
            </ImageBackground>
        </Animated.View>

    );
}

const S = StyleSheet.create({
    heroAnimWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, overflow: 'hidden' },
    heroOverlay: { backgroundColor: 'rgba(0,0,0,0.52)', paddingTop: 14, paddingHorizontal: 20, paddingBottom: 26 },
    heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '10%' },
    ava: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
    avaTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
    hiSub: { fontSize: 10.5, color: 'rgba(255,255,255,0.6)' },
    hiName: { fontSize: 14, color: '#fff', fontWeight: '700' },
    heroTitle: { fontSize: 23, fontWeight: '800', color: '#fff', lineHeight: 31, letterSpacing: -0.3, marginBottom: 20, marginTop: '5%' },
    glassCard: { backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', gap: 8 },
    branchSelector: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14, maxWidth: IS_TABLET ? '60%' : '45%' },
    glassRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14, width: "60%" },
    glassRowFull: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14 },
    glassField: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14 },
    glassIcon: { fontSize: 18 },
    glassIconSmall: { fontSize: 14 },
    glassLbl: { fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: '600', letterSpacing: 0.6 },
    glassLblSmall: { fontSize: 8, color: 'rgba(255,255,255,0.65)', fontWeight: '600', letterSpacing: 0.4 },
    glassVal: { fontSize: 13, color: '#fff', fontWeight: '700', marginTop: 3 },
    glassValSmall: { fontSize: 11, color: '#fff', fontWeight: '700', flexShrink: 1 },
    glassCaret: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 3 },
    glassCaretSmall: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    glassDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 2 },
    glassTag: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
    glassTagTxt: { fontSize: 9.5, color: '#fff', fontWeight: '600' },
});

