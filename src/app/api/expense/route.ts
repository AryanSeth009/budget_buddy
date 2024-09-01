import { NextResponse } from 'next/server';
import  {connectToDatabase} from '../../utils/mongodb';
import Expense from '../../models/Expense'; // Adjust the path as needed

// Handler for GET requests
export async function GET() {
  try {
    await connectToDatabase();
    const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);
    return NextResponse.json(recentExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// Handler for POST requests
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { subject, personName, amount, date } = await req.json();
    
    if (!subject || !personName || !amount || !date) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const newExpense = new Expense({
      subject,
      personName,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    return NextResponse.json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}
