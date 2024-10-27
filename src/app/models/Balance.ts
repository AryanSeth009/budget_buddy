import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },  // Ensure userId is used for uniqueness
  balance: { type: Number, required: true },
  // Comment out or remove the username field if it's not needed
  // username: { type: String, unique: true, sparse: true } 
});

const Balance = mongoose.models.Balance || mongoose.model('Balance', balanceSchema);
export default Balance;
