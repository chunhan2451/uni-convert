<!-- components/Convert/Text/LineTools.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Text Line Tools</h1>
            <p class="text-zinc-600 mb-6 text-center">Sort, filter, and manipulate text lines</p>

            <!-- Tools Selection -->
            <div class="tabs tabs-boxed justify-center mb-6">
                <a
                    v-for="tool in tools"
                    :key="tool.id"
                    class="tab"
                    :class="{ 'tab-active': selectedTool === tool.id }"
                    @click="selectedTool = tool.id"
                >
                    {{ tool.name }}
                </a>
            </div>

            <!-- Input Area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">Text Input</label>
                    <div class="flex space-x-2">
                        <button @click="clearInput" class="btn btn-xs btn-ghost">Clear</button>
                        <button @click="pasteClipboard" class="btn btn-xs btn-ghost">
                            <Icon :name="uiIcons.clipboard" class="h-4 w-4 mr-1" />
                            Paste
                        </button>
                    </div>
                </div>
                <textarea
                    v-model="inputText"
                    class="textarea textarea-bordered w-full min-h-40 font-mono text-sm"
                    placeholder="Enter text with multiple lines..."
                ></textarea>
                <div class="flex justify-between mt-1">
                    <div class="text-xs text-zinc-500">{{ lineCount }} line{{ lineCount !== 1 ? 's' : '' }}</div>
                </div>
            </div>

            <!-- Tool-specific options -->
            <div v-if="selectedTool === 'sort'" class="mb-6 bg-base-200 p-4 rounded-lg">
                <div class="flex flex-wrap items-center gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="sortOptions.reverse" class="checkbox checkbox-sm" />
                        <span>Reverse order</span>
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="sortOptions.ignoreCase" class="checkbox checkbox-sm" />
                        <span>Ignore case</span>
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="sortOptions.numeric" class="checkbox checkbox-sm" />
                        <span>Numeric sort</span>
                    </label>
                </div>
            </div>

            <div v-else-if="selectedTool === 'filter'" class="mb-6 bg-base-200 p-4 rounded-lg">
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Filter method</label>
                        <select v-model="filterOptions.method" class="select select-bordered w-full">
                            <option value="contains">Lines containing text</option>
                            <option value="not-contains">Lines NOT containing text</option>
                            <option value="starts-with">Lines starting with text</option>
                            <option value="ends-with">Lines ending with text</option>
                            <option value="regex">Lines matching regex</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-zinc-700 text-sm font-medium mb-1">
                            {{ filterOptions.method === 'regex' ? 'Regular expression' : 'Filter text' }}
                        </label>
                        <input v-model="filterOptions.pattern" type="text" class="input input-bordered w-full" />
                    </div>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="filterOptions.ignoreCase" class="checkbox checkbox-sm" />
                        <span>Ignore case</span>
                    </label>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center mb-6">
                <button @click="processText" class="btn btn-primary">
                    {{ getActionButtonText() }}
                </button>
            </div>

            <!-- Output Area -->
            <div v-if="outputText || showOutput" class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">Result</label>
                    <div class="flex space-x-2">
                        <div class="text-xs text-zinc-500">{{ outputLineCount }} line{{ outputLineCount !== 1 ? 's' : '' }}</div>
                        <button v-if="outputText" @click="copyToClipboard(outputText)" class="btn btn-xs btn-primary">
                            <Icon :name="uiIcons.copy" class="mr-1" />Copy
                        </button>
                    </div>
                </div>
                <textarea
                    v-model="outputText"
                    class="textarea textarea-bordered w-full min-h-40 font-mono text-sm"
                    placeholder="Result will appear here..."
                    readonly
                ></textarea>
            </div>

            <!-- Tool Descriptions -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">About Line Tools</h3>

                <div class="tabs mb-4">
                    <a
                        v-for="tool in tools"
                        :key="tool.id"
                        class="tab tab-bordered"
                        :class="{ 'tab-active': infoTab === tool.id }"
                        @click="infoTab = tool.id"
                    >
                        {{ tool.name }}
                    </a>
                </div>

                <div v-if="infoTab === 'sort'" class="text-zinc-600">
                    <p>The Sort Lines tool arranges lines alphabetically or numerically. Options include:</p>
                    <ul class="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Reverse order</strong>: Sorts lines in descending order (Z to A)</li>
                        <li><strong>Ignore case</strong>: Sorts without considering uppercase/lowercase differences</li>
                        <li><strong>Numeric sort</strong>: Treats content as numbers if possible</li>
                    </ul>
                </div>

                <div v-if="infoTab === 'filter'" class="text-zinc-600">
                    <p>The Filter Lines tool helps you keep or remove lines based on criteria:</p>
                    <ul class="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Lines containing text</strong>: Keep only lines that include specified text</li>
                        <li><strong>Lines NOT containing text</strong>: Remove lines with specified text</li>
                        <li><strong>Lines starting/ending with text</strong>: Filter by line beginnings or endings</li>
                        <li><strong>Regular expression</strong>: Use powerful pattern matching</li>
                    </ul>
                </div>

                <div v-if="infoTab === 'remove-duplicates'" class="text-zinc-600">
                    <p>
                        The Remove Duplicates tool eliminates repeated lines, keeping only the first occurrence of each unique
                        line. This is useful for cleaning up data, removing redundancies, and preparing lists for further
                        processing.
                    </p>
                </div>

                <div v-if="infoTab === 'add-prefix-suffix'" class="text-zinc-600">
                    <p>
                        The Add Prefix/Suffix tool lets you add text to the beginning or end of each line. This is helpful for
                        creating SQL statements, HTML lists, markdown bullets, or formatting text for specific systems or
                        requirements.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { textConverters } from '~/utils/textDataConverters';
