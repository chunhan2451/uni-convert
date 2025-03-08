<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6 text-center">Find Your Converter</h1>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto mb-8">
            <div class="join w-full">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search for converters..."
                    class="input input-bordered join-item flex-1"
                    @input="filterConverters"
                />
                <button class="btn join-item">
                    <Icon name="solar:magnifier-linear" class="h-5 w-5" />
                </button>
            </div>
        </div>

        <!-- Category Filters -->
        <div class="max-w-4xl mx-auto mb-8 flex flex-wrap justify-center gap-2">
            <button
                class="btn btn-sm"
                :class="selectedCategory === '' ? 'btn-primary' : 'btn-outline'"
                @click="selectedCategory = ''"
            >
                All
            </button>
            <button
                v-for="category in categories"
                :key="category.id"
                class="btn btn-sm"
                :class="selectedCategory === category.id ? 'btn-primary' : 'btn-outline'"
                @click="selectedCategory = category.id"
            >
                {{ category.name }}
            </button>
        </div>

        <!-- Search Results -->
        <div class="max-w-4xl mx-auto">
            <div v-if="filteredConverters.length === 0" class="text-center py-12">
                <Icon name="solar:file-search-broken" class="h-12 w-12 mx-auto mb-4 text-zinc-400" />
                <h2 class="text-lg font-medium mb-2">No converters found</h2>
                <p class="text-zinc-500">Try a different search term or browse by category</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="converter in filteredConverters"
                    :key="converter.id"
                    class="card card-compact bg-base-100 shadow-sm hover:shadow transition-shadow duration-200"
                >
                    <div class="card-body">
                        <h2 class="card-title text-lg">{{ converter.name }}</h2>
                        <p class="text-sm text-zinc-500">{{ converter.description }}</p>
                        <div class="card-actions justify-end mt-2">
                            <NuxtLink :to="converter.path" class="btn btn-sm btn-primary">
                                Open
                                <Icon name="solar:arrow-right-linear" class="h-4 w-4 ml-1" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
// import { useStorage } from "@vueuse/core";

// State
const searchQuery = ref("");
const selectedCategory = ref("");

// Categories - these match your main converter categories
const categories = [
    { id: "units", name: "Units", icon: "solar:ruler-linear" },
    { id: "color", name: "Colors", icon: "solar:palette-linear" },
    { id: "data", name: "Data", icon: "solar:database-linear" },
    { id: "text", name: "Text", icon: "solar:text-linear" },
    { id: "number", name: "Numbers", icon: "solar:calculator-linear" },
    { id: "datetime", name: "Date & Time", icon: "solar:calendar-linear" },
    { id: "programming", name: "Programming", icon: "solar:code-linear" },
];

// All converters - this would be imported from a data store in a real app
const allConverters = [
    // Unit converters
    {
        id: "px-to-rem",
        name: "Pixels to REM",
        description: "Convert pixel values to REM units for responsive web design",
        category: "units",
        categoryName: "Units",
        path: "/converter/px-to-rem",
        tags: ["css", "web design", "responsive"],
    },
    {
        id: "kg-to-lb",
        name: "Kilograms to Pounds",
        description: "Convert weight from metric to imperial units",
        category: "units",
        categoryName: "Units",
        path: "/converter/kg-to-lb",
        tags: ["weight", "mass", "imperial", "metric"],
    },
    {
        id: "m-to-ft",
        name: "Meters to Feet",
        description: "Convert length from metric to imperial units",
        category: "units",
        categoryName: "Units",
        path: "/converter/m-to-ft",
        tags: ["length", "distance", "imperial", "metric"],
    },

    // Color converters
    {
        id: "hex-to-rgb",
        name: "HEX to RGB",
        description: "Convert hexadecimal color codes to RGB values",
        category: "color",
        categoryName: "Colors",
        path: "/converter/hex-to-rgb",
        tags: ["color", "web design", "css"],
    },
    {
        id: "rgb-to-hsl",
        name: "RGB to HSL",
        description: "Convert RGB colors to HSL (Hue, Saturation, Lightness)",
        category: "color",
        categoryName: "Colors",
        path: "/converter/rgb-to-hsl",
        tags: ["color", "design", "css"],
    },

    // Data converters
    {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "Format and validate JSON data",
        category: "data",
        categoryName: "Data",
        path: "/converter/json-formatter",
        tags: ["programming", "development", "web"],
    },
    {
        id: "base64",
        name: "Base64 Encoder/Decoder",
        description: "Convert text to and from Base64 encoding",
        category: "data",
        categoryName: "Data",
        path: "/converter/base64",
        tags: ["encoding", "web", "programming"],
    },

    // Add more converter entries for each category
    // Text converters, Number converters, Date & Time converters, etc.
];

// Filtered converters based on search and category
const filteredConverters = computed(() => {
    let results = allConverters;

    // Filter by category if selected
    if (selectedCategory.value) {
        results = results.filter((converter) => converter.category === selectedCategory.value);
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        results = results.filter(
            (converter) =>
                converter.name.toLowerCase().includes(query) ||
                converter.description.toLowerCase().includes(query) ||
                converter.tags.some((tag) => tag.toLowerCase().includes(query))
        );
    }

    return results;
});
</script>
