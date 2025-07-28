import axios from "axios";

export const geocodeCity = async (req, res) => {
  const { city } = req.params;
  
  console.log("Geocoding request received for city:", city);
  
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: city,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'RealEstateApp/1.0',
          'Accept-Language': 'en'
        }
      }
    );
    
    console.log("Nominatim API response:", response.data);

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      const coordinates = [parseFloat(lat), parseFloat(lon)];
      console.log("Found coordinates:", coordinates);
      res.json({ coordinates });
    } else {
      console.log("No coordinates found for city:", city);
      res.json({ coordinates: null });
    }
  } catch (error) {
    console.error("Geocoding error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Failed to geocode city", 
      error: error.response?.data || error.message 
    });
  }
};
