import axios from "axios";

const apiRequest = axios.create({
  // This now reads the URL from your environment variables
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default apiRequest;