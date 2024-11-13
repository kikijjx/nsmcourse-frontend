import axios from 'axios';

const API_URL = "http://45.15.156.106:8000";

export const getExperiments = async () => {
  const response = await axios.get(`${API_URL}/experiments`);
  return response.data;
};

export const getExperimentById = async (id: number) => {
  const response = await axios.get(`${API_URL}/experiments/${id}`);
  return response.data;
};
