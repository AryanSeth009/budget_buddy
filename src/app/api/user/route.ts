// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User'; // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Connect to the MongoDB database
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI, { });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Database connection failed');
  }
};

export async function GET(req: Request) {
  console.log('Request Headers:', req.headers);

  try {
    await connectDB();

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    console.log('Extracted Token:', token);
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token and extract user ID
    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId; // Use the correct field for the user ID
      
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find user by ID
    const user = await User.findById(userId).select('username'); // Only select username
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ userId: user._id, username: user.username });
  } catch (error) {
    console.error('Fetch user details error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
