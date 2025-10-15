import type { Race, RaceResponse } from '@/types/race';
import { NEDS_API_URL } from '@/types/race';

export class RaceApiService {
  private static instance: RaceApiService;

  private constructor() {}

  public static getInstance(): RaceApiService {
    if (!RaceApiService.instance) {
      RaceApiService.instance = new RaceApiService();
    }
    return RaceApiService.instance;
  }

  async fetchRaces(): Promise<Race[]> {
    try {
      const response = await fetch(NEDS_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RaceResponse = await response.json();
      
      if (data.status !== 200) {
        throw new Error(`API error! status: ${data.status}`);
      }

      // Convert the race summaries object to an array and sort by advertised_start
      const races = Object.values(data.data.race_summaries)
        .filter(race => data.data.next_to_go_ids.includes(race.race_id))
        .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds);

      return races;
    } catch (error) {
      console.error('Error fetching races:', error);
      throw error;
    }
  }

  /**
   * Filters races by category and removes races that have started more than 1 minute ago
   */
  filterAndSortRaces(races: Race[], selectedCategories: string[]): Race[] {
    const now = Math.floor(Date.now() / 1000);
    const oneMinuteAgo = now - 60;

    return races
      .filter(race => {
        // Filter by selected categories
        if (selectedCategories.length > 0 && !selectedCategories.includes(race.category_id)) {
          return false;
        }
        
        // Remove races that started more than 1 minute ago
        return race.advertised_start.seconds > oneMinuteAgo;
      })
      .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
      .slice(0, 5); // Always show maximum 5 races
  }

  /**
   * Calculates the countdown time in seconds until race start
   */
  getCountdownSeconds(race: Race): number {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, race.advertised_start.seconds - now);
  }

  /**
   * Formats countdown seconds into MM:SS format
   */
  formatCountdown(seconds: number): string {
    if (seconds <= 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
