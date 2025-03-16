<!-- components/Convert/Categories/PressureConverter.vue -->
<template>
    <BaseConverter :category="category" title="Pressure Converter" />
</template>

<script setup>
import { unitConvertCategories } from "~/utils/unit";
import BaseConverter from "../BaseConverter.vue";

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === "pressure");
</script>
