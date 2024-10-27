import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/mongodb';
import Trip from '../../models/Trip'; // Adjust the path as needed
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT and extract userId
const verifyJWT = (req: Request): string => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.userId) {
      throw new Error('User ID is missing in the token');
    }

    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Handler for GET requests
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const userId = verifyJWT(req);
    console.log('User ID from token:', userId);

    const url = new URL(req.url);
    const countParam = url.searchParams.get('count');

    if (countParam === 'true') {
      // Count the total number of trips for the user
      const tripCount = await Trip.countDocuments({ userId });
      console.log('Total trip count:', tripCount);
      return NextResponse.json({ tripCount });
    } else {
      // Fetch the 5 most recent trips for the user
      const recentTrips = await Trip.find({ userId }).sort({ date: -1 }).limit(5);
      console.log('Fetched trips:', recentTrips);
      return NextResponse.json(recentTrips);
    }
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch trips' }, { status: 500 });
  }
}

// Handler for POST requests

export async function POST(req: Request) {
  const { userId, TripName, Destination, Amount, StartDate, EndDate, method, Note } = await req.json();

  try {
    const newTrip = new Trip({
      
      TripName,
      Destination,
      Amount,
      StartDate,
      EndDate,
      method,
      Note,
      userId,
    });

    const savedTrip = await newTrip.save();
    return NextResponse.json(savedTrip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// Handler for DELETE requests
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();

    const userId = verifyJWT(req);
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('id'); // Retrieve the trip ID from the query parameters

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is missing' }, { status: 400 });
    }

    // Find the trip by ID and verify if it belongs to the user
    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    // Delete the trip
    await Trip.findByIdAndDelete(tripId);

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to delete trip' }, { status: 500 });
  }
}
