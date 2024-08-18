// nextjs-app/lib/mongodb.ts
import mongoose from 'mongoose';
const dbName = 'budget_buddy';
const connectDB = async (dbName:string) => {
  if (mongoose.connections[0].readyState) {
    // Use existing connection
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI || '', {
    
  });
};


connectDB(dbName);