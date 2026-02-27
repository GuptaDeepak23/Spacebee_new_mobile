// src/components/home/TimePickerModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { GradBtn, PickerHandle } from '../Shared';
import { Colors, Gradients } from '../../theme';

const fmtTime = (h, m, ap) => `${h}:${m.toString().padStart(2, '0')} ${ap}`;

export default function TimePickerModal({
    visible,
    timeStep,
    pickH, pickM, pickAP,
    startH, startM, startAP,
    endH, endM, endAP,
    onIncH, onDecH,
    onIncM, onDecM,
    onSetAP,
    onNextOrConfirm,
    onCancel,
}) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={S.overlay}>
                <View style={[S.sheet, { paddingBottom: 32 }]}>
                    <PickerHandle />
                    <Text style={S.sheetTitle}>⏰ Set Time</Text>

                    {/* Step indicator */}
                    <View style={S.stepRow}>
                        <View style={[S.stepChip, timeStep === 'start' && S.stepChipActive]}>
                            <Text style={[S.stepTxt, timeStep === 'start' && S.stepTxtActive]}>
                                Start: {fmtTime(
                                    timeStep === 'start' ? pickH : startH,
                                    timeStep === 'start' ? pickM : startM,
                                    timeStep === 'start' ? pickAP : startAP,
                                )}
                            </Text>
                        </View>
                        <Text style={S.stepArrow}>→</Text>
                        <View style={[S.stepChip, timeStep === 'end' && S.stepChipActive]}>
                            <Text style={[S.stepTxt, timeStep === 'end' && S.stepTxtActive]}>
                                End: {fmtTime(
                                    timeStep === 'end' ? pickH : endH,
                                    timeStep === 'end' ? pickM : endM,
                                    timeStep === 'end' ? pickAP : endAP,
                                )}
                            </Text>
                        </View>
                    </View>
                    <Text style={S.stepHint}>
                        {timeStep === 'start' ? 'Set when the booking starts' : 'Set when the booking ends'}
                    </Text>

                    {/* ── SPINNER ROW ── */}
                    <View style={T.row}>

                        {/* Hour */}
                        <View style={T.spinnerCol}>
                            <Text style={T.spinnerLbl}>HH</Text>
                            <TouchableOpacity style={T.arrowBtn} onPress={onIncH} activeOpacity={0.7}>
                                <Text style={T.arrowTxt}>▲</Text>
                            </TouchableOpacity>
                            <View style={T.numBox}>
                                <Text style={T.num}>{pickH.toString().padStart(2, '0')}</Text>
                            </View>
                            <TouchableOpacity style={T.arrowBtn} onPress={onDecH} activeOpacity={0.7}>
                                <Text style={T.arrowTxt}>▼</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={T.colon}>:</Text>

                        {/* Minute */}
                        <View style={T.spinnerCol}>
                            <Text style={T.spinnerLbl}>MM</Text>
                            <TouchableOpacity style={T.arrowBtn} onPress={onIncM} activeOpacity={0.7}>
                                <Text style={T.arrowTxt}>▲</Text>
                            </TouchableOpacity>
                            <View style={T.numBox}>
                                <Text style={T.num}>{pickM.toString().padStart(2, '0')}</Text>
                            </View>
                            <TouchableOpacity style={T.arrowBtn} onPress={onDecM} activeOpacity={0.7}>
                                <Text style={T.arrowTxt}>▼</Text>
                            </TouchableOpacity>
                        </View>

                        {/* AM / PM */}
                        <View style={T.ampmCol}>
                            <Text style={T.spinnerLbl}>  </Text>
                            <TouchableOpacity
                                style={[T.ampmBtn, pickAP === 'AM' && T.ampmActive]}
                                onPress={() => onSetAP('AM')} activeOpacity={0.8}
                            >
                                <Text style={[T.ampmTxt, pickAP === 'AM' && T.ampmTxtActive]}>AM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[T.ampmBtn, pickAP === 'PM' && T.ampmActive]}
                                onPress={() => onSetAP('PM')} activeOpacity={0.8}
                            >
                                <Text style={[T.ampmTxt, pickAP === 'PM' && T.ampmTxtActive]}>PM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                        <TouchableOpacity style={S.calCancel} onPress={onCancel}>
                            <Text style={S.calCancelTxt}>{timeStep === 'end' ? '← Back' : 'Cancel'}</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <GradBtn
                                label={timeStep === 'start' ? 'Next: End Time →' : 'Confirm Time ✓'}
                                colors={Gradients.green}
                                onPress={onNextOrConfirm}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const S = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20 },
    sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.txt, textAlign: 'center', marginBottom: 14 },
    stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 },
    stepArrow: { color: Colors.txt3, fontSize: 14, fontWeight: '700' },
    stepChip: {
        backgroundColor: Colors.bg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
        borderWidth: 1.5, borderColor: Colors.border,
    },
    stepChipActive: { backgroundColor: Colors.primary + '18', borderColor: Colors.primary },
    stepTxt: { fontSize: 11, color: Colors.txt2, fontWeight: '600' },
    stepTxtActive: { color: Colors.primary, fontWeight: '700' },
    stepHint: { textAlign: 'center', fontSize: 11.5, color: Colors.txt3, marginBottom: 16 },
    calCancel: {
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
        paddingVertical: 14, alignItems: 'center', paddingHorizontal: 20,
    },
    calCancelTxt: { fontSize: 13, color: Colors.txt2, fontWeight: '600' },
});

const T = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8 },
    spinnerCol: { alignItems: 'center', gap: 6 },
    spinnerLbl: { fontSize: 9, color: Colors.txt3, fontWeight: '600', letterSpacing: 0.5 },
    arrowBtn: {
        width: 44, height: 36, borderRadius: 10, backgroundColor: Colors.bg,
        borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
    },
    arrowTxt: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
    numBox: {
        width: 72, height: 64, borderRadius: 16, backgroundColor: Colors.primary + '12',
        borderWidth: 2, borderColor: Colors.primary + '30', alignItems: 'center', justifyContent: 'center',
    },
    num: { fontSize: 34, fontWeight: '800', color: Colors.primary, lineHeight: 38 },
    colon: { fontSize: 32, fontWeight: '800', color: Colors.txt2, marginTop: 28, paddingHorizontal: 2 },
    ampmCol: { alignItems: 'center', gap: 8, marginTop: 20 },
    ampmBtn: {
        width: 56, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.bg,
        borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
    },
    ampmActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    ampmTxt: { fontSize: 12, fontWeight: '700', color: Colors.txt2 },
    ampmTxtActive: { color: '#fff' },
});
