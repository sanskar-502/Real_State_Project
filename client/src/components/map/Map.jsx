import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

// --- FIX FOR LEAFLET ICONS START ---
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});
// --- FIX FOR LEAFLET ICONS END ---


function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

async function getCityCoordinates(city) {
  try {
    const response = await apiRequest.get(`/geocode/${encodeURIComponent(city)}`);
    return response.data.coordinates;
  } catch (error) {
    console.error("Error getting city coordinates:", error.response?.data || error.message);
    return null;
  }
}

function Map({ items }) {
  const [searchParams] = useSearchParams();
  const [mapCenter, setMapCenter] = useState(null);
  const city = searchParams.get("city");

  useEffect(() => {
    async function updateMapCenter() {
      if (city) {
        const coordinates = await getCityCoordinates(city);
        if (coordinates) {
          setMapCenter(coordinates);
        }
      } else if (items.length > 0) {
        setMapCenter([items[0].latitude, items[0].longitude]);
      } else {
        setMapCenter([20.5937, 78.9629]); // Center of India
      }
    }
    updateMapCenter();
  }, [city, items]);

  if (!mapCenter) {
    return <div>Loading Map...</div>;
  }

  return (
    <MapContainer
      center={mapCenter} 
      zoom={12}
      scrollWheelZoom={false}
      className="map"
    >
      <ChangeView center={mapCenter} zoom={12} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        // ✅ CRITICAL FIX: Convert string coordinates to numbers
        <Pin item={{
            ...item,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude)
        }} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;