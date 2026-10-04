import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/lib/models/Admin';
import { verifyOTP } from '@/lib/utils/otp';
import { generateToken } from '@/lib/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    await connectDB();

    // Verify OTP
    if (!verifyOTP(phoneNumber, otp)) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Get admin
    const admin = await Admin.findOne({ phoneNumber });
    
    if (!admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: admin._id.toString(),
      phoneNumber: admin.phoneNumber,
    });

    return res.status(200).json({ 
      token,
      user: {
        id: admin._id,
        name: admin.name,
        phoneNumber: admin.phoneNumber,
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

