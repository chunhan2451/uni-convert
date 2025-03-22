<!-- components/Units/ElectricalConverter.vue -->
<template>
    <div class="converter-container max-w-3xl mx-auto">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.categoryIcons.electrical" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-8 text-center">Electrical Converter</h1>
        </div>

        <!-- From Section -->
        <div class="mb-4">
            <label class="block text-base-content font-medium mb-2">From</label>
            <div class="join w-full">
                <input
                    type="number"
                    v-model="inputValue"
                    class="input input-bordered join-item w-3/5"
                    step="any"
                    min="0"
                    @input="convertOhmsLaw"
                />
                <select v-model="fromUnit" class="select select-bordered join-item w-2/5" @change="convertOhmsLaw">
                    <option v-for="unit in ohmsUnits.filter(item => item.id != toUnit)" :key="unit.id" :value="unit.id">
                        {{ unit.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Swap Button -->
        <div class="flex justify-center my-4">
            <button class="btn btn-circle btn-outline" @click="swapUnits">
                <Icon :name="uiIcons.transfer" class="h-6 w-6" />
            </button>
        </div>

        <!-- To Section -->
        <div class="mb-4">
            <label class="block text-base-content font-medium mb-2">To</label>
            <div class="join w-full">
                <input type="text" :value="result" class="input input-bordered join-item w-3/5" readonly />
                <select v-model="toUnit" class="select select-bordered join-item w-2/5" @change="convertOhmsLaw">
                    <option v-for="unit in ohmsUnits.filter(item => item.id != fromUnit)" :key="unit.id" :value="unit.id">
                        {{ unit.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Copy Result Button -->
        <button v-if="result" class="btn btn-primary w-full mt-4" @click="copyToClipboard(result)">
            <Icon :name="uiIcons.copy" class="h-5 w-5 mr-2" />
            Copy Result
        </button>

        <!-- Reference Information -->
        <details class="bg-base-200 rounded-lg p-1 mt-6">
            <summary class="p-3 font-medium cursor-pointer hover:bg-base-300 rounded-lg">Ohm's Law Reference</summary>
            <div class="p-4 pt-2">
                <h3 class="font-bold mb-3">Ohm's Law Formulas:</h3>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Find</th>
                                <th>Formula</th>
                                <th>Given</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Voltage (V)</td>
                                <td>V = I × R</td>
                                <td>Current and Resistance</td>
                            </tr>
                            <tr>
                                <td>Current (I)</td>
                                <td>I = V ÷ R</td>
                                <td>Voltage and Resistance</td>
                            </tr>
                            <tr>
                                <td>Resistance (R)</td>
                                <td>R = V ÷ I</td>
                                <td>Voltage and Current</td>
                            </tr>
                            <tr>
                                <td>Power (P)</td>
                                <td>P = V × I</td>
                                <td>Voltage and Current</td>
                            </tr>
                            <tr>
                                <td>Power (P)</td>
                                <td>P = I² × R</td>
                                <td>Current and Resistance</td>
                            </tr>
                            <tr>
                                <td>Power (P)</td>
                                <td>P = V² ÷ R</td>
                                <td>Voltage and Resistance</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="font-bold mt-4 mb-3">Notes:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Voltage (V) is measured in volts</li>
                    <li>Current (I) is measured in amperes or amps</li>
                    <li>Resistance (R) is measured in ohms</li>
                    <li>Power (P) is measured in watts</li>
                </ul>

                <div class="mt-4 text-sm text-base-content/70">
                    <p>
                        This calculator provides approximate conversions using common values. For precise calculations with
                        multiple variables, a more advanced circuit calculator is recommended.
                    </p>
                </div>
            </div>
        </details>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

// Get URL update functionality
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();
const appState = useAppState();

// Ohm's Law units
const ohmsUnits = [
    { id: 'v', name: 'Voltage (V)' },
    { id: 'i', name: 'Current (A)' },
    { id: 'r', name: 'Resistance (Ω)' },
    { id: 'p', name: 'Power (W)' },
];

// State
const fromUnit = ref('v');
const toUnit = ref('p');
const inputValue = ref(12);
const result = ref('');

// Initialize units when component mounts
const initializeUnits = () => {
    const urlUnits = getUnitsFromUrl();

    if (urlUnits && urlUnits.fromUnit && urlUnits.toUnit) {
        fromUnit.value = urlUnits.fromUnit;
        toUnit.value = urlUnits.toUnit;
    }
};

// Swap function
const swapUnits = () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    convertOhmsLaw();
    updateUrlPath(fromUnit.value, toUnit.value);
};

// Convert Ohm's Law values
const convertOhmsLaw = () => {
    const value = parseFloat(inputValue.value);

    if (isNaN(value) || value <= 0) {
        result.value = '';
        return;
    }

    // For demonstration purposes, we'll use some reasonable assumptions:
    // - Standard voltage: 120V
    // - Standard resistance: 10 Ohms
    // - Standard current: 1 Amp
    // - Standard power: 100 Watts
    const standardValues = {
        v: 120,
        r: 10,
        i: 1,
        p: 100,
    };

    // If the from unit is the same as to unit, just return the same value
    if (fromUnit.value === toUnit.value) {
        result.value = formatValue(value);
        return;
    }

    let calculatedResult;

    // Voltage conversions
    if (fromUnit.value === 'v') {
        if (toUnit.value === 'i') {
            // V to I: I = V/R (assume standard resistance)
            calculatedResult = value / standardValues.r;
        } else if (toUnit.value === 'r') {
            // V to R: R = V/I (assume standard current)
            calculatedResult = value / standardValues.i;
        } else if (toUnit.value === 'p') {
            // V to P: P = V*I (assume standard current)
            calculatedResult = value * standardValues.i;
        }
    }
    // Current conversions
    else if (fromUnit.value === 'i') {
        if (toUnit.value === 'v') {
            // I to V: V = I*R (assume standard resistance)
            calculatedResult = value * standardValues.r;
        } else if (toUnit.value === 'r') {
            // I to R: R = V/I (assume standard voltage)
            calculatedResult = standardValues.v / value;
        } else if (toUnit.value === 'p') {
            // I to P: P = I*V (assume standard voltage)
            calculatedResult = value * standardValues.v;
        }
    }
    // Resistance conversions
    else if (fromUnit.value === 'r') {
        if (toUnit.value === 'v') {
            // R to V: V = I*R (assume standard current)
            calculatedResult = standardValues.i * value;
        } else if (toUnit.value === 'i') {
            // R to I: I = V/R (assume standard voltage)
            calculatedResult = standardValues.v / value;
        } else if (toUnit.value === 'p') {
            // R to P: P = V²/R (assume standard voltage)
            calculatedResult = (standardValues.v * standardValues.v) / value;
        }
    }
    // Power conversions
    else if (fromUnit.value === 'p') {
        if (toUnit.value === 'v') {
            // P to V: V = P/I (assume standard current)
            calculatedResult = value / standardValues.i;
        } else if (toUnit.value === 'i') {
            // P to I: I = P/V (assume standard voltage)
            calculatedResult = value / standardValues.v;
        } else if (toUnit.value === 'r') {
            // P to R: R = V²/P (assume standard voltage)
            calculatedResult = (standardValues.v * standardValues.v) / value;
        }
    }

    // Format and update result
    result.value = formatValue(calculatedResult);
};

// Copy to clipboard function
const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    appState.value.showToast = true;
    setTimeout(() => (appState.value.showToast = false), 2000); // Hide toast after 2 seconds
};

// Format value based on size
const formatValue = (value) => {
    if (value === undefined || isNaN(value)) return '';

    if (Math.abs(value) >= 1000000) {
        return value.toExponential(2);
    } else if (Math.abs(value) >= 100) {
        return value.toFixed(1);
    } else if (Math.abs(value) >= 10) {
        return value.toFixed(2);
    } else if (Math.abs(value) >= 1) {
        return value.toFixed(3);
    } else if (Math.abs(value) >= 0.01) {
        return value.toFixed(4);
    } else if (Math.abs(value) >= 0.0001) {
        return value.toFixed(6);
    } else {
        return value.toExponential(3);
    }
};

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
initializeUnits();
convertOhmsLaw();
</script>
