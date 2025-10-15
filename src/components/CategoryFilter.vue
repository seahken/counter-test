<template>
    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">
                Filter by Category
            </h2>
            <div class="flex space-x-2">
                <button @click="selectAll" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Select All
                </button>
                <span class="text-gray-300">|</span>
                <button @click="clearAll" class="text-sm text-gray-600 hover:text-gray-700 font-medium">
                    Clear All
                </button>
            </div>
        </div>

        <div class="space-y-3">
            <label v-for="category in availableCategories" :key="category.id"
                class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                <input type="checkbox" :checked="isSelected(category.id)" @change="toggleCategory(category.id)"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full" :class="`bg-${category.color}-500`"></div>
                    <span class="text-sm font-medium text-gray-700">
                        {{ category.name }}
                    </span>
                </div>
            </label>
        </div>

        <div v-if="selectedCategories.length > 0" class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-2">
                Showing races for:
            </p>
            <div class="flex flex-wrap gap-2">
                <button v-for="category in selectedCategories" :key="category" @click="toggleCategory(category)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    X {{ getCategoryName(category) }}
                </button>
            </div>
        </div>

        <div v-else class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-500">
                No categories selected. All races will be shown.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRacesStore } from '@/stores/races';

const racesStore = useRacesStore();

const availableCategories = computed(() => racesStore.availableCategories);
const selectedCategories = computed(() => racesStore.selectedCategories);

const isSelected = (categoryId: string) => {
    return racesStore.selectedCategories.includes(categoryId);
};

const toggleCategory = (categoryId: string) => {
    racesStore.toggleCategory(categoryId);
};

const selectAll = () => {
    racesStore.selectAllCategories();
};

const clearAll = () => {
    racesStore.clearAllCategories();
};

const getCategoryName = (categoryId: string) => {
    return racesStore.getCategoryName(categoryId);
};
</script>
