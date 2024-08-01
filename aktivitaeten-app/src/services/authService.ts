import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Adjust this to your Spring Boot backend URL

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, `username=${username}&password=${password}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    withCredentials: true
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return null;
  }
};