// nextjs-app/pages/api/register.ts


import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User'; // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI || '';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI, {
   
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await connectDB();

  if (method === 'POST') {
    try {
      const { username, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
