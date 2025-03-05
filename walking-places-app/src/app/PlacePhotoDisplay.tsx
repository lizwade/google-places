import React, { useState, useEffect } from "react";

type Photo = {
  photo_reference: string;
};

type Place = {
  photos?: Photo[];
};

function PlacePhotoDisplay({ place }: { place: Place }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (place?.photos && place.photos.length > 0) {
          const photo = place.photos[0];
          
          const stringToFetch = `/api/photo?photoReference=${photo.photo_reference}`;
          console.log("In the PlacePhotoDisplay component. stringToFetch is ");
          console.log(stringToFetch);

        try {
          const response = await fetch(stringToFetch);

          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPhotoUrl(url);
          } else {
            console.error("Error fetching photo");
          }
        } catch (error) {
          console.error("Error fetching photo:", error);
        }
      } else {
        setPhotoUrl(null);
      }
    };

    fetchPhoto();
  }, [place]);

  return (
    <div>
      {photoUrl ? (
        <img src={photoUrl} alt="Place Photo" />
      ) : (
        <p>No photo available.</p>
      )}
    </div>
  );
}

export default PlacePhotoDisplay;