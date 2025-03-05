"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Place = {
    
  location: {
      latitude: number;
      longitude: number;
    };
  
  // Add other properties of a place if needed
};

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [location, setLocation] = useState({ lat: 51.5902, lng: 0.0173 }); // Default to Walthamstow

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateLocation = () => {
    // Example usage of setLocation
    setLocation({ lat: 40.7128, lng: -74.0060 }); // New York City coordinates
  };

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const response = await fetch("/api/places", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat: location.lat, lng: location.lng }),
        });

        if (!response.ok) {
          console.error("API Error:", response.status, response.statusText);
          return;
        }

        const data: Place[] = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    getPlaces();
  }, [location]);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_DEFAULT_API_KEY";

  return (
    <div>
      <h1>Where?</h1>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} zoom={13} center={location}>
          {places.map((place, index) => (
            <Marker key={index} position={{ lat: place.location.latitude, lng: place.location.longitude }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}