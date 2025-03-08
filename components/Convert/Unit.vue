<template>
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">Universal Converter</h1>

            <!-- Conversion Type Selection -->
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-medium mb-2">Conversion Type</label>
                <select v-model="selectedCategory" class="select w-full bg-white" @change="handleCategoryChange">
                    <option disabled value="">Select type</option>
                    <option v-for="category in convertCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <!-- CSS Options (only show when CSS is selected) -->
            <div v-if="selectedCategory === 'css'" class="mb-6 p-4 bg-zinc-100 rounded-xl shadow-sm">
                <h3 class="font-medium mb-3 text-zinc-900">CSS Conversion Options</h3>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Base Font Size (px)</label>
                        <input
                            v-model="cssOptions.baseSize"
                            type="number"
                            class="input input-sm w-full bg-white"
                            @change="convertFromValue"
                        />
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Container Size (px)</label>
                        <input
                            v-model="cssOptions.containerSize"
                            type="number"
                            class="input input-sm w-full bg-white"
                            @change="convertFromValue"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Viewport Width (px)</label>
                        <input
                            v-model="cssOptions.viewportWidth"
                            type="number"
                            class="input input-sm w-full bg-white"
                            @change="convertFromValue"
                        />
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Viewport Height (px)</label>
                        <input
                            v-model="cssOptions.viewportHeight"
                            type="number"
                            class="input input-sm w-full bg-white"
                            @change="convertFromValue"
                        />
                    </div>
                </div>
            </div>

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
                        <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center my-2">
                <button @click="swapUnits" class="btn btn-circle btn-sm btn-outline" title="Swap units">
                    <Icon name="solar:transfer-vertical-linear" class="h-5 w-5" />
                </button>
            </div>

            <!-- To Section -->
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-medium mb-2">To</label>
                <div class="join w-full">
                    <input v-model="toValue" type="text" class="input join-item flex-1 bg-white" placeholder="Result" readonly />
                    <select v-model="toUnit" class="select join-item bg-white w-2/5" @change="convertFromValue">
                        <option disabled value="">Unit</option>
                        <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
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
import { convertCategories } from "~/utils/convert";
import { ref, computed, watch } from "vue";

// State
const selectedCategory = ref("");
const fromUnit = ref("");
const toUnit = ref("");
const fromValue = ref("");
const toValue = ref("");
const showToast = ref(false);

// CSS specific options
const cssOptions = ref({
    baseSize: 16, // Default browser font size (16px)
    viewportWidth: 1920, // Default viewport width
    viewportHeight: 1080, // Default viewport height
    containerSize: 1000, // Default container size for % calculations
});

// Get current units based on selected category
const currentUnits = computed(() => {
    const category = convertCategories.find((cat) => cat.id === selectedCategory.value);
    return category ? category.units : [];
});

// Initialize units when component mounts or category changes
const handleCategoryChange = () => {
    const category = convertCategories.find((cat) => cat.id === selectedCategory.value);

    if (category && category.units.length > 0) {
        fromUnit.value = category.units[0].id;
        toUnit.value = category.units.length > 1 ? category.units[1].id : category.units[0].id;

        // Reset values
        fromValue.value = "";
        toValue.value = "";
    }
};

// Conversion formula display
const conversionFormula = computed(() => {
    const from = currentUnits.value.find((unit) => unit.id === fromUnit.value);
    const to = currentUnits.value.find((unit) => unit.id === toUnit.value);

    if (!from || !to) return "";

    if (selectedCategory.value === "temperature") {
        return `Converted using temperature formulas`;
    }

    if (selectedCategory.value === "css") {
        if (fromUnit.value === "rem" && toUnit.value === "px") {
            return `1 ${from.name} = ${cssOptions.value.baseSize} ${to.name} (Base: ${cssOptions.value.baseSize}px)`;
        } else if (fromUnit.value === "px" && toUnit.value === "rem") {
            return `1 ${from.name} = ${(1 / cssOptions.value.baseSize).toFixed(6)} ${to.name} (Base: ${
                cssOptions.value.baseSize
            }px)`;
        } else if (fromUnit.value === "percent" || toUnit.value === "percent") {
            return `Converted based on container size: ${cssOptions.value.containerSize}px`;
        } else if (fromUnit.value === "vh" || toUnit.value === "vh") {
            return `Converted based on viewport height: ${cssOptions.value.viewportHeight}px`;
        } else if (fromUnit.value === "vw" || toUnit.value === "vw") {
            return `Converted based on viewport width: ${cssOptions.value.viewportWidth}px`;
        } else {
            return `Converted using CSS unit calculations`;
        }
    }

    return `1 ${from.name} = ${(from.factor / to.factor).toFixed(6)} ${to.name}`;
});

