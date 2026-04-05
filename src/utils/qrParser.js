/**
 * QR PARSER
 * Parses real UPI QR strings like:
 * upi://pay?pa=abc@upi&pn=Rahul%20Sharma&am=100
 *
 * Works on real-world UPI QR codes.
 */

export function parseUPIQR(qrString) {
  try {
    if (!qrString || !qrString.startsWith('upi://')) {
      return { success: false, error: 'Not a UPI QR code' };
    }

    // Extract the query string part after "upi://pay?"
    const queryString = qrString.split('?')[1];
    if (!queryString) {
      return { success: false, error: 'Invalid QR format' };
    }

    // Parse all key=value pairs
    const params = {};
    queryString.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });

    // pa = payee address (UPI ID) — REQUIRED
    if (!params.pa) {
      return { success: false, error: 'Missing UPI ID (pa)' };
    }

    // pn = payee name — use UPI ID as fallback if missing
    const name = params.pn || params.pa.split('@')[0];

    return {
      success: true,
      data: {
        upiId: params.pa,
        name: name,
        amount: params.am || '',       // pre-filled amount (optional)
        note: params.tn || '',         // transaction note (optional)
        merchantCode: params.mc || '', // merchant category (optional)
      },
    };
  } catch (err) {
    return { success: false, error: 'Failed to parse QR code' };
  }
}