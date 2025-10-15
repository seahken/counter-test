<template>
    <div class="race-card">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
                <span class="category-badge" :class="`bg-${categoryColor}-100 text-${categoryColor}-800 pl-0`">
                    {{ categoryName }}
                </span>
                <span class="text-sm text-gray-500">
                    Race {{ race.race_number }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ race.race_name }}
            </h3>
            <p class="text-sm text-gray-600">
                {{ race.meeting_name }}
            </p>
        </div>

        <div class="flex items-center justify-end">
            <CountdownTimer :target-time="race.advertised_start.seconds" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Race } from '@/types/race';
import CountdownTimer from './CountdownTimer.vue';
import { useRacesStore } from '@/stores/races';

interface Props {
    race: Race;
}

const props = defineProps<Props>();
const racesStore = useRacesStore();

const categoryColor = computed(() => racesStore.getCategoryColor(props.race.category_id));
const categoryName = computed(() => racesStore.getCategoryName(props.race.category_id));
</script>

<style scoped>
.race-card {
    transition: all 0.2s ease-in-out;
}

.race-card:hover {
    transform: translateY(-2px);
}
</style>
