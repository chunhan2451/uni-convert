<!-- components/Convert/Categories/CssConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.categoryIcons.css" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-8 text-center">CSS Units Converter</h1>
            </div>

            <!-- CSS Options -->
            <div class="mb-6 p-4 bg-zinc-100 rounded-xl shadow-sm">
                <h3 class="font-medium mb-3 text-zinc-900">CSS Conversion Options</h3>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Base Font Size (px)</label>
                        <input v-model.number="cssOptions.baseSize" type="number" class="input input-sm w-full bg-white" />
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Container Size (px)</label>
                        <input v-model.number="cssOptions.containerSize" type="number" class="input input-sm w-full bg-white" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Viewport Width (px)</label>
                        <input v-model.number="cssOptions.viewportWidth" type="number" class="input input-sm w-full bg-white" />
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-sm mb-1">Viewport Height (px)</label>
                        <input v-model.number="cssOptions.viewportHeight" type="number" class="input input-sm w-full bg-white" />
                    </div>
                </div>
            </div>

            <!-- Use the BaseConverter component with props for custom conversion -->
            <BaseConverter
                :category="cssCategory"
                ref="baseConverter"
                :convert-function="convertCssUnits"
                :formula-function="getConversionFormula"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { unitConvertCategories } from '~/utils/unit';
import BaseConverter from "../BaseConverter.vue";

// Get the CSS category from unitConvertCategories
const cssCategory = unitConvertCategories.find((cat) => cat.id === 'css');

// Reference to the base converter
const baseConverter = ref(null);

// CSS specific options
const cssOptions = ref({
    baseSize: 16, // Default browser font size (16px)
    viewportWidth: 1920, // Default viewport width
    viewportHeight: 1080, // Default viewport height
    containerSize: 1000, // Default container size for % calculations
});

// CSS Units conversion
const convertCssUnits = (value, fromUnit, toUnit) => {
    // First convert to px as our intermediate unit
    let valueInPx;

    switch (fromUnit) {
        case 'px':
            valueInPx = value;
            break;
        case 'rem':
            valueInPx = value * cssOptions.value.baseSize;
            break;
        case 'em':
            // For em, we use the base size
            valueInPx = value * cssOptions.value.baseSize;
            break;
        case 'percent':
            // Percentage of the container
            valueInPx = (value * cssOptions.value.containerSize) / 100;
            break;
        case 'pt':
            valueInPx = value * 1.333333;
            break;
        case 'vh':
            valueInPx = (value * cssOptions.value.viewportHeight) / 100;
            break;
        case 'vw':
            valueInPx = (value * cssOptions.value.viewportWidth) / 100;
            break;
        default:
            return 0;
    }

    // Then convert from px to the target unit
    switch (toUnit) {
        case 'px':
            return valueInPx;
        case 'rem':
            return valueInPx / cssOptions.value.baseSize;
        case 'em':
            return valueInPx / cssOptions.value.baseSize;
        case 'percent':
            // Convert to percentage of the container
            return (valueInPx / cssOptions.value.containerSize) * 100;
        case 'pt':
            return valueInPx / 1.333333;
        case 'vh':
            return (valueInPx / cssOptions.value.viewportHeight) * 100;
        case 'vw':
            return (valueInPx / cssOptions.value.viewportWidth) * 100;
        default:
            return 0;
    }
};

// Custom formula display for CSS units
const getConversionFormula = (fromUnit, toUnit) => {
    if (!fromUnit || !toUnit) return '';

    if (fromUnit === 'rem' && toUnit === 'px') {
        return `1 rem = ${cssOptions.value.baseSize} px (Base: ${cssOptions.value.baseSize}px)`;
    } else if (fromUnit === 'px' && toUnit === 'rem') {
        return `1 px = ${(1 / cssOptions.value.baseSize).toFixed(6)} rem (Base: ${cssOptions.value.baseSize}px)`;
    } else if (fromUnit === 'percent' || toUnit === 'percent') {
        return `Converted based on container size: ${cssOptions.value.containerSize}px`;
    } else if (fromUnit === 'vh' || toUnit === 'vh') {
        return `Converted based on viewport height: ${cssOptions.value.viewportHeight}px`;
    } else if (fromUnit === 'vw' || toUnit === 'vw') {
        return `Converted based on viewport width: ${cssOptions.value.viewportWidth}px`;
    }

    return `Converted using CSS unit calculations`;
};

// Watch CSS option changes to recalculate
watch(
    cssOptions,
    () => {
        if (baseConverter.value) {
            baseConverter.value.convertFromValue();
        }
    },
    { deep: true }
);
</script>
