<!-- pages/converter/index.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="text-center mb-8 max-w-3xl mx-auto">
            <h1 class="text-4xl font-bold mb-3">Universal Unit Converter</h1>
            <p class="text-xl text-zinc-600">Transform any measurement with precision and ease</p>
        </div>

        <!-- Search Input -->
        <div class="max-w-xl mx-auto mb-10">
            <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name="solar:magnifer-linear" class="h-5 w-5 text-zinc-400 z-1" />
                </div>
                <input
                    v-model="searchQuery"
                    type="text"
                    class="input bg-white pl-10 w-full shadow-sm"
                    placeholder="Search for converters..."
                />
            </div>
        </div>

        <!-- Grid of Converter Categories -->
        <div v-if="filteredCategories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard v-for="category in filteredCategories" :key="category.id" :category="category" />
        </div>

        <!-- No Results Message -->
        <div v-else class="text-center py-16 bg-zinc-50 rounded-lg">
            <Icon name="solar:magnifier-broken" class="h-16 w-16 text-zinc-300 mx-auto mb-4" />
            <p class="text-xl text-zinc-500">No converters found matching "{{ searchQuery }}"</p>
            <button @click="searchQuery = ''" class="btn btn-outline mt-6">Clear Search</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { unitConvertCategories } from '~/utils/unit';
import { CategoryCard } from '~/components/Convert';

// Define metadata for SEO
useHead({
    title: 'Universal Unit Converter - Convert Any Measurement',
    meta: [
        {
            name: 'description',
            content:
                'Convert between different units of measurement including length, weight, temperature, time, volume, color formats and more.',
        },
    ],
});

// Search functionality
const searchQuery = ref('');

// Filter categories based on search query
const filteredCategories = computed(() => {
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
        return category.units.some((unit) => unit.name.toLowerCase().includes(query));
    });
});
</script>