import { useAppState } from '~/composables/states'

const appState = useAppState();

// Available tools
const tools = [
    { id: 'sort', name: 'Sort Lines' },
    { id: 'filter', name: 'Filter Lines' },
    { id: 'remove-duplicates', name: 'Remove Duplicates' },
    { id: 'add-prefix-suffix', name: 'Add Prefix/Suffix' },
];

// State
const selectedTool = ref('sort');
const infoTab = ref('sort');
const inputText = ref('');
const outputText = ref('');
const showOutput = ref(false);

// Sort options
const sortOptions = ref({
    reverse: false,
    ignoreCase: true,
    numeric: false,
});

// Filter options
const filterOptions = ref({
    method: 'contains',
    pattern: '',
    ignoreCase: true,
});

// Prefix/suffix options
const affixOptions = ref({
    prefix: '',
    suffix: '',
});

// Count lines
const lineCount = computed(() => {
    if (!inputText.value.trim()) return 0;
    return inputText.value.split('\n').length;
});

const outputLineCount = computed(() => {
    if (!outputText.value.trim()) return 0;
    return outputText.value.split('\n').length;
});

// Get action button text based on selected tool
const getActionButtonText = () => {
    switch (selectedTool.value) {
        case 'sort':
            return 'Sort Lines';
        case 'filter':
            return 'Filter Lines';
        case 'remove-duplicates':
            return 'Remove Duplicate Lines';
        case 'add-prefix-suffix':
            return 'Add Prefix/Suffix';
        default:
            return 'Process Text';
    }
};

// Process text based on selected tool
const processText = () => {
    if (!inputText.value.trim()) {
        outputText.value = '';
        return;
    }

    showOutput.value = true;

    switch (selectedTool.value) {
        case 'sort':
            sortLines();
            break;
        case 'filter':
            filterLines();
            break;
        case 'remove-duplicates':
            removeDuplicates();
            break;
        case 'add-prefix-suffix':
            addPrefixSuffix();
            break;
    }
};

// Sort lines
const sortLines = () => {
    const lines = inputText.value.split('\n');

    // Create a sorting function
    const getSortFn = () => {
        if (sortOptions.value.numeric) {
            // Numeric sort
            return (a, b) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);

                if (isNaN(numA) && isNaN(numB)) {
                    // If both aren't numbers, sort alphabetically
                    return sortOptions.value.ignoreCase ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b);
                } else if (isNaN(numA)) {
                    return 1; // Non-numbers after numbers
                } else if (isNaN(numB)) {
                    return -1; // Numbers before non-numbers
                } else {
                    return numA - numB; // Numeric sort
                }
            };
        } else {
            // Alphabetic sort
            return sortOptions.value.ignoreCase
                ? (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
                : (a, b) => a.localeCompare(b);
        }
    };

    // Sort the lines
    const sortedLines = lines.sort(getSortFn());

    // Reverse if needed
    if (sortOptions.value.reverse) {
        sortedLines.reverse();
    }

    outputText.value = sortedLines.join('\n');
};

// Filter lines
const filterLines = () => {
    if (!filterOptions.value.pattern.trim()) {
        outputText.value = inputText.value;
        return;
    }

    const lines = inputText.value.split('\n');
    let filteredLines = [];

    const { method, pattern, ignoreCase } = filterOptions.value;

    // Create pattern matching function
    const matches = (line) => {
        const patternToUse = ignoreCase ? pattern.toLowerCase() : pattern;
        const lineToCheck = ignoreCase ? line.toLowerCase() : line;

        switch (method) {
            case 'contains':
                return lineToCheck.includes(patternToUse);
            case 'not-contains':
                return !lineToCheck.includes(patternToUse);
            case 'starts-with':
                return lineToCheck.startsWith(patternToUse);
            case 'ends-with':
                return lineToCheck.endsWith(patternToUse);
            case 'regex':
                try {
                    const flags = ignoreCase ? 'i' : '';
                    const regex = new RegExp(pattern, flags);
                    return regex.test(line);
                } catch (error) {
                    console.error('Invalid regex:', error);
                    return false;
                }
            default:
                return false;
        }
    };

    // Filter the lines
    filteredLines = lines.filter(matches);

    outputText.value = filteredLines.join('\n');
};

// Remove duplicate lines
const removeDuplicates = () => {
    outputText.value = textConverters.removeDuplicateLines(inputText.value);
};

// Add prefix/suffix to each line
const addPrefixSuffix = () => {
    // Show modal or input fields
    // For simplicity, let's add default prefix/suffix for now
    const prefix = prompt('Enter prefix for each line (or leave empty):', '');
    const suffix = prompt('Enter suffix for each line (or leave empty):', '');

    if (prefix === null && suffix === null) {
        return; // User canceled
    }

    const lines = inputText.value.split('\n');
    const processedLines = lines.map((line) => {
        if (!line.trim()) return line; // Keep empty lines as is
        return `${prefix || ''}${line}${suffix || ''}`;
    });

    outputText.value = processedLines.join('\n');
};

// Clear input
const clearInput = () => {
    inputText.value = '';
    outputText.value = '';
    showOutput.value = false;
};

// Paste from clipboard
const pasteClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
    } catch (err) {
        console.error('Failed to read clipboard:', err);
    }
};

// Copy to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        appState.value.showToast = true;
        setTimeout(() => (appState.value.showToast = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Update info tab when tool changes
watch(selectedTool, (newValue) => {
    infoTab.value = newValue;
});
</script>
