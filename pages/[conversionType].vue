<template>

  <!-- To handle path and set specific component -->

  <div class="max-w-md mx-auto bg-surface rounded-lg shadow-lg p-6">
    <!-- Title -->
    <h1 class="text-2xl font-bold text-headline mb-6">{{ converter.name }}</h1>

    <!-- Config Inputs -->
    <div v-if="converter.category === 'unit'" class="mb-6">
      <label class="block text-body font-medium mb-2">Root Font Size (px)</label>
      <input
        v-model="rootFontSize"
        type="number"
        class="w-full p-2 border rounded-lg"
        placeholder="16"
      />
    </div>

    <!-- Input Field -->
    <div class="mb-6">
      <label class="block text-body font-medium mb-2">{{ converter.inputLabel }}</label>
      <input
        v-model="inputValue"
        :type="converter.inputType"
        class="w-full p-2 border rounded-lg"
        :placeholder="`Enter ${converter.inputLabel}`"
      />
    </div>

    <!-- Convert Button -->
    <button
      @click="convertValue"
      class="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-colors mb-6"
    >
      Convert
    </button>

    <!-- Output Field -->
    <div v-if="result !== null" class="mb-6">
      <label class="block text-body font-medium mb-2">{{ converter.outputLabel }}</label>
      <div class="flex items-center gap-2">
        <pre class="flex-1 p-2 border rounded-lg bg-background">{{ result }}</pre>
        <button
          @click="copyToClipboard"
          class="p-2 hover:text-primary transition-colors"
          :class="{ 'text-green-500': copied }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Vice Versa Button -->
    <div v-if="viceVersaConverter" class="flex justify-center mb-6">
      <button
        @click="switchConverter"
        class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
      >
        <span>Switch to {{ viceVersaConverter.name }}</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
      </button>
    </div>

    <!-- Formula Display -->
    <div class="text-caption text-sm">
      <p class="font-mono bg-gray-100 p-2 rounded">{{ converter.formula }}</p>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg"
    >
      Copied to clipboard!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { converters } from '~/utils/converters';

const route = useRoute();
const converter = converters[route.params.conversionType];

const rootFontSize = ref(16);
const inputValue = ref('');
const result = ref(null);
const copied = ref(false);
const showToast = ref(false);

// Find the vice versa converter (e.g., PX ↔ REM)
const viceVersaConverter = computed(() => {
  if (converter.id.includes('to')) {
    const parts = converter.id.split('-to-');
    const reverseId = `${parts[1]}-to-${parts[0]}`;
    return converters[reverseId];
  }
  return null;
});

// Convert the input value
const convertValue = () => {
  if (!inputValue.value) return;

  try {
    result.value = converter.convert(inputValue.value, {
      rootFontSize: rootFontSize.value,
    });
    copied.value = false;
  } catch (error) {
    result.value = 'Invalid input format';
  }
};

// Copy the result to clipboard
const copyToClipboard = async () => {
  if (!result.value) return;

  try {
    await navigator.clipboard.writeText(result.value);
    copied.value = true;
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 2000); // Hide toast after 2 seconds
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Switch to the vice versa converter
const switchConverter = () => {
  if (viceVersaConverter.value) {
    navigateTo(`/converters/${viceVersaConverter.value.id}`);
  }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>