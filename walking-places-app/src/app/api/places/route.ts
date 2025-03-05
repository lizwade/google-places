import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json(); // Parse the request body as JSON

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || "YOUR_DEFAULT_API_KEY"; // Get API key from environment variables

    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchNearby`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.types", // Specify the fields you want
        },
        body: JSON.stringify({
          locationRestriction: {
            circle: {
              center: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
              },
              radius: 5000.0, // 5km radius
            },
          },
          includedTypes: ["park"], // Change this for other place types
          // maxResultCount: 10, // Optional: Limit the number of results
        }),
      }
    );

    if (!response.ok) {
      console.error("Google Places API error:", response.status, response.statusText);
      return NextResponse.json({ error: "Failed to fetch places from Google Places API" }, { status: response.status });
    }

    const data = await response.json();

    if (data.places) {
      console.log("Got places:", data.places);
      return NextResponse.json(data.places);
    } else {
      console.log("No places found, or error:", data);
      return NextResponse.json({ error: "No places found or API error" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}