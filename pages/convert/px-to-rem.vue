<template>
    <div class="max-w-md mx-auto bg-surface rounded-lg shadow-lg p-6">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-headline mb-6">PX to REM Converter</h1>
  
      <!-- Root Font-Size Input -->
      <div class="mb-6">
        <label class="block text-body font-medium mb-2">Root Font-Size (px)</label>
        <input
          v-model="rootFontSize"
          type="number"
          class="w-full p-2 border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="Enter root font-size"
        />
      </div>
  
      <!-- Pixels Input -->
      <div class="mb-6">
        <label class="block text-body font-medium mb-2">Pixels (px)</label>
        <input
          v-model="pixels"
          type="number"
          class="w-full p-2 border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="Enter pixels"
        />
      </div>
  
      <!-- REM Output -->
      <div class="mb-6">
        <label class="block text-body font-medium mb-2">REM</label>
        <div class="w-full p-2 border rounded-lg bg-background">
          {{ rem }}
        </div>
      </div>
  
      <!-- Calculation Explanation -->
      <div class="text-caption text-sm">
        <p>Calculation based on a root font-size of <strong>{{ rootFontSize }}px</strong>.</p>
        <p>Formula: <code>REM = Pixels / Root Font-Size</code></p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // State
  const rootFontSize = ref(16); // Default root font-size
  const pixels = ref(10); // Default pixel value
  
  // Computed REM value
  const rem = computed(() => {
    return (pixels.value / rootFontSize.value).toFixed(4);
  });
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>