import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  currentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  driverStatus: {
    type: String,
    enum: ['available', 'on_trip', 'break', 'offline'],
    default: 'offline'
  }
});

export const Driver = mongoose.model('Driver', driverSchema); 