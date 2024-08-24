// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User'; // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  
};

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    // Find user by ID
    const user = await User.findById(userId).select('username'); // Only select username
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ username: user.username });
  } catch (error) {
    console.error('Fetch user details error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
