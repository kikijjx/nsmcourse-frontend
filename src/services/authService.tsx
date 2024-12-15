import axios from 'axios';

import { API_URL } from "../config";

export const login = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await axios.post(`${API_URL}/token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
};
