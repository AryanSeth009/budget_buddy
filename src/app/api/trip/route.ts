import { NextResponse } from 'next/server';
import  {connectToDatabase} from '../../utils/mongodb';
import Trip from '../../models/Trip'; // Adjust the path as needed

// Handler for GET requests
export async function GET() {
  try {
    await connectToDatabase();
    const recentTrips = await Trip.find().sort({ date: -1 }).limit(5);
    return NextResponse.json(recentTrips);
  } catch (error) {
    console.error('Error fetching Trips:', error);
    return NextResponse.json({ error: 'Failed to fetch Trips' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      await connectToDatabase();
      const { TripName,Destination, Amount, StartDate, EndDate, currency, method, Note} = await req.json();
      
      if (!TripName || !Destination || !Amount || !StartDate || !EndDate || !currency || !method) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
  
      const newTrip = new Trip({
        TripName,
        Destination,
        Amount,
        StartDate: new Date(StartDate),
        EndDate: new Date(EndDate),
        Note,
        currency,
        method,
      });
  
      await newTrip.save();
      return NextResponse.json({ message: 'Trip added successfully', Trip: newTrip });
    } catch (error) {
      console.error('Error adding Trip:', error);
      return NextResponse.json({ error: 'Failed to add Trip' }, { status: 500 });
    }
  }
  