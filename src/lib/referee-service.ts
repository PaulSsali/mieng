/**
 * Referee Service
 * Handles operations related to referees and abstracts away API calls
 */

import { User } from 'firebase/auth';
import { authenticatedFetch } from './auth-utils';

// Define MockUser interface to match auth-utils.ts
interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  getIdToken: () => Promise<string>;
}

// Use the same user type as in auth-utils
type AuthUser = User | MockUser | null;

// Review type definition
export interface Review {
  id: number;
  name: string;
  status: string;
  date?: string;
}

// Referee type definition
export interface Referee {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string | null;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Extended properties for UI functionality
  projectIds?: number[];
  reviews?: Review[];
}

// Type for creating a new referee (without id)
export interface CreateRefereeData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string | null;
}

// Type for updating an existing referee
export interface UpdateRefereeData extends CreateRefereeData {
  id: string;
}

/**
 * Fetch all referees for the current user
 */
export async function fetchReferees(user: AuthUser): Promise<Referee[]> {
  try {
    const response = await authenticatedFetch('/api/referees', {
      method: 'GET',
    }, user);
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch referees: ${response?.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching referees:', error);
    throw error;
  }
}

/**
 * Create a new referee
 */
export async function createReferee(data: CreateRefereeData, user: AuthUser): Promise<Referee> {
  try {
    const response = await authenticatedFetch('/api/referees', {
      method: 'POST',
      body: JSON.stringify(data),
    }, user);
    
    if (!response || !response.ok) {
      throw new Error(`Failed to create referee: ${response?.status}`);
    }
    
    const referee = await response.json();
    return referee;
  } catch (error) {
    console.error('Error creating referee:', error);
    throw error;
  }
}

/**
 * Update an existing referee
 */
export async function updateReferee(data: UpdateRefereeData, user: AuthUser): Promise<Referee> {
  try {
    const response = await authenticatedFetch('/api/referees', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, user);
    
    if (!response || !response.ok) {
      throw new Error(`Failed to update referee: ${response?.status}`);
    }
    
    const referee = await response.json();
    return referee;
  } catch (error) {
    console.error('Error updating referee:', error);
    throw error;
  }
}

/**
 * Delete a referee
 */
export async function deleteReferee(id: string, user: AuthUser): Promise<void> {
  try {
    const response = await authenticatedFetch(`/api/referees?id=${id}`, {
      method: 'DELETE',
    }, user);
    
    if (!response || !response.ok) {
      throw new Error(`Failed to delete referee: ${response?.status}`);
    }
  } catch (error) {
    console.error('Error deleting referee:', error);
    throw error;
  }
} 