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
                <div v-if="dynamicComponent">
                    <component :is="dynamicComponent" />
                </div>
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
import { ref, computed, onMounted, watch, shallowRef } from 'vue';
import { unitConvertCategories } from '~/utils/unit';
import { getConverterByCategory } from '~/components/Convert';

// Get the from and to parameters from the route
const route = useRoute();
const fromUnitId = route.params.from;
const toUnitId = route.params.to;

// Use shallowRef for the component to prevent reactivity issues
const dynamicComponent = shallowRef(null);

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

// Construct page title
const pageTitle = computed(() => {
    if (!conversionData.value) return 'Unit Converter';
    return `${fromUnit.value.name} to ${toUnit.value.name} Converter`;
});

// Function to update page state when units change
function updatePageForNewUnits() {
    // Find conversion data for the new units
    for (const category of unitConvertCategories) {
        const fromUnitExists = category.units.some((unit) => unit.id === fromUnitId);
        const toUnitExists = category.units.some((unit) => unit.id === toUnitId);

        if (fromUnitExists && toUnitExists) {
            // Update the conversion data
            conversionData.value = {
                categoryId: category.id,
                fromUnit: category.units.find((unit) => unit.id === fromUnitId),
                toUnit: category.units.find((unit) => unit.id === toUnitId),
            };

            // Update the converter component
            if (categoryData.value) {
                loadDynamicComponent();
            }

            break;
        }
    }
}

// Load the converter component
function loadDynamicComponent() {
    if (!categoryData.value) return;

    // Get the component and explicitly mark it as not reactive
    const component = getConverterByCategory(categoryData.value.id);

    // Update the shallowRef
    dynamicComponent.value = component;
}

// Watch for route changes to handle direct navigation or back/forward browser buttons
watch(
    () => route.path,
    (newPath) => {
        const match = newPath.match(/\/([^-]+)-to-([^-]+)-converter/);
        if (match && match.length === 3) {
            fromUnitId = match[1];
            toUnitId = match[2];
            updatePageForNewUnits();
        }
    }
);

// Mount the component
onMounted(() => {
    // Load dynamic component
    loadDynamicComponent();
});

// Set SEO metadata
useHead(() => {
    if (!conversionData.value) {
        return {
            title: 'Unit Converter - Not Found',
            meta: [{ name: 'description', content: 'Conversion not available. Try our other unit converters.' }],
        };
    }

    return {
        title: `${fromUnit.value.name} to ${toUnit.value.name} Converter - Free Online Calculator`,
        meta: [
            {
                name: 'description',
                content: `Convert from ${fromUnit.value.name} to ${
                    toUnit.value.name
                } with our free online calculator. Quick, easy, and accurate ${categoryData.value.name.toLowerCase()} conversions.`,
            },
        ],
    };
});
</script>
