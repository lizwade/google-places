// app/api/photo/route.ts
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Hello from the GET route");
  console.log(req);
  try {
    const { searchParams } = new URL(req.url);
    const photoReference = searchParams.get("photoReference");

    if (!photoReference) {
      return NextResponse.json({ error: "photoReference is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

    console.log(`trying to get photo for photoUrl`);
    console.log(photoUrl);

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