import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/mongodb';
import Balance from '../../models/Balance'; // Ensure this imports from the correct schema
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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

    // Decode the token and extract the userId
    const userId = verifyJWT(req);

    // Find the balance for the user
    const userBalance = await Balance.findOne({ userId });

    // If no balance found, return a 404 response
    if (!userBalance) {
      return NextResponse.json({ error: 'No balance found for the user' }, { status: 404 });
    }

    // Return the balance if found
    return NextResponse.json({ balance: userBalance.balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: error || 'Failed to fetch balance' }, { status: 500 });
  }
}

// Handler for POST requests
// Handler for POST requests
// Handler for POST requests
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const userId = verifyJWT(req);  // Get userId from the decoded JWT
    const { balance } = await req.json();

    if (balance === undefined) {
      return NextResponse.json({ error: 'Balance is required' }, { status: 400 });
    }

    const existingBalance = await Balance.findOne({ userId });

    if (existingBalance) {
      // Update the balance
      existingBalance.balance = balance;
      await existingBalance.save();
    } else {
      // Create a new balance entry if it doesn't exist
      const newBalance = new Balance({ userId, balance });
      await newBalance.save();
    }

    return NextResponse.json({ message: 'Balance updated successfully' });
  } catch (error) {
    console.error('Error updating balance:', error);
    return NextResponse.json({ error: error || 'Failed to update balance' }, { status: 500 });
  }
}

