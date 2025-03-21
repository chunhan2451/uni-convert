<!-- components/Units/DataSpeedConverter.vue -->
<template>
    <div class="converter-container max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Data Transfer & Internet Speed Converter</h1>

        <div class="mb-8">
            <!-- From Section -->
            <div class="mb-4">
                <label class="block text-base-content font-medium mb-2">From</label>
                <div class="join w-full">
                    <input
                        type="number"
                        v-model="inputValue"
                        class="input input-bordered join-item w-3/5"
                        step="0.001"
                        min="0"
                        @input="debounceConvert"
                    />
                    <select v-model="fromUnit" class="select select-bordered join-item w-2/5">
                        <option v-for="unit in speedUnits.filter((item) => item.id != toUnit)" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center my-4">
                <button class="btn btn-circle btn-outline" @click="swapUnits">
                    <Icon name="ph:arrows-vertical-bold" class="h-6 w-6" />
                </button>
            </div>

            <!-- To Section -->
            <div class="mb-4">
                <label class="block text-base-content font-medium mb-2">To</label>
                <div class="join w-full">
                    <input type="text" :value="convertedValue" class="input input-bordered join-item w-3/5" readonly />
                    <select v-model="toUnit" class="select select-bordered join-item w-2/5">
                        <option v-for="unit in speedUnits.filter((item) => item.id != fromUnit)" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Copy Result Button - Only shown when there's a result -->
            <button v-if="convertedValue" class="btn btn-primary w-full mt-4" @click="copyToClipboard(convertedValue)">
                <Icon name="ph:copy-bold" class="h-5 w-5 mr-2" />
                Copy Result
            </button>

            <!-- Conversion Formula -->
            <div class="bg-base-200 p-4 rounded-lg mt-6 text-center">
                <p v-if="convertedValue">
                    {{ inputValue }} {{ getUnitNameById(fromUnit) }} = {{ convertedValue }} {{ getUnitNameById(toUnit) }}
                </p>
                <p v-else>Enter a value to see conversion</p>
            </div>
        </div>

        <!-- Conversion Information -->
        <details class="bg-base-200 rounded-lg p-1" open>
            <summary class="p-3 font-medium cursor-pointer hover:bg-base-300 rounded-lg">Data Speed Conversion Table</summary>
            <div class="p-4 pt-2">
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Multiply By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Megabits per second (Mbps)</td>
                                <td>Megabytes per second (MBps)</td>
                                <td>0.125</td>
                            </tr>
                            <tr>
                                <td>Megabits per second (Mbps)</td>
                                <td>Gigabits per second (Gbps)</td>
                                <td>0.001</td>
                            </tr>
                            <tr>
                                <td>Megabytes per second (MBps)</td>
                                <td>Megabits per second (Mbps)</td>
                                <td>8</td>
                            </tr>
                            <tr>
                                <td>Megabytes per second (MBps)</td>
                                <td>Gigabits per second (Gbps)</td>
                                <td>0.008</td>
                            </tr>
                            <tr>
                                <td>Gigabits per second (Gbps)</td>
                                <td>Megabits per second (Mbps)</td>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <td>Gigabits per second (Gbps)</td>
                                <td>Megabytes per second (MBps)</td>
                                <td>125</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-4 text-sm">
                    <h3 class="font-bold mb-2">Conversion Formulas:</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>1 Byte = 8 bits</li>
                        <li>1 Megabyte (MB) = 8 Megabits (Mb)</li>
                        <li>1 Gigabit (Gb) = 1,000 Megabits (Mb)</li>
                        <li>1 Gigabyte (GB) = 8 Gigabits (Gb) = 8,000 Megabits (Mb)</li>
                    </ul>
                </div>
            </div>
        </details>

        <div class="text-sm mt-6 text-base-content/70">
            <p class="mb-2">Common internet speeds:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Standard home broadband: 30-100 Mbps</li>
                <li>Fiber optic internet: 100-1000 Mbps (1 Gbps)</li>
                <li>5G mobile data: 50-300 Mbps</li>
                <li>4G mobile data: 10-50 Mbps</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

// Get URL update functionality
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();

// Speed units
const speedUnits = [
    { id: 'mbps', name: 'Megabits per second (Mbps)', factor: 1 },
    { id: 'MBps', name: 'Megabytes per second (MBps)', factor: 0.125 },
    { id: 'gbps', name: 'Gigabits per second (Gbps)', factor: 0.001 },
    { id: 'GBps', name: 'Gigabytes per second (GBps)', factor: 0.000125 },
    { id: 'kbps', name: 'Kilobits per second (kbps)', factor: 1000 },
    { id: 'KBps', name: 'Kilobytes per second (KBps)', factor: 125 },
];

// Conversion state
const fromUnit = ref('mbps');
const toUnit = ref('MBps');
const inputValue = ref(100);
const convertedValue = ref('');

// Initialize units when component mounts
const initializeUnits = () => {
    const urlUnits = getUnitsFromUrl();

    if (urlUnits && urlUnits.fromUnit && urlUnits.toUnit) {
        fromUnit.value = urlUnits.fromUnit;
        toUnit.value = urlUnits.toUnit;
    }
};

