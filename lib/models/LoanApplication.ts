import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUploadedDocument {
  filename: string;
  gridFSId: mongoose.Types.ObjectId;
  type: string;
}

export interface IExtractedData {
  name?: string;
  landArea?: number;
  documentType?: string;
}

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  loanCategory: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Needs More Information';
  extractedData: IExtractedData;
  uploadedDocuments: IUploadedDocument[];
  geoValuation?: number;
  voiceConsentRecording?: string;
  matchedSchemeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LoanApplicationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loanCategory: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Needs More Information'],
    default: 'Under Review',
  },
  extractedData: {
    name: String,
    landArea: Number,
    documentType: String,
  },
  uploadedDocuments: [{
    filename: String,
    gridFSId: Schema.Types.ObjectId,
    type: String,
  }],
  geoValuation: Number,
  voiceConsentRecording: String,
  matchedSchemeId: {
    type: Schema.Types.ObjectId,
    ref: 'Scheme',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

LoanApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const LoanApplication: Model<ILoanApplication> = mongoose.models.LoanApplication || mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);

export default LoanApplication;


