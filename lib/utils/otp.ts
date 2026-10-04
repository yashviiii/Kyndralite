// Simple OTP generation and verification
// In production, use a proper OTP service like Twilio, AWS SNS, etc.

const OTP_STORE: Map<string, { otp: string; expiresAt: number }> = new Map();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(phoneNumber: string, otp: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  OTP_STORE.set(phoneNumber, { otp, expiresAt });
}

export function verifyOTP(phoneNumber: string, otp: string): boolean {
  const stored = OTP_STORE.get(phoneNumber);
  if (!stored) return false;
  
  if (Date.now() > stored.expiresAt) {
    OTP_STORE.delete(phoneNumber);
    return false;
  }
  
  if (stored.otp === otp) {
    OTP_STORE.delete(phoneNumber);
    return true;
  }
  
  return false;
}

// For development: log OTP to console
export function sendOTP(phoneNumber: string, otp: string): void {
  console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);
  // In production, integrate with SMS service here
}


