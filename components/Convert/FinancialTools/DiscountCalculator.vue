<!-- components/Convert/DiscountCalculator.vue -->
<template>
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto overflow-hidden">
            <div class="justify-center text-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.currencyCircleDollar" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">Discount Calculator</h1>
                <p class="text-base-content/70 mb-8">Calculate the final price after applying a discount</p>
            </div>

            <!-- Calculator Form -->
            <div class="">
                <!-- Original Price Input -->
                <div class="mb-4">
                    <label class="label">
                        <span class="label-text">Original Price</span>
                    </label>
                    <div class="flex">
                        <span class="bg-base-200 px-3 flex items-center rounded-l-md border border-r-0 border-base-300">$</span>
                        <input
                            v-model="originalPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter price"
                            class="input input-bordered w-full rounded-l-none"
                            @input="calculateDiscount"
                        />
                    </div>
                </div>

                <!-- Discount Percentage Input -->
                <div class="form-control mb-6">
                    <label class="label">
                        <span class="label-text">Discount Percentage</span>
                    </label>
                    <div class="flex">
                        <input
                            v-model="discountPercentage"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter percentage"
                            class="input input-bordered w-full rounded-r-none"
                            @input="calculateDiscount"
                        />
                        <span class="bg-base-200 px-3 flex items-center rounded-r-md border border-l-0 border-base-300">%</span>
                    </div>
                </div>

                <!-- Results Section -->
                <div class="bg-base-200 p-4 rounded-lg mb-4">
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Discount Amount -->
                        <div>
                            <p class="text-sm text-base-content/70 mb-1">You Save</p>
                            <p class="text-lg font-semibold">${{ discountAmount.toFixed(2) }}</p>
                        </div>
                        <!-- Final Price -->
                        <div>
                            <p class="text-sm text-base-content/70 mb-1">Final Price</p>
                            <p class="text-lg font-semibold">${{ finalPrice.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Discount Visualization - Simplified for better understanding -->
                <div class="mb-6">
                    <div class="relative h-8 bg-base-200 rounded-md overflow-hidden">
                        <div
                            class="absolute h-full bg-success transition-all duration-300 ease-in-out"
                            :style="{ width: `${discountPercentage > 100 ? 100 : discountPercentage}%` }"
                        ></div>
                        <div class="absolute inset-0 flex items-center justify-center text-sm font-medium">
                            {{ discountPercentage }}% OFF
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                    <button @click="resetForm" class="btn btn-outline flex-1">
                        <Icon :name="uiIcons.refresh" class="w-4 h-4 mr-1" />
                        Reset
                    </button>
                    <button @click="copyResult" class="btn btn-primary flex-1" :class="{ 'opacity-50': !canCopy }">
                        <Icon :name="uiIcons.copy" class="w-4 h-4 mr-1" />
                        Copy Result
                    </button>
                </div>
            </div>
        </div>

        <!-- Additional Information Card - Simplified for elderly users -->
        <div class="max-w-md mx-auto mt-6 bg-base-100 rounded-xl shadow-sm overflow-hidden">
            <div class="p-6">
                <h2 class="text-lg font-semibold mb-2">Quick Tips</h2>
                <ul class="space-y-3 text-base-content/80">
                    <li class="flex items-center">
                        <Icon :name="uiIcons.checkCircle" class="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Enter the original price of the item</span>
                    </li>
                    <li class="flex items-center">
                        <Icon :name="uiIcons.checkCircle" class="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Enter the discount percentage (e.g., 20 for 20% off)</span>
                    </li>
                    <li class="flex items-center">
                        <Icon :name="uiIcons.checkCircle" class="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Results will update automatically</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAppState } from '~/composables/states';
import { uiIcons } from '~/utils/appConstant';

// Reactive state
const originalPrice = ref('');
const discountPercentage = ref('');
const discountAmount = ref(0);
const finalPrice = ref(0);
const appState = useAppState();

// Computed property to check if there are valid results to copy
const canCopy = computed(() => {
    return finalPrice.value > 0 || (originalPrice.value && discountPercentage.value);
});

// Calculate the discount and final price
const calculateDiscount = () => {
    // Parse inputs as numbers
    const price = parseFloat(originalPrice.value) || 0;
    const discount = parseFloat(discountPercentage.value) || 0;

    // Calculate discount amount and final price
    discountAmount.value = (price * discount) / 100;
    finalPrice.value = price - discountAmount.value;

    // Ensure final price doesn't go below zero
    if (finalPrice.value < 0) {
        finalPrice.value = 0;
    }
};

// Watch for changes in inputs and recalculate
watch([originalPrice, discountPercentage], () => {
    calculateDiscount();
});

// Reset form to initial state
const resetForm = () => {
    originalPrice.value = '';
    discountPercentage.value = '';
    discountAmount.value = 0;
    finalPrice.value = 0;
};

// Copy the calculation result to clipboard
const copyResult = async () => {
    // Format with larger font and simple layout for better readability
    const resultText = `Original Price: ${parseFloat(originalPrice.value).toFixed(2)}\nDiscount: ${
        discountPercentage.value
    }% (-${discountAmount.value.toFixed(2)})\nFinal Price: ${finalPrice.value.toFixed(2)}`;

    // Copy to clipboard
    await navigator.clipboard.writeText(resultText);
    appState.value.showToast = true;
    setTimeout(() => (appState.value.showToast = false), 2000); // Hide toast after 2 seconds
};

// SEO metadata
useHead({
    title: 'Discount Calculator - Calculate Sale Prices Easily',
    meta: [
        {
            name: 'description',
            content:
                'Calculate final prices after discounts with our easy-to-use discount calculator. Perfect for shopping and sales.',
        },
    ],
});
</script>
