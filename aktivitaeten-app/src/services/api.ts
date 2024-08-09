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
  averageRating?: number; 
  userRating?: number; 
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

  
export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  alias: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  role: string;
}

export interface UserProfileUpdate {
  firstName: string;
  lastName: string;
  alias: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER'| 'PREFER_NOT_TO_SAY';
}

export interface ActivityPage {
  content: Activity[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Rating {
  id: number;
  score: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
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
export const removeParticipant = (activityId: number, participantUsername: string) =>   api.delete(`/activities/${activityId}/participants/${participantUsername}`);
export const getParticipatingActivities = (page = 0, size = 10) =>   api.get<ActivityPage>(`/activities/participating?page=${page}&size=${size}`);


// User Profile
export const getUserProfile = () => api.get<UserProfile>('/users/profile');
export const updateUserProfile = (profile: UserProfileUpdate) => api.put<UserProfile>('/users/profile', profile);

// Ratings
export const getUserRating = (activityId: number) => api.get<Rating>(`/activities/${activityId}/rating`);
export const rateActivity = (activityId: number, score: number, comment?: string) => api.post<Rating>(`/activities/${activityId}/rate`, null, { params: { score, comment } });


export default api;