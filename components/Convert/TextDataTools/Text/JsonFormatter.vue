<!-- components/Convert/Text/JsonFormatter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">JSON Formatter</h1>
            <p class="text-zinc-600 mb-6 text-center">Format, validate, and minify JSON data</p>

            <!-- JSON input area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">JSON Input</label>
                    <div class="flex space-x-2">
                        <button @click="clearInput" class="btn btn-xs btn-ghost">Clear</button>
                        <button @click="pasteClipboard" class="btn btn-xs btn-ghost">
                            <Icon :name="uiIcons.clipboard" class="h-4 w-4 mr-1" />
                            Paste
                        </button>
                    </div>
                </div>
                <textarea
                    v-model="jsonInput"
                    class="textarea textarea-bordered w-full min-h-40 font-mono text-sm"
                    placeholder="Paste your JSON here..."
                ></textarea>
                <div v-if="jsonError" class="text-error text-sm mt-1">{{ jsonError }}</div>
            </div>

            <!-- Action buttons -->
            <div class="flex flex-wrap justify-center gap-2 mb-6">
                <button @click="formatJson" class="btn btn-primary">
                    <Icon :name="uiIcons.codeBrackets" class="h-5 w-5 mr-2" />
                    Pretty Format
                </button>
                <button @click="minifyJson" class="btn btn-outline">
                    <Icon :name="uiIcons.codeBraces" class="h-5 w-5 mr-2" />
                    Minify
                </button>
                <button @click="validateJson" class="btn btn-outline">
                    <Icon :name="uiIcons.checkCircle" class="h-5 w-5 mr-2" />
                    Validate
                </button>
            </div>

            <!-- Validation result -->
            <div v-if="validationResult !== null" class="mb-6">
                <div v-if="validationResult.valid" class="alert alert-success">
                    <Icon :name="uiIcons.checkCircle" class="h-5 w-5" />
                    <span>Valid JSON! Your JSON is well-formed.</span>
                </div>
                <div v-else class="alert alert-error">
                    <Icon :name="uiIcons.close" class="h-5 w-5" />
                    <span>Invalid JSON: {{ validationResult.error }}</span>
                </div>
            </div>

            <!-- Formatted output -->
            <div v-if="jsonOutput" class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">Result</label>
                    <button @click="copyToClipboard(jsonOutput)" class="btn btn-xs btn-primary">
                        <Icon :name="uiIcons.copy" class="mr-1" />Copy
                    </button>
                </div>
                <textarea
                    v-model="jsonOutput"
                    class="textarea textarea-bordered w-full min-h-40 font-mono text-sm"
                    readonly
                ></textarea>
            </div>

            <!-- JSON info -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">About JSON</h3>
                <p class="text-zinc-600 mb-3">
                    JSON (JavaScript Object Notation) is a lightweight data interchange format. It is easy for humans to read and
                    write and easy for machines to parse and generate.
                </p>
                <div class="overflow-x-auto mt-4">
                    <table class="table w-full table-sm">
                        <thead>
                            <tr>
                                <th>Operation</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Format</td>
                                <td>Add proper indentation and line breaks for readability</td>
                            </tr>
                            <tr>
                                <td>Minify</td>
                                <td>Remove all whitespace to reduce file size</td>
                            </tr>
                            <tr>
                                <td>Validate</td>
                                <td>Check if your JSON is syntactically valid</td>
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
import { dataConverters } from '~/utils/textDataConverters';
import { useAppState } from '~/composables/states'

const appState = useAppState();

// State
const jsonInput = ref('');
const jsonOutput = ref('');
const jsonError = ref('');
const validationResult = ref(null);

// Format JSON
const formatJson = () => {
    if (!jsonInput.value.trim()) {
        jsonOutput.value = '';
        jsonError.value = '';
        return;
    }

    try {
        const result = dataConverters.formatJSON(jsonInput.value);

        if (result && typeof result === 'object' && result.error) {
            jsonError.value = result.error;
            return;
        }

        jsonOutput.value = result;
        jsonError.value = '';
    } catch (error) {
        jsonError.value = error.message || 'Error formatting JSON';
    }
};

// Minify JSON
const minifyJson = () => {
    if (!jsonInput.value.trim()) {
        jsonOutput.value = '';
        jsonError.value = '';
        return;
    }

    try {
        const result = dataConverters.minifyJSON(jsonInput.value);

        if (result && typeof result === 'object' && result.error) {
            jsonError.value = result.error;
            return;
        }

        jsonOutput.value = result;
        jsonError.value = '';
    } catch (error) {
        jsonError.value = error.message || 'Error minifying JSON';
    }
};

// Validate JSON
const validateJson = () => {
    if (!jsonInput.value.trim()) {
        validationResult.value = null;
        jsonError.value = '';
        return;
    }

    try {
        const result = dataConverters.validateJSON(jsonInput.value);
        validationResult.value = result;
        jsonError.value = '';
    } catch (error) {
        jsonError.value = error.message || 'Error validating JSON';
    }
};

// Clear input
const clearInput = () => {
    jsonInput.value = '';
    jsonOutput.value = '';
    jsonError.value = '';
    validationResult.value = null;
};

// Paste from clipboard
const pasteClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        jsonInput.value = text;
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
