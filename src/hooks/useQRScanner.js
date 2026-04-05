import { useState, useRef } from 'react';
import { parseUPIQR } from '../utils/qrParser';

/**
 * useQRScanner
 * ────────────
 * Encapsulates all QR scanning state and logic.
 * The screen just calls this hook and renders based on state.
 */
export function useQRScanner({ onSuccess, onError }) {
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const lastScanned = useRef('');

  function handleBarCodeScanned({ data }) {
    // Prevent scanning same QR twice in a row
    if (scanned || data === lastScanned.current) return;

    lastScanned.current = data;
    setScanned(true);

    const result = parseUPIQR(data);

    if (result.success) {
      onSuccess(result.data);
    } else {
      onError(result.error || 'Invalid QR code');
      // Allow retry after 2 seconds
      setTimeout(() => setScanned(false), 2000);
    }
  }

  function resetScanner() {
    setScanned(false);
    lastScanned.current = '';
  }

  function toggleTorch() {
    setTorchOn((prev) => !prev);
  }

  return {
    scanned,
    torchOn,
    handleBarCodeScanned,
    resetScanner,
    toggleTorch,
  };
}