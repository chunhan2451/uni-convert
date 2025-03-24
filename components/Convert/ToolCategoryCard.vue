<!-- components/Convert/ToolCategoryCard.vue -->
<template>
    <div class="card bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-base-200">
        <div class="card-body p-6">
            <!-- Category header with icon -->
            <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-primary/10 rounded-lg flex"">
                    <Icon :name="category.icon || uiIcons.tools" class="text-primary h-5 w-5 text-2xl" />
                </div>
                <h3 class="text-xl font-medium">{{ category.name }}</h3>
            </div>

            <!-- Category description -->
            <p class="text-base-content/70 text-sm mb-4">{{ category.description }}</p>

            <!-- Tool list -->
            <div class="space-y-2">
                <NuxtLink
                    v-for="tool in category.tools"
                    :key="tool.id"
                    :to="getToolPath(tool.id)"
                    class="flex items-center justify-between px-4 py-3 rounded-lg border border-base-200 hover:border-primary group transition-all hover:bg-primary/5 hover:shadow-lg"
                >
                    <span class="font-medium text-base-content">{{ tool.name }}</span>
                    <div class="flex items-center gap-1 text-primary">
                        <span class="text-sm">Open</span>
                        <Icon
                            :name="uiIcons.arrowRight"
                            class="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
                        />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { uiIcons } from '~/utils/appConstant';

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
});

// Get the correct path based on tool ID
const getToolPath = (toolId) => {
    // Map of special paths for specific tools
    const pathMap = {
        // Text & Data tools
        base64: '/text-to-base64-converter',
        url: '/text-to-url-converter',
        json: '/json-formatter',
        csv: '/csv-to-json-converter',

        // Number system tools
        binary: '/decimal-to-binary-converter',
        roman: '/decimal-to-roman-converter',

        // Time tools
        timestamp: '/timestamp-converter',
        timezone: '/timezone-converter',
        duration: '/duration-converter',

        // Text transformation tools
        case: '/text-case-converter',
        stats: '/text-statistics',
        lines: '/text-line-tools',
    };

    // Return the special path if it exists, otherwise use the default pattern
    return pathMap[toolId] || `/${toolId}-converter`;
};
</script>
