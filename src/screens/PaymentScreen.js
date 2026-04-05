import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import { isValidAmount } from '../utils/validators';
import { usePayment } from '../hooks/usePayment';

export default function PaymentScreen({ route, navigation }) {
  const { paymentData } = route.params;
  const { upiId, name, amount: prefilled } = paymentData;
  const [amount, setAmount] = useState(prefilled || '');
  const [note, setNote]     = useState('');
  const { pay, loading, error } = usePayment();
  const dotAnim = React.useRef(new Animated.Value(0)).current;

  // Animate the dot inside the "Connecting Securely" pill
  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(dotAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
      ).start();
    } else {
      dotAnim.setValue(0);
    }
  }, [loading]);

  async function handlePay() {
    const validation = isValidAmount(amount);
    if (!validation.valid) { Alert.alert('Invalid Amount', validation.error); return; }
    const result = await pay({ upiId, name, amount, note });
    if (result) {
      navigation.replace(ROUTES.SUCCESS, { transaction: result });
    } else {
      Alert.alert('Payment Failed', error || 'Please try again.');
    }
  }

  // ── "Connecting Securely" loading screen ──
  if (loading) {
    const translateX = dotAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 110] });
    return (
      <View style={ls.root}>
        <View style={ls.pill}>
          <Animated.View style={[ls.dot, { transform: [{ translateX }] }]} />
        </View>
        <Text style={ls.connectText}>Connecting Securely</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Send Money</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Recipient */}
      <View style={s.recipientCard}>
        <View style={s.avatar}>
          <Ionicons name="person" size={28} color={COLORS.white} />
        </View>
        <View style={s.recipientInfo}>
          <Text style={s.recipientName}>{name}</Text>
          <Text style={s.recipientUpi}>{upiId}</Text>
        </View>
        <View style={s.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.successLight} />
          <Text style={s.verifiedText}>Verified</Text>
        </View>
      </View>

      {/* Amount */}
      <View style={s.amountRow}>
        <Text style={s.rupeeSign}>₹</Text>
        <TextInput
          style={s.amountInput}
          placeholder="0"
          placeholderTextColor={COLORS.textDisabled}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          maxLength={7}
          autoFocus
        />
      </View>
      <Text style={s.amountHint}>Enter amount</Text>

      {/* Note */}
      <View style={s.noteWrap}>
        <Ionicons name="create-outline" size={16} color={COLORS.textMuted} />
        <TextInput
          style={s.noteInput}
          placeholder="Add a note (optional)"
          placeholderTextColor={COLORS.textMuted}
          value={note}
          onChangeText={setNote}
          maxLength={50}
        />
      </View>

      {/* Pay button */}
      <TouchableOpacity style={s.payBtn} onPress={handlePay} activeOpacity={0.85}>
        <Text style={s.payBtnText}>Pay {amount ? `₹${amount}` : ''}</Text>
      </TouchableOpacity>

      <Text style={s.secureNote}>🔒  Secured by UPI · Simulated</Text>
    </KeyboardAvoidingView>
  );
}

const ls = StyleSheet.create({
  root:        { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  pill:        { width: 160, height: 44, backgroundColor: '#EDE7F6', borderRadius: 22, overflow: 'hidden', justifyContent: 'center', marginBottom: 24 },
  dot:         { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, marginLeft: 4 },
  connectText: { color: COLORS.white, fontSize: 18, fontWeight: '600' },
});

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: COLORS.background },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle:    { color: COLORS.white, fontSize: 18, fontWeight: '600' },
  recipientCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 32, gap: 12 },
  avatar:         { width: 52, height: 52, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  recipientInfo:  { flex: 1 },
  recipientName:  { color: COLORS.white, fontSize: 17, fontWeight: '600' },
  recipientUpi:   { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  verifiedBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText:   { color: COLORS.successLight, fontSize: 12 },
  amountRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  rupeeSign:      { fontSize: 32, color: COLORS.textSecondary, marginRight: 4, marginTop: 8 },
  amountInput:    { fontSize: 64, fontWeight: 'bold', color: COLORS.white, minWidth: 80, textAlign: 'center' },
  amountHint:     { textAlign: 'center', color: COLORS.textMuted, fontSize: 14, marginBottom: 32 },
  noteWrap:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, gap: 10, borderWidth: 1, borderColor: COLORS.border },
  noteInput:      { flex: 1, color: COLORS.white, fontSize: 15 },
  payBtn:         { backgroundColor: COLORS.primary, marginHorizontal: 16, marginTop: 'auto', marginBottom: 16, borderRadius: 14, paddingVertical: 18, alignItems: 'center', elevation: 6, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  payBtnText:     { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  secureNote:     { textAlign: 'center', color: COLORS.textDisabled, fontSize: 12, marginBottom: 24 },
});