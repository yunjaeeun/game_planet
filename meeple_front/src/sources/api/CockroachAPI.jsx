import axios from "axios";

export const VideoAPI = {
  createSession: async () => {
    const response = await axios.post(
      // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/video/create-session`
      `${import.meta.env.VITE_API_BASE_URL}/video/create-session`
    );
    return response.data;
  },
  generateToken: async (sessionId) => {
    const response = await axios.post(
      // `${import.meta.env.VITE_LOCAL_API_BASE_URL}/video/generate-token/${sessionId}`
      `${import.meta.env.VITE_API_BASE_URL}/video/generate-token/${sessionId}`
    );
    return response.data;
  },
};
