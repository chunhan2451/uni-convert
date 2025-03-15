<!-- pages/converter/index.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-b from-base-100 to-base-200/50">
        <div class="container mx-auto px-4 py-10">
            <!-- Hero section -->
            <div class="text-center mb-12 max-w-3xl mx-auto">
                <h1 class="text-4xl font-bold mb-3 text-base-content">Universal Converter</h1>
                <p class="text-xl text-base-content/70">Transform units, text, data, and more with powerful conversion tools</p>
            </div>

            <!-- Search Input -->
            <div class="max-w-xl mx-auto mb-10 relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-base-content/50 z-1" />
                </div>
                <input
                    v-model="searchQuery"
                    type="text"
                    class="input input-bordered w-full pl-11 pr-4 py-6 shadow-md focus:shadow-lg transition-shadow duration-300 focus:border-primary"
                    placeholder="Search for converters..."
                />
                <button v-if="searchQuery" @click="searchQuery = ''" class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Icon name="heroicons:x-mark" class="h-5 w-5 text-base-content/50 hover:text-error" />
                </button>
            </div>

            <!-- Categories Section -->
            <div v-if="filteredUnitCategories.length > 0 || filteredToolCategories.length > 0" class="mb-16">
                <!-- Unit conversion categories -->
                <div v-if="filteredUnitCategories.length > 0" class="mb-12">
                    <div class="mb-6 flex items-center">
                        <h2 class="text-2xl font-bold">Unit Converters</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CategoryCard v-for="category in filteredUnitCategories" :key="category.id" :category="category" />
                    </div>
                </div>

                <!-- Tools categories -->
                <div v-if="filteredToolCategories.length > 0" class="mt-16">
                    <div class="mb-6 flex items-center">
                        <h2 class="text-2xl font-bold">Text & Data Tools</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ToolCategoryCard v-for="category in filteredToolCategories" :key="category.id" :category="category" />
                    </div>
                </div>
            </div>

            <!-- No Results Message -->
            <div v-else class="text-center py-20 bg-base-200/50 rounded-xl shadow-inner border border-base-300">
                <Icon name="heroicons:magnifying-glass" class="h-16 w-16 text-base-content/20 mx-auto mb-4" />
                <p class="text-xl text-base-content/60 mb-2">No converters found matching</p>
                <p class="text-2xl font-semibold mb-6">"{{ searchQuery }}"</p>
                <button @click="searchQuery = ''" class="btn btn-primary mt-2">
                    <Icon name="heroicons:arrow-path" class="h-5 w-5 mr-2" />
                    Reset Search
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { unitConvertCategories, additionalConverterCategories } from '~/utils/unit';
import { CategoryCard } from '~/components/Convert';
import ToolCategoryCard from '~/components/Convert/ToolCategoryCard.vue';

// Search functionality
const searchQuery = ref('');

// Filter categories based on search query
const filteredUnitCategories = computed(() => {
    if (!searchQuery.value.trim()) {
        return unitConvertCategories;
    }

    const query = searchQuery.value.toLowerCase().trim();

    return unitConvertCategories.filter((category) => {
        // Check category name
        if (category.name.toLowerCase().includes(query)) {
            return true;
        }

        // Check unit names
        return category.units && category.units.some((unit) => unit.name.toLowerCase().includes(query));
    });
});

// Filter tool categories based on search query
const filteredToolCategories = computed(() => {
    if (!searchQuery.value.trim()) {
        return additionalConverterCategories;
    }

    const query = searchQuery.value.toLowerCase().trim();

    return additionalConverterCategories.filter((category) => {
        // Check category name or description
        if (category.name.toLowerCase().includes(query) || category.description.toLowerCase().includes(query)) {
            return true;
        }

        // Check tool names
        return (
            category.tools &&
            category.tools.some(
                (tool) => tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query)
            )
        );
    });
});

// Define metadata for SEO
useHead({
    title: 'Universal Converter - Transform Units, Text & Data',
    meta: [
        {
            name: 'description',
            content:
                'Convert between different units of measurement, encode/decode data, transform text formats, and more with our comprehensive suite of conversion tools.',
        },
    ],
});
</script>