// Convert from the "from" value
const convertFromValue = () => {
    if (!fromUnit.value || !toUnit.value || fromValue.value === "") {
        toValue.value = "";
        return;
    }

    // Special case for temperature
    if (selectedCategory.value === "temperature") {
        toValue.value = convertTemperature(parseFloat(fromValue.value), fromUnit.value, toUnit.value).toFixed(4);
        return;
    }

    // Special case for CSS units
    if (selectedCategory.value === "css") {
        toValue.value = convertCssUnits(parseFloat(fromValue.value), fromUnit.value, toUnit.value).toFixed(4);
        return;
    }

    // Standard conversion using factor
    const result = computeConversion(parseFloat(fromValue.value), fromUnit.value, toUnit.value);
    toValue.value = result.toFixed(4);
};

// Compute conversion between units using factors
const computeConversion = (value, fromUnitId, toUnitId) => {
    const fromUnit = currentUnits.value.find((unit) => unit.id === fromUnitId);
    const toUnit = currentUnits.value.find((unit) => unit.id === toUnitId);

    if (!fromUnit || !toUnit) return 0;

    return value * (fromUnit.factor / toUnit.factor);
};

// CSS Units conversion
const convertCssUnits = (value, fromUnit, toUnit) => {
    // First convert to px as our intermediate unit
    let valueInPx;

    switch (fromUnit) {
        case "px":
            valueInPx = value;
            break;
        case "rem":
            valueInPx = value * cssOptions.value.baseSize;
            break;
        case "em":
            // For em, we use the base size
            valueInPx = value * cssOptions.value.baseSize;
            break;
        case "percent":
            // Percentage of the container
            valueInPx = (value * cssOptions.value.containerSize) / 100;
            break;
        case "pt":
            valueInPx = value * 1.333333;
            break;
        case "vh":
            valueInPx = (value * cssOptions.value.viewportHeight) / 100;
            break;
        case "vw":
            valueInPx = (value * cssOptions.value.viewportWidth) / 100;
            break;
        default:
            return 0;
    }

    // Then convert from px to the target unit
    switch (toUnit) {
        case "px":
            return valueInPx;
        case "rem":
            return valueInPx / cssOptions.value.baseSize;
        case "em":
            return valueInPx / cssOptions.value.baseSize;
        case "percent":
            // Convert to percentage of the container
            return (valueInPx / cssOptions.value.containerSize) * 100;
        case "pt":
            return valueInPx / 1.333333;
        case "vh":
            return (valueInPx / cssOptions.value.viewportHeight) * 100;
        case "vw":
            return (valueInPx / cssOptions.value.viewportWidth) * 100;
        default:
            return 0;
    }
};

// Temperature conversion requires special formulas
const convertTemperature = (value, fromUnit, toUnit) => {
    // Convert to Celsius first as an intermediate step
    let celsius;

    switch (fromUnit) {
        case "c":
            celsius = value;
            break;
        case "f":
            celsius = (value - 32) * (5 / 9);
            break;
        case "k":
            celsius = value - 273.15;
            break;
        default:
            return 0;
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
        case "c":
            return celsius;
        case "f":
            return celsius * (9 / 5) + 32;
        case "k":
            return celsius + 273.15;
        default:
            return 0;
    }
};

// Copy to clipboard functionality
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000); // Hide toast after 2 seconds
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};

// Swap units function
const swapUnits = () => {
    // Save current values
    const tempUnit = fromUnit.value;
    const tempValue = fromValue.value;

    // Swap units
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;

    // Set from value to the result of the previous conversion
    fromValue.value = toValue.value;

    // Convert with new settings
    convertFromValue();
};

// Watch for from value changes
watch(fromValue, convertFromValue);
watch(fromUnit, convertFromValue);
watch(toUnit, convertFromValue);

// Also watch CSS option changes to recalculate when they change
watch(cssOptions, convertFromValue, { deep: true });
</script>
