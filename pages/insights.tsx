import Layout from '@/components/Layout';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Shield,
  Ban,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

// Hardcoded analytics data
const analytics = {
  overview: {
    totalLoans: 2847,
    approvedLoans: 1923,
    rejectedLoans: 456,
    underReviewLoans: 312,
    needsMoreInfoLoans: 156,
    approvalRate: '67.5%',
    rejectionRate: '16.0%',
  },
  users: {
    totalUsers: 3421,
    kycVerifiedUsers: 2894,
    usersWithLoans: 2847,
    kycVerificationRate: '84.6%',
  },
  categoryBreakdown: {
    'Tractor Loan': 892,
    'Dairy Farming': 654,
    'Crop Loan': 523,
    'Poultry Farming': 387,
    'Irrigation Equipment': 291,
    'Greenhouse Setup': 100,
  },
  statusBreakdown: {
    'Under Review': 312,
    'Approved': 1923,
    'Rejected': 456,
    'Needs More Information': 156,
  },
  riskAnalysis: {
    riskyUsersGivenLoans: 127,
    fraudsStopped: 89,
    avgGeoValuation: 1245000,
  },
  monthlyTrends: [
    { month: 'Jul 2024', count: 342 },
    { month: 'Aug 2024', count: 389 },
    { month: 'Sep 2024', count: 456 },
    { month: 'Oct 2024', count: 521 },
    { month: 'Nov 2024', count: 598 },
    { month: 'Dec 2024', count: 541 },
  ],
};

export default function Insights() {

  const statusData = Object.entries(analytics.statusBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const categoryData = Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const statCards = [
    {
      title: 'Total Loans',
      value: analytics.overview.totalLoans.toLocaleString(),
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      change: '+18.5%',
      trend: 'up',
    },
    {
      title: 'Approved Loans',
      value: analytics.overview.approvedLoans.toLocaleString(),
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      change: analytics.overview.approvalRate,
      trend: 'up',
    },
    {
      title: 'Rejected Loans',
      value: analytics.overview.rejectedLoans.toLocaleString(),
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
      change: analytics.overview.rejectionRate,
      trend: 'down',
    },
    {
      title: 'Under Review',
      value: analytics.overview.underReviewLoans.toLocaleString(),
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-600',
      change: `${((analytics.overview.underReviewLoans / analytics.overview.totalLoans) * 100).toFixed(1)}%`,
      trend: 'neutral',
    },
  ];

  const userStats = [
    {
      title: 'Total Users',
      value: analytics.users.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'KYC Verified',
      value: analytics.users.kycVerifiedUsers.toLocaleString(),
      icon: Shield,
      color: 'bg-green-100 text-green-600',
      subtitle: analytics.users.kycVerificationRate,
    },
    {
      title: 'Users with Loans',
      value: analytics.users.usersWithLoans.toLocaleString(),
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  const riskStats = [
    {
      title: 'Risky Users Given Loans',
      value: analytics.riskAnalysis.riskyUsersGivenLoans,
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Frauds Stopped',
      value: analytics.riskAnalysis.fraudsStopped,
      icon: Ban,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Avg Geo Valuation',
      value: `₹${analytics.riskAnalysis.avgGeoValuation.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">Comprehensive overview of loan applications and performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                      {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                      <span>{stat.change}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Loan Applications
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Loan Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#22c55e" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {userStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-sm text-gray-500">{stat.subtitle} verified</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Analysis & Fraud Prevention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {riskStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}


