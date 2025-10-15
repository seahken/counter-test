import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Race } from '@/types/race';
import { RACE_CATEGORIES } from '@/types/race';
import { RaceApiService } from '@/services/raceApi';

export const useRacesStore = defineStore('races', () => {
  // State
  const races = ref<Race[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedCategories = ref<string[]>([]);
  const lastFetchTime = ref<number>(0);

  // Services
  const raceApi = RaceApiService.getInstance();

  // Computed
  const filteredRaces = computed(() => {
    return raceApi.filterAndSortRaces(races.value, selectedCategories.value);
  });

  const availableCategories = computed(() => {
    return RACE_CATEGORIES;
  });

  const selectedCategoryNames = computed(() => {
    return RACE_CATEGORIES
      .filter(category => selectedCategories.value.includes(category.id))
      .map(category => category.name);
  });

  // Actions
  async function fetchRaces() {
    loading.value = true;
    error.value = null;
    
    try {
      const fetchedRaces = await raceApi.fetchRaces();
      races.value = fetchedRaces;
      lastFetchTime.value = Date.now();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch races';
      console.error('Error fetching races:', err);
    } finally {
      loading.value = false;
    }
  }

  function toggleCategory(categoryId: string) {
    const index = selectedCategories.value.indexOf(categoryId);
    if (index > -1) {
      selectedCategories.value.splice(index, 1);
    } else {
      selectedCategories.value.push(categoryId);
    }
  }

  function selectAllCategories() {
    selectedCategories.value = RACE_CATEGORIES.map(category => category.id);
  }

  function clearAllCategories() {
    selectedCategories.value = [];
  }

  function getCountdownSeconds(race: Race): number {
    return raceApi.getCountdownSeconds(race);
  }

  function formatCountdown(seconds: number): string {
    return raceApi.formatCountdown(seconds);
  }

  function getCategoryColor(categoryId: string): string {
    const category = RACE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.color || 'gray';
  }

  function getCategoryName(categoryId: string): string {
    const category = RACE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  }

  // Auto-refresh logic
  let refreshInterval: number | null = null;

  function startAutoRefresh(intervalMs: number = 30000) {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
      fetchRaces();
    }, intervalMs);
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  return {
    // State
    races,
    loading,
    error,
    selectedCategories,
    lastFetchTime,
    
    // Computed
    filteredRaces,
    availableCategories,
    selectedCategoryNames,
    
    // Actions
    fetchRaces,
    toggleCategory,
    selectAllCategories,
    clearAllCategories,
    getCountdownSeconds,
    formatCountdown,
    getCategoryColor,
    getCategoryName,
    startAutoRefresh,
    stopAutoRefresh,
  };
});
