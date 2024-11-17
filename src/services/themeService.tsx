import axios from 'axios';

const API_URL = "http://45.15.156.106:8000";

export const getThemes = async () => {
  const response = await axios.get(`${API_URL}/themes`);
  return response.data;
};

export const getTheme = async (themeId: number) => {
  const response = await axios.get(`${API_URL}/themes/${themeId}`);
  return response.data;
};

export const createTheme = async (data: { title: string, description: string, content: any[], course_id: number }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error('Token not found');
  }

  const response = await axios.post(`${API_URL}/themes?token=${token}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};



export const updateTheme = async (themeId: number, themeData: { title: string; description: string; content: any[]; course_id: number }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error('Token not found');
  }

  const response = await axios.put(`${API_URL}/themes/${themeId}?token=${token}`, themeData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const deleteTheme = async (themeId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error('Token not found');
  }

  const response = await axios.delete(`${API_URL}/themes/${themeId}?token=${token}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};