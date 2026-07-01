import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId; // Client
  dietitianId: mongoose.Types.ObjectId; // Dietitian/Nutritionist
  date: Date;
  duration: number; // in minutes, e.g. 30, 60
  status: 'Pending' | 'Approved' | 'Cancelled' | 'Completed';
  notes?: string;
  videoLink?: string; // Meeting link (Mock or Daily.co / Jitsi)
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dietitianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, default: 30 },
    status: { type: String, enum: ['Pending', 'Approved', 'Cancelled', 'Completed'], default: 'Pending' },
    notes: { type: String },
    videoLink: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
