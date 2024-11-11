import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getThemes = async () => {
  const response = await axios.get(`${API_URL}/themes`);
  return response.data;
};

export const getThemeById = async (id: number) => {
  const response = await axios.get(`${API_URL}/themes/${id}`);
  return response.data;
};