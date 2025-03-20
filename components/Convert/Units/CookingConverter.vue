<!-- components/Units/CookingConverter.vue -->
<template>
    <div class="w-full">
        <div class="p-5">
            <h2 class="text-2xl font-bold mb-6 text-center">Cooking Converter</h2>

            <!-- From Section -->
            <div class="mb-8">
                <label class="block text-base-content mb-2">From</label>
                <div class="flex">
                    <input
                        v-model="fromValue"
                        type="number"
                        class="input input-bordered rounded-r-none flex-1"
                        placeholder="Value"
                        min="0"
                        step="any"
                        @input="updateConversion"
                    />
                    <select v-model="fromUnit" class="select select-bordered rounded-l-none w-2/5" @change="updateConversion">
                        <option v-for="unit in units" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center -mt-4 mb-2">
                <button @click="swapUnits" class="btn btn-circle btn-sm btn-outline" aria-label="Swap units">
                    <Icon :name="uiIcons.transfer" class="h-5 w-5" />
                </button>
            </div>

            <!-- To Section -->
            <div class="mb-8">
                <label class="block text-base-content mb-2">To</label>
                <div class="flex">
                    <input
                        v-model="toValue"
                        type="text"
                        class="input input-bordered rounded-r-none flex-1"
                        placeholder="Result"
                        readonly
                    />
                    <select v-model="toUnit" class="select select-bordered rounded-l-none w-2/5" @change="updateConversion">
                        <option v-for="unit in units" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Ingredient Selector (only shown when needed) -->
            <div v-if="showIngredientSelector" class="mb-6">
                <label class="block text-base-content mb-2">Ingredient Type</label>
                <select v-model="selectedIngredient" class="select select-bordered w-full" @change="updateConversion">
                    <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">
                        {{ ingredient.name }}
                    </option>
                </select>
                <div class="text-xs text-base-content/70 mt-1">* Required for volume ↔ weight conversion</div>
            </div>

            <!-- Copy Result Button -->
            <div v-if="fromValue && toValue" class="mb-6">
                <button
                    @click="copyToClipboard(toValue)"
                    class="btn btn-primary w-full flex items-center justify-center"
                    :class="{ 'opacity-80': copied }"
                >
                    <Icon :name="copied ? uiIcons.checkCircle : uiIcons.copy" class="h-5 w-5 mr-2" />
                    Copy Result
                </button>
            </div>

            <!-- Conversion Formula Display -->
            <div class="mt-2 text-zinc-600 p-2 bg-zinc-50 rounded-xl">
                <p class="text-base-content">
                    1 {{ getUnitName(fromUnit) }} = {{ getConversionFactor() }} {{ getUnitName(toUnit) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

// Initialize URL handling
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();

// Define cooking measurement units
const units = [
    { id: 'cup', name: 'Cup', factor: 1 },
    { id: 'tbsp', name: 'Tablespoon', factor: 0.0625 },
    { id: 'tsp', name: 'Teaspoon', factor: 0.0208333 },
    { id: 'ml', name: 'Milliliter', factor: 0.00423223 },
    { id: 'floz', name: 'Fluid Ounce', factor: 0.125 },
    { id: 'g', name: 'Gram', factor: 0 },
    { id: 'oz', name: 'Ounce', factor: 0 },
    { id: 'l', name: 'Liter', factor: 4.23223 },
    { id: 'pt', name: 'Pint', factor: 2 },
    { id: 'qt', name: 'Quart', factor: 4 },
    { id: 'gal', name: 'Gallon', factor: 16 },
    { id: 'kg', name: 'Kilogram', factor: 0 },
    { id: 'lb', name: 'Pound', factor: 0 },
];

// Common ingredients and their density (g/ml)
const ingredients = [
    { id: 'water', name: 'Water', density: 1 },
    { id: 'milk', name: 'Milk', density: 1.03 },
    { id: 'oil', name: 'Oil', density: 0.92 },
    { id: 'flour', name: 'All-Purpose Flour', density: 0.53 },
    { id: 'sugar', name: 'Granulated Sugar', density: 0.85 },
    { id: 'brown-sugar', name: 'Brown Sugar', density: 0.8 },
    { id: 'salt', name: 'Table Salt', density: 1.2 },
    { id: 'butter', name: 'Butter', density: 0.96 },
    { id: 'honey', name: 'Honey', density: 1.4 },
    { id: 'rice', name: 'White Rice (uncooked)', density: 0.75 },
];

// Form state
const fromUnit = ref('cup');
const toUnit = ref('tbsp');
const fromValue = ref('');
const toValue = ref('');
const selectedIngredient = ref('water');
const copied = ref(false);

// Determine if we need to show the ingredient selector
const showIngredientSelector = computed(() => {
    const volumeUnits = ['cup', 'tbsp', 'tsp', 'ml', 'l', 'floz', 'pt', 'qt', 'gal'];
    const weightUnits = ['g', 'kg', 'oz', 'lb'];

    // Show the selector if converting between volume and weight
    return (
        (volumeUnits.includes(fromUnit.value) && weightUnits.includes(toUnit.value)) ||
        (weightUnits.includes(fromUnit.value) && volumeUnits.includes(toUnit.value))
    );
});

// Get the full name of a unit for display
const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : unitId;
};

// Get conversion factor for the formula display
const getConversionFactor = () => {
    if (fromValue.value) {
        return convertCookingMeasurement(1, fromUnit.value, toUnit.value, selectedIngredient.value);
    }

    // Default conversion for common units
    if (fromUnit.value === 'cup' && toUnit.value === 'tbsp') return '16';
    if (fromUnit.value === 'tbsp' && toUnit.value === 'tsp') return '3';

    return convertCookingMeasurement(1, fromUnit.value, toUnit.value, selectedIngredient.value);
};

// Convert between cooking measurements
const convertCookingMeasurement = (value, from, to, ingredient) => {
    if (!value || isNaN(value)) return '';

    // We'll first convert everything to milliliters (ml) as a base unit for volume
    // For weight units (g, kg, oz, lb) we'll use conversions based on ingredient density

    // Convert from the original unit to ml first
    let valueInMl;

    switch (from) {
        case 'cup':
            valueInMl = value * 237;
            break;
        case 'tbsp':
            valueInMl = value * 15;
            break;
        case 'tsp':
            valueInMl = value * 5;
            break;
        case 'ml':
            valueInMl = value;
            break;
        case 'l':
            valueInMl = value * 1000;
            break;
        case 'floz':
            valueInMl = value * 30;
            break;
        case 'pt':
            valueInMl = value * 473;
            break;
        case 'qt':
            valueInMl = value * 946;
            break;
        case 'gal':
            valueInMl = value * 3785;
            break;
        case 'g': {
            // Convert from grams to ml using the ingredient's density
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            valueInMl = value / ingredientDensity;
            break;
        }
        case 'kg': {
            // Convert from kg to ml
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            valueInMl = (value * 1000) / ingredientDensity;
            break;
        }
        case 'oz': {
            // Convert from oz to ml (1 oz = 28.35 g)
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            valueInMl = (value * 28.35) / ingredientDensity;
            break;
        }
        case 'lb': {
            // Convert from lb to ml (1 lb = 453.59 g)
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            valueInMl = (value * 453.59) / ingredientDensity;
            break;
        }
        default:
            valueInMl = value;
    }

    // Now convert from ml to the target unit
    let result;

    switch (to) {
        case 'cup':
            result = valueInMl / 237;
            break;
        case 'tbsp':
            result = valueInMl / 15;
            break;
        case 'tsp':
            result = valueInMl / 5;
            break;
        case 'ml':
            result = valueInMl;
            break;
        case 'l':
            result = valueInMl / 1000;
            break;
        case 'floz':
            result = valueInMl / 30;
            break;
        case 'pt':
            result = valueInMl / 473;
            break;
        case 'qt':
            result = valueInMl / 946;
            break;
        case 'gal':
            result = valueInMl / 3785;
            break;
        case 'g': {
            // Convert from ml to grams using the ingredient's density
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            result = valueInMl * ingredientDensity;
            break;
        }
        case 'kg': {
            // Convert from ml to kg
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            result = (valueInMl * ingredientDensity) / 1000;
            break;
        }
        case 'oz': {
            // Convert from ml to oz (1 oz = 28.35 g)
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            result = (valueInMl * ingredientDensity) / 28.35;
            break;
        }
        case 'lb': {
            // Convert from ml to lb (1 lb = 453.59 g)
            const ingredientDensity = ingredients.find((i) => i.id === ingredient)?.density || 1;
            result = (valueInMl * ingredientDensity) / 453.59;
            break;
        }
        default:
            result = valueInMl;
    }

    // Round the result for better readability
    const significantDigits = value.toString().includes('.') ? value.toString().split('.')[1].length + 1 : 2;

    return result.toFixed(Math.min(significantDigits, 6));
};

// Update conversion when input changes
const updateConversion = () => {
    if (fromValue.value) {
        toValue.value = convertCookingMeasurement(
            parseFloat(fromValue.value),
            fromUnit.value,
            toUnit.value,
            selectedIngredient.value
        );
    } else {
        toValue.value = '';
    }

    // Update the URL to reflect the current conversion
    updateUrlPath(fromUnit.value, toUnit.value);
};

// Swap units
const swapUnits = () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    updateConversion();
};

// Copy result to clipboard
const copyToClipboard = async (text) => {
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};

// Watch for changes in units and update conversion
watch([fromUnit, toUnit, selectedIngredient], updateConversion);

// Initialize from URL if available
onMounted(() => {
    const urlUnits = getUnitsFromUrl();
    if (urlUnits) {
        fromUnit.value = urlUnits.fromUnit;
        toUnit.value = urlUnits.toUnit;
    }

    // Force an update if we have a value
    if (fromValue.value) {
        updateConversion();
    }
});

// Define metadata for SEO
// useHead({
//     title: 'Cooking Converter - Convert Between Cups, Tablespoons, and More',
//     meta: [
//         {
//             name: 'description',
//             content:
//                 'Convert between cooking measurements like cups, tablespoons, teaspoons, milliliters, and fluid ounces for easier recipe conversion.',
//         },
//     ],
// });
</script>
