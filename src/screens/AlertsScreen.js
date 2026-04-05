import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function AlertsScreen({ navigation }) {
  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Alerts</Text>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color={COLORS.white} />
          <Ionicons name="chevron-back-outline" size={22} color={COLORS.white} style={{ marginLeft: -14 }} />
        </TouchableOpacity>
      </View>

      {/* Alert Item */}
      <View style={s.alertItem}>
        <View style={s.alertIcon}>
          <Ionicons name="finger-print" size={28} color="#4FC3F7" />
        </View>
        <View style={s.alertBody}>
          <Text style={s.alertText}>
            Pay faster with Fingerprint. Enable it now to enjoy seamless payments every time.
          </Text>
          <Text style={s.alertAction}>Activate now</Text>
        </View>
        <TouchableOpacity style={s.closeBtn}>
          <Ionicons name="close" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={s.alertTime}>1d</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.background, paddingTop: 52 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 },
  title:      { color: COLORS.white, fontSize: 26, fontWeight: 'bold' },
  backBtn:    { flexDirection: 'row', backgroundColor: '#1565C0', borderRadius: 20, padding: 8 },
  alertItem:  { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 14, padding: 16, gap: 12 },
  alertIcon:  { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surface2, justifyContent: 'center', alignItems: 'center' },
  alertBody:  { flex: 1 },
  alertText:  { color: COLORS.white, fontSize: 14, lineHeight: 20 },
  alertAction:{ color: COLORS.textMuted, fontSize: 13, marginTop: 6 },
  closeBtn:   { padding: 4 },
  alertTime:  { color: COLORS.textMuted, fontSize: 12, position: 'absolute', bottom: 14, right: 16 },
});