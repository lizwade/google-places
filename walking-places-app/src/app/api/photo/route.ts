// app/api/photo/route.ts
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { photoName } = await req.json(); // Get photoName from request body

    if (!photoName) {
      return NextResponse.json({ error: "photoName is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidth=400`;

    const response = await fetch(photoUrl);

    if (!response.ok) {
      console.error("Photo API error:", response.status, response.statusText);
      return NextResponse.json({ error: "Failed to fetch photo" }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}