import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';

import HomeScreen               from '../screens/HomeScreen';
import QRScannerScreen          from '../screens/QRScannerScreen';
import PaymentScreen            from '../screens/PaymentScreen';
import SuccessScreen            from '../screens/SuccessScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import SearchScreen             from '../screens/SearchScreen';
import AlertsScreen             from '../screens/AlertsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle:      { backgroundColor: COLORS.background, elevation: 0, shadowOpacity: 0 },
          headerTintColor:  COLORS.white,
          headerTitleStyle: { fontWeight: 'bold', color: COLORS.white },
          headerBackTitleVisible: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name={ROUTES.HOME}   component={MainTabsWrapper} options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.QR_SCANNER} component={QRScannerScreen} options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.PAYMENT}    component={PaymentScreen}   options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.SUCCESS}    component={SuccessScreen}   options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.SEARCH}     component={SearchScreen}    options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.ALERTS}     component={AlertsScreen}    options={{ headerShown: false }} />
        <Stack.Screen
          name={ROUTES.TRANSACTION_HISTORY}
          component={TransactionHistoryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ── Custom Bottom Tab Bar wrapped around HomeScreen ──
function MainTabsWrapper({ navigation }) {
  const [activeTab, setActiveTab] = React.useState('Home');

  function goTo(tab) {
    setActiveTab(tab);
    if (tab === 'Search')  navigation.navigate(ROUTES.SEARCH);
    if (tab === 'Alerts')  navigation.navigate(ROUTES.ALERTS);
    if (tab === 'History') navigation.navigate(ROUTES.TRANSACTION_HISTORY);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <HomeScreen navigation={navigation} />
      <View style={tabStyles.bar}>
        <TabItem icon="home"          label="Home"    active={activeTab==='Home'}    onPress={() => setActiveTab('Home')} />
        <TabItem icon="search"        label="Search"  active={activeTab==='Search'}  onPress={() => goTo('Search')} />

        {/* Centre QR button */}
        <TouchableOpacity style={tabStyles.qrWrap} onPress={() => navigation.navigate(ROUTES.QR_SCANNER)}>
          <View style={tabStyles.qrCircle}>
            <Ionicons name="qr-code" size={26} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <TabItem icon="notifications-outline" label="Alerts"  active={activeTab==='Alerts'}  onPress={() => goTo('Alerts')}  badge={1} />
        <TabItem icon="time-outline"          label="History" active={activeTab==='History'} onPress={() => goTo('History')} />
      </View>
    </View>
  );
}

function TabItem({ icon, label, active, onPress, badge }) {
  return (
    <TouchableOpacity style={tabStyles.item} onPress={onPress}>
      <View>
        <Ionicons name={icon} size={24} color={active ? COLORS.white : COLORS.navInactive} />
        {badge ? (
          <View style={tabStyles.badge}><Text style={tabStyles.badgeText}>{badge}</Text></View>
        ) : null}
      </View>
      <Text style={[tabStyles.label, active && tabStyles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const tabStyles = StyleSheet.create({
  bar:       { flexDirection: 'row', backgroundColor: COLORS.navBackground, borderTopWidth: 1, borderTopColor: '#222', paddingBottom: 12, paddingTop: 8, alignItems: 'flex-end' },
  item:      { flex: 1, alignItems: 'center', gap: 3 },
  label:     { fontSize: 11, color: COLORS.navInactive },
  labelActive:{ color: COLORS.white, fontWeight: '600' },
  qrWrap:    { flex: 1, alignItems: 'center', marginTop: -24 },
  qrCircle:  { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8 },
  badge:     { position: 'absolute', top: -4, right: -6, backgroundColor: COLORS.primary, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },
});