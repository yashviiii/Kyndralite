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

    // Get all loans
    const allLoans = await LoanApplication.find();
    const allUsers = await User.find();

    // Calculate statistics
    const totalLoans = allLoans.length;
    const approvedLoans = allLoans.filter(l => l.status === 'Approved').length;
    const rejectedLoans = allLoans.filter(l => l.status === 'Rejected').length;
    const underReviewLoans = allLoans.filter(l => l.status === 'Under Review').length;
    const needsMoreInfoLoans = allLoans.filter(l => l.status === 'Needs More Information').length;

    // Loan categories breakdown
    const categoryBreakdown = allLoans.reduce((acc: any, loan) => {
      acc[loan.loanCategory] = (acc[loan.loanCategory] || 0) + 1;
      return acc;
    }, {});

    // Status breakdown
    const statusBreakdown = {
      'Under Review': underReviewLoans,
      'Approved': approvedLoans,
      'Rejected': rejectedLoans,
      'Needs More Information': needsMoreInfoLoans,
    };

    // User statistics
    const totalUsers = allUsers.length;
    const kycVerifiedUsers = allUsers.filter(u => u.kycVerified).length;
    const usersWithLoans = new Set(allLoans.map(l => l.userId.toString())).size;

    // Average geo valuation
    const loansWithValuation = allLoans.filter(l => l.geoValuation);
    const avgGeoValuation = loansWithValuation.length > 0
      ? loansWithValuation.reduce((sum, l) => sum + (l.geoValuation || 0), 0) / loansWithValuation.length
      : 0;

    // Risk analysis (mock data for now)
    const riskyUsersGivenLoans = Math.floor(approvedLoans * 0.15); // 15% of approved
    const fraudsStopped = Math.floor(rejectedLoans * 0.25); // 25% of rejected

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentLoans = allLoans.filter(l => l.createdAt >= sixMonthsAgo);
    
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5 - i));
      month.setDate(1);
      const nextMonth = new Date(month);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const loansInMonth = recentLoans.filter(
        l => l.createdAt >= month && l.createdAt < nextMonth
      ).length;
      
      return {
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: loansInMonth,
      };
    });

    // Approval rate
    const approvalRate = totalLoans > 0 
      ? ((approvedLoans / totalLoans) * 100).toFixed(1)
      : '0';

    // Rejection rate
    const rejectionRate = totalLoans > 0
      ? ((rejectedLoans / totalLoans) * 100).toFixed(1)
      : '0';

    return res.status(200).json({
      overview: {
        totalLoans,
        approvedLoans,
        rejectedLoans,
        underReviewLoans,
        needsMoreInfoLoans,
        approvalRate: `${approvalRate}%`,
        rejectionRate: `${rejectionRate}%`,
      },
      users: {
        totalUsers,
        kycVerifiedUsers,
        usersWithLoans,
        kycVerificationRate: totalUsers > 0 
          ? `${((kycVerifiedUsers / totalUsers) * 100).toFixed(1)}%`
          : '0%',
      },
      categoryBreakdown,
      statusBreakdown,
      riskAnalysis: {
        riskyUsersGivenLoans,
        fraudsStopped,
        avgGeoValuation: Math.round(avgGeoValuation),
      },
      monthlyTrends,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


