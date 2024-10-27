  // nextjs-app/models/User.ts
  import mongoose, { Document, Model, Schema } from 'mongoose';

  interface IUser extends Document {
    username: string;
    email: string;
    password: string;
  
  }

  const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

  });

  const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema,'budget_buddy');

  export default User;
