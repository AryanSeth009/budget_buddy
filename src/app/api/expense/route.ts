// src/app/api/expense/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Expense from '../../models/Expense'; // Adjust the path as needed

// Handler for GET requests
export async function GET() {
  try {
    // Connect to MongoDB if not already connected
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI || '', {
       
      });
    }

    const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);
    return NextResponse.json(recentExpenses);
  } catch (error) {
    return NextResponse.error();
  }
}
