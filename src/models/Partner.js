import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  partnerCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  role: {
    type: String,
    default: 'partner',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
