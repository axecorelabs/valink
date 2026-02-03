import mongoose from 'mongoose';

const ValentinePageSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  fromName: {
    type: String,
    required: true,
    maxlength: 30,
  },
  toName: {
    type: String,
    required: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    maxlength: 120,
    default: '',
  },
  templateId: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
    default: '',
  },
  partnerCode: {
    type: String,
    default: '',
    index: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date('2026-02-15T23:59:59'),
  },
});

export default mongoose.models.ValentinePage || mongoose.model('ValentinePage', ValentinePageSchema);
