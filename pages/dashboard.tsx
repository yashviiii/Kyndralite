import { useState } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Layout from '@/components/Layout';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  TrendingUp,
  MapPin,
  FileText,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface Loan {
  _id: string;
  userId: {
    phoneNumber: string;
  };
  loanCategory: string;
  status: string;
  extractedData: {
    name?: string;
    landArea?: number;
    documentType?: string;
  };
  geoValuation?: number;
  matchedSchemeId?: {
    title: string;
    loanType: string;
  };
  createdAt: string;
  riskScore?: number;
  riskReason?: string;
}

const statusConfig = {
  'Under Review': {
    label: 'Under Review',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    columnColor: 'bg-yellow-50',
  },
  'Approved': {
    label: 'Approved',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    columnColor: 'bg-green-50',
  },
  'Rejected': {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    columnColor: 'bg-red-50',
  },
  'Needs More Information': {
    label: 'Needs More Info',
    icon: AlertCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    columnColor: 'bg-blue-50',
  },
};

const statusOrder = ['Under Review', 'Approved', 'Rejected', 'Needs More Information'];

// Hardcoded loan data with risk scores
const hardcodedLoans: Loan[] = [
  // Under Review loans
  {
    _id: '1',
    userId: { phoneNumber: '+919876543210' },
    loanCategory: 'Tractor Loan',
    status: 'Under Review',
    extractedData: { name: 'Rajesh Kumar', landArea: 12.5, documentType: 'Land Deed' },
    geoValuation: 1850000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-12-15T10:30:00Z',
    riskScore: 35,
    riskReason: 'Low risk: Good credit history, verified land documents, stable income source',
  },
  {
    _id: '2',
    userId: { phoneNumber: '+919876543211' },
    loanCategory: 'Dairy Farming',
    status: 'Under Review',
    extractedData: { name: 'Priya Sharma', landArea: 8.0, documentType: 'Land Deed' },
    geoValuation: 950000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-12-14T14:20:00Z',
    riskScore: 42,
    riskReason: 'Moderate risk: New to dairy farming, limited experience, but has good business plan',
  },
  {
    _id: '3',
    userId: { phoneNumber: '+919876543212' },
    loanCategory: 'Crop Loan',
    status: 'Under Review',
    extractedData: { name: 'Amit Patel', landArea: 15.0, documentType: 'Land Deed' },
    geoValuation: 1200000,
    matchedSchemeId: { title: 'Kisan Credit Card', loanType: 'Crop' },
    createdAt: '2024-12-13T09:15:00Z',
    riskScore: 28,
    riskReason: 'Low risk: Experienced farmer, consistent crop yields, excellent repayment history',
  },
  {
    _id: '4',
    userId: { phoneNumber: '+919876543213' },
    loanCategory: 'Poultry Farming',
    status: 'Under Review',
    extractedData: { name: 'Sunita Devi', landArea: 5.5, documentType: 'Land Deed' },
    geoValuation: 650000,
    matchedSchemeId: { title: 'Poultry Development Scheme', loanType: 'Poultry' },
    createdAt: '2024-12-12T16:45:00Z',
    riskScore: 55,
    riskReason: 'Moderate-high risk: First-time poultry farmer, market volatility concerns, needs training',
  },
  {
    _id: '5',
    userId: { phoneNumber: '+919876543214' },
    loanCategory: 'Irrigation Equipment',
    status: 'Under Review',
    extractedData: { name: 'Vikram Singh', landArea: 20.0, documentType: 'Land Deed' },
    geoValuation: 2100000,
    matchedSchemeId: { title: 'Micro Irrigation Scheme', loanType: 'Irrigation' },
    createdAt: '2024-12-11T11:30:00Z',
    riskScore: 25,
    riskReason: 'Low risk: Large landholding, proven track record, government scheme support',
  },
  {
    _id: '6',
    userId: { phoneNumber: '+919876543215' },
    loanCategory: 'Tractor Loan',
    status: 'Under Review',
    extractedData: { name: 'Meera Reddy', landArea: 10.0, documentType: 'Land Deed' },
    geoValuation: 1400000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-12-10T13:20:00Z',
    riskScore: 38,
    riskReason: 'Low-moderate risk: Good documentation, adequate collateral, minor income verification needed',
  },
  {
    _id: '7',
    userId: { phoneNumber: '+919876543216' },
    loanCategory: 'Dairy Farming',
    status: 'Under Review',
    extractedData: { name: 'Ramesh Yadav', landArea: 7.5, documentType: 'Land Deed' },
    geoValuation: 880000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-12-09T08:10:00Z',
    riskScore: 48,
    riskReason: 'Moderate risk: Existing dairy operation, but recent market price fluctuations, needs monitoring',
  },
  {
    _id: '8',
    userId: { phoneNumber: '+919876543217' },
    loanCategory: 'Crop Loan',
    status: 'Under Review',
    extractedData: { name: 'Lakshmi Nair', landArea: 18.0, documentType: 'Land Deed' },
    geoValuation: 1650000,
    matchedSchemeId: { title: 'Kisan Credit Card', loanType: 'Crop' },
    createdAt: '2024-12-08T15:00:00Z',
    riskScore: 32,
    riskReason: 'Low risk: Diversified crops, multiple income streams, strong financial position',
  },
  // Approved loans
  {
    _id: '9',
    userId: { phoneNumber: '+919876543218' },
    loanCategory: 'Tractor Loan',
    status: 'Approved',
    extractedData: { name: 'Suresh Kumar', landArea: 14.0, documentType: 'Land Deed' },
    geoValuation: 1750000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-12-05T10:00:00Z',
    riskScore: 22,
    riskReason: 'Very low risk: Excellent credit score, verified assets, strong repayment capacity',
  },
  {
    _id: '10',
    userId: { phoneNumber: '+919876543219' },
    loanCategory: 'Dairy Farming',
    status: 'Approved',
    extractedData: { name: 'Anita Desai', landArea: 9.0, documentType: 'Land Deed' },
    geoValuation: 1100000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-12-04T12:30:00Z',
    riskScore: 30,
    riskReason: 'Low risk: Experienced dairy farmer, stable milk production, good market connections',
  },
  {
    _id: '11',
    userId: { phoneNumber: '+919876543220' },
    loanCategory: 'Crop Loan',
    status: 'Approved',
    extractedData: { name: 'Mohan Das', landArea: 16.5, documentType: 'Land Deed' },
    geoValuation: 1950000,
    matchedSchemeId: { title: 'Kisan Credit Card', loanType: 'Crop' },
    createdAt: '2024-12-03T09:45:00Z',
    riskScore: 18,
    riskReason: 'Very low risk: Long-standing customer, perfect repayment history, diversified income',
  },
  {
    _id: '12',
    userId: { phoneNumber: '+919876543221' },
    loanCategory: 'Poultry Farming',
    status: 'Approved',
    extractedData: { name: 'Kavita Mehta', landArea: 6.0, documentType: 'Land Deed' },
    geoValuation: 720000,
    matchedSchemeId: { title: 'Poultry Development Scheme', loanType: 'Poultry' },
    createdAt: '2024-12-02T14:15:00Z',
    riskScore: 35,
    riskReason: 'Low risk: Established poultry business, consistent sales, good management practices',
  },
  {
    _id: '13',
    userId: { phoneNumber: '+919876543222' },
    loanCategory: 'Irrigation Equipment',
    status: 'Approved',
    extractedData: { name: 'Harish Joshi', landArea: 22.0, documentType: 'Land Deed' },
    geoValuation: 2400000,
    matchedSchemeId: { title: 'Micro Irrigation Scheme', loanType: 'Irrigation' },
    createdAt: '2024-12-01T11:20:00Z',
    riskScore: 20,
    riskReason: 'Very low risk: Large-scale operation, government subsidy eligibility, proven efficiency',
  },
  {
    _id: '14',
    userId: { phoneNumber: '+919876543223' },
    loanCategory: 'Tractor Loan',
    status: 'Approved',
    extractedData: { name: 'Geeta Verma', landArea: 11.5, documentType: 'Land Deed' },
    geoValuation: 1550000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-11-30T13:00:00Z',
    riskScore: 28,
    riskReason: 'Low risk: Good collateral, stable income, appropriate loan amount for land size',
  },
  {
    _id: '15',
    userId: { phoneNumber: '+919876543224' },
    loanCategory: 'Dairy Farming',
    status: 'Approved',
    extractedData: { name: 'Nitin Agarwal', landArea: 8.5, documentType: 'Land Deed' },
    geoValuation: 1020000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-11-29T10:30:00Z',
    riskScore: 33,
    riskReason: 'Low risk: Modern dairy setup, quality breed cattle, established supply chain',
  },
  {
    _id: '16',
    userId: { phoneNumber: '+919876543225' },
    loanCategory: 'Crop Loan',
    status: 'Approved',
    extractedData: { name: 'Pooja Shah', landArea: 13.0, documentType: 'Land Deed' },
    geoValuation: 1480000,
    matchedSchemeId: { title: 'Kisan Credit Card', loanType: 'Crop' },
    createdAt: '2024-11-28T08:15:00Z',
    riskScore: 25,
    riskReason: 'Low risk: Organic farming practices, premium market access, sustainable methods',
  },
  // Rejected loans
  {
    _id: '17',
    userId: { phoneNumber: '+919876543226' },
    loanCategory: 'Tractor Loan',
    status: 'Rejected',
    extractedData: { name: 'Deepak Malhotra', landArea: 4.0, documentType: 'Land Deed' },
    geoValuation: 450000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-11-25T15:30:00Z',
    riskScore: 78,
    riskReason: 'High risk: Insufficient land area for tractor, unverified income sources, poor credit history',
  },
  {
    _id: '18',
    userId: { phoneNumber: '+919876543227' },
    loanCategory: 'Dairy Farming',
    status: 'Rejected',
    extractedData: { name: 'Ravi Khanna', landArea: 3.5, documentType: 'Land Deed' },
    geoValuation: 380000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-11-24T12:00:00Z',
    riskScore: 82,
    riskReason: 'High risk: No prior dairy experience, inadequate infrastructure plan, unrealistic projections',
  },
  {
    _id: '19',
    userId: { phoneNumber: '+919876543228' },
    loanCategory: 'Poultry Farming',
    status: 'Rejected',
    extractedData: { name: 'Sandeep Rao', landArea: 2.0, documentType: 'Land Deed' },
    geoValuation: 220000,
    matchedSchemeId: { title: 'Poultry Development Scheme', loanType: 'Poultry' },
    createdAt: '2024-11-23T09:20:00Z',
    riskScore: 85,
    riskReason: 'Very high risk: Previous loan defaults, insufficient collateral, market saturation concerns',
  },
  {
    _id: '20',
    userId: { phoneNumber: '+919876543229' },
    loanCategory: 'Crop Loan',
    status: 'Rejected',
    extractedData: { name: 'Manish Tiwari', landArea: 6.0, documentType: 'Land Deed' },
    geoValuation: 680000,
    matchedSchemeId: { title: 'Kisan Credit Card', loanType: 'Crop' },
    createdAt: '2024-11-22T14:45:00Z',
    riskScore: 75,
    riskReason: 'High risk: Unverified land ownership, inconsistent income documentation, high debt-to-income ratio',
  },
  {
    _id: '21',
    userId: { phoneNumber: '+919876543230' },
    loanCategory: 'Irrigation Equipment',
    status: 'Rejected',
    extractedData: { name: 'Ashok Pandey', landArea: 5.0, documentType: 'Land Deed' },
    geoValuation: 550000,
    matchedSchemeId: { title: 'Micro Irrigation Scheme', loanType: 'Irrigation' },
    createdAt: '2024-11-21T11:10:00Z',
    riskScore: 80,
    riskReason: 'High risk: Water source unverified, equipment cost exceeds land value, repayment capacity doubtful',
  },
  {
    _id: '22',
    userId: { phoneNumber: '+919876543231' },
    loanCategory: 'Tractor Loan',
    status: 'Rejected',
    extractedData: { name: 'Vijay Chaturvedi', landArea: 3.0, documentType: 'Land Deed' },
    geoValuation: 320000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-11-20T16:30:00Z',
    riskScore: 88,
    riskReason: 'Very high risk: Fraud indicators detected, document authenticity questioned, multiple application attempts',
  },
  // Needs More Information loans
  {
    _id: '23',
    userId: { phoneNumber: '+919876543232' },
    loanCategory: 'Dairy Farming',
    status: 'Needs More Information',
    extractedData: { name: 'Rekha Menon', landArea: 9.5, documentType: 'Land Deed' },
    geoValuation: 1150000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-12-07T10:00:00Z',
    riskScore: 45,
    riskReason: 'Moderate risk: Missing KYC documents, income proof incomplete, needs additional verification',
  },
  {
    _id: '24',
    userId: { phoneNumber: '+919876543233' },
    loanCategory: 'Crop Loan',
    status: 'Needs More Information',
    extractedData: { name: 'Arjun Nair', landArea: 17.0, documentType: 'Land Deed' },
    geoValuation: 1800000,
    matchedSchemeId: { title: 'Kisan Credit Card', loanType: 'Crop' },
    createdAt: '2024-12-06T13:45:00Z',
    riskScore: 40,
    riskReason: 'Moderate risk: Land survey document required, crop insurance details missing, bank statement needed',
  },
  {
    _id: '25',
    userId: { phoneNumber: '+919876543234' },
    loanCategory: 'Poultry Farming',
    status: 'Needs More Information',
    extractedData: { name: 'Shilpa Reddy', landArea: 7.0, documentType: 'Land Deed' },
    geoValuation: 820000,
    matchedSchemeId: { title: 'Poultry Development Scheme', loanType: 'Poultry' },
    createdAt: '2024-12-05T09:30:00Z',
    riskScore: 50,
    riskReason: 'Moderate-high risk: Business plan incomplete, market analysis required, veterinary clearance needed',
  },
  {
    _id: '26',
    userId: { phoneNumber: '+919876543235' },
    loanCategory: 'Irrigation Equipment',
    status: 'Needs More Information',
    extractedData: { name: 'Kiran Deshmukh', landArea: 19.0, documentType: 'Land Deed' },
    geoValuation: 2050000,
    matchedSchemeId: { title: 'Micro Irrigation Scheme', loanType: 'Irrigation' },
    createdAt: '2024-12-04T15:20:00Z',
    riskScore: 38,
    riskReason: 'Low-moderate risk: Water source certification pending, equipment specifications unclear, quote verification needed',
  },
  {
    _id: '27',
    userId: { phoneNumber: '+919876543236' },
    loanCategory: 'Tractor Loan',
    status: 'Needs More Information',
    extractedData: { name: 'Rahul Iyer', landArea: 12.0, documentType: 'Land Deed' },
    geoValuation: 1650000,
    matchedSchemeId: { title: 'PM Kisan Tractor Scheme', loanType: 'Tractor' },
    createdAt: '2024-12-03T11:00:00Z',
    riskScore: 42,
    riskReason: 'Moderate risk: Tractor model selection unclear, dealer verification required, down payment confirmation needed',
  },
  {
    _id: '28',
    userId: { phoneNumber: '+919876543237' },
    loanCategory: 'Dairy Farming',
    status: 'Needs More Information',
    extractedData: { name: 'Swati Kapoor', landArea: 8.0, documentType: 'Land Deed' },
    geoValuation: 980000,
    matchedSchemeId: { title: 'Dairy Entrepreneurship Scheme', loanType: 'Dairy' },
    createdAt: '2024-12-02T14:00:00Z',
    riskScore: 48,
    riskReason: 'Moderate risk: Cattle purchase agreement missing, feed supplier details required, milk collection center verification needed',
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>(hardcodedLoans);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan._id === draggableId ? { ...loan, status: newStatus } : loan
      )
    );
  };

  const getLoansByStatus = (status: string) => {
    return loans.filter((loan) => loan.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 30) return 'bg-green-100 text-green-700';
    if (riskScore <= 50) return 'bg-yellow-100 text-yellow-700';
    if (riskScore <= 70) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Applications</h1>
          <p className="text-gray-600">Manage and review loan applications</p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusOrder.map((status) => {
              const config = statusConfig[status as keyof typeof statusConfig];
              const Icon = config.icon;
              const statusLoans = getLoansByStatus(status);

              return (
                <div
                  key={status}
                  className={`${config.columnColor} rounded-lg p-4 border-2 border-dashed`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <h2 className="font-semibold text-gray-900">{config.label}</h2>
                    </div>
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                      {statusLoans.length}
                    </span>
                  </div>

                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] space-y-3 ${
                          snapshot.isDraggingOver ? 'bg-opacity-80' : ''
                        }`}
                      >
                        {statusLoans.map((loan, index) => (
                          <Draggable
                            key={loan._id}
                            draggableId={loan._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => router.push(`/loans/${loan._id}`)}
                                className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                      {loan.extractedData?.name || 'N/A'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                      {loan.userId?.phoneNumber || 'N/A'}
                                    </p>
                                  </div>
                                  {loan.riskScore !== undefined && (
                                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      loan.riskScore <= 30 ? 'bg-green-100 text-green-700' :
                                      loan.riskScore <= 50 ? 'bg-yellow-100 text-yellow-700' :
                                      loan.riskScore <= 70 ? 'bg-orange-100 text-orange-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {loan.riskScore}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-1 mt-3">
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <FileText className="w-3 h-3" />
                                    <span>{loan.loanCategory}</span>
                                  </div>
                                  {loan.matchedSchemeId && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <TrendingUp className="w-3 h-3" />
                                      <span className="truncate">{loan.matchedSchemeId.title}</span>
                                    </div>
                                  )}
                                  {loan.geoValuation && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <MapPin className="w-3 h-3" />
                                      <span>₹{loan.geoValuation.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {loan.riskReason && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                      <div className="flex items-start gap-1 text-xs">
                                        <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
                                          loan.riskScore! <= 30 ? 'text-green-600' :
                                          loan.riskScore! <= 50 ? 'text-yellow-600' :
                                          loan.riskScore! <= 70 ? 'text-orange-600' :
                                          'text-red-600'
                                        }`} />
                                        <span className="text-gray-600 line-clamp-2">{loan.riskReason}</span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-400 mt-2">
                                    {formatDate(loan.createdAt)}
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-end">
                                  <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    View Details
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
}


