import { authenticatedFetch } from "../auth-utils";
import { User } from "firebase/auth";

export interface Referee {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches all referees for the authenticated user
 */
export async function fetchReferees(user: User | null): Promise<Referee[]> {
  try {
    const response = await authenticatedFetch('/api/referees', {
      method: 'GET',
    }, user);

    if (!response || !response.ok) {
      throw new Error('Failed to fetch referees');
    }

    const data = await response.json();
    return data as Referee[];
  } catch (error) {
    console.error('Error fetching referees:', error);
    return [];
  }
}

/**
 * Creates a new referee
 */
export async function createReferee(referee: Omit<Referee, 'id' | 'createdAt' | 'updatedAt'>, user: User | null): Promise<Referee | null> {
  try {
    const response = await authenticatedFetch('/api/referees', {
      method: 'POST',
      body: JSON.stringify(referee),
    }, user);

    if (!response || !response.ok) {
      throw new Error('Failed to create referee');
    }

    const data = await response.json();
    return data as Referee;
  } catch (error) {
    console.error('Error creating referee:', error);
    return null;
  }
}

/**
 * Updates an existing referee
 */
export async function updateReferee(referee: Partial<Referee> & { id: string }, user: User | null): Promise<Referee | null> {
  try {
    const response = await authenticatedFetch('/api/referees', {
      method: 'PUT',
      body: JSON.stringify(referee),
    }, user);

    if (!response || !response.ok) {
      throw new Error('Failed to update referee');
    }

    const data = await response.json();
    return data as Referee;
  } catch (error) {
    console.error('Error updating referee:', error);
    return null;
  }
}

/**
 * Deletes a referee
 */
export async function deleteReferee(id: string, user: User | null): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`/api/referees?id=${id}`, {
      method: 'DELETE',
    }, user);

    if (!response || !response.ok) {
      throw new Error('Failed to delete referee');
    }

    return true;
  } catch (error) {
    console.error('Error deleting referee:', error);
    return false;
  }
} 