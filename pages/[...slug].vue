<!-- pages/[...slug].vue -->
<template>
    <div>
        <!-- Breadcrumbs navigation -->
        <div class="container mx-auto px-4 py-3">
            <div class="text-sm breadcrumbs">
                <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/converter">Converters</NuxtLink></li>
                    <!-- <li v-if="toolCategory && !isFromToPattern">{{ toolCategory }}</li>
                    <li v-if="categoryData && isFromToPattern">{{ categoryData.name }}</li> -->
                    <li>{{ pageTitle }}</li>
                </ul>
            </div>
        </div>

        <div v-if="isLoading" class="container mx-auto p-4 justify-items-center">
            <Skeleton />
        </div>

        <!-- From-To Unit Converter -->
        <div v-else-if="isFromToPattern && conversionData" class="container mx-auto p-4">
            <div class="max-w-xl mx-auto">
                <div v-if="dynamicComponent">
                    <component :is="dynamicComponent" />
                </div>
            </div>
        </div>

        <!-- Tool Converter -->
        <div v-else-if="dynamicComponent && !isFromToPattern">
            <component :is="dynamicComponent" />
        </div>

        <!-- Not Found State -->
        <div v-else class="container mx-auto p-8 text-center">
            <h1 class="text-3xl font-bold mb-4">Tool Not Found</h1>
            <p class="mb-6">Sorry, we couldn't find the converter or tool you're looking for.</p>
            <NuxtLink to="/converter" class="btn btn-primary"> Browse All Tools </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { onMounted, shallowRef, ref, computed, watch } from 'vue';
import Skeleton from '~/components/Skeleton.vue';
import { getConverterByCategory } from '~/components/Convert';
import { unitConvertCategories, additionalConverterCategories } from '~/utils/unit';

const isLoading = ref(true);

// Get the slug parameter from the route
const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug;

// Use shallowRef for component to avoid reactivity warnings
const dynamicComponent = shallowRef(null);
const toolCategory = ref(null);

// Check if this is a from-to pattern converter
const isFromToPattern = computed(() => {
    const pattern = /^([^-]+)-to-([^-]+)-converter$/;
    return pattern.test(slug);
});

// Extract from and to parameters for unit converters
const fromUnitId = computed(() => {
    if (!isFromToPattern.value) return null;
    const match = slug.match(/^([^-]+)-to-([^-]+)-converter$/);
    return match ? match[1] : null;
});

const toUnitId = computed(() => {
    if (!isFromToPattern.value) return null;
    const match = slug.match(/^([^-]+)-to-([^-]+)-converter$/);
    return match ? match[2] : null;
});

// Find conversion data for from-to patterns
const conversionData = computed(() => {
    if (!isFromToPattern.value || !fromUnitId.value || !toUnitId.value) return null;

    // Check for special tools that use the from-to pattern but aren't unit converters
    const specialTools = handleSpecialFromToPatterns();
    if (specialTools) return specialTools;

    // Find which category contains both units
    for (const category of unitConvertCategories) {
        const fromUnitExists = category.units && category.units.some((unit) => unit.id === fromUnitId.value);
        const toUnitExists = category.units && category.units.some((unit) => unit.id === toUnitId.value);

        if (fromUnitExists && toUnitExists) {
            return {
                categoryId: category.id,
                fromUnit: category.units.find((unit) => unit.id === fromUnitId.value),
                toUnit: category.units.find((unit) => unit.id === toUnitId.value),
            };
        }
    }

    return null;
});

// Get category data for unit converters
const categoryData = computed(() => {
    if (!conversionData.value) return null;
    return unitConvertCategories.find((cat) => cat.id === conversionData.value.categoryId);
});

// Handle special from-to patterns that aren't unit converters
function handleSpecialFromToPatterns() {
    const from = fromUnitId.value;
    const to = toUnitId.value;

    // Map specific conversion patterns
    if ((from === 'text' && to === 'base64') || (from === 'base64' && to === 'text')) {
        toolCategory.value = 'Text & Data';
        return { toolId: 'base64' };
    } else if ((from === 'text' && to === 'url') || (from === 'url' && to === 'text')) {
        toolCategory.value = 'Text & Data';
        return { toolId: 'url' };
    } else if ((from === 'csv' && to === 'json') || (from === 'json' && to === 'csv')) {
        toolCategory.value = 'Text & Data';
        return { toolId: 'csv' };
    } else if (
        // Starting with decimal-binary pairs
        (from === 'decimal' && to === 'binary') ||
        (from === 'binary' && to === 'decimal') ||
        // Additional combinations with decimal
        (from === 'decimal' && to === 'octal') ||
        (from === 'decimal' && to === 'hexadecimal') ||
        // Additional combinations with binary
        (from === 'binary' && to === 'octal') ||
        (from === 'binary' && to === 'hexadecimal') ||
        // Additional combinations with octal
        (from === 'octal' && to === 'decimal') ||
        (from === 'octal' && to === 'binary') ||
        (from === 'octal' && to === 'hexadecimal') ||
        // Additional combinations with hexadecimal
        (from === 'hexadecimal' && to === 'decimal') ||
        (from === 'hexadecimal' && to === 'binary') ||
        (from === 'hexadecimal' && to === 'octal')
    ) {
        toolCategory.value = 'Number Systems';
        return { toolId: 'binary' };
    } else if ((from === 'decimal' && to === 'roman') || (from === 'roman' && to === 'decimal')) {
        toolCategory.value = 'Number Systems';
        return { toolId: 'roman' };
    }

    return null;
}

