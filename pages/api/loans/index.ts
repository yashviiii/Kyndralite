import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db/mongodb';
import LoanApplication from '@/lib/models/LoanApplication';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    await connectDB();

    const loans = await LoanApplication.find()
      .populate('userId', 'phoneNumber')
      .populate('matchedSchemeId', 'title loanType')
      .sort({ createdAt: -1 });

    return res.status(200).json({ loans });
  } catch (error) {
    console.error('Error fetching loans:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


