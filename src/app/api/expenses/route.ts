import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/mongodb';
import Expense from '../../models/Expense';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose  from  'mongoose';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


// Middleware to verify JWT and extract userId
const verifyJWT = (req: Request): string => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.userId) {
      throw new Error('User ID is missing in the token');
    }

    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isTotalRequest = searchParams.get("total") === "true"; // Check for `total=true` in the query parameter

  try {
    await connectToDatabase();

    const userId = verifyJWT(req);
    console.log("Extracted User ID:", userId); // Debug log

    if (isTotalRequest) {
      // Fetch total amount of all expenses for the user
      const totalExpenses = await Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Ensure ObjectId type
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);
      

      console.log("Total Expenses Data:", totalExpenses); // Debug log
      return NextResponse.json({ totalAmount: totalExpenses[0]?.totalAmount || 0 });
    } else {
      // Fetch recent expenses if `total` parameter is not set to true
      const recentExpenses = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
      return NextResponse.json(recentExpenses);
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch expenses' }, { status: 500 });
  }
}

// Handler for adding a new expense
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const userId = verifyJWT(req);

    const { subject, personName, amount, date } = await req.json();
    if (!subject || !personName || !amount || !date) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const newExpense = new Expense({
      userId,
      subject,
      personName,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    return NextResponse.json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to add expense' }, { status: 500 });
  }
}

// Handler for deleting an expense
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();

    const userId = verifyJWT(req);
    const { searchParams } = new URL(req.url);
    const expenseId = searchParams.get('id'); // Retrieve the expense ID from the query parameters

    if (!expenseId) {
      return NextResponse.json({ error: 'Expense ID is missing' }, { status: 400 });
    }

    // Find the expense by ID and verify if it belongs to the user
    const expense = await Expense.findOne({ _id: expenseId, userId });
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found or unauthorized' }, { status: 404 });
    }

    // Delete the expense
    await Expense.findByIdAndDelete(expenseId);

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Failed to delete expense' }, { status: 500 });
  }
}
