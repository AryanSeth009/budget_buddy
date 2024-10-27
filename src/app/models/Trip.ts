// models/Expense.ts
import mongoose, { Schema, model, Document } from 'mongoose';

interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  TripName: string;
  Destination:string,
  StartDate: Date,
  EndDate:Date,
  Amount:number,
  method:string,
  Note:string, 
}

const tripSchema = new Schema<ITrip>({

  TripName: { type: String, required: true },
  Destination: { type: String, required: true },
  Amount: { type: Number, required: true },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  method: { type: String, required: true },
  Note: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add reference to User model

});

// Check if model already exists, otherwise create it
const Trip = mongoose.models.Trip || model<ITrip>('Trip', tripSchema);

export default Trip;
