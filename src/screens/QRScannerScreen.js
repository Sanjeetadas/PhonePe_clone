import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import { useQRScanner } from '../hooks/useQRScanner';

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();

  const { scanned, torchOn, handleBarCodeScanned, toggleTorch } = useQRScanner({
    onSuccess: (data) => {
      Vibration.vibrate(80);
      navigation.replace(ROUTES.PAYMENT, { paymentData: data });
    },
    onError: (msg) => {
      Alert.alert('Invalid QR', msg, [{ text: 'OK' }]);
    },
  });

  if (!permission) {
    return (
      <View style={s.centered}>
        <Text style={s.msg}>Requesting camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={s.centered}>
        <Ionicons name="camera-off-outline" size={64} color={COLORS.textDisabled} />
        <Text style={s.permTitle}>Camera Access Required</Text>
        <Text style={s.permMsg}>Allow camera to scan UPI QR codes</Text>
        <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
          <Text style={s.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.backLink} onPress={() => navigation.goBack()}>
          <Text style={s.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned}
      />

      {/* Header overlay */}
      <View style={s.headerOverlay}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Dim overlay */}
      <View style={s.overlay}>
        <View style={s.overlayTop} />
        <View style={s.overlayMiddle}>
          <View style={s.overlaySide} />
          <View style={s.scanWindow}>
            <View style={[s.corner, s.cTL]} />
            <View style={[s.corner, s.cTR]} />
            <View style={[s.corner, s.cBL]} />
            <View style={[s.corner, s.cBR]} />
            {scanned && (
              <View style={s.scanningIndicator}>
                <Text style={s.scanningText}>✓ QR Detected</Text>
              </View>
            )}
          </View>
          <View style={s.overlaySide} />
        </View>
        <View style={s.overlayBottom}>
          <Text style={s.instruction}>
            {scanned ? 'Loading payment...' : 'Point at any UPI QR code'}
          </Text>
          <TouchableOpacity style={s.torchBtn} onPress={toggleTorch}>
            <Ionicons name={torchOn ? 'flashlight' : 'flashlight-outline'} size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const SZ = 260;

const s = StyleSheet.create({
  root:              { flex: 1, backgroundColor: '#000' },
  centered:          { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: COLORS.background },
  msg:               { color: COLORS.textSecondary },
  permTitle:         { fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginTop: 16, textAlign: 'center' },
  permMsg:           { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  permBtn:           { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  permBtnText:       { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  backLink:          { marginTop: 16 },
  backLinkText:      { color: COLORS.primary, fontSize: 15 },
  headerOverlay:     { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: 'rgba(0,0,0,0.4)' },
  backBtn:           { padding: 4 },
  headerTitle:       { color: COLORS.white, fontSize: 18, fontWeight: '600' },
  overlay:           { flex: 1 },
  overlayTop:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayMiddle:     { flexDirection: 'row', height: SZ },
  overlaySide:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayBottom:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 32, gap: 20 },
  scanWindow:        { width: SZ, height: SZ, justifyContent: 'center', alignItems: 'center' },
  instruction:       { color: COLORS.white, fontSize: 15, textAlign: 'center', paddingHorizontal: 32 },
  torchBtn:          { padding: 12 },
  corner:            { position: 'absolute', width: 32, height: 32, borderColor: COLORS.primary, borderWidth: 3.5 },
  cTL:               { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cTR:               { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cBL:               { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cBR:               { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  scanningIndicator: { backgroundColor: 'rgba(0,180,80,0.85)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  scanningText:      { color: COLORS.white, fontWeight: '600', fontSize: 14 },
});