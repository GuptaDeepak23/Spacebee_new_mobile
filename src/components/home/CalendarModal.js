// src/components/home/CalendarModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { GradBtn, PickerHandle } from '../Shared';
import { Colors, Gradients } from '../../theme';

const fmtLabel = (dateStr) => {
    if (!dateStr) return '—';
    const [, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]}`;
};

export default function CalendarModal({
    visible,
    showCalendar,
    CalendarComponent,
    fromDate,
    toDate,
    today,
    dateStep,
    markedDates,
    onDayPress,
    onConfirm,
    onCancel,
    onShow,
}) {
    return (
        <Modal visible={visible} transparent animationType="slide" onShow={onShow}>
            <View style={S.overlay}>
                <View style={S.calSheet}>
                    <PickerHandle />
                    <Text style={S.sheetTitle}>📅 Select Date Range</Text>

                    {/* Step chips */}
                    <View style={S.stepRow}>
                        <View style={[S.stepChip, dateStep === 'from' && S.stepChipActive]}>
                            <Text style={[S.stepTxt, dateStep === 'from' && S.stepTxtActive]}>
                                From: {fmtLabel(fromDate)}
                            </Text>
                        </View>
                        <Text style={S.stepArrow}>→</Text>
                        <View style={[S.stepChip, dateStep === 'to' && S.stepChipActive]}>
                            <Text style={[S.stepTxt, dateStep === 'to' && S.stepTxtActive]}>
                                To: {toDate ? fmtLabel(toDate) : 'Select...'}
                            </Text>
                        </View>
                    </View>
                    <Text style={S.stepHint}>
                        {dateStep === 'from' ? 'Tap a start date' : 'Tap an end date'}
                    </Text>

                    {showCalendar && CalendarComponent && (
                        <CalendarComponent
                            onDayPress={onDayPress}
                            markingType="period"
                            markedDates={markedDates}
                            minDate={today}
                            theme={{
                                backgroundColor: '#fff', calendarBackground: '#fff',
                                selectedDayBackgroundColor: Colors.primary, selectedDayTextColor: '#fff',
                                todayTextColor: Colors.primary, dayTextColor: Colors.txt,
                                textDisabledColor: Colors.txt3, arrowColor: Colors.primary,
                                monthTextColor: Colors.txt, textSectionTitleColor: Colors.txt2,
                                textDayFontWeight: '500', textMonthFontWeight: '700',
                                textDayHeaderFontWeight: '600',
                            }}
                        />
                    )}

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                        <TouchableOpacity style={S.calCancel} onPress={onCancel}>
                            <Text style={S.calCancelTxt}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <GradBtn label="Confirm Dates ✓" colors={Gradients.green} onPress={onConfirm} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const S = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    calSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26,
        padding: 20, paddingBottom: 24,
    },
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
