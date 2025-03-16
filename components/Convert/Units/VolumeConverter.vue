<!-- components/Convert/Categories/VolumeConverter.vue -->
<template>
    <BaseConverter :category="category" title="Volume Converter" />
</template>

<script setup>
import { unitConvertCategories } from "~/utils/unit";
import BaseConverter from "../BaseConverter.vue";

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === "volume");
</script>
