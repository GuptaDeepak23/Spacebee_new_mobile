// src/components/home/BranchModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { PickerHandle } from '../Shared';
import { Colors } from '../../theme';

export default function BranchModal({ visible, branches, selected, onSelect, onClose }) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={S.overlay} activeOpacity={1} onPress={onClose}>
                <View style={S.sheet}>
                    <PickerHandle />
                    <Text style={S.sheetTitle}>Select Office Branch</Text>
                    {branches.map((b) => (
                        <TouchableOpacity
                            key={b}
                            style={S.pickRow}
                            onPress={() => { onSelect(b); onClose(); }}
                        >
                            <Text>📍</Text>
                            <Text style={[S.pickTxt, b === selected && { color: Colors.primary, fontWeight: '600' }]}>
                                {b}
                            </Text>
                            {b === selected && <Text style={{ color: Colors.primary }}>✓</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const S = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20 },
    sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.txt, textAlign: 'center', marginBottom: 14 },
    pickRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
    pickTxt: { flex: 1, fontSize: 13, color: Colors.txt },
});
