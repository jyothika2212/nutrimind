import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: 'active' | 'inactive' | 'canceled' | 'trialing';
  planTier: 'Free' | 'Premium';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'canceled', 'trialing'], default: 'inactive' },
    planTier: { type: String, enum: ['Free', 'Premium'], default: 'Free' },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
