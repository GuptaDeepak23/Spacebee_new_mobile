// src/screens/LoginOTPScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { IS_TABLET } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useVerifyOtp, useRequestOtp } from '../../api/hooks/useApi';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

const MINT_GREEN = '#22BF96';

export default function LoginOTPScreen({ route, navigation }) {
    const { email } = route.params;
    const { login } = useAuth();
    const { mutate: verifyOtpMutation, isPending } = useVerifyOtp();
    const { mutate: requestOtpMutation } = useRequestOtp();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const inputs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = () => {
        if (timer > 0) return;

        requestOtpMutation(email, {
            onSuccess: () => {
                setTimer(60);
                setOtp(['', '', '', '', '', '']);
                inputs.current[0]?.focus();
            }
        });
    };

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text.length !== 0 && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length < 6) {
            alert('Please enter the 6-digit code');
            return;
        }

        verifyOtpMutation({ email, otp: code }, {
            onSuccess: async (data) => {
                await SecureStore.setItemAsync("accessToken", data.access_token);
                Toast.show({
                    type: 'success',
                    text1: 'OTP verified successfully',
                    text2: data.message,
                });
                login(email, data.user);
            },
            onError: (error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
            }
        });
    };

    return (
        <SafeAreaView style={S.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={S.scroll}>
                    <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={S.backBtnText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={S.header}>
                        <Text style={S.title}>Verification</Text>
                        <Text style={S.subtitle}>
                            We've sent a code to <Text style={S.emailBold}>{email}</Text>
                        </Text>
                    </View>

                    <View style={S.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={S.otpInput}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                ref={(ref) => (inputs.current[index] = ref)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={S.button}
                        onPress={handleVerify}
                        activeOpacity={0.8}
                        disabled={verifyOtpMutation.isPending}
                    >
                        {isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={S.buttonText}>Verify & Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={S.resendBtn}
                        onPress={handleResend}
                        disabled={timer > 0}
                    >
                        <Text style={S.resendText}>
                            Didn't receive a code?{' '}
                            <Text style={[S.resendLink, timer > 0 && { color: '#999' }]}>
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const S = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    scroll: { flexGrow: 1, padding: 24 },
    backBtn: { marginBottom: 30 },
    backBtnText: { color: '#1E1B6E', fontSize: 16, fontWeight: '600' },
    header: { marginBottom: IS_TABLET ? 60 : 40 },
    title: { fontSize: IS_TABLET ? 32 : 28, fontWeight: '800', color: '#1E1B6E', marginBottom: 12 },
    subtitle: { fontSize: IS_TABLET ? 18 : 16, color: '#666', lineHeight: 24 },
    emailBold: { fontWeight: '700', color: '#1E1B6E' },
    otpContainer: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginBottom: IS_TABLET ? 60 : 40, gap: 2
    },
    otpInput: {
        width: IS_TABLET ? 60 : 50, height: IS_TABLET ? 70 : 60, backgroundColor: '#F5F7FA',
        borderRadius: 12, borderWidth: 1, borderColor: '#E1E5EB',
        textAlign: 'center', fontSize: IS_TABLET ? 28 : 24, fontWeight: '700', color: '#1E1B6E'
    },
    button: {
        backgroundColor: MINT_GREEN, borderRadius: 12,
        padding: IS_TABLET ? 20 : 18, alignItems: 'center'
    },
    buttonText: { color: '#fff', fontSize: IS_TABLET ? 18 : 16, fontWeight: '700' },
    resendBtn: { marginTop: IS_TABLET ? 40 : 30, alignItems: 'center' },
    resendText: { color: '#666', fontSize: IS_TABLET ? 18 : 14 },
    resendLink: { color: MINT_GREEN, fontWeight: '700' }
});
