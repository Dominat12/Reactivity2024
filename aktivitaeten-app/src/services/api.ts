import axios from 'axios';

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
  currentUserCreator: boolean;
  currentUserParticipant: boolean;
  participants: Participant[];
}


export interface Participant {
  id: number;
  username: string;
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

//Get Activities
export const getActivities = () => api.get<Activity[]>('/activities');
export const getActivity = (id: number) => api.get<Activity>(`/activities/${id}`);

//CRUD Activities
export const createActivity = (activity: ActivityInput) => api.post<Activity>('/activities', activity);
export const updateActivity = (id: number, activity: ActivityInput) => api.put<Activity>(`/activities/${id}`, activity);
export const deleteActivity = (id: number) => api.delete(`/activities/${id}`);

//Created Activities
export const getUserActivities = () => api.get<Activity[]>('/activities/creator');

//Participate
export const joinActivity = (id: number) => api.post(`/activities/${id}/join`);
export const leaveActivity = (id: number) => api.post(`/activities/${id}/leave`);



export default api;