// Computed page title for breadcrumbs
const pageTitle = computed(() => {
    // For unit converters with from-to pattern
    if (isFromToPattern.value && conversionData.value) {
        if (conversionData.value.fromUnit && conversionData.value.toUnit) {
            return `${conversionData.value.fromUnit.name} to ${conversionData.value.toUnit.name} Converter`;
        } else if (conversionData.value.toolId) {
            // For special tool patterns like text-to-base64
            const from = fromUnitId.value.toUpperCase();
            const to = toUnitId.value.toUpperCase();
            return `${from} to ${to} Converter`;
        }
    }

    // For other tool patterns
    const lastPart = slug;

    // Handle different formats
    if (lastPart.includes('-converter') && !isFromToPattern.value) {
        return (
            lastPart
                .replace('-converter', '')
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ') + ' Converter'
        );
    } else if (lastPart.includes('-formatter')) {
        return (
            lastPart
                .replace('-formatter', '')
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ') + ' Formatter'
        );
    } else if (lastPart.startsWith('text-')) {
        return (
            'Text ' +
            lastPart
                .replace('text-', '')
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        );
    }

    return lastPart
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});

// Find the tool component based on the URL path
const resolveToolToComponent = () => {
    // For from-to patterns
    if (isFromToPattern.value) {
        if (conversionData.value) {
            if (conversionData.value.toolId) {
                // Handle special tool patterns
                return conversionData.value.toolId;
            } else if (conversionData.value.categoryId) {
                // Handle unit converter patterns
                return conversionData.value.categoryId;
            }
        }
        return null;
    }

    // Common patterns to check
    const isFormatter = slug.endsWith('-formatter');
    const isConverter = slug.endsWith('-converter');
    const isTextTool = slug.startsWith('text-');

    // Extract the core part of the slug
    let toolId;

    if (isConverter) {
        // Handle simple converter pattern like "tool-converter"
        toolId = slug.replace('-converter', '');

        // case converter
        if (toolId === 'text-case') {
            toolId = 'case';
        }

        // Set category based on tool ID
        if (['timestamp', 'timezone', 'duration'].includes(toolId)) {
            toolCategory.value = 'Time & Date';
        } else if (['binary', 'roman'].includes(toolId)) {
            toolCategory.value = 'Number Systems';
        }
    } else if (isFormatter) {
        // Handle formatter pattern like "json-formatter"
        toolId = slug.replace('-formatter', '');
        toolCategory.value = 'Text & Data';
    } else if (isTextTool) {
        // Handle text tools pattern like "text-statistics"
        const textToolId = slug.replace('text-', '');

        // Map text tools to their component IDs
        if (textToolId === 'statistics') {
            toolId = 'stats';
        } else if (textToolId === 'case-converter') {
            toolId = 'case';
        } else if (textToolId === 'line-tools') {
            toolId = 'lines';
        }

        toolCategory.value = 'Text Transformation';
    } else {
        // Fallback - just use the slug as the tool ID
        toolId = slug;
    }

    return toolId;
};

// Set metadata for SEO
useHead(() => {
    // For unit converters with from-to pattern
    if (isFromToPattern.value && conversionData.value) {
        if (conversionData.value.fromUnit && conversionData.value.toUnit) {
            return {
                title: `${conversionData.value.fromUnit.name} to ${conversionData.value.toUnit.name} Converter - Free Online Calculator`,
                meta: [
                    {
                        name: 'description',
                        content: `Convert from ${conversionData.value.fromUnit.name} to ${
                            conversionData.value.toUnit.name
                        } with our free online calculator. Quick, easy, and accurate ${categoryData.value.name.toLowerCase()} conversions.`,
                    },
                ],
            };
        }
    }

    // For other tools
    const title = pageTitle.value;

    return {
        title: `${title} - Free Online Tool`,
        meta: [
            {
                name: 'description',
                content: `Free online ${title.toLowerCase()}. Convert, format, and transform your data easily with our web-based tool.`,
            },
        ],
    };
});

// Watch for route changes
watch(
    () => route.path,
    (newPath) => {
        const newSlug = newPath.substring(1); // Remove the leading '/'

        // Re-evaluate everything based on the new path
        if (newSlug !== slug) {
            onMounted(() => {
                const componentId = resolveToolToComponent();
                if (componentId) {
                    dynamicComponent.value = getConverterByCategory(componentId);
                }
            });
        }
    }
);

// Load the appropriate component
onMounted(() => {
    const componentId = resolveToolToComponent();
    if (componentId) {
        dynamicComponent.value = getConverterByCategory(componentId);
    }

    isLoading.value = false;
});
</script>
