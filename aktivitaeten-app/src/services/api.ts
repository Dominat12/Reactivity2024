import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

export interface Activity {
  id: number;
  name: string;
  description: string;
  rating: number;
  location: string;
  startTime: string;
  endTime: string | null;
  minPrice: number;
  maxPrice: number;
  minParticipants: number;
  maxParticipants: number;
  imagePath: string;
}

// In api.ts
export interface ActivityInput {
    name: string;
    description: string;
    rating: number;
    location: string;
    startTime: string;
    endTime: string | null;
    minPrice: number;
    maxPrice: number;
    minParticipants: number;
    maxParticipants: number;
    imagePath?: string; // Optional field
  }

export const getActivities = () => api.get<Activity[]>('/activities');
export const getActivity = (id: number) => api.get<Activity>(`/activities/${id}`);
export const createActivity = (activity: ActivityInput) => api.post<Activity>('/activities', activity);
export const updateActivity = (id: number, activity: ActivityInput) => api.put<Activity>(`/activities/${id}`, activity);
export const deleteActivity = (id: number) => api.delete(`/activities/${id}`);
export const participateInActivity = (id: number) => api.put(`/activities/${id}/participate`);
export const getUserActivities = () => api.get<Activity[]>('/activities/creator');

export default api;