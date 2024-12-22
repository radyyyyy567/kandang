import axios from "axios";
import { AUTH_TOKEN } from "constants/AuthConstant";
import { signOut } from "store/slices/authSlice";

export const fetchMe = async () => {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      console.warn("Authorization token not found.");
      signOut(); // Sign out the user if the token is missing
      return null; // Return null or appropriate response
    }

    // Make the API call with the authorization header
    const response = await axios.get('http://100.114.201.121:8093/api/user/v1/details/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the data for further usage
    return response.data.data;
  } catch (error) {
    // Handle specific HTTP errors
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Unauthorized. Signing out...");
        localStorage.removeItem(AUTH_TOKEN);// Sign out the user on 401
        signOut();
        return null; // Return null or redirect logic here
      }

      console.error(`HTTP Error: ${status}`, error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error in setting up the request:", error.message);
    }

    // Re-throw the error if needed for upstream handling
    throw error;
  }
};
