import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';

type PoopEventResponse = {
  poopEventLoggeds: {
    user: string;
    latitude: number;
    longitude: number;
    sessionDuration: number;
    timestamp: string;
  }[];
};

export async function POST(req: NextRequest) {
  const query = gql`
    {
      poopEventLoggeds {
        user
        latitude
        longitude
        sessionDuration
        timestamp
      }
    }
  `;

  const url = process.env.NEXT_PUBLIC_SUBGRAPH_URL as string;

  try {
    const data = await req.json();

    if (!data.address) {
      return NextResponse.json({ message: 'Invalid Address' }, { status: 400 });
    }

    const response: PoopEventResponse = await request(url, query);

    // Filter events where user matches the provided address
    const filteredEvents = response.poopEventLoggeds.filter(
      (event: { user: string }) =>
        event.user.toLowerCase() === data.address.toLowerCase()
    );

    return NextResponse.json({ message: filteredEvents }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: 'Error fetching data from the subgraph', error },
      { status: 500 }
    );
  }
}
