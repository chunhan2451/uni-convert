<!-- pages/converter/[category].vue -->
<template>
    <div>
        <!-- Breadcrumbs navigation -->
        <div class="container mx-auto px-4 py-3">
            <div class="text-sm breadcrumbs">
                <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/converter">Converters</NuxtLink></li>
                    <li v-if="categoryData">{{ categoryData.name }}</li>
                    <li v-else>Not Found</li>
                </ul>
            </div>
        </div>

        <div v-if="categoryData">
            <!-- Render the appropriate converter component based on category -->
            <component :is="converterComponent" />
        </div>

        <div v-else class="container mx-auto p-8 text-center">
            <h1 class="text-3xl font-bold mb-4">Converter Not Found</h1>
            <p class="mb-6">Sorry, we couldn't find the converter you're looking for.</p>
            <NuxtLink to="/converter" class="btn btn-primary"> Browse All Converters </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from "vue";
import { unitConvertCategories } from "~/utils/unit";
import { getConverterByCategory } from "~/components/Convert";

// Get the category parameter from the route
const route = useRoute();
const categoryId = route.params.category;

// Find the category data
const categoryData = computed(() => unitConvertCategories.find((cat) => cat.id === categoryId));

// Get the appropriate converter component
const converterComponent = computed(() => {
    return getConverterByCategory(categoryId);
});

// Set SEO metadata
useHead(() => {
    if (!categoryData.value) {
        return {
            title: "Converter Not Found",
        };
    }

    return {
        title: `${categoryData.value.name} Converter - Convert ${categoryData.value.name} Units`,
        meta: [
            {
                name: "description",
                content: `Convert between different ${categoryData.value.name.toLowerCase()} units of measurement like ${categoryData.value.units
                    .slice(0, 3)
                    .map((u) => u.name)
                    .join(", ")} and more.`,
            },
        ],
    };
});
</script>
