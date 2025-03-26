<!-- components/Convert/Text/CsvConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.textBox" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">CSV ↔ JSON Converter</h1>
            </div>
            <p class="text-zinc-600 mb-6 text-center">Convert between CSV and JSON formats easily</p>

            <!-- Mode selection -->
            <div class="tabs tabs-lift justify-center mb-6">
                <a class="tab" :class="{ 'tab-active': mode === 'csv-to-json' }" @click="switchMode('csv-to-json')">
                    CSV to JSON
                </a>
                <a class="tab" :class="{ 'tab-active': mode === 'json-to-csv' }" @click="switchMode('json-to-csv')">
                    JSON to CSV
                </a>
            </div>

            <!-- CSV to JSON Options -->
            <div v-if="mode === 'csv-to-json'" class="bg-base-200 p-4 rounded-lg mb-6">
                <h3 class="font-medium mb-3">CSV Options</h3>
                <div class="flex flex-wrap gap-4">
                    <label class="flex items-center cursor-pointer gap-2">
                        <input type="checkbox" v-model="csvOptions.hasHeader" class="checkbox checkbox-sm checkbox-primary" />
                        <span>First row is header</span>
                    </label>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Delimiter</span>
                        </label>
                        <select v-model="csvOptions.delimiter" class="select select-sm select-bordered">
                            <option value=",">Comma (,)</option>
                            <option value=";">Semicolon (;)</option>
                            <option value="\t">Tab</option>
                            <option value="|">Pipe (|)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">
                        {{ mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input' }}
                    </label>
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
                    :placeholder="mode === 'csv-to-json' ? 'Paste your CSV here...' : 'Paste your JSON array here...'"
                ></textarea>
                <div v-if="inputError" class="text-error text-sm mt-1">{{ inputError }}</div>
            </div>

            <!-- Convert Button -->
            <div class="flex justify-center mb-6">
                <button @click="convertData" class="btn btn-primary">
                    {{ mode === 'csv-to-json' ? 'Convert CSV to JSON' : 'Convert JSON to CSV' }}
                    <Icon :name="uiIcons.arrowDown" class="h-5 w-5 ml-2" />
                </button>
            </div>

            <!-- Output Area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">
                        {{ mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output' }}
                    </label>
                    <button v-if="outputText" @click="copyToClipboard(outputText)" class="btn btn-xs btn-primary">
                        <Icon :name="uiIcons.copy" class="mr-1" />Copy
                    </button>
                </div>
                <textarea
                    v-model="outputText"
                    class="textarea textarea-bordered w-full min-h-40 text-sm"
                    :placeholder="mode === 'csv-to-json' ? 'JSON output will appear here...' : 'CSV output will appear here...'"
                    readonly
                ></textarea>
            </div>

            <!-- Format Info -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">Format Examples</h3>

                <div class="tabs mb-4">
                    <a class="tab tab-bordered" :class="{ 'tab-active': infoTab === 'csv' }" @click="infoTab = 'csv'">
                        CSV Format
                    </a>
                    <a class="tab tab-bordered" :class="{ 'tab-active': infoTab === 'json' }" @click="infoTab = 'json'">
                        JSON Format
                    </a>
                </div>

                <div v-if="infoTab === 'csv'" class="text-zinc-600">
                    <p class="mb-2">CSV (Comma-Separated Values) typically looks like this:</p>
                    <pre class="bg-base-300 p-2 rounded-md text-xs overflow-x-auto">
name,age,email
  John Doe,28,john@example.com
  Jane Smith,34,jane@example.com</pre
                    >
                    <p class="mt-2">The first row is usually a header with column names.</p>
                </div>

                <div v-if="infoTab === 'json'" class="text-zinc-600">
                    <p class="mb-2">JSON for a data table is typically an array of objects:</p>
                    <pre class="bg-base-300 p-2 rounded-md text-xs overflow-x-auto">
[
    {
      "name": "John Doe",
      "age": 28,
      "email": "john@example.com"
    },
    {
      "name": "Jane Smith",
      "age": 34,
      "email": "jane@example.com"
    }
  ]</pre
                    >
                    <p class="mt-2">Each object represents a row, with properties for each column.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { dataConverters } from '~/utils/textDataConverters';
import { useUrlUpdate } from '~/composables/useUrlUpdate';
import { useAppState } from '~/composables/states';

const appState = useAppState();

const { updateUrlPath } = useUrlUpdate();

// State
const mode = ref('csv-to-json');
const inputText = ref('');
const outputText = ref('');
const inputError = ref('');
const infoTab = ref('csv');

// CSV options
const csvOptions = ref({
    hasHeader: true,
    delimiter: ',',
});

// Convert function
const convertData = () => {
    if (!inputText.value.trim()) {
        outputText.value = '';
        inputError.value = '';
        return;
    }

    inputError.value = '';

    try {
        if (mode.value === 'csv-to-json') {
            const result = dataConverters.csvToJSON(inputText.value, csvOptions.value.delimiter, csvOptions.value.hasHeader);

            if (result && typeof result === 'object' && result.error) {
                inputError.value = result.error;
                return;
            }

            // Pretty print the JSON
            outputText.value = JSON.stringify(result, null, 2);
        } else {
            // JSON to CSV
            const result = dataConverters.jsonToCSV(inputText.value, csvOptions.value.delimiter);

            if (result && typeof result === 'object' && result.error) {
                inputError.value = result.error;
                return;
            }

            outputText.value = result;
        }
    } catch (error) {
        inputError.value = error.message || 'Error converting data';
    }
};

// Switch between encode and decode modes
const switchMode = (newMode) => {
    if (mode.value === newMode) return;

    mode.value = newMode;

    if (newMode === 'csv-to-json') {
        updateUrlPath('csv', 'json');
    } else {
        updateUrlPath('json', 'csv');
    }
};

// Clear input
const clearInput = () => {
    inputText.value = '';
    outputText.value = '';
    inputError.value = '';
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

// Initialize path when component mounts
const initializePath = () => {
    const urlPath = window.location.pathname.split('/').pop();
    if (urlPath === 'json-to-csv-converter') {
        mode.value = 'json-to-csv';
    } else {
        mode.value = 'csv-to-json';
    }
};

// Initialize on mount
onMounted(() => {
    initializePath();
});
</script>
