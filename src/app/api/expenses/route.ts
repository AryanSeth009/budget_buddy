import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/mongodb';
import Expense from '../../models/Expense';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Replace with your JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNDQ3OTk5OSwiaWF0IjoxNzI0NDc5OTk5fQ';

// Middleware to verify JWT and extract userId
const verifyJWT = (req: Request): string => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  console.log('Received token:', token); // Log token

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Decoded token:', decoded); // Log decoded token

    // Check if userId is present in the token payload
    if (!decoded.userId) {
      throw new Error('User ID is missing in the token');
    }

    return decoded.userId;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};


// Handler for GET requests
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Verify the JWT and get the user ID
    const userId = verifyJWT(req);

    // Filter expenses by userId
    const recentExpenses = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
    return NextResponse.json(recentExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch expenses' }, { status: 500 });
  }
}

// Handler for POST requests
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Verify the JWT and get the user ID
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
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to add expense' }, { status: 500 });
  }
}
