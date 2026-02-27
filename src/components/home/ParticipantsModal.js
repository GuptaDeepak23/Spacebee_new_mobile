// src/components/home/ParticipantsModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { GradBtn, PickerHandle, CtrBtn } from '../Shared';
import { Colors, Gradients } from '../../theme';

export default function ParticipantsModal({ visible, tempPart, onDecrement, onIncrement, onConfirm, onClose }) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={S.overlay} activeOpacity={1} onPress={onClose}>
                <View style={[S.sheet, { paddingBottom: 30 }]}>
                    <PickerHandle />
                    <Text style={S.sheetTitle}>Number of Participants</Text>
                    <View style={S.ctrRow}>
                        <CtrBtn icon="−" onPress={onDecrement} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={S.ctrNum}>{tempPart}</Text>
                            <Text style={{ color: Colors.txt2, fontSize: 12 }}>people</Text>
                        </View>
                        <CtrBtn icon="+" onPress={onIncrement} />
                    </View>
                    <GradBtn label="Confirm" colors={Gradients.green} onPress={onConfirm} />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const S = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20 },
    sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.txt, textAlign: 'center', marginBottom: 14 },
    ctrRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, paddingVertical: 24 },
    ctrNum: { fontSize: 48, fontWeight: '700', color: Colors.primary, lineHeight: 52 },
});
