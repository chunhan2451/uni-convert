<!-- components/Convert/ToolCategoryCard.vue -->
<template>
    <div
        class="card bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-primary/20"
    >
        <div class="card-body gap-4">
            <!-- Category title with icon -->
            <div class="flex items-center gap-3">
                <div class="p-2 bg-primary/10 rounded-lg flex">
                    <Icon :name="category.icon || uiIcons.tools" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h3 class="card-title text-xl">{{ category.name }}</h3>
            </div>

            <p class="text-base-content/70">{{ category.description }}</p>

            <div class="space-y-2 mt-2">
                <div
                    v-for="tool in category.tools"
                    :key="tool.id"
                    class="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 group transition-all cursor-pointer"
                    @click="navigateToTool(tool.id)"
                >
                    <div class="flex items-center gap-2">
                        <div class="badge badge-outline badge-sm">{{ tool.id }}</div>
                        <span class="font-medium">{{ tool.name }}</span>
                    </div>
                    <Icon
                        :name="uiIcons.arrowRight"
                        class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-200"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
});

const router = useRouter();

// Navigate to specific tool
const navigateToTool = (toolId) => {
    // Build appropriate URL format based on tool type
    let path;

    switch (toolId) {
        // Text & Data tools
        case 'base64':
            path = '/text-to-base64-converter';
            break;
        case 'url':
            path = '/text-to-url-converter';
            break;
        case 'json':
            path = '/json-formatter';
            break;
        case 'csv':
            path = '/csv-to-json-converter';
            break;

        // Number system tools
        case 'binary':
            path = '/decimal-to-binary-converter';
            break;
        case 'roman':
            path = '/decimal-to-roman-converter';
            break;

        // Time tools
        case 'timestamp':
            path = '/timestamp-converter';
            break;
        case 'timezone':
            path = '/timezone-converter';
            break;
        case 'duration':
            path = '/duration-converter';
            break;

        // Text transformation tools
        case 'case':
            path = '/text-case-converter';
            break;
        case 'stats':
            path = '/text-statistics';
            break;
        case 'lines':
            path = '/text-line-tools';
            break;

        default:
            // Fallback to simpler format
            path = `/${toolId}-converter`;
    }

    router.push(path);
};
</script>
