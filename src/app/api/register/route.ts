// src/app/api/register/route.ts
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

    // Parse request body
    const { username, email, password } = await req.json();

    // Debugging log
    console.log('Request body:', { username, email, password });

    // Validate input
     // Validate input
     if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    // Check if the user already exists (pseudo code for database operation)
    

    // Register the user (pseudo code for database operation)
    const newUser = await createUser({ username, email, password });

    // Respond with success message
    return NextResponse.json({ success: true, message: 'User registered successfully' });
    
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
async function checkIfUserExists(email: string) {
  // Code to check if the user already exists in the database
}

async function createUser(userData: { username: string; email: string; password: string }) {
  // Code to create a new user in the database
}