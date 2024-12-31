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

export const updateMe = async (updateData) => {
  try {
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Update data must be a valid object.");
    }

    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // API call to update user details
    const response = await axios.put(
      `http://100.114.201.121:8093/api/user/v1/updateMyDetails`,
      updateData, // Body payload for the update
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    console.error(`Error updating user:`, error.message);
    throw error; // Propagate the error
  }
};
