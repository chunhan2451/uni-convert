<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-headline mb-8">Search Converters</h1>

        <!-- Search Bar -->
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search converters..."
            class="w-full p-2 border rounded-lg mb-6 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />

        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2 mb-6">
            <button
                v-for="category in categories"
                :key="category"
                @click="toggleCategory(category)"
                :class="[
                    'px-4 py-2 rounded-lg',
                    selectedCategories.includes(category)
                        ? 'bg-primary text-white'
                        : 'bg-background text-body',
                ]"
            >
                {{ category }}
            </button>
        </div>

        <!-- Converter List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink
                v-for="converter in filteredConverters"
                :key="converter.id"
                :to="`/${converter.id}`"
                class="p-6 bg-surface rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
                <h2 class="text-xl font-semibold text-headline">{{ converter.name }}</h2>
                <p class="text-caption mt-2">{{ converter.description }}</p>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { converters, getAllCategories } from "~/utils/converters";

const searchQuery = ref("");
const selectedCategories = ref([]);

const categories = getAllCategories();

const filteredConverters = computed(() => {
    return Object.values(converters).filter((converter) => {
        const matchesSearch = converter.name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase());
        const matchesCategory =
            selectedCategories.value.length === 0 ||
            selectedCategories.value.includes(converter.category);
        return matchesSearch && matchesCategory;
    });
});

const toggleCategory = (category) => {
    if (selectedCategories.value.includes(category)) {
        selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
    } else {
        selectedCategories.value.push(category);
    }
};
</script>
