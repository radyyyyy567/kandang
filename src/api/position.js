import axios from 'axios';


export const fetchDatas = async () => {
  try {
    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // Make the API call with the authorization header
    const response = await axios.get('http://100.114.201.121:8093/api/position/v1/getPositionInCompany', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the data for further usage
    return response.data.data;
  } catch (error) {
    console.error("Error fetching datas:", error);
    throw error; // Re-throw the error to handle it in the calling file
  }
};

export const createData = async (data) => {
  try {
    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // Make the API call to create the user with the authorization header
    const response = await axios.post('http://100.114.201.121:8093/api/position/v1/createPositionInCompany', data, {
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


export const getDataDetails = async (id) => {
  try {
    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error("Authorization token not found.");
    }

    // Make the API call to get position details with the authorization header
    const response = await axios.get(`http://100.114.201.121:8093/api/position/v1/getPositionDetailsInCompany/${id}`, {
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

export const updateDataById = async (id, updateData) => {
  try {
    if (!id) {
      throw new Error("Data ID is required.");
    }

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
      `http://100.114.201.121:8093/api/position/v1/updatePositionInCompanyById/${id}`,
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
    console.error(`Error updating Position details for ID ${id}:`, error.message);
    throw error; // Propagate the error
  }
};

export const deleteDataById = async (id) => {
  try {
    if (!id) {
      throw new Error("Data ID is required.");
    }

    // Retrieve the token from localStorage or cookies
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error("Authorization token not found.");
    }

    console.log("hai delete")

    const response = await axios.delete(
      `http://100.114.201.121:8093/api/position/v1/deletePositionInCompanyById/${id}`,
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
    console.error(`Error delete data for ID ${id}:`, error.message);
    throw error; // Propagate the error
  }
};