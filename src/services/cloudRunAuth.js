import axios from 'axios';

// Function to get ID token for Cloud Run authentication
async function getIdToken(audience) {
  try {
    // For local development, you might need to get a token from a metadata server mock
    // or use a different approach
    if (window.location.hostname === 'localhost') {
      console.log('Running locally, skipping Cloud Run authentication');
      return null;
    }

    // For production, get the ID token from the metadata server
    // This works when your app is running on Google Cloud (like Cloud Run)
    const response = await axios.get(
      `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${audience}`,
      {
        headers: {
          'Metadata-Flavor': 'Google'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

// Function to create an authenticated axios instance for Cloud Run
export async function createAuthenticatedAxiosInstance(baseURL) {
  const axiosInstance = axios.create({
    baseURL
  });

  // Add request interceptor to add authentication token
  axiosInstance.interceptors.request.use(async (config) => {
    // Skip authentication for local development
    if (window.location.hostname === 'localhost') {
      return config;
    }

    try {
      const token = await getIdToken(baseURL);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error in authentication interceptor:', error);
    }
    return config;
  });

  return axiosInstance;
}

export default {
  createAuthenticatedAxiosInstance
};
