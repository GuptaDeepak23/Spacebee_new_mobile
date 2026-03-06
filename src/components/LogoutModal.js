// src/components/LogoutModal.js
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Gradients } from '../theme';
import { GradBtn, OutBtn } from './Shared';

export default function LogoutModal({ visible, onCancel, onConfirm, loading }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={S.overlay}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={[S.card, Shadows.lg]}>
                    <View style={S.iconContainer}>
                        <View style={S.iconBg}>
                            <Ionicons name="log-out-outline" size={32} color={Colors.sRed} />
                        </View>
                    </View>

                    <Text style={S.title}>Ready to Log Out?</Text>
                    <Text style={S.subTitle}>
                        Are you sure you want to end your current session? You'll need to login again to book rooms.
                    </Text>

                    <View style={S.footer}>
                        <GradBtn
                            label="Log Out"
                            onPress={onConfirm}
                            colors={['#EF4444', '#DC2626']}
                            style={S.btn}
                            loading={loading}
                        />
                        <TouchableOpacity onPress={onCancel} style={S.cancelBtn} activeOpacity={0.7}>
                            <Text style={S.cancelTxt}>Stay Logged In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const S = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
            android: { elevation: 12 },
        }),
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.txt,
        marginBottom: 10,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        color: Colors.txt2,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
        paddingHorizontal: 10,
    },
    footer: {
        width: '100%',
        gap: 12,
    },
    btn: {
        width: '100%',
    },
    cancelBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelTxt: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.txt3,
    },
});
