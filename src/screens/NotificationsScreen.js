// src/screens/NotificationsScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader, Divider } from '../components/Shared';
import { Colors } from '../theme';
import { NOTIFICATIONS } from '../data';

export default function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <BackHeader title="Notifications" subtitle="3 unread" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((n, i) => (
          <React.Fragment key={n.id}>
            <TouchableOpacity
              style={[S.item, n.unread && S.itemUnread]}
              onPress={() => Alert.alert(n.title, n.sub)}
              activeOpacity={0.8}>
              {/* Icon */}
              <View style={[S.iconWrap, { backgroundColor: n.color }]}>
                <Text style={{ fontSize:16 }}>{n.icon}</Text>
              </View>
              {/* Text */}
              <View style={{ flex:1 }}>
                <Text style={[S.title, n.unread && { fontWeight:'700' }]}>{n.title}</Text>
                <Text style={S.sub} numberOfLines={1}>{n.sub}</Text>
                <Text style={S.time}>{n.time}</Text>
              </View>
              {/* Unread dot */}
              {n.unread && <View style={S.dot} />}
            </TouchableOpacity>
            {i < NOTIFICATIONS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe:       { flex:1, backgroundColor:Colors.bg },
  item:       { flexDirection:'row', alignItems:'flex-start', gap:13, padding:16, paddingHorizontal:18 },
  itemUnread: { backgroundColor:'rgba(26,77,143,0.04)' },
  iconWrap:   { width:42, height:42, borderRadius:13, alignItems:'center', justifyContent:'center', flexShrink:0 },
  title:      { fontSize:13, color:Colors.txt, fontWeight:'500', marginBottom:2 },
  sub:        { fontSize:11, color:Colors.txt2, marginBottom:3 },
  time:       { fontSize:10, color:Colors.txt3 },
  dot:        { width:9, height:9, borderRadius:5, backgroundColor:Colors.primary, marginTop:4, flexShrink:0 },
});
