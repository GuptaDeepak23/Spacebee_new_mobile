// src/screens/PrivacySecurityScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme';

export default function PrivacySecurityScreen({ navigation }) {
    return (
        <SafeAreaView style={S.safe}>
            <View style={S.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.txt} />
                </TouchableOpacity>
                <Text style={S.title}>Privacy & Security</Text>
            </View>
            <ScrollView contentContainerStyle={S.content}>
                <View style={[S.card, Shadows.card]}>
                    <Text style={S.sectionTitle}>Privacy Policy</Text>
                    <Text style={S.text}>Our privacy policy describes how we collect, use, and protect your personal information.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Our privacy policy describes how we collect, use, and protect your personal information.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Our privacy policy describes how we collect, use, and protect your personal information.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Our privacy policy describes how we collect, use, and protect your personal information.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>

                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

const S = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: '#fff' },
    backBtn: { marginRight: 15 },
    title: { fontSize: 20, fontWeight: '700', color: Colors.txt },
    content: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.txt, marginBottom: 10 },
    text: { fontSize: 14, color: Colors.txt2, lineHeight: 20, marginBottom: 15 },
    link: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
    linkLast: { borderBottomWidth: 0 },
    linkText: { fontSize: 15, color: Colors.teal, fontWeight: '600' },
});
