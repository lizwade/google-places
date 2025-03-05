"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacePhotoDisplay from '../app/PlacePhotoDisplay'


export type Photo = {
  name: string;
  // Add other photo properties if needed
};

export type Place = { 
  location: {
      latitude: number;
      longitude: number;
  };  
  displayName: {
    text: string;
  }
  photos: Photo[];
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
  }, [location]); //end of useEffect

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_DEFAULT_API_KEY";

  function displayPlace(aPlace : Place) {
    const myName = aPlace.displayName.text;
    console.log('ref for photo is' + aPlace.photos[0].name);
    alert(myName);



  //   const firstPhoto = aPlace.photos[0];
      
  //   //do something to display myPhoto
  //   //const photoFrame = document.getElementById("photoFrame") as HTMLImageElement;
  //   const photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${myPhotoRef}&key=`;
  //   console.log(photo);

  //   const photoString = `https://places.googleapis.com/v1/${firstPhoto.name}/:getData?key=${googleMapsApiKey}&maxWidth={WIDTH}`
   }

  return (
    <div>
      <h1>Where?</h1>
      <h2>Top spots for a lovely walk</h2>
      {//<div><img id="photoFrame" alt="Nice place for walk" src="https://img.freepik.com/free-vector/tree_1308-36471.jpg?w=360"/></div>
      }
      
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <PlacePhotoDisplay place={places[0]}></PlacePhotoDisplay>
        <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} zoom={13} center={location}>
          {places.map((place, index) => (
            <Marker key={index} onClick={()=>displayPlace(place)} position={{ lat: place.location.latitude, lng: place.location.longitude }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}