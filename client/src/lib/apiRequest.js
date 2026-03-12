import axios from "axios";

const apiRequest = axios.create({
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
          console.log("✓ Token added to request:", user.token.substring(0, 20) + "...");
        } else {
          console.warn("⚠ No token found in user object");
        }
      } catch (err) {
        console.error("✗ Error parsing user from localStorage:", err);
      }
    } else {
      console.warn("⚠ No user data in localStorage - user may not be authenticated");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("✗ 401 Unauthorized - Token may be expired or invalid");
      console.error("Request was made to:", error.config?.url);
      
      // Optional: Clear user data and redirect to login
      // localStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiRequest;