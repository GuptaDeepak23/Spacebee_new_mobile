import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Animated } from 'react-native';
import { GradBtn, PickerHandle } from '../Shared';
import { Colors, Gradients } from '../../theme';

const ITEM_HEIGHT = 48; // Slightly larger for better touch surface
const VISIBLE_ITEMS = 3;

const fmtTime = (h, m, ap) => `${h}:${m.toString().padStart(2, '0')} ${ap}`;

function WheelPicker({ items, selectedValue, onValueChange, label, type, visible }) {
    const scrollRef = useRef(null);
    const selectedIndex = items.indexOf(selectedValue);

    // Sync scroll to state if it changes from outside
    useEffect(() => {
        if (scrollRef.current && selectedIndex !== -1) {
            scrollRef.current.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
        }
    }, [visible]); // Re-center when modal opens

    const onMomentumScrollEnd = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        if (index >= 0 && index < items.length) {
            onValueChange(items[index]);
        }
    };

    return (
        <View style={T.wheelCol}>
            <Text style={T.spinnerLbl}>{label}</Text>
            <View style={T.wheelWindow}>
                {/* Selection Highlight - centered in the window */}
                <View style={T.highlight} />
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }} // Padding for TOP/BOTTOM items
                    scrollEventThrottle={16}
                >
                    {items.map((item, i) => {
                        const isSelected = item === selectedValue;
                        const displayVal = type === 'minute' || type === 'hour' && item < 10 && false
                            ? item.toString().padStart(2, '0')
                            : item.toString();

                        return (
                            <View key={i} style={T.wheelItem}>
                                <Text style={[T.wheelText, isSelected && T.wheelTextActive]}>
                                    {displayVal}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

export default function TimePickerModal({
    visible,
    timeStep,
    pickH, pickM, pickAP,
    onSetH, onSetM, onSetAP,
    onNextOrConfirm,
    onCancel,
    startH, startM, startAP,
    endH, endM, endAP,
}) {
    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods = ['AM', 'PM'];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={S.overlay}>
                <View style={[S.sheet, { paddingBottom: 40 }]}>
                    <PickerHandle />
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <Text style={S.sheetTitle}>⏰ Set Time</Text>
                    </View>

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

                    {/* ── WHEEL ROW ── */}
                    <View style={T.container}>
                        <WheelPicker
                            label="HH"
                            type="hour"
                            items={hours}
                            selectedValue={pickH}
                            onValueChange={onSetH}
                            visible={visible}
                        />
                        <Text style={T.colon}>:</Text>
                        <WheelPicker
                            label="MM"
                            type="minute"
                            items={minutes}
                            selectedValue={pickM}
                            onValueChange={onSetM}
                            visible={visible}
                        />
                        <View style={{ width: 15 }} />
                        <WheelPicker
                            label="  "
                            items={periods}
                            selectedValue={pickAP}
                            onValueChange={onSetAP}
                            visible={visible}
                        />
                    </View>

                    {/* Buttons */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
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
    sheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 },
    sheetTitle: { fontSize: 18, fontWeight: '700', color: Colors.txt, textAlign: 'center' },
    stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 },
    stepArrow: { color: Colors.txt3, fontSize: 14, fontWeight: '700' },
    stepChip: {
        backgroundColor: Colors.bg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10,
        borderWidth: 1.5, borderColor: Colors.border,
    },
    stepChipActive: { backgroundColor: Colors.primary + '10', borderColor: Colors.primary },
    stepTxt: { fontSize: 13, color: Colors.txt2, fontWeight: '600' },
    stepTxtActive: { color: Colors.primary, fontWeight: '700' },
    calCancel: {
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 18,
        paddingVertical: 16, alignItems: 'center', paddingHorizontal: 28,
    },
    calCancelTxt: { fontSize: 15, color: Colors.txt2, fontWeight: '600' },
});

const T = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: ITEM_HEIGHT * VISIBLE_ITEMS + 20, // Extra vertical padding inside
        backgroundColor: Colors.bg + '70', // Slightly transparent background
        borderRadius: 24,
        paddingHorizontal: 20,
        marginVertical: 12,
    },
    wheelCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'center' },
    wheelWindow: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: '100%',
        overflow: 'hidden',
    },
    wheelItem: {
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    highlight: {
        position: 'absolute',
        top: ITEM_HEIGHT,
        left: 4,
        right: 4,
        height: ITEM_HEIGHT,
        backgroundColor: Colors.primary + '12',
        borderRadius: 14,
    },
    wheelText: {
        fontSize: 15,
        color: Colors.txt3,
        fontWeight: '500',
    },
    wheelTextActive: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: '800',
    },
    spinnerLbl: {
        fontSize: 9,
        color: Colors.txt3,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    colon: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.txt2,
        marginTop: 18, // Adjust based on labels
    },
});
