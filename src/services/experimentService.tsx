import axios from 'axios';

const API_URL = "http://79.141.77.97:8000";

export const getExperiments = async () => {
  const response = await axios.get(`${API_URL}/experiments`);
  return response.data;
};

export const getExperimentById = async (id: number) => {
  const response = await axios.get(`${API_URL}/experiments/${id}`);
  return response.data;
};
