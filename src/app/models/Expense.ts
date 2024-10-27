// models/Expense.ts
import mongoose, { Schema, model, Document } from 'mongoose';

interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
 // Reference to the user
  subject: string;
  personName: string;
  amount: number;
  date: Date;
}

const expenseSchema = new Schema<IExpense>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add reference to User model
  
  subject: { type: String, required: true },
  personName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

// Check if model already exists, otherwise create it
const Expense = mongoose.models.Expense || model<IExpense>('Expense', expenseSchema);

export default Expense;
