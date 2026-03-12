import axios from "axios";

const apiRequest = axios.create({
  // This now reads the URL from your environment variables
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiRequest.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiRequest;