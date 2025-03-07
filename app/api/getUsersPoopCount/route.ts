import { gql, request } from 'graphql-request';
import { NextResponse } from 'next/server';

type PoopCountResponse = {
  poopEventLoggeds: { user: string }[];
};

export async function POST() {
  const query = gql`
    {
      poopEventLoggeds {
        user
      }
    }
  `;

  const url = process.env.NEXT_PUBLIC_SUBGRAPH_URL as string;

  try {
    const response: PoopCountResponse = await request(url, query);

    // Count occurrences of each unique user
    const userCounts: Record<string, number> = {};

    response.poopEventLoggeds.forEach((event: { user: string }) => {
      const user = event.user.toLowerCase(); // Normalize case
      userCounts[user] = (userCounts[user] || 0) + 1;
    });

    // Transform the object into an array of { user, count }
    const result = Object.entries(userCounts).map(([user, count]) => ({
      user,
      count,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: 'Error fetching data from the subgraph', error },
      { status: 500 }
    );
  }
}
