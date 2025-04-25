import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  pickupLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed'],
    default: 'pending'
  },
  assignedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Journey = mongoose.model('Journey', journeySchema); 