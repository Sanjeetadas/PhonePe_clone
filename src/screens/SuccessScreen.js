import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function SuccessScreen({ route, navigation }) {
  const { transaction } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Play "ting" sound
    playTingSound();

    // Animate: checkmark pops → card slides up
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1, useNativeDriver: true, tension: 80, friction: 5,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  async function playTingSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        // Built-in system sound via frequency trick
        { uri: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg' },
        { shouldPlay: true, volume: 1.0 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      // Sound is optional — don't crash if it fails
    }
  }

  const maskedUpi = transaction.upiId.replace(/^(.{4})/, 'XXXXXX');

  return (
    <View style={s.root}>
      {/* Green top half */}
      <View style={s.greenTop}>
        <Animated.View style={[s.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark" size={44} color={COLORS.success} />
        </Animated.View>
        <Text style={s.successTitle}>Payment Successful</Text>
        <Text style={s.successDate}>{formatDate(transaction.timestamp)}</Text>
      </View>

      {/* Dark bottom half with card */}
      <Animated.View style={[s.bottomCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Recipient row */}
        <View style={s.recipientRow}>
          <View style={s.avatarWrap}>
            <Ionicons name="person" size={28} color={COLORS.white} />
          </View>
          <View style={s.recipientInfo}>
            <Text style={s.recipientName}>{transaction.name}</Text>
            <Text style={s.maskedUpi}>{maskedUpi}</Text>
            <Text style={s.amountBig}>₹{transaction.amount}</Text>
          </View>
          <TouchableOpacity style={s.splitBtn}>
            <Text style={s.splitBtnText}>Split Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        {/* Action buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => navigation.navigate(ROUTES.TRANSACTION_HISTORY)}
          >
            <View style={s.actionIcon}>
              <Ionicons name="document-text-outline" size={22} color={COLORS.white} />
            </View>
            <Text style={s.actionText}>View Details</Text>
          </TouchableOpacity>

          <View style={s.actionDivider} />

          <TouchableOpacity style={s.actionBtn}>
            <View style={s.actionIcon}>
              <Ionicons name="share-social-outline" size={22} color={COLORS.white} />
            </View>
            <Text style={s.actionText}>Share Receipt</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Done button */}
      <TouchableOpacity
        style={s.doneBtn}
        onPress={() => navigation.navigate(ROUTES.HOME)}
      >
        <Text style={s.doneBtnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: COLORS.background },
  greenTop:      { backgroundColor: COLORS.success, flex: 0.45, justifyContent: 'center', alignItems: 'center', gap: 10 },
  checkCircle:   { width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  successTitle:  { color: COLORS.white, fontSize: 22, fontWeight: 'bold' },
  successDate:   { color: '#A5D6A7', fontSize: 14 },
  bottomCard:    { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 18, padding: 20, marginTop: -20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  recipientRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatarWrap:    { width: 56, height: 56, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  recipientInfo: { flex: 1 },
  recipientName: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
  maskedUpi:     { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  amountBig:     { color: COLORS.white, fontSize: 26, fontWeight: 'bold', marginTop: 6 },
  splitBtn:      { paddingTop: 4 },
  splitBtnText:  { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  divider:       { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  actionRow:     { flexDirection: 'row' },
  actionBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 4 },
  actionIcon:    { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  actionText:    { color: COLORS.white, fontSize: 14, fontWeight: '500' },
  actionDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  doneBtn:       { position: 'absolute', bottom: 32, alignSelf: 'center' },
  doneBtnText:   { color: COLORS.primary, fontSize: 18, fontWeight: '600' },
});