import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/lib/models/Admin';
import { generateOTP, storeOTP, sendOTP } from '@/lib/utils/otp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    await connectDB();

    // Check if admin exists
    const admin = await Admin.findOne({ phoneNumber });
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);
    sendOTP(phoneNumber, otp);

    return res.status(200).json({ 
      message: 'OTP sent successfully',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

