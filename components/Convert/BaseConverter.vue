<!-- components/Convert/BaseConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto">
            <h1 v-if="title" class="text-3xl font-bold mb-6 text-center">{{ title }}</h1>

            <!-- From Section -->
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-medium mb-2">From</label>
                <div class="join w-full">
                    <input
                        v-model="fromValue"
                        type="number"
                        class="input join-item flex-1 bg-white"
                        placeholder="Value"
                        @input="convertFromValue"
                    />
                    <select v-model="fromUnit" class="select join-item bg-white w-2/5" @change="convertFromValue">
                        <option disabled value="">Unit</option>
                        <option v-for="unit in units" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center my-2">
                <button @click="swapUnits" class="btn btn-circle btn-sm btn-outline" title="Swap units">
                    <Icon name="solar:transfer-vertical-linear" class="h-5 w-5 text-base" />
                </button>
            </div>

            <!-- To Section -->
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-medium mb-2">To</label>
                <div class="join w-full">
                    <input v-model="toValue" type="text" class="input join-item flex-1 bg-white" placeholder="Result" readonly />
                    <select v-model="toUnit" class="select join-item bg-white w-2/5" @change="convertFromValue">
                        <option disabled value="">Unit</option>
                        <option v-for="unit in units" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Copy Button -->
            <button v-show="toUnit && toValue" @click="copyToClipboard(toValue.toString())" class="btn btn-primary w-full mb-6">
                <Icon name="solar:copy-linear" class="mr-2" />Copy Result
            </button>

            <!-- Formula Display -->
            <div v-show="conversionFormula" class="mt-2 text-zinc-600 p-2 bg-zinc-50 rounded-xl">
                <p>{{ conversionFormula }}</p>
            </div>
        </div>

        <!-- Toast Notification -->
        <div v-if="showToast" class="toast toast-end toast-bottom">
            <div class="alert alert-success">
                <span>Copied to clipboard!</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
    },
});

// Get the from and to parameters from the route
const route = useRoute();
const fromUnitId = route.params.from;
const toUnitId = route.params.to;

// Get URL update functionality
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();

// Access units from the category
const units = computed(() => props.category.units);

// State
const fromUnit = ref('');
const toUnit = ref('');
const fromValue = ref('');
const toValue = ref('');
const showToast = ref(false);

// Initialize units when component mounts
const initializeUnits = () => {
    if (units.value && units.value.length > 0) {
        if (fromUnitId && units.value.some((unit) => unit.id === fromUnitId)) {
            fromUnit.value = fromUnitId;
        } else {
            fromUnit.value = units.value[0].id;
        }

        if (toUnitId && units.value.some((unit) => unit.id === toUnitId)) {
            toUnit.value = toUnitId;
        } else {
            toUnit.value = units.value.length > 1 ? units.value[1].id : units.value[0].id;
        }

        // Update URL with the default units
        setTimeout(() => {
            updateUrlPath(fromUnit.value, toUnit.value);
        }, 0);

        // Reset values
        fromValue.value = '';
        toValue.value = '';
    }
};

// Computed for formula display - to be overridden in specialized converters
const conversionFormula = computed(() => {
    const from = units.value.find((unit) => unit.id === fromUnit.value);
    const to = units.value.find((unit) => unit.id === toUnit.value);

    if (!from || !to) return '';

    return `1 ${from.name} = ${(from.factor / to.factor).toFixed(6)} ${to.name}`;
});

// Standard conversion method - can be overridden in specialized converters
const computeConversion = (value, fromUnitId, toUnitId) => {
    const fromUnit = units.value.find((unit) => unit.id === fromUnitId);
    const toUnit = units.value.find((unit) => unit.id === toUnitId);

    if (!fromUnit || !toUnit) return 0;

    return value * (fromUnit.factor / toUnit.factor);
};

// Convert from the "from" value - can be overridden in specialized converters
const convertFromValue = () => {
    if (!fromUnit.value || !toUnit.value || fromValue.value === '') {
        toValue.value = '';
        return;
    }

    // Standard conversion using factor
    const result = computeConversion(parseFloat(fromValue.value), fromUnit.value, toUnit.value);
    toValue.value = result.toFixed(4);
};

// Copy to clipboard functionality
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000); // Hide toast after 2 seconds
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Swap units function
const swapUnits = () => {
    // Save current values
    const tempUnit = fromUnit.value;

    // Swap units
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;

    // Set from value to the result of the previous conversion
    fromValue.value = toValue.value;

    // Convert with new settings
    convertFromValue();

    // Update URL with swapped units
    updateUrlPath(fromUnit.value, toUnit.value);
};

// Watch for from value changes
watch(fromValue, convertFromValue);

// When units change, update both the conversion and the URL
watch(fromUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        convertFromValue();
        updateUrlPath(newVal, toUnit.value);
    }
});

watch(toUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        convertFromValue();
        updateUrlPath(fromUnit.value, newVal);
    }
});

// Initialize on mount
onMounted(() => {
    initializeUnits();
});

// Expose methods and properties for child components
defineExpose({
    fromUnit,
    toUnit,
    fromValue,
    toValue,
    convertFromValue,
    computeConversion,
    swapUnits,
    copyToClipboard,
});
</script>
