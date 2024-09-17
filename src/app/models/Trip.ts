// models/Expense.ts
import mongoose, { Schema, model, Document } from 'mongoose';

interface ITrip extends Document {
  TripName: string;
  Destination:string,
  StartDate: Date,
  EndDate:Date,
  Amount:number,
  currency:string,
  method:string,
  Note:string,

  

 
  
}

const tripSchema = new Schema<ITrip>({
  TripName: { type: String, required: true },
  Destination: { type: String, required: true },
  Amount: { type: Number, required: true },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  currency: { type: String, required: true },
  method: { type: String, required: true },
  Note: { type: String, required: false },
});

// Check if model already exists, otherwise create it
const Trip = mongoose.models.Expense || model<ITrip>('Trip', tripSchema);

export default Trip;
