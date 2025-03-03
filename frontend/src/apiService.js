import axios from 'axios';

// Create an Axios instance
const apiService = axios.create({
   baseURL: 'https://library-attendance-system.onrender.com',
 //baseURL: "http://localhost:5000", // Change to your backend API base URL
  withCredentials: true, // Ensure cookies are sent with each request if necessary
});

// Set the Authorization token for each request
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Or get from cookies if using cookies
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header for requests
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors if necessary
  }
);

// Handle responses or errors globally
apiService.interceptors.response.use(
  (response) => response, // Success case: return the response
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (token expired or invalid)
      // Maybe redirect to login page or clear the local storage
      localStorage.removeItem("authToken");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Handle other errors
  }
);

export default apiService;
