// models/Expense.ts
import mongoose, { Schema, model, Document } from 'mongoose';

interface IExpense extends Document {
  subject: string;
  personName: string;
  amount: number;
  date: Date;
}

const expenseSchema = new Schema<IExpense>({
  subject: { type: String, required: true },
  personName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

// Check if model already exists, otherwise create it
const Expense = mongoose.models.Expense || model<IExpense>('Expense', expenseSchema);

export default Expense;
