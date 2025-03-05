"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacePhotoDisplay from "./PlacePhotoDisplay";

export type Photo = {
  photo_reference: string;
  height: number;
  width: number;
  // Add other photo properties if needed
};


type Place = {
  name: string;
  place_id: string;
  photos: Photo[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
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
    const fetchPlaces = async () => {
      const res = await fetch(`/api/places?lat=${location.lat}&lng=${location.lng}`);
      const data: Place[] = await res.json();
      setPlaces(data);
    };

    fetchPlaces();
  }, [location]);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_DEFAULT_API_KEY";

  function displayPlace(aPlace: Place) {
    const myName = aPlace.name;
    console.log('ref for photo is ' + aPlace.photos[0].photo_reference);
    alert(myName);
  }

  return (
    <div>
      <h1>Where?</h1>
      <h2>Top spots for a lovely walk</h2>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <PlacePhotoDisplay place={places[0]} />
        <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} zoom={13} center={location}>
          {places.map((place, index) => (
            <Marker key={index} onClick={()=>displayPlace(place)} position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}