<!-- components/Convert/Categories/TemperatureConverter.vue -->
<template>
    <BaseConverter :category="temperatureCategory" title="Temperature Converter" ref="baseConverter" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { unitConvertCategories } from "~/utils/unit";
import BaseConverter from "../BaseConverter.vue";

// Get the temperature category from unitConvertCategories
const temperatureCategory = unitConvertCategories.find((cat) => cat.id === "temperature");

// Reference to the base converter
const baseConverter = ref(null);

// Temperature conversion requires special formulas
const convertTemperature = (value, fromUnit, toUnit) => {
    console.log(value, fromUnit, toUnit);
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

// Custom formula display for temperature
const getConversionFormula = (fromUnit, toUnit) => {
    const from = temperatureCategory.units.find((unit) => unit.id === fromUnit);
    const to = temperatureCategory.units.find((unit) => unit.id === toUnit);

    if (!from || !to) return "";

    if (fromUnit === toUnit) return `${from.name} = ${to.name}`;

    if (fromUnit === "c" && toUnit === "f") {
        return `°C to °F: Multiply by 9/5, then add 32`;
    } else if (fromUnit === "f" && toUnit === "c") {
        return `°F to °C: Subtract 32, then multiply by 5/9`;
    } else if (fromUnit === "c" && toUnit === "k") {
        return `°C to K: Add 273.15`;
    } else if (fromUnit === "k" && toUnit === "c") {
        return `K to °C: Subtract 273.15`;
    } else if (fromUnit === "f" && toUnit === "k") {
        return `°F to K: Subtract 32, multiply by 5/9, then add 273.15`;
    } else if (fromUnit === "k" && toUnit === "f") {
        return `K to °F: Subtract 273.15, multiply by 9/5, then add 32`;
    }

    return `Converted using temperature formulas`;
};

// Override the default conversion method when the component is mounted
onMounted(() => {
    console.log(baseConverter.value);
    //!! issue on convertFromValue function
    if (baseConverter.value) {
        // Override the conversion method
        baseConverter.value.convertFromValue = () => {
            const { fromUnit, toUnit, fromValue, toValue } = baseConverter.value;

            console.log(fromUnit.value, toUnit.value, fromValue.value);
            if (!fromUnit.value || !toUnit.value || fromValue.value === "") {
                toValue.value = "";
                return;
            }

            const result = convertTemperature(parseFloat(fromValue.value), fromUnit.value, toUnit.value);

            toValue.value = result.toFixed(4);
        };

        // Override the formula display
        Object.defineProperty(baseConverter.value, "conversionFormula", {
            get: () => getConversionFormula(baseConverter.value.fromUnit.value, baseConverter.value.toUnit.value),
        });
    }
});
</script>
