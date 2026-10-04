import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  kycVerified: boolean;
  voicePrintId?: string;
  language: string;
  createdAt: Date;
  isAdmin?: boolean;
}

const UserSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  kycVerified: {
    type: Boolean,
    default: false,
  },
  voicePrintId: {
    type: String,
  },
  language: {
    type: String,
    default: 'hi',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;