// Debounce function to prevent too many calculations
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

const debounceConvert = debounce(() => {
    convertSpeed();
}, 300);

// Get unit name by ID
const getUnitNameById = (id) => {
    const unit = speedUnits.find((u) => u.id === id);
    return unit ? unit.name : '';
};

// Swap unit function
const swapUnits = () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    convertSpeed();
    updateUrlPath(fromUnit.value, toUnit.value);
};

// Copy to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        // Could add a toast notification here
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};

// Convert between data transfer speed units
const convertSpeed = () => {
    if (!inputValue.value) {
        convertedValue.value = '';
        return;
    }

    const value = parseFloat(inputValue.value);
    if (isNaN(value)) {
        convertedValue.value = 'Invalid input';
        return;
    }

    let result;

    // Direct conversion formulas for each combination
    if (fromUnit.value === 'mbps' && toUnit.value === 'MBps') {
        result = value * 0.125;
    } else if (fromUnit.value === 'mbps' && toUnit.value === 'gbps') {
        result = value * 0.001;
    } else if (fromUnit.value === 'mbps' && toUnit.value === 'GBps') {
        result = value * 0.000125;
    } else if (fromUnit.value === 'mbps' && toUnit.value === 'kbps') {
        result = value * 1000;
    } else if (fromUnit.value === 'mbps' && toUnit.value === 'KBps') {
        result = value * 125;
    } else if (fromUnit.value === 'MBps' && toUnit.value === 'mbps') {
        result = value * 8;
    } else if (fromUnit.value === 'MBps' && toUnit.value === 'gbps') {
        result = value * 0.008;
    } else if (fromUnit.value === 'MBps' && toUnit.value === 'GBps') {
        result = value * 0.001;
    } else if (fromUnit.value === 'MBps' && toUnit.value === 'kbps') {
        result = value * 8000;
    } else if (fromUnit.value === 'MBps' && toUnit.value === 'KBps') {
        result = value * 1000;
    } else if (fromUnit.value === 'gbps' && toUnit.value === 'mbps') {
        result = value * 1000;
    } else if (fromUnit.value === 'gbps' && toUnit.value === 'MBps') {
        result = value * 125;
    } else if (fromUnit.value === 'gbps' && toUnit.value === 'GBps') {
        result = value * 0.125;
    } else if (fromUnit.value === 'gbps' && toUnit.value === 'kbps') {
        result = value * 1000000;
    } else if (fromUnit.value === 'gbps' && toUnit.value === 'KBps') {
        result = value * 125000;
    } else if (fromUnit.value === 'GBps' && toUnit.value === 'mbps') {
        result = value * 8000;
    } else if (fromUnit.value === 'GBps' && toUnit.value === 'MBps') {
        result = value * 1000;
    } else if (fromUnit.value === 'GBps' && toUnit.value === 'gbps') {
        result = value * 8;
    } else if (fromUnit.value === 'GBps' && toUnit.value === 'kbps') {
        result = value * 8000000;
    } else if (fromUnit.value === 'GBps' && toUnit.value === 'KBps') {
        result = value * 1000000;
    } else if (fromUnit.value === 'kbps' && toUnit.value === 'mbps') {
        result = value * 0.001;
    } else if (fromUnit.value === 'kbps' && toUnit.value === 'MBps') {
        result = value * 0.000125;
    } else if (fromUnit.value === 'kbps' && toUnit.value === 'gbps') {
        result = value * 0.000001;
    } else if (fromUnit.value === 'kbps' && toUnit.value === 'GBps') {
        result = value * 0.000000125;
    } else if (fromUnit.value === 'kbps' && toUnit.value === 'KBps') {
        result = value * 0.125;
    } else if (fromUnit.value === 'KBps' && toUnit.value === 'mbps') {
        result = value * 0.008;
    } else if (fromUnit.value === 'KBps' && toUnit.value === 'MBps') {
        result = value * 0.001;
    } else if (fromUnit.value === 'KBps' && toUnit.value === 'gbps') {
        result = value * 0.000008;
    } else if (fromUnit.value === 'KBps' && toUnit.value === 'GBps') {
        result = value * 0.000001;
    } else if (fromUnit.value === 'KBps' && toUnit.value === 'kbps') {
        result = value * 8;
    } else {
        // Same unit, no conversion needed
        result = value;
    }

    // Format the result based on the size
    if (result < 0.01) {
        convertedValue.value = result.toFixed(6);
    } else if (result < 0.1) {
        convertedValue.value = result.toFixed(4);
    } else if (result < 1) {
        convertedValue.value = result.toFixed(3);
    } else if (result < 10) {
        convertedValue.value = result.toFixed(2);
    } else if (result < 100) {
        convertedValue.value = result.toFixed(1);
    } else {
        convertedValue.value = result.toFixed(0);
    }
};

// Watch for changes and update conversion
watch([fromUnit, toUnit, inputValue], () => {
    convertSpeed();
});

// When units change, update both the conversion and the URL
watch(fromUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateUrlPath(newVal, toUnit.value);
    }
});

watch(toUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateUrlPath(fromUnit.value, newVal);
    }
});

// Initialize conversion
convertSpeed();
</script>
