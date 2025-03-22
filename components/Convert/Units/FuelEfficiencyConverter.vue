<!-- components/Convert/Units/FuelEfficiencyConverter.vue -->
<template>
    <div class="converter-container py-6">
        <div class="max-w-xl mx-auto">
            <div class="justify-center text-center mb-8">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.categoryIcons.fuel" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold">Fuel Efficiency Converter</h1>
            </div>

            <!-- Conversion Form -->
            <div class="grid gap-4">
                <!-- From Section -->
                <div>
                    <label class="text-lg font-medium">From</label>
                    <div class="flex mt-2 rounded-lg overflow-hidden border border-base-300">
                        <input
                            v-model="inputValue"
                            type="number"
                            step="any"
                            min="0"
                            class="input rounded-r-none rounded-l-lg border-0 flex-1 focus:outline-none"
                            placeholder="Value"
                            @input="convert"
                        />
                        <select
                            v-model="fromUnit"
                            class="select rounded-l-none rounded-r-lg border-0 border-l border-base-300 bg-base-100 focus:outline-none w-2/5"
                            @change="convert"
                        >
                            <option v-for="unit in units.filter(item => item.id != toUnit)" :key="unit.id" :value="unit.id">{{ unit.fullName }}</option>
                        </select>
                    </div>
                </div>

                <!-- Swap Button -->
                <div class="flex justify-center">
                    <button @click="swapUnits" class="btn btn-circle btn-sm btn-outline">
                        <Icon :name="uiIcons.transfer" class="h-5 w-5 text-base" />
                    </button>
                </div>

                <!-- To Section -->
                <div>
                    <label class="text-lg font-medium">To</label>
                    <div class="flex mt-2 rounded-lg overflow-hidden border border-base-300">
                        <input
                            v-model="resultValue"
                            type="number"
                            step="any"
                            readonly
                            class="input rounded-r-none rounded-l-lg border-0 flex-1 bg-base-100 focus:outline-none"
                            placeholder="Result"
                        />
                        <select
                            v-model="toUnit"
                            class="select rounded-l-none rounded-r-lg border-0 border-l border-base-300 bg-base-100 focus:outline-none  w-2/5"
                            @change="convert"
                        >
                            <option v-for="unit in units.filter(item => item.id != fromUnit)" :key="unit.id" :value="unit.id" :disabled="unit.id === fromUnit">
                                {{ unit.fullName }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Copy Result Button -->
                <button
                    v-if="resultValue"
                    @click="copyToClipboard(resultValue)"
                    class="btn btn-primary w-full mt-4"
                >
                    <Icon :name="uiIcons.copy" class="h-5 w-5" />
                    Copy Result
                </button>

                <!-- Conversion Display -->
                <div v-if="inputValue && resultValue" class="bg-base-200 p-4 rounded-lg text-center">
                    {{ inputValue }} {{ getUnitName(fromUnit) }} = {{ resultValue }} {{ getUnitName(toUnit) }}
                </div>
            </div>

            <!-- Formula Explanation -->
            <div class="mt-8 bg-base-100 p-6 rounded-lg shadow-md border border-base-300">
                <h2 class="text-xl font-semibold mb-4">Conversion Formulas</h2>
                <div class="grid gap-4">
                    <div>
                        <h3 class="font-medium">Miles per Gallon (MPG) to Kilometers per Liter (km/L)</h3>
                        <p class="text-base-content/70 mt-1">1 MPG = 0.425144 km/L</p>
                    </div>
                    <div>
                        <h3 class="font-medium">Miles per Gallon (MPG) to Liters per 100 km (L/100km)</h3>
                        <p class="text-base-content/70 mt-1">L/100km = 235.215 / MPG</p>
                    </div>
                    <div>
                        <h3 class="font-medium">Kilometers per Liter (km/L) to Liters per 100 km (L/100km)</h3>
                        <p class="text-base-content/70 mt-1">L/100km = 100 / km/L</p>
                    </div>
                </div>
            </div>

            <!-- Common Conversion Examples -->
            <div class="mt-8 bg-base-100 p-6 rounded-lg shadow-md border border-base-300">
                <h2 class="text-xl font-semibold mb-4">Common Fuel Efficiency Values</h2>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>MPG</th>
                                <th>km/L</th>
                                <th>L/100km</th>
                                <th>Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>15</td>
                                <td>6.38</td>
                                <td>15.68</td>
                                <td>Large SUV/Truck</td>
                            </tr>
                            <tr>
                                <td>25</td>
                                <td>10.63</td>
                                <td>9.41</td>
                                <td>Midsize Sedan</td>
                            </tr>
                            <tr>
                                <td>35</td>
                                <td>14.88</td>
                                <td>6.72</td>
                                <td>Compact Car</td>
                            </tr>
                            <tr>
                                <td>50</td>
                                <td>21.26</td>
                                <td>4.70</td>
                                <td>Hybrid Vehicle</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useUrlUpdate } from '~/composables/useUrlUpdate';
