// src/screens/LoginEmailScreen.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRequestOtp } from '../../api/hooks/useApi';

const MINT_GREEN = '#22BF96';

export default function LoginEmailScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const { mutate: requestOtp, isPending } = useRequestOtp();

    const handleSendOtp = () => {
        requestOtp(
            email,
            {
                onSuccess: (data) => {
                    console.log("OTP sent successfully", data);
                    navigation.navigate('LoginOTP', { email });
                }
            }
        );
    }

    const handleNext = () => {
        if (!email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        handleSendOtp();
    };

    return (
        <SafeAreaView style={S.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={S.scroll}>
                    <View style={S.header}>
                        <View>
                            <Image source={require('../../assets/spacebee.png')} style={S.logo} />
                        </View>
                        <Text style={S.title}>Welcome to Spacebee</Text>
                        <Text style={S.subtitle}>Enter your work email to continue</Text>
                    </View>

                    <View style={S.form}>
                        <View style={S.inputContainer}>
                            <Text style={S.label}>EMAIL ADDRESS <Text style={{ color: 'red' }}>*</Text></Text>
                            <TextInput
                                style={S.input}
                                placeholder="yours@company.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <TouchableOpacity
                            style={S.button}
                            onPress={handleNext}
                            activeOpacity={0.8}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={S.buttonText}>Send OTP Code</Text>
                            )}
                        </TouchableOpacity>


                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const S = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    logoCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#F0F9F6', alignItems: 'center',
        justifyContent: 'center', marginBottom: 20
    },
    logoText: { fontSize: 40 },
    title: { fontSize: 24, fontWeight: '800', color: '#1E1B6E', marginBottom: 8 },
    subtitle: { fontSize: 15, color: '#666', textAlign: 'center' },
    logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 10 },
    form: { width: '100%' },
    inputContainer: { marginBottom: 24 },
    label: { fontSize: 11, fontWeight: '700', color: '#1E1B6E', marginBottom: 8, letterSpacing: 1 },
    input: {
        backgroundColor: '#F5F7FA', borderRadius: 12,
        padding: 16, fontSize: 16, color: '#1E1B6E',
        borderWidth: 1, borderColor: '#E1E5EB'
    },
    button: {
        backgroundColor: MINT_GREEN, borderRadius: 12,
        padding: 18, alignItems: 'center', shadowColor: MINT_GREEN,
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
        shadowRadius: 8, elevation: 4
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footerText: {
        marginTop: 24, fontSize: 12, color: '#999',
        textAlign: 'center', lineHeight: 18
    }
});
