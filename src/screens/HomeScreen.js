import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, RefreshControl, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function HomeScreen({ navigation }) {
  const { transactions, loading, reload, balance, handleAddMoney } = useTransactions();

  React.useEffect(() => {
    const unsub = navigation.addListener('focus', reload);
    return unsub;
  }, [navigation, reload]);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={COLORS.primary} />}
      >

        {/* ── Hero Banner (purple gradient like real PhonePe) ── */}
        <LinearGradient colors={['#7B2FBE', '#A855F7', '#C084FC']} style={s.hero} start={{x:0,y:0}} end={{x:1,y:1}}>
          {/* Top row */}
          <View style={s.heroTop}>
            <View style={s.qrIconWrap}>
              <Ionicons name="qr-code" size={22} color={COLORS.white} />
            </View>
            <TouchableOpacity style={s.helpBtn}>
              <Ionicons name="help-circle-outline" size={26} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={s.heroTitle}>Find Best Mobile</Text>
          <Text style={s.heroTitle}>Plans Instantly</Text>

          <TouchableOpacity style={s.rechargeBtn}>
            <Text style={s.rechargeBtnText}>Recharge Now  ›</Text>
          </TouchableOpacity>

          {/* ── Balance Card ── */}
          <View style={s.balanceCard}>
            <Text style={s.balanceLabel}>Wallet Balance</Text>
            <Text style={s.balanceAmount}>{formatCurrency(balance)}</Text>
            <TouchableOpacity
              style={s.addMoneyBtn}
              onPress={() => {
                Alert.alert(
                  'Add Money',
                  'Choose amount to add to wallet',
                  [
                    { text: '+ ₹500',   onPress: () => handleAddMoney(500).then(()  => Alert.alert('✅ Done', '₹500 added!'))  },
                    { text: '+ ₹1000',  onPress: () => handleAddMoney(1000).then(() => Alert.alert('✅ Done', '₹1000 added!')) },
                    { text: '+ ₹2000',  onPress: () => handleAddMoney(2000).then(() => Alert.alert('✅ Done', '₹2000 added!')) },
                    { text: '+ ₹5000',  onPress: () => handleAddMoney(5000).then(() => Alert.alert('✅ Done', '₹5000 added!')) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Ionicons name="add-circle-outline" size={16} color={COLORS.white} />
              <Text style={s.addMoneyText}>Add Money</Text>
            </TouchableOpacity>
          </View>

        </LinearGradient>

        {/* ── Money Transfers Section ── */}
        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Money Transfers</Text>
            <TouchableOpacity style={s.referChip}>
              <Text style={s.referText}>🪙 Refer → ₹100</Text>
            </TouchableOpacity>
          </View>

          <View style={s.iconGrid}>
            {TRANSFER_ACTIONS.map((a) => (
              <TouchableOpacity key={a.label} style={s.gridItem} onPress={() => a.route && navigation.navigate(a.route)}>
                <View style={[s.iconCircle, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name={a.icon} size={26} color={COLORS.white} />
                </View>
                <Text style={s.gridLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Promo chips */}
          <View style={s.promoRow}>
            <TouchableOpacity style={s.promoChip}>
              <Text style={s.promoText}>💿  Start saving in pure Silver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.promoChip}>
              <Text style={s.promoText}>💵  Daily Mutual Fund</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Recharge & Bills ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Recharge &amp; Bills</Text>
          <View style={s.iconGrid}>
            {BILL_ACTIONS.map((a) => (
              <TouchableOpacity key={a.label} style={s.gridItem}>
                <View style={[s.iconCircle, { backgroundColor: COLORS.surface2 }]}>
                  <Ionicons name={a.icon} size={24} color={a.color || COLORS.white} />
                </View>
                <Text style={s.gridLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={s.jioChip}>
            <Text style={s.jioText}>Free Delivery of Jio SIM</Text>
            <Text style={{fontSize:18}}>📶</Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Transactions ── */}
        {transactions.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recent</Text>
            {transactions.slice(0, 3).map((txn) => (
              <View key={txn.id} style={s.txnRow}>
                <View style={s.txnAvatar}>
                  <Ionicons name="arrow-up" size={18} color={COLORS.white} />
                </View>
                <View style={s.txnInfo}>
                  <Text style={s.txnName}>{txn.name}</Text>
                  <Text style={s.txnTime}>{formatDate(txn.timestamp)}</Text>
                </View>
                <Text style={s.txnAmt}>-{formatCurrency(txn.amount)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const TRANSFER_ACTIONS = [
  { label: 'To Mobile\nNumber',   icon: 'call-outline',     route: null },
  { label: 'To Bank &\nSelf A/c', icon: 'business-outline', route: null },
  { label: 'PhonePe\nWallet',     icon: 'wallet-outline',   route: null },
  { label: 'Check\nBalance',      icon: 'logo-usd',         route: null },
];

const BILL_ACTIONS = [
  { label: 'Mobile\nRecharge',  icon: 'phone-portrait-outline', color: '#4FC3F7' },
  { label: 'Fastag\nRecharge',  icon: 'car-outline',            color: '#81C784' },
  { label: 'Electricity\nBill', icon: 'bulb-outline',           color: '#FFD54F' },
  { label: 'Loan\nRepayment',   icon: 'calendar-outline',       color: '#FFB74D' },
];

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: COLORS.background },
  hero:           { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 32, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  heroTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  qrIconWrap:     { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 8 },
  helpBtn:        { padding: 4 },
  heroTitle:      { fontSize: 26, fontWeight: 'bold', color: COLORS.white, lineHeight: 34 },
  rechargeBtn:    { marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: COLORS.white, borderRadius: 24, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start' },
  rechargeBtnText:{ color: COLORS.white, fontWeight: '600', fontSize: 15 },
  section:        { backgroundColor: COLORS.surface, marginTop: 8, paddingHorizontal: 16, paddingVertical: 18 },
  sectionRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle:   { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  referChip:      { backgroundColor: '#3D1F00', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  referText:      { color: '#FFB74D', fontSize: 13, fontWeight: '500' },
  iconGrid:       { flexDirection: 'row', justifyContent: 'space-between' },
  gridItem:       { alignItems: 'center', width: '23%', gap: 8 },
  iconCircle:     { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  gridLabel:      { color: COLORS.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 16 },
  promoRow:       { flexDirection: 'row', gap: 10, marginTop: 16 },
  promoChip:      { flex: 1, backgroundColor: COLORS.surfaceLight, borderRadius: 10, padding: 12 },
  promoText:      { color: COLORS.textSecondary, fontSize: 12 },
  jioChip:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surfaceLight, borderRadius: 10, padding: 14, marginTop: 14 },
  jioText:        { color: COLORS.textSecondary, fontSize: 13 },
  txnRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txnAvatar:      { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.surface2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txnInfo:        { flex: 1 },
  txnName:        { color: COLORS.white, fontSize: 14, fontWeight: '500' },
  txnTime:        { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  txnAmt:         { color: COLORS.white, fontSize: 15, fontWeight: '600' },
  balanceCard:    { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 },
  balanceLabel:   { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 },
  balanceAmount:  { color: COLORS.white, fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  addMoneyBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  addMoneyText:   { color: COLORS.white, fontSize: 13, fontWeight: '600' },
});