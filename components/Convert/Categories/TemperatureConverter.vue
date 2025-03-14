<!-- components/Convert/Categories/TemperatureConverter.vue -->
<template>
    <div>
        <BaseConverter
            :category="temperatureCategory"
            title="Temperature Converter"
            ref="baseConverter"
            :convert-function="convertTemperature"
            :formula-function="getConversionFormula"
        />
    </div>
</template>

<script setup>
import { ref} from 'vue';
import { unitConvertCategories } from '~/utils/unit';
import BaseConverter from "../BaseConverter.vue";

// Get the temperature category from unitConvertCategories
const temperatureCategory = unitConvertCategories.find((cat) => cat.id === 'temperature');

// Reference to the base converter
const baseConverter = ref(null);

// Temperature conversion requires special formulas
const convertTemperature = (value, fromUnit, toUnit) => {
    // Convert to Celsius first as an intermediate step
    let celsius;

    switch (fromUnit) {
        case 'c':
            celsius = value;
            break;
        case 'f':
            celsius = (value - 32) * (5 / 9);
            break;
        case 'k':
            celsius = value - 273.15;
            break;
        default:
            return 0;
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'c':
            return celsius;
        case 'f':
            return celsius * (9 / 5) + 32;
        case 'k':
            return celsius + 273.15;
        default:
            return 0;
    }
};

// Custom formula display for temperature
const getConversionFormula = (fromUnit, toUnit) => {
    const from = temperatureCategory.units.find((unit) => unit.id === fromUnit);
    const to = temperatureCategory.units.find((unit) => unit.id === toUnit);

    if (!from || !to) return '';

    if (fromUnit === toUnit) return `${from.name} = ${to.name}`;

    if (fromUnit === 'c' && toUnit === 'f') {
        return `°C to °F: Multiply by 9/5, then add 32`;
    } else if (fromUnit === 'f' && toUnit === 'c') {
        return `°F to °C: Subtract 32, then multiply by 5/9`;
    } else if (fromUnit === 'c' && toUnit === 'k') {
        return `°C to K: Add 273.15`;
    } else if (fromUnit === 'k' && toUnit === 'c') {
        return `K to °C: Subtract 273.15`;
    } else if (fromUnit === 'f' && toUnit === 'k') {
        return `°F to K: Subtract 32, multiply by 5/9, then add 273.15`;
    } else if (fromUnit === 'k' && toUnit === 'f') {
        return `K to °F: Subtract 273.15, multiply by 9/5, then add 32`;
    }

    return `Converted using temperature formulas`;
};
</script>
