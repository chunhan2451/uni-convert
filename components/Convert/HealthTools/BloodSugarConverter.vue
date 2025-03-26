<!-- components/Convert/HealthTools/BloodSugarConverter.vue -->
<template>
    <div class="max-w-xl mx-auto">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.heartPulse" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-6 text-center">Blood Sugar Converter</h1>
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

        <!-- Copy Result Button -->
        <button v-if="toValue" @click="copyToClipboard(toValue)" class="btn btn-primary w-full mb-6">
            <Icon :name="uiIcons.copy" class="mr-2" />Copy Result
        </button>

        <!-- Result Status -->
        <div v-if="fromValue && toValue" class="bg-base-200 p-4 rounded-lg mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-lg font-bold">
                        {{ fromValue }} {{ getUnitName(fromUnit) }} = {{ toValue }} {{ getUnitName(toUnit) }}
                    </p>
                    <p class="text-base-content/70 mt-1">{{ getBloodSugarCategory(toValue, toUnit) }}</p>
                </div>
            </div>
        </div>

        <!-- Formula Display -->
        <!-- <div class="mt-2 text-base-content p-4 bg-base-200 rounded-xl">
            <h3 class="font-semibold mb-2">Conversion Formula:</h3>
            <ul class="text-sm space-y-1">
                <li>mg/dL to mmol/L: <span>divide by 18</span></li>
                <li>mmol/L to mg/dL: <span>multiply by 18</span></li>
            </ul>
        </div> -->

        <!-- Reference Ranges -->
        <details class="collapse collapse-arrow bg-base-200 mt-6" open>
            <summary class="collapse-title font-medium">Blood Sugar Reference Range</summary>
            <div class="collapse-content">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>mg/dL</th>
                            <th>mmol/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Low (Hypoglycemia)</td>
                            <td>&lt; 70</td>
                            <td>&lt; 3.9</td>
                        </tr>
                        <tr>
                            <td>Normal (Fasting)</td>
                            <td>70 - 99</td>
                            <td>3.9 - 5.5</td>
                        </tr>
                        <tr>
                            <td>Prediabetes (Fasting)</td>
                            <td>100 - 125</td>
                            <td>5.6 - 6.9</td>
                        </tr>
                        <tr>
                            <td>Diabetes (Fasting)</td>
                            <td>&gt; 126</td>
                            <td>&gt; 7.0</td>
                        </tr>
                        <tr>
                            <td>Normal (2h after meal)</td>
                            <td>&lt; 140</td>
                            <td>&lt; 7.8</td>
                        </tr>
                        <tr>
                            <td>Prediabetes (2h after meal)</td>
                            <td>140 - 199</td>
                            <td>7.8 - 11.0</td>
                        </tr>
                        <tr>
                            <td>Diabetes (2h after meal)</td>
                            <td>&gt; 200</td>
                            <td>&gt; 11.1</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-xs mt-2 text-base-content/70">
                    * These are general guidelines. Always consult with a healthcare professional for personal medical advice.
                </p>
            </div>
        </details>

        <!-- Notes Section -->
        <div class="bg-base-200 p-4 rounded-lg mt-6 text-sm mb-8">
            <h3 class="font-semibold mb-2">About Blood Sugar Measurements:</h3>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>mg/dL (milligrams per deciliter)</strong>: Standard unit in the United States</li>
                <li><strong>mmol/L (millimoles per liter)</strong>: Standard unit in most other countries</li>
                <li>A1C tests measure average blood sugar over 2-3 months (reported as percentage)</li>
                <li>Fasting blood sugar is measured after not eating for at least 8 hours</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';

const appState = useAppState();

// Unit definitions
const units = [
    { id: 'mgdl', name: 'mg/dL' },
    { id: 'mmoll', name: 'mmol/L' },
];

// State variables
const fromUnit = ref('mgdl');
const toUnit = ref('mmoll');
const fromValue = ref('');
const toValue = ref('');

// Get unit name for display
const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : unitId;
};

// Get blood sugar category based on value and unit
const getBloodSugarCategory = (value, unit) => {
    if (!value) return '';

    const numValue = parseFloat(value);

    if (unit === 'mgdl') {
        if (numValue < 70) return 'Low (Hypoglycemia)';
        if (numValue <= 99) return 'Normal (Fasting)';
        if (numValue <= 125) return 'Prediabetes (Fasting)';
        if (numValue >= 126) return 'Diabetes (Fasting)';
    } else if (unit === 'mmoll') {
        if (numValue < 3.9) return 'Low (Hypoglycemia)';
        if (numValue <= 5.5) return 'Normal (Fasting)';
        if (numValue <= 6.9) return 'Prediabetes (Fasting)';
        if (numValue >= 7.0) return 'Diabetes (Fasting)';
    }

    return '';
};

// Conversion function
const convert = () => {
    if (!fromValue.value || isNaN(fromValue.value) || parseFloat(fromValue.value) < 0) {
        toValue.value = '';
        return;
    }

    const value = parseFloat(fromValue.value);
    let result;

    if (fromUnit.value === 'mgdl' && toUnit.value === 'mmoll') {
        // mg/dL to mmol/L: divide by 18
        result = value / 18;
        toValue.value = result.toFixed(1);
    } else if (fromUnit.value === 'mmoll' && toUnit.value === 'mgdl') {
        // mmol/L to mg/dL: multiply by 18
        result = value * 18;
        toValue.value = Math.round(result).toString();
    } else {
        // Same unit, no conversion needed
        toValue.value = value.toString();
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
watch([fromUnit, toUnit], () => {
    convert();
});
</script>
