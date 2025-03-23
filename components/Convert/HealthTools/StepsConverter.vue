<!-- components/Convert/HealthTools/StepsConverter.vue -->
<template>
    <div class="max-w-xl mx-auto">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.heartPulse" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-6 text-center">Steps Converter</h1>
        </div>

        <!-- From Section -->
        <div class="mb-4">
            <label class="block text-base-content text-sm font-medium mb-2">From</label>
            <div class="join w-full">
                <input
                    v-model="fromValue"
                    type="number"
                    class="input input-bordered join-item flex-1"
                    placeholder="Value"
                    min="0"
                    step="any"
                    @input="convert"
                />
                <select v-model="fromUnit" class="select select-bordered join-item w-2/5" @change="convert">
                    <option v-for="unit in units.filter(item => item.id != toUnit)" :key="unit.id" :value="unit.id">
                        {{ unit.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Swap Button -->
        <div class="flex justify-center my-2">
            <button @click="swapUnits" class="btn btn-circle btn-sm btn-outline">
                <Icon :name="uiIcons.transfer" class="h-5 w-5" />
            </button>
        </div>

        <!-- To Section -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">To</label>
            <div class="join w-full">
                <input
                    v-model="toValue"
                    type="text"
                    class="input input-bordered join-item flex-1"
                    placeholder="Result"
                    readonly
                />
                <select v-model="toUnit" class="select select-bordered join-item w-2/5" @change="convert">
                    <option v-for="unit in units.filter(item => item.id != fromUnit)" :key="unit.id" :value="unit.id">
                        {{ unit.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Stride Length Section -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">Stride Length</label>
            <div class="flex gap-2">
                <div class="w-2/3">
                    <input
                        v-model="strideLength"
                        type="number"
                        class="input input-bordered w-full"
                        placeholder="Stride length"
                        min="0.1"
                        step="0.1"
                        @input="convert"
                    />
                </div>
                <div class="w-1/3">
                    <select v-model="strideLengthUnit" class="select select-bordered w-full" @change="convert">
                        <option value="m">Meters</option>
                        <option value="ft">Feet</option>
                        <option value="in">Inches</option>
                    </select>
                </div>
            </div>
            <div class="text-xs text-base-content/70 mt-1">Average stride: Men ~0.76m, Women ~0.67m</div>
        </div>

        <!-- Copy Result Button -->
        <button v-if="toValue" @click="copyToClipboard(toValue)" class="btn btn-primary w-full mb-6">
            <Icon :name="uiIcons.copy" class="mr-2" />Copy Result
        </button>

        <!-- Formula Display -->
        <div v-if="fromValue && toValue" class="mt-2 text-base-content p-4 bg-base-200 rounded-xl">
            <p class="font-semibold">{{ fromValue }} {{ getUnitName(fromUnit) }} = {{ toValue }} {{ getUnitName(toUnit) }}</p>
            <p class="text-sm mt-1 text-base-content/70">Based on stride length of {{ strideLength }} {{ strideLengthUnit }}</p>
        </div>

        <!-- Common Steps References -->
        <details class="collapse collapse-arrow bg-base-200 mt-6 mb-8" open>
            <summary class="collapse-title font-medium">Step Count Reference</summary>
            <div class="collapse-content">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Activity Level</th>
                            <th>Steps/Day</th>
                            <th>~Miles</th>
                            <th>~Kilometers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sedentary</td>
                            <td>&lt; 5,000</td>
                            <td>&lt; 2.5</td>
                            <td>&lt; 4.0</td>
                        </tr>
                        <tr>
                            <td>Low Active</td>
                            <td>5,000 - 7,499</td>
                            <td>2.5 - 3.7</td>
                            <td>4.0 - 6.0</td>
                        </tr>
                        <tr>
                            <td>Somewhat Active</td>
                            <td>7,500 - 9,999</td>
                            <td>3.7 - 5.0</td>
                            <td>6.0 - 8.0</td>
                        </tr>
                        <tr>
                            <td>Active</td>
                            <td>10,000 - 12,499</td>
                            <td>5.0 - 6.2</td>
                            <td>8.0 - 10.0</td>
                        </tr>
                        <tr>
                            <td>Highly Active</td>
                            <td>&gt; 12,500</td>
                            <td>&gt; 6.2</td>
                            <td>&gt; 10.0</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-sm mt-3">Common fitness goals by steps:</p>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                    <li>10,000 steps: Common daily goal</li>
                    <li>3,000-4,000 steps: ~30 minutes of walking</li>
                    <li>1 mile ≈ 2,000 steps (average)</li>
                    <li>1 kilometer ≈ 1,250 steps (average)</li>
                </ul>
            </div>
        </details>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';

const appState = useAppState();

// Unit definitions
const units = [
    { id: 'steps', name: 'Steps' },
    { id: 'miles', name: 'Miles' },
    { id: 'km', name: 'Kilometers' },
    { id: 'meters', name: 'Meters' },
];

// State variables
const fromUnit = ref('steps');
const toUnit = ref('km');
const fromValue = ref('');
const toValue = ref('');
const strideLength = ref(0.7);
const strideLengthUnit = ref('m');

// Get unit name for display
const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : unitId;
};

// Conversion function
const convert = () => {
    if (
        !fromValue.value ||
        isNaN(fromValue.value) ||
        parseFloat(fromValue.value) < 0 ||
        !strideLength.value ||
        isNaN(strideLength.value) ||
        parseFloat(strideLength.value) <= 0
    ) {
        toValue.value = '';
        return;
    }

    const value = parseFloat(fromValue.value);

    // Convert stride length to meters
    let strideLengthInMeters = parseFloat(strideLength.value);
    if (strideLengthUnit.value === 'ft') {
        strideLengthInMeters = strideLengthInMeters * 0.3048;
    } else if (strideLengthUnit.value === 'in') {
        strideLengthInMeters = strideLengthInMeters * 0.0254;
    }

    // Convert to meters as intermediate step
    let valueInMeters;

    if (fromUnit.value === 'steps') {
        valueInMeters = value * strideLengthInMeters;
    } else if (fromUnit.value === 'miles') {
        valueInMeters = value * 1609.34;
    } else if (fromUnit.value === 'km') {
        valueInMeters = value * 1000;
    } else if (fromUnit.value === 'meters') {
        valueInMeters = value;
    }

    // Convert meters to target unit
    let result;
    if (toUnit.value === 'steps') {
        result = valueInMeters / strideLengthInMeters;
    } else if (toUnit.value === 'miles') {
        result = valueInMeters / 1609.34;
    } else if (toUnit.value === 'km') {
        result = valueInMeters / 1000;
    } else if (toUnit.value === 'meters') {
        result = valueInMeters;
    }

    // Format the result based on the unit
    if (toUnit.value === 'steps') {
        toValue.value = Math.round(result).toLocaleString();
    } else if (toUnit.value === 'meters') {
        toValue.value = result.toFixed(1);
    } else {
        toValue.value = result.toFixed(2);
    }
};

// Swap units function
const swapUnits = () => {
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    convert();
};

// Copy to clipboard function
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        appState.value.showToast = true;
        setTimeout(() => (appState.value.showToast = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Watch for changes to perform conversion
watch([fromUnit, toUnit, strideLengthUnit], () => {
    convert();
});
</script>
