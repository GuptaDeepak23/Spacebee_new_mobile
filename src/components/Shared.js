// src/components/Shared.js
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, AVATAR_PALETTE, roomColors, statusStyle, Gradients } from '../theme';

// ── GRADIENT BUTTON ─────────────────────────────────────────
export function GradBtn({ label, onPress, colors = Gradients.green, style, loading = false }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={style} disabled={loading}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[SS.gBtn, Shadows.green]}>
        {loading
          ? <View style={SS.row}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={[SS.gTxt, { marginLeft: 10 }]}>Processing...</Text>
          </View>
          : <Text style={SS.gTxt}>{label}</Text>
        }
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── OUTLINE BUTTON ──────────────────────────────────────────
export function OutBtn({ label, onPress, color = Colors.primary, style }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={[SS.oBtn, { borderColor: color }, style]}>
      <Text style={[SS.oTxt, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── SECTION HEADER ──────────────────────────────────────────
export function SecHd({ title, action, onAction, secondaryAction, onSecondaryAction }) {
  return (
    <View style={SS.secHd}>
      <Text style={SS.secTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12  }}>
        {secondaryAction && (
          <TouchableOpacity onPress={onSecondaryAction}>
            <Text style={[SS.seeAll, { color: Colors.txt3 }]}>{secondaryAction}</Text>
          </TouchableOpacity>
        )}
        {action && (
          <TouchableOpacity onPress={onAction}>
            <Text style={SS.seeAll}>{action}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ── STATUS BADGE ────────────────────────────────────────────
export function StatusBadge({ status }) {
  const ss = statusStyle(status);
  return (
    <View style={[SS.badge, { backgroundColor: ss.bg }]}>
      <Text style={[SS.badgeTxt, { color: ss.txt }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

// ── AVATAR STACK ────────────────────────────────────────────
export function AvatarStack({ avatars }) {
  return (
    <View style={{ flexDirection: 'row', height: 22 }}>
      {avatars.map((a, i) => {
        const [c1, c2] = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
        return (
          <LinearGradient key={i} colors={[c1, c2]}
            style={[SS.miniAva, { left: i * 15, zIndex: avatars.length - i }]}>
            <Text style={SS.miniAvaTxt}>{a}</Text>
          </LinearGradient>
        );
      })}
      <View style={{ width: (avatars.length * 15) + 7 }} />
    </View>
  );
}

// ── ROOM THUMBNAIL ──────────────────────────────────────────
export function RoomThumb({ theme, size = 68 }) {
  return (
    <LinearGradient colors={roomColors(theme)}
      style={[SS.rthumb, { width: size, height: size, borderRadius: size * 0.19 }]}>
      <Text style={{ fontSize: size * 0.38 }}>🏢</Text>
    </LinearGradient>
  );
}

// ── ROOM TAG ────────────────────────────────────────────────
export function RoomTag({ label, blue = false }) {
  return (
    <View style={[SS.rtag, { backgroundColor: blue ? '#EBF2FC' : Colors.tealLight }]}>
      <Text style={[SS.rtagTxt, { color: blue ? Colors.primary : '#0A7A72' }]}>
        {label}
      </Text>
    </View>
  );
}

// ── SEARCH FIELD ROW ────────────────────────────────────────
export function SFRow({ icon, label, value, onPress, trailing }) {
  return (
    <TouchableOpacity style={SS.sfRow} onPress={onPress} activeOpacity={0.8}>
      <Text style={{ fontSize: 15 }}>{icon}</Text>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={SS.sfLbl}>{label.toUpperCase()}</Text>
        <Text style={SS.sfVal} numberOfLines={1}>{value}</Text>
      </View>
      {trailing && <Text style={SS.sfArr}>{trailing}</Text>}
    </TouchableOpacity>
  );
}

// ── META ROW ────────────────────────────────────────────────
export function MetaRow({ icon, text }) {
  return (
    <View style={SS.metaRow}>
      <Text style={SS.metaIcon}>{icon}</Text>
      <Text style={SS.metaTxt} numberOfLines={1}>{text}</Text>
    </View>
  );
}

// ── DETAIL ROW ──────────────────────────────────────────────
export function DetailRow({ label, value }) {
  return (
    <View style={SS.detRow}>
      <Text style={SS.detLbl}>{label}</Text>
      <Text style={SS.detVal}>{value}</Text>
    </View>
  );
}

// ── PICKER HANDLE ───────────────────────────────────────────
export function PickerHandle() {
  return <View style={SS.handle} />;
}

// ── DIVIDER ─────────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[SS.divider, style]} />;
}

// ── COUNTER BUTTON ──────────────────────────────────────────
export function CtrBtn({ icon, onPress }) {
  return (
    <TouchableOpacity style={SS.ctrBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={SS.ctrIcon}>{icon}</Text>
    </TouchableOpacity>
  );
}

// ── GRADIENT HEADER ─────────────────────────────────────────
export function GradHeader({ children, style }) {
  return (
    <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[SS.gradHeader, style]}>
      {children}
    </LinearGradient>
  );
}

// ── BACK HEADER ─────────────────────────────────────────────
export function BackHeader({ title, subtitle, onBack, trailing, statusBadge }) {
  return (
    <GradHeader>
      <View style={SS.backTop}>
        <TouchableOpacity onPress={onBack} style={SS.backBtn}>
          <Text style={{ fontSize: 20, color: '#fff' }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={SS.backTitle} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={SS.backSub}>{subtitle}</Text>}
        </View>
        {statusBadge && statusBadge}
        {trailing && trailing}
      </View>
    </GradHeader>
  );
}

const SS = StyleSheet.create({
  gBtn: { borderRadius: 16, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  gTxt: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  oBtn: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 13, alignItems: 'center', flex: 1 },
  oTxt: { fontSize: 13, fontWeight: '600' },
  secHd: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  secTitle: { fontSize: 15.5, fontWeight: '700', color: Colors.txt },
  seeAll: { fontSize: 11.5, color: Colors.primary, fontWeight: '600' },
  badge: { alignSelf: 'flex-start', height: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
  badgeTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  miniAva: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  miniAvaTxt: { color: '#fff', fontSize: 7, fontWeight: '700' },
  rthumb: { alignItems: 'center', justifyContent: 'center' },
  rtag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginRight: 4, marginBottom: 4 },
  rtagTxt: { fontSize: 9.5, fontWeight: '600' },
  sfRow: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 13, backgroundColor: Colors.bg, borderRadius: 13, marginBottom: 9 },
  sfLbl: { fontSize: 9, color: Colors.txt3, fontWeight: '500', letterSpacing: 0.5 },
  sfVal: { fontSize: 12, color: Colors.txt, fontWeight: '500', marginTop: 1 },
  sfArr: { fontSize: 14, color: Colors.txt3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaIcon: { fontSize: 12, marginRight: 5 },
  metaTxt: { fontSize: 10.5, color: Colors.txt2, fontWeight: '500', flex: 1 },
  detRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detLbl: { fontSize: 12, color: Colors.txt2 },
  detVal: { fontSize: 12, color: Colors.txt, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  handle: { width: 38, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  divider: { height: 1, backgroundColor: Colors.border },
  ctrBtn: { width: 36, height: 36, backgroundColor: Colors.bg, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  ctrIcon: { fontSize: 20, color: Colors.primary, lineHeight: 24 },
  gradHeader: { paddingTop: 14, paddingHorizontal: 22, paddingBottom: 22 },
  backTop: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center' },
  backTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  backSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
});
