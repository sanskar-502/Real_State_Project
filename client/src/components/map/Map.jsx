import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

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
  return (
    <MapContainer
      center={[20.5937, 78.9629]} 
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <ChangeView center={mapCenter} zoom={mapCenter ? 12 : 7} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
