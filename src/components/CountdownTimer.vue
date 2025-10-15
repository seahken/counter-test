<template>
    <div v-if="isStarted">
        <span :class="timerClass">Started</span>
    </div>
    <div v-else>
        Starting in: <span class="countdown-timer" :class="timerClass">{{ formattedTime }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface Props {
    targetTime: number; // Unix timestamp in seconds
}

const props = defineProps<Props>();

const currentTime = ref(Math.floor(Date.now() / 1000));
let intervalId: number | null = null;

const countdownSeconds = computed(() => {
    return Math.max(0, props.targetTime - currentTime.value);
});

const isStarted = computed(() => {
    return countdownSeconds.value <= 0;
});

const formattedTime = computed(() => {
    if (countdownSeconds.value <= 0) return '00:00';

    const minutes = Math.floor(countdownSeconds.value / 60);
    const seconds = countdownSeconds.value % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const timerClass = computed(() => {
    const seconds = countdownSeconds.value;

    if (seconds <= 0) {
        return 'text-green-500';
    } else if (seconds <= 30) {
        return 'countdown-critical text-danger-700';
    } else if (seconds <= 60) {
        return 'countdown-warning text-danger-600';
    } else {
        return 'text-primary-600';
    }
});

const updateTime = () => {
    currentTime.value = Math.floor(Date.now() / 1000);
};

onMounted(() => {
    updateTime();
    intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<style scoped>
.countdown-timer {
    font-variant-numeric: tabular-nums;
}
</style>
