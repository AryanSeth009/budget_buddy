// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User'; // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Add JWT secret to your .env.local

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI, {
   
  });
};

export async function POST(req: Request) {
  try {
    await connectDB();

    // Ensure req.json() correctly parses the body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}