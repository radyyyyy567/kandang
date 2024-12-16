import axios from 'axios';


export const fetchUsers = async () => {
  try {
    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // Make the API call with the authorization header
    const response = await axios.get('http://100.114.201.121:8093/api/user/v1/getUsersInCompany', {
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

export const createUserInCompany = async (userData) => {
  try {
    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // Make the API call to create the user with the authorization header
    const response = await axios.post('http://100.114.201.121:8093/api/user/v1/createUserInCompany', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw the error to handle it in the calling file
  }
};


export const getUserDetails = async (userId) => {
  try {
    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // Make the API call to get user details with the authorization header
    const response = await axios.get(`http://100.114.201.121:8093/api/user/v1/details/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the response data
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error; // Re-throw the error to handle it in the calling file
  }
};
