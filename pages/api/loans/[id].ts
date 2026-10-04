import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db/mongodb';
import LoanApplication from '@/lib/models/LoanApplication';
import { verifyToken } from '@/lib/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const loan = await LoanApplication.findById(id)
        .populate('userId', 'phoneNumber kycVerified language')
        .populate('matchedSchemeId');

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      return res.status(200).json({ loan });
    } catch (error) {
      console.error('Error fetching loan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const validStatuses = ['Under Review', 'Approved', 'Rejected', 'Needs More Information'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const loan = await LoanApplication.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      )
        .populate('userId', 'phoneNumber kycVerified language')
        .populate('matchedSchemeId');

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      return res.status(200).json({ loan });
    } catch (error) {
      console.error('Error updating loan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


