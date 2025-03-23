<!-- components/Convert/Units/CookingConverter.vue -->
<template>
    <BaseConverter
        :category="category"
        title="Cooking Converter"
        :convertFunction="convertCookingMeasurement"
        :formulaFunction="getConversionFormula"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import { unitConvertCategories } from '~/utils/unit';
import BaseConverter from '../BaseConverter.vue';

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === 'cooking');

// Common ingredients and their density (g/ml)
const ingredients = [
    { id: 'water', name: 'Water', density: 1 },
    { id: 'flour', name: 'All-Purpose Flour', density: 0.53 },
    { id: 'sugar', name: 'Granulated Sugar', density: 0.85 },
    { id: 'salt', name: 'Table Salt', density: 1.2 },
    { id: 'butter', name: 'Butter', density: 0.96 },
];

// Selected ingredient for volume-to-weight conversions
const selectedIngredient = ref('water');

// Custom conversion function for cooking measurements
const convertCookingMeasurement = (value, from, to) => {
    if (!value || isNaN(value)) return 0;

    // Units that are based on standard factors
    const standardUnits = ['cup', 'tbsp', 'tsp', 'ml', 'floz'];
    const weightUnits = ['g', 'oz'];

    // If both units are standard volume units, use the standard conversion
    if (standardUnits.includes(from) && standardUnits.includes(to)) {
        const fromUnit = category.units.find((unit) => unit.id === from);
        const toUnit = category.units.find((unit) => unit.id === to);
        return value * (fromUnit.factor / toUnit.factor);
    }

    // If converting between weight units, use standard conversion
    if (weightUnits.includes(from) && weightUnits.includes(to)) {
        if (from === 'g' && to === 'oz') return value * 0.035274;
        if (from === 'oz' && to === 'g') return value * 28.3495;
        return value;
    }

    // For volume to weight or weight to volume, use density
    const ingredientDensity = ingredients.find((i) => i.id === selectedIngredient.value)?.density || 1;

    // Convert to ml as intermediate step
    let valueInMl;
    if (from === 'cup') valueInMl = value * 237;
    else if (from === 'tbsp') valueInMl = value * 15;
    else if (from === 'tsp') valueInMl = value * 5;
    else if (from === 'ml') valueInMl = value;
    else if (from === 'floz') valueInMl = value * 30;
    else if (from === 'g') valueInMl = value / ingredientDensity;
    else if (from === 'oz') valueInMl = (value * 28.3495) / ingredientDensity;

    // Convert from ml to target unit
    if (to === 'cup') return valueInMl / 237;
    else if (to === 'tbsp') return valueInMl / 15;
    else if (to === 'tsp') return valueInMl / 5;
    else if (to === 'ml') return valueInMl;
    else if (to === 'floz') return valueInMl / 30;
    else if (to === 'g') return valueInMl * ingredientDensity;
    else if (to === 'oz') return (valueInMl * ingredientDensity) / 28.3495;

    return value;
};

// Custom formula display
const getConversionFormula = (fromUnitId, toUnitId) => {
    const fromUnit = category.units.find((unit) => unit.id === fromUnitId);
    const toUnit = category.units.find((unit) => unit.id === toUnitId);

    if (!fromUnit || !toUnit) return '';

    const weightUnits = ['g', 'oz'];
    const volumeUnits = ['cup', 'tbsp', 'tsp', 'ml', 'floz'];

    // If converting between weight and volume
    if (
        (weightUnits.includes(fromUnitId) && volumeUnits.includes(toUnitId)) ||
        (volumeUnits.includes(fromUnitId) && weightUnits.includes(toUnitId))
    ) {
        const ingredientDensity = ingredients.find((i) => i.id === selectedIngredient.value)?.density || 1;
        return `Conversion based on ${selectedIngredient.value} with density: ${ingredientDensity} g/ml`;
    }

    // Standard conversion
    if (fromUnit.factor && toUnit.factor) {
        return `1 ${fromUnit.name} = ${(fromUnit.factor / toUnit.factor).toFixed(6)} ${toUnit.name}`;
    }

    return 'Custom conversion based on units';
};
</script>
