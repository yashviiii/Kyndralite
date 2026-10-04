import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScheme extends Document {
  title: string;
  description: string;
  benefits: string;
  loanType: string;
  eligibility: string;
  icon: string;
}

const SchemeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  benefits: {
    type: String,
    required: true,
  },
  loanType: {
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const Scheme: Model<IScheme> = mongoose.models.Scheme || mongoose.model<IScheme>('Scheme', SchemeSchema);

export default Scheme;


