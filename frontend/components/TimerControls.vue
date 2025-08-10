<template>
  <div class="flex flex-wrap justify-center gap-3 mt-6">
    <UiButton
      variant="success"
      size="md"
      :disabled="isRunning || timeLeft === 0"
      @click="$emit('start')"
      class="min-w-20"
    >
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 5v10l8-5-8-5z"/>
      </svg>
      Start
    </UiButton>
    
    <UiButton
      variant="danger"
      size="md"
      :disabled="!isRunning"
      @click="$emit('stop')"
      class="min-w-20"
    >
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6 4h8v12H6z"/>
      </svg>
      Stop
    </UiButton>
    
    <UiButton
      variant="secondary"
      size="md"
      @click="$emit('restart')"
      class="min-w-20"
    >
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
      </svg>
      Restart
    </UiButton>
  </div>
</template>

<script setup>
const props = defineProps({
  isRunning: {
    type: Boolean,
    required: true
  },
  timeLeft: {
    type: Number,
    required: true
  }
})

defineEmits(['start', 'stop', 'restart'])
</script>
