<!-- pages/[from]-to-[to]-converter.vue -->
<template>
    <div class="container mx-auto p-4">
        <!-- Breadcrumbs navigation -->
        <div class="px-4 py-3">
            <div class="text-sm breadcrumbs">
                <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/converter">Converters</NuxtLink></li>
                    <li>{{ pageTitle }}</li>
                </ul>
            </div>
        </div>

        <div class="max-w-xl mx-auto">
            <div v-if="conversionData">
                <!-- Full converter component -->
                <component :is="converterComponent" />
            </div>

            <div v-else class="text-center py-8">
                <h2 class="text-xl mb-4">Conversion not available</h2>
                <p class="mb-6">Sorry, we couldn't find a way to convert between these units.</p>
                <NuxtLink to="/converter" class="btn btn-primary"> Browse All Converters </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { unitConvertCategories } from "~/utils/unit";
import { getConverterByCategory } from "~/components/Convert";

// Get the from and to parameters from the route
const route = useRoute();
const fromUnitId = route.params.from;
const toUnitId = route.params.to;

// Find conversion data
const conversionData = computed(() => {
    // Find which category contains both units
    for (const category of unitConvertCategories) {
        const fromUnitExists = category.units.some((unit) => unit.id === fromUnitId);
        const toUnitExists = category.units.some((unit) => unit.id === toUnitId);

        if (fromUnitExists && toUnitExists) {
            return {
                categoryId: category.id,
                fromUnit: category.units.find((unit) => unit.id === fromUnitId),
                toUnit: category.units.find((unit) => unit.id === toUnitId),
            };
        }
    }

    return null;
});

// Get category data
const categoryData = computed(() => {
    if (!conversionData.value) return null;
    return unitConvertCategories.find((cat) => cat.id === conversionData.value.categoryId);
});

// Get fromUnit and toUnit
const fromUnit = computed(() => conversionData.value?.fromUnit || {});
const toUnit = computed(() => conversionData.value?.toUnit || {});

// Get appropriate converter component
const converterComponent = ref(null);

// Construct page title
const pageTitle = computed(() => {
    if (!conversionData.value) return "Unit Converter";
    return `${fromUnit.value.name} to ${toUnit.value.name} Converter`;
});

// Mount the component
onMounted(() => {
    // Initialize the converter component
    if (categoryData.value) {
        converterComponent.value = getConverterByCategory(categoryData.value.id);
    }
});

// Set SEO metadata
useHead(() => {
    if (!conversionData.value) {
        return {
            title: "Unit Converter - Not Found",
            meta: [{ name: "description", content: "Conversion not available. Try our other unit converters." }],
        };
    }

    return {
        title: `${fromUnit.value.name} to ${toUnit.value.name} Converter - Free Online Calculator`,
        meta: [
            {
                name: "description",
                content: `Convert from ${fromUnit.value.name} to ${
                    toUnit.value.name
                } with our free online calculator. Quick, easy, and accurate ${categoryData.value.name.toLowerCase()} conversions.`,
            },
        ],
    };
});
</script>
