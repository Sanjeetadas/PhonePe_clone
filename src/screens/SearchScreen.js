import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Search</Text>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color={COLORS.white} />
          <Ionicons name="chevron-back-outline" size={22} color={COLORS.white} style={{ marginLeft: -14 }} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={s.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={s.input}
          placeholder="Search for 'contacts'"
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <Ionicons name="mic-outline" size={20} color={COLORS.textMuted} />
      </View>

      <ScrollView>
        {/* Popular */}
        <Text style={s.sectionTitle}>Popular</Text>
        <View style={s.popularRow}>
          {POPULAR.map((item) => (
            <TouchableOpacity key={item.label} style={s.popularItem}>
              <View style={s.popularIcon}>
                <Ionicons name={item.icon} size={24} color={COLORS.textSecondary} />
              </View>
              <Text style={s.popularLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* New for you */}
        <Text style={s.sectionTitle}>New for you</Text>
        <View style={s.cardsRow}>
          <View style={[s.promoCard, { backgroundColor: '#0D2B2B' }]}>
            <Text style={s.promoCardTitle}>Get up to ₹50 Lakh</Text>
            <Text style={s.promoCardSub}>Pledge your gold for a quick loan</Text>
          </View>
          <View style={[s.promoCard, { backgroundColor: '#2B1A0D' }]}>
            <Text style={s.promoCardTitle}>Book your train</Text>
            <Text style={s.promoCardSub}>Use CTNEW | 50% on service charge</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const POPULAR = [
  { label: 'Wallet',          icon: 'wallet-outline' },
  { label: 'Mobile\nRecharge',icon: 'phone-portrait-outline' },
  { label: 'Loan\nRepayment', icon: 'cash-outline' },
  { label: 'FASTag\nRecharge',icon: 'car-outline' },
];

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: COLORS.background, paddingTop: 52 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title:         { color: COLORS.white, fontSize: 26, fontWeight: 'bold' },
  backBtn:       { flexDirection: 'row', backgroundColor: '#1565C0', borderRadius: 20, padding: 8 },
  searchBar:     { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface2, marginHorizontal: 16, borderRadius: 28, paddingHorizontal: 16, paddingVertical: 12, gap: 10, marginBottom: 24 },
  input:         { flex: 1, color: COLORS.white, fontSize: 15 },
  sectionTitle:  { color: COLORS.white, fontSize: 15, fontWeight: '600', paddingHorizontal: 16, marginBottom: 14 },
  popularRow:    { flexDirection: 'row', paddingHorizontal: 16, gap: 16, marginBottom: 28 },
  popularItem:   { alignItems: 'center', gap: 8 },
  popularIcon:   { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.surface2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  popularLabel:  { color: COLORS.textSecondary, fontSize: 12, textAlign: 'center' },
  cardsRow:      { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  promoCard:     { flex: 1, borderRadius: 14, padding: 16, minHeight: 140, justifyContent: 'flex-end' },
  promoCardTitle:{ color: COLORS.white, fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  promoCardSub:  { color: COLORS.textSecondary, fontSize: 12 },
});