import { uiIcons } from '~/utils/appConstant';

// Units definition with full names for dropdown display
const units = [
    { id: 'mpg', name: 'MPG', fullName: 'Miles per Gallon (MPG)' },
    { id: 'kml', name: 'km/L', fullName: 'Kilometers per Liter (km/L)' },
    { id: 'l100km', name: 'L/100km', fullName: 'Liters per 100km (L/100km)' },
];

// Conversion state
const inputValue = ref('');
const resultValue = ref('');
const fromUnit = ref('mpg');
const toUnit = ref('kml');

// URL parameter handling
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();

// Initialize units when component mounts
const initializeUnits = () => {
    const urlUnits = getUnitsFromUrl();
    if (urlUnits) {
        const validFromUnit = units.some((u) => u.id === urlUnits.fromUnit);
        const validToUnit = units.some((u) => u.id === urlUnits.toUnit);

        if (validFromUnit && validToUnit && urlUnits.fromUnit !== urlUnits.toUnit) {
            fromUnit.value = urlUnits.fromUnit;
            toUnit.value = urlUnits.toUnit;
        }
    }
};

// Get unit display name for the result text
const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : '';
};

// Conversion functions
const convertToStandard = (value, unit) => {
    if (!value || isNaN(value)) return 0;

    const numValue = parseFloat(value);

    switch (unit) {
        case 'mpg':
            return numValue;
        case 'kml':
            return numValue / 0.425144;
        case 'l100km':
            if (numValue === 0) return 0; // Avoid division by zero
            return 235.215 / numValue;
        default:
            return 0;
    }
};

const convertFromStandard = (mpgValue, unit) => {
    if (!mpgValue || isNaN(mpgValue)) return 0;

    switch (unit) {
        case 'mpg':
            return mpgValue;
        case 'kml':
            return mpgValue * 0.425144;
        case 'l100km':
            if (mpgValue === 0) return 0; // Avoid division by zero
            return 235.215 / mpgValue;
        default:
            return 0;
    }
};

// Main conversion function
const convert = () => {
    if (!inputValue.value || isNaN(inputValue.value)) {
        resultValue.value = '';
        return;
    }

    // Handle special case for L/100km (since it's inverted)
    if (fromUnit.value === 'l100km' && toUnit.value === 'l100km') {
        resultValue.value = parseFloat(inputValue.value);
        return;
    }

    // Convert input to MPG as standard unit
    const standardValue = convertToStandard(inputValue.value, fromUnit.value);

    // Convert from standard to target unit
    const result = convertFromStandard(standardValue, toUnit.value);

    // Format the result (3 decimal places max)
    resultValue.value = parseFloat(result.toFixed(3));

    // Update URL with current conversion
    updateUrlPath(fromUnit.value, toUnit.value);
};

// Swap units
const swapUnits = () => {
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    convert();
    updateUrlPath(fromUnit.value, toUnit.value);
};

// Copy result to clipboard
const copyToClipboard = async (text) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    appState.value.showToast = true;
    setTimeout(() => (appState.value.showToast = false), 2000); // Hide toast after 2 seconds
};

// Watch for changes in units to trigger conversion
watch([fromUnit, toUnit], () => {
    convert();
});

// Watch for input value changes to convert on typing
watch(inputValue, () => {
    convert();
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

// Handle URL parameters on mount
onMounted(() => {
    initializeUnits();
});
</script>
