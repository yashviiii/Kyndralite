import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '@/components/Layout';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  FileText,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

interface Loan {
  _id: string;
  userId: {
    phoneNumber: string;
    kycVerified: boolean;
    language: string;
  };
  loanCategory: string;
  status: string;
  extractedData: {
    name?: string;
    landArea?: number;
    documentType?: string;
  };
  uploadedDocuments: Array<{
    filename: string;
    type: string;
  }>;
  geoValuation?: number;
  voiceConsentRecording?: string;
  matchedSchemeId?: {
    title: string;
    description: string;
    benefits: string;
    loanType: string;
    eligibility: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  'Under Review': {
    label: 'Under Review',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
  },
  'Approved': {
    label: 'Approved',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
  },
  'Rejected': {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
  },
  'Needs More Information': {
    label: 'Needs More Information',
    icon: AlertCircle,
    color: 'bg-blue-100 text-blue-800',
  },
};

export default function LoanDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLoan();
    }
  }, [id]);

  const fetchLoan = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoan(response.data.loan);
    } catch (error) {
      console.error('Error fetching loan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!loan) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Loan not found
          </div>
        </div>
      </Layout>
    );
  }

  const statusInfo = statusConfig[loan.status] || statusConfig['Under Review'];
  const StatusIcon = statusInfo.icon;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Loan Application Details
              </h1>
              <p className="text-gray-600">Application ID: {loan._id}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.color}`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium">{statusInfo.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Applicant Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {loan.extractedData?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {loan.userId?.phoneNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">KYC Status</p>
                  <p className="font-medium">
                    {loan.userId?.kycVerified ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="font-medium text-gray-900">
                    {loan.userId?.language?.toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Loan Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Loan Category</p>
                  <p className="font-medium text-gray-900">{loan.loanCategory}</p>
                </div>
                {loan.matchedSchemeId && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Matched Scheme</p>
                      <p className="font-medium text-gray-900">
                        {loan.matchedSchemeId.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Type</p>
                      <p className="font-medium text-gray-900">
                        {loan.matchedSchemeId.loanType}
                      </p>
                    </div>
                  </>
                )}
                {loan.geoValuation && (
                  <div>
                    <p className="text-sm text-gray-500">Geo Valuation</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      ₹{loan.geoValuation.toLocaleString()}
                    </p>
                  </div>
                )}
                {loan.extractedData?.landArea && (
                  <div>
                    <p className="text-sm text-gray-500">Land Area</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {loan.extractedData.landArea} acres
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Data */}
          {loan.extractedData && Object.keys(loan.extractedData).length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Extracted Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loan.extractedData.documentType && (
                  <div>
                    <p className="text-sm text-gray-500">Document Type</p>
                    <p className="font-medium text-gray-900">
                      {loan.extractedData.documentType}
                    </p>
                  </div>
                )}
                {loan.extractedData.landArea && (
                  <div>
                    <p className="text-sm text-gray-500">Land Area</p>
                    <p className="font-medium text-gray-900">
                      {loan.extractedData.landArea} acres
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Uploaded Documents */}
          {loan.uploadedDocuments && loan.uploadedDocuments.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Uploaded Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loan.uploadedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <p className="font-medium text-gray-900">{doc.filename}</p>
                    <p className="text-sm text-gray-500 mt-1">{doc.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Scheme Details */}
          {loan.matchedSchemeId && (
            <div className="mt-6 bg-primary-50 rounded-lg p-4 border border-primary-200">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Matched Scheme Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-900">{loan.matchedSchemeId.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Benefits</p>
                  <p className="text-gray-900">{loan.matchedSchemeId.benefits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Eligibility</p>
                  <p className="text-gray-900">{loan.matchedSchemeId.eligibility}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(loan.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated: {new Date(loan.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


