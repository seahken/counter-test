<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">
              Next to Go Races
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="refreshRaces" :disabled="racesStore.loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="racesStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ racesStore.loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Category Filter Sidebar -->
        <div class="lg:col-span-1">
          <CategoryFilter />
        </div>

        <!-- Races List -->
        <div class="lg:col-span-3">
          <!-- Error State -->
          <div v-if="racesStore.error" class="mb-6">
            <div class="bg-danger-50 border border-danger-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-danger-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-danger-800">
                    Error loading races
                  </h3>
                  <div class="mt-2 text-sm text-danger-700">
                    <p>{{ racesStore.error }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="racesStore.loading && racesStore.races.length === 0" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-4 text-gray-600">Loading races...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="racesStore.filteredRaces.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No races found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ racesStore.selectedCategories.length > 0
                ? 'No races match your selected categories.'
                : 'No upcoming races available at the moment.'
              }}
            </p>
          </div>

          <!-- Races Grid -->
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">
                Upcoming Races ({{ racesStore.filteredRaces.length }})
              </h2>
              <p class="text-sm text-gray-500">
                Last updated: {{ new Date(racesStore.lastFetchTime).toLocaleTimeString() }}
              </p>
            </div>

            <div class="grid gap-4">
              <RaceCard v-for="race in racesStore.filteredRaces" :key="race.race_id" :race="race" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRacesStore } from '@/stores/races';
import RaceCard from '@/components/RaceCard.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';

const racesStore = useRacesStore();

onMounted(async () => {
  // Initial fetch
  await racesStore.fetchRaces();

  // Start auto-refresh every 30 seconds
  racesStore.startAutoRefresh(30000);
});

onUnmounted(() => {
  // Clean up auto-refresh
  racesStore.stopAutoRefresh();
});

const refreshRaces = async () => {
  await racesStore.fetchRaces();
};
</script>
