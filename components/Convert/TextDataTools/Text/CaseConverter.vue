<!-- components/Convert/Text/CaseConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.textVariant" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">Text Case Converter</h1>
            </div>
            <p class="text-zinc-600 mb-6 text-center">Convert text between different letter cases</p>

            <!-- Input Area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">Input Text</label>
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
                    class="textarea textarea-bordered w-full min-h-40 text-sm"
                    placeholder="Enter text to convert..."
                ></textarea>
            </div>

            <!-- Conversion buttons -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                <button
                    v-for="caseOption in caseOptions"
                    :key="caseOption.id"
                    @click="convertCase(caseOption.id)"
                    class="btn btn-outline hover:btn-primary"
                    :class="{ 'btn-primary': activeCase === caseOption.id }"
                >
                    {{ caseOption.name }}
                </button>
            </div>

            <!-- Output Area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">Result</label>
                    <button v-if="outputText" @click="copyToClipboard(outputText)" class="btn btn-xs btn-primary">
                        <Icon :name="uiIcons.copy" class="mr-1" />Copy
                    </button>
                </div>
                <textarea
                    v-model="outputText"
                    class="textarea textarea-bordered w-full min-h-40 text-sm"
                    placeholder="Converted text will appear here..."
                    readonly
                ></textarea>
            </div>

            <!-- Case examples -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">Case Types Examples</h3>
                <div class="overflow-x-auto">
                    <table class="table w-full">
                        <thead>
                            <tr>
                                <th>Case Type</th>
                                <th>Example</th>
                                <th>Common Usage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>lowercase</td>
                                <td>the quick brown fox</td>
                                <td>General text, documentation</td>
                            </tr>
                            <tr>
                                <td>UPPERCASE</td>
                                <td>THE QUICK BROWN FOX</td>
                                <td>Emphasis, headings, constants</td>
                            </tr>
                            <tr>
                                <td>Title Case</td>
                                <td>The Quick Brown Fox</td>
                                <td>Titles, headings, names</td>
                            </tr>
                            <tr>
                                <td>camelCase</td>
                                <td>theQuickBrownFox</td>
                                <td>JavaScript variables, functions</td>
                            </tr>
                            <tr>
                                <td>PascalCase</td>
                                <td>TheQuickBrownFox</td>
                                <td>Classes, React components</td>
                            </tr>
                            <tr>
                                <td>snake_case</td>
                                <td>the_quick_brown_fox</td>
                                <td>Python variables, SQL</td>
                            </tr>
                            <tr>
                                <td>kebab-case</td>
                                <td>the-quick-brown-fox</td>
                                <td>URLs, CSS classes, HTML attributes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { textConverters } from '~/utils/textDataConverters';
import { useAppState } from '~/composables/states'

const appState = useAppState();

// State
const inputText = ref('');
const outputText = ref('');
const activeCase = ref('');

// Case conversion options
const caseOptions = [
    { id: 'lower', name: 'lowercase', function: textConverters.toLowerCase },
    { id: 'upper', name: 'UPPERCASE', function: textConverters.toUpperCase },
    { id: 'title', name: 'Title Case', function: textConverters.toTitleCase },
    { id: 'camel', name: 'camelCase', function: textConverters.toCamelCase },
    { id: 'pascal', name: 'PascalCase', function: textConverters.toPascalCase },
    { id: 'snake', name: 'snake_case', function: textConverters.toSnakeCase },
    { id: 'kebab', name: 'kebab-case', function: textConverters.toKebabCase },
];

// Convert text to selected case
const convertCase = (caseId) => {
    if (!inputText.value.trim()) {
        outputText.value = '';
        return;
    }

    const caseOption = caseOptions.find((option) => option.id === caseId);

    if (caseOption) {
        outputText.value = caseOption.function(inputText.value);
        activeCase.value = caseId;
    }
};

// Clear input
const clearInput = () => {
    inputText.value = '';
    outputText.value = '';
    activeCase.value = '';
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
</script>
