import axios from 'axios';

const API_URL = "/api";

export const getExperiments = async () => {
  const response = await axios.get(`${API_URL}/experiments`);
  return response.data;
};

export const getExperimentById = async (id: number) => {
  const response = await axios.get(`${API_URL}/experiments/${id}`);
  return response.data;
};
