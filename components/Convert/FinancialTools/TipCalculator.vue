<!-- components/Convert/FinancialTools/TipCalculator.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-md mx-auto">
            <div class="justify-center text-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.currencyCircleDollar" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">Tip Calculator</h1>
                <p class="text-base-content/70 mb-8">Calculate tips and split bills easily</p>
            </div>

            <div>
                <!-- Bill Amount -->
                <div class="mb-6">
                    <label class="block text-base-content/80 mb-2">Bill Amount</label>
                    <div class="flex">
                        <span class="bg-base-200 px-3 flex items-center rounded-l-md border border-r-0 border-base-300">$</span>
                        <input
                            v-model="billAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter bill amount"
                            class="input input-bordered w-full rounded-l-none"
                            @input="calculateTip"
                        />
                    </div>
                </div>

                <!-- Tip Percentage - Simplified -->
                <div class="mb-6">
                    <label class="block text-base-content/80 mb-2">Tip Percentage: {{ tipPercentage }}%</label>

                    <!-- Common Tip Percentages -->
                    <div class="grid grid-cols-4 gap-2 mb-3">
                        <button
                            v-for="percentage in [15, 18, 20, 25]"
                            :key="percentage"
                            @click="setTipPercentage(percentage)"
                            class="btn btn-sm"
                            :class="{ 'btn-primary': tipPercentage === percentage, 'btn-outline': tipPercentage !== percentage }"
                        >
                            {{ percentage }}%
                        </button>
                    </div>

                    <!-- Custom Percentage Input - Simplified -->
                    <div class="flex border border-base-300 rounded-md">
                        <button
                            @click="decrementTip"
                            class="px-4 py-2 border-r border-base-300 text-base cursor-pointer"
                            :disabled="tipPercentage <= 0"
                        >
                            -
                        </button>
                        <input
                            v-model="tipPercentage"
                            type="number"
                            min="0"
                            max="100"
                            class="text-center w-full py-2 border-none focus:outline-none"
                            @input="calculateTip"
                        />
                        <button
                            @click="incrementTip"
                            class="px-4 py-2 border-l border-base-300 text-base cursor-pointer"
                            :disabled="tipPercentage >= 100"
                        >
                            +
                        </button>
                    </div>
                </div>

                <!-- Number of People - Simplified -->
                <div class="mb-6">
                    <label class="block text-base-content/80 mb-2">Split Between</label>
                    <div class="flex border border-base-300 rounded-md">
                        <button
                            @click="decrementPeople"
                            class="px-4 py-2 border-r border-base-300 text-base cursor-pointer"
                            :disabled="numberOfPeople <= 1"
                        >
                            -
                        </button>
                        <div class="flex-1 flex items-center justify-center">
                            <span class="text-lg">{{ numberOfPeople }}</span>
                            <span class="text-sm text-base-content/70 ml-2">{{ numberOfPeople > 1 ? 'people' : 'person' }}</span>
                        </div>
                        <button @click="incrementPeople" class="px-4 py-2 border-l border-base-300 text-base cursor-pointer">
                            +
                        </button>
                    </div>
                </div>

                <div class="divider my-4"></div>

                <!-- Results - Mobile Responsive -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Tip Amount -->
                    <div class="bg-base-200 p-4 rounded-lg">
                        <div class="text-sm mb-1">Tip Amount</div>
                        <div class="text-xl font-bold">${{ tipAmount.toFixed(2) }}</div>
                        <div v-if="numberOfPeople > 1" class="text-xs mt-1">
                            ${{ (tipAmount / numberOfPeople).toFixed(2) }} per person
                        </div>
                    </div>

                    <!-- Total Amount -->
                    <div class="bg-primary/10 p-4 rounded-lg">
                        <div class="text-sm mb-1">Total to Pay</div>
                        <div class="text-xl font-bold">${{ totalAmount.toFixed(2) }}</div>
                        <div v-if="numberOfPeople > 1" class="text-xs mt-1">
                            ${{ (totalAmount / numberOfPeople).toFixed(2) }} per person
                        </div>
                    </div>
                </div>

                <!-- Reset Button -->
                <div class="mt-5 text-center">
                    <button @click="resetCalculator" class="btn btn-outline btn-sm">Reset</button>
                </div>
            </div>

            <!-- Tips Section - Simplified -->
            <div class="mt-4 bg-base-200 p-4 rounded-lg">
                <h3 class="font-medium mb-2">Tipping Guide</h3>
                <ul class="space-y-1 text-sm">
                    <li>• 15-18%: Standard service</li>
                    <li>• 20%: Good service</li>
                    <li>• 25%+: Exceptional service</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useHead } from '#app';

// State
const billAmount = ref('');
const tipPercentage = ref(15);
const numberOfPeople = ref(1);
const tipAmount = ref(0);
const totalAmount = ref(0);

// Methods
const calculateTip = () => {
    // Convert inputs to numbers and handle validation
    const bill = parseFloat(billAmount.value) || 0;
    const tip = parseFloat(tipPercentage.value) || 0;

    // Calculate tip and total
    tipAmount.value = bill * (tip / 100);
    totalAmount.value = bill + tipAmount.value;
};

const setTipPercentage = (percentage) => {
    tipPercentage.value = percentage;
    calculateTip();
};

const incrementTip = () => {
    tipPercentage.value = Math.min(100, parseInt(tipPercentage.value) + 1);
    calculateTip();
};

const decrementTip = () => {
    tipPercentage.value = Math.max(0, parseInt(tipPercentage.value) - 1);
    calculateTip();
};

const incrementPeople = () => {
    numberOfPeople.value++;
    calculateTip();
};

const decrementPeople = () => {
    if (numberOfPeople.value > 1) {
        numberOfPeople.value--;
        calculateTip();
    }
};

const resetCalculator = () => {
    billAmount.value = '';
    tipPercentage.value = 15;
    numberOfPeople.value = 1;
    tipAmount.value = 0;
    totalAmount.value = 0;
};

// Watch for input changes
watch([billAmount, tipPercentage, numberOfPeople], calculateTip);

// Set page metadata
useHead({
    title: 'Tip Calculator - Calculate & Split Restaurant Bills',
    meta: [
        {
            name: 'description',
            content:
                'Calculate restaurant tips easily and split bills among friends with our free online tip calculator. Simple, fast, and accurate.',
        },
    ],
});
</script>
