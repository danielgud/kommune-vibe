import { Result } from "../components/TopList";

const API_BASE = '/api';

export const readTop10 = async (cardCount: number): Promise<Result[]> => {
  try {
    const response = await fetch(`${API_BASE}/leaderboard?cardCount=${cardCount}`);
    if (!response.ok) {
      console.error('Failed to fetch leaderboard:', response.statusText);
      return [];
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const writeTop10 = async (cardCount: number, data: Result[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardCount, leaderboard: data }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return false;
  }
};

// Fallback to localStorage for immediate updates (will be synced later)
export const readTop10Local = (cardCount: number): Result[] => {
  const raw = localStorage.getItem(`top10_${cardCount}`);
  return raw ? JSON.parse(raw) : [];
};

export const writeTop10Local = (cardCount: number, data: Result[]): void => {
  localStorage.setItem(`top10_${cardCount}`, JSON.stringify(data));
};