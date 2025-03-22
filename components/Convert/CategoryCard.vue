<!-- components/Convert/CategoryCard.vue -->
<template>
    <div
        class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-primary/20"
    >
        <div class="card-body gap-4">
            <!-- Category title with icon -->
            <div class="flex items-center gap-3">
                <div class="p-2 bg-primary/10 rounded-lg flex">
                    <Icon :name="getCategoryIcon(category.id)" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h3 class="card-title text-xl">{{ category.name }}</h3>
            </div>

            <div>
                <p class="text-sm text-base-content/70 mb-2">Convert between {{ category?.name.toLowerCase() }} like:</p>
                <div class="flex flex-wrap gap-1.5 mb-4">
                    <span
                        v-for="unit in displayUnits"
                        :key="unit.id"
                        class="badge badge-outline bg-base-100 border-primary/30 text-xs px-2.5 py-1 gap-1"
                    >
                        {{ getShortUnitName(unit.name) }}
                    </span>
                </div>
            </div>

            <div class="card-actions justify-end mt-auto pt-3">
                <NuxtLink
                    v-if="category.id === 'color'"
                    :to="`/hex-to-rgb-converter`"
                    class="btn btn-primary btn-sm w-full group transition-all hover:shadow-md hover:shadow-primary/20"
                >
                    Open Converter
                    <Icon :name="uiIcons.arrowRight" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </NuxtLink>
                <NuxtLink
                    v-else-if="category.units && category.units.length >= 2"
                    :to="`/${category.units[0].id}-to-${category.units[1].id}-converter`"
                    class="btn btn-primary btn-sm w-full group transition-all hover:shadow-md hover:shadow-primary/20"
                >
                    Open Converter
                    <Icon :name="uiIcons.arrowRight" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </NuxtLink>
                <NuxtLink
                    v-else
                    :to="`/${category.id}-converter`"
                    class="btn btn-primary btn-sm w-full group transition-all hover:shadow-md hover:shadow-primary/20"
                >
                    Open Converter
                    <Icon :name="uiIcons.arrowRight" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NuxtLink } from '#components';
import { computed } from 'vue';
import { uiIcons } from '~/utils/appConstant';

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
});

// Display up to 6 units for preview
const displayUnits = computed(() => {
    return props.category.units.slice(0, 6);
});

// Get shortened unit name by removing parentheses content
const getShortUnitName = (name) => {
    // Remove content in parentheses and trim
    return name.replace(/\s*\([^)]*\)\s*/g, '').trim();
};

// Get category icon based on category ID
const getCategoryIcon = (categoryId) => {
    return uiIcons.categoryIcons[categoryId] || uiIcons.categoryIcons.default;
};
</script>
