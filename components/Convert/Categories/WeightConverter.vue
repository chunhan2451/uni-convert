<!-- components/Convert/Categories/WeightConverter.vue -->
<template>
    <BaseConverter :category="category" title="Weight Converter" />
</template>

<script setup>
import { unitConvertCategories } from "~/utils/unit";
import BaseConverter from "../BaseConverter.vue";

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === "weight");
</script>
