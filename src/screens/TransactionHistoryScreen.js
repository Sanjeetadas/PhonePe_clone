import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionHistoryScreen({ navigation }) {
  const { transactions, loading, reload } = useTransactions();

  // Group by month
  const grouped = groupByMonth(transactions);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>History</Text>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.stmtBtn}>
            <Ionicons name="download-outline" size={16} color={COLORS.white} />
            <Text style={s.stmtText}>My Statements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={22} color={COLORS.white} />
            <Ionicons name="chevron-back-outline" size={22} color={COLORS.white} style={{ marginLeft: -14 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={s.searchBar}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput style={s.searchInput} placeholder="Search" placeholderTextColor={COLORS.textMuted} />
        <Ionicons name="options-outline" size={18} color={COLORS.textMuted} />
      </View>

      {/* Refer banner */}
      <View style={s.referBanner}>
        <View style={s.referLeft}>
          <Text style={s.referTitle}>Refer and earn ₹100</Text>
          <Text style={s.referSub}>Invite your friends and family to PhonePe</Text>
          <TouchableOpacity style={s.inviteBtn}>
            <Text style={s.inviteBtnText}>Invite a friend</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 48 }}>🎉</Text>
      </View>

      {transactions.length === 0 && !loading ? (
        <View style={s.empty}>
          <Ionicons name="receipt-outline" size={64} color={COLORS.textDisabled} />
          <Text style={s.emptyText}>No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.month}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={COLORS.primary} />}
          renderItem={({ item }) => (
            <View>
              <Text style={s.monthHeader}>{item.month.toUpperCase()}</Text>
              {item.txns.map((txn) => (
                <View key={txn.id} style={s.txnRow}>
                  <View style={s.txnIconWrap}>
                    <Ionicons name="arrow-up" size={18} color={COLORS.white} />
                  </View>
                  <View style={s.txnInfo}>
                    <Text style={s.txnLabel}>Paid to</Text>
                    <Text style={s.txnName}>{txn.name.toUpperCase()}</Text>
                    <Text style={s.txnTime}>{formatDate(txn.timestamp)}</Text>
                  </View>
                  <View style={s.txnRight}>
                    <Text style={s.txnAmt}>₹{txn.amount}</Text>
                    <Text style={s.txnDebit}>Debited</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

function groupByMonth(txns) {
  const map = {};
  txns.forEach((t) => {
    const month = new Date(t.timestamp).toLocaleString('en-IN', { month: 'long' });
    if (!map[month]) map[month] = [];
    map[month].push(t);
  });
  return Object.keys(map).map((m) => ({ month: m, txns: map[m] }));
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: COLORS.background, paddingTop: 52 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  title:        { color: COLORS.white, fontSize: 26, fontWeight: 'bold' },
  headerRight:  { flexDirection: 'row', gap: 10, alignItems: 'center' },
  stmtBtn:      { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, gap: 6 },
  stmtText:     { color: COLORS.white, fontSize: 13 },
  backBtn:      { flexDirection: 'row', backgroundColor: '#1565C0', borderRadius: 20, padding: 8 },
  searchBar:    { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface2, marginHorizontal: 16, borderRadius: 28, paddingHorizontal: 16, paddingVertical: 11, gap: 10, marginBottom: 16 },
  searchInput:  { flex: 1, color: COLORS.white, fontSize: 14 },
  referBanner:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 8 },
  referLeft:    { flex: 1 },
  referTitle:   { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  referSub:     { color: COLORS.textSecondary, fontSize: 13, marginTop: 4, marginBottom: 12 },
  inviteBtn:    { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start' },
  inviteBtnText:{ color: COLORS.white, fontWeight: '600' },
  monthHeader:  { color: COLORS.textMuted, fontSize: 12, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 10, letterSpacing: 1 },
  txnRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txnIconWrap:  { width: 42, height: 42, borderRadius: 10, backgroundColor: COLORS.surface2, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  txnInfo:      { flex: 1 },
  txnLabel:     { color: COLORS.textMuted, fontSize: 11 },
  txnName:      { color: COLORS.white, fontSize: 15, fontWeight: '600', marginTop: 2 },
  txnTime:      { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  txnRight:     { alignItems: 'flex-end' },
  txnAmt:       { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  txnDebit:     { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  empty:        { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText:    { color: COLORS.textSecondary, fontSize: 16 },
});