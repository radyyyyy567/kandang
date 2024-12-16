import axios from "axios";


export const fetchMe = async () => {
    try {
      // Retrieve the token from localStorage or cookies
      const token = localStorage.getItem('auth_token');
  
      if (!token) {
        throw new Error("Authorization token not found.");
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
      console.error("Error fetching users:", error);
      throw error; // Re-throw the error to handle it in the calling file
    }
  };