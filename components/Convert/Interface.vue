<template>
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">{{ converterTitle }}</h1>

            <!-- Number Base Converter -->
            <div :class="converterType === 'base'">
                <div class="mb-6">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Input Number</label>
                    <div class="join w-full">
                        <input
                            v-model="baseInput.value"
                            type="text"
                            class="input join-item flex-1 bg-white"
                            placeholder="Enter number"
                            @input="convertBase"
                        />
                        <select v-model="baseInput.format" class="select join-item bg-white w-2/5" @change="convertBase">
                            <option value="decimal">Decimal</option>
                            <option value="binary">Binary</option>
                            <option value="octal">Octal</option>
                            <option value="hex">Hexadecimal</option>
                            <option value="roman">Roman Numeral</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 mb-6">
                    <div v-if="baseInput.format !== 'decimal'" class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Decimal:</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="baseResults.decimal" />
                            <button @click="copyToClipboard(baseResults.decimal)" class="btn btn-sm btn-square ml-2">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div v-if="baseInput.format !== 'binary'" class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Binary:</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="baseResults.binary" />
                            <button @click="copyToClipboard(baseResults.binary)" class="btn btn-sm btn-square ml-2">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div v-if="baseInput.format !== 'octal'" class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Octal:</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="baseResults.octal" />
                            <button @click="copyToClipboard(baseResults.octal)" class="btn btn-sm btn-square ml-2">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div v-if="baseInput.format !== 'hex'" class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Hexadecimal:</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="baseResults.hex" />
                            <button @click="copyToClipboard(baseResults.hex)" class="btn btn-sm btn-square ml-2">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div v-if="baseInput.format !== 'roman'" class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Roman Numeral:</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="baseResults.roman" />
                            <button @click="copyToClipboard(baseResults.roman)" class="btn btn-sm btn-square ml-2">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Base64 Converter -->
            <div :class="converterType === 'base64'">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Text</label>
                    <textarea
                        v-model="base64Input.text"
                        class="textarea w-full bg-white h-32"
                        placeholder="Enter text to encode"
                        @input="convertBase64"
                    ></textarea>
                </div>

                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Base64</label>
                    <textarea
                        v-model="base64Input.base64"
                        class="textarea w-full bg-white h-32"
                        placeholder="Enter Base64 to decode"
                        @input="convertBase64FromBase64"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <button @click="encodeBase64" class="btn btn-primary">
                        <Icon name="solar:arrow-down-linear" class="mr-2" />Encode
                    </button>
                    <button @click="decodeBase64" class="btn btn-secondary">
                        <Icon name="solar:arrow-up-linear" class="mr-2" />Decode
                    </button>
                </div>
            </div>

            <!-- URL Encoder/Decoder -->
            <div :class="converterType === 'url'">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Text</label>
                    <textarea
                        v-model="urlInput.text"
                        class="textarea w-full bg-white h-32"
                        placeholder="Enter text to encode"
                        @input="convertURL"
                    ></textarea>
                </div>

                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">URL Encoded</label>
                    <textarea
                        v-model="urlInput.encoded"
                        class="textarea w-full bg-white h-32"
                        placeholder="Enter URL encoded text to decode"
                        @input="convertURLFromEncoded"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <button @click="encodeURL" class="btn btn-primary">
                        <Icon name="solar:arrow-down-linear" class="mr-2" />Encode
                    </button>
                    <button @click="decodeURL" class="btn btn-secondary">
                        <Icon name="solar:arrow-up-linear" class="mr-2" />Decode
                    </button>
                </div>
            </div>

            <!-- JSON Formatter -->
            <div :class="converterType === 'json'">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">JSON Input</label>
                    <textarea
                        v-model="jsonInput"
                        class="textarea w-full bg-white h-40"
                        placeholder="Enter JSON to format or validate"
                    ></textarea>
                </div>

                <div class="grid grid-cols-3 gap-2 mb-4">
                    <button @click="formatJSON" class="btn btn-primary btn-sm">
                        <Icon name="solar:document-linear" class="mr-1" />Format
                    </button>
                    <button @click="minifyJSON" class="btn btn-secondary btn-sm">
                        <Icon name="solar:minimize-square-linear" class="mr-1" />Minify
                    </button>
                    <button @click="validateJSON" class="btn btn-accent btn-sm">
                        <Icon name="solar:check-circle-linear" class="mr-1" />Validate
                    </button>
                </div>

                <div v-if="jsonResult" class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Output</label>
                    <div v-if="typeof jsonResult === 'string'">
                        <textarea
                            v-model="jsonResult"
                            class="textarea w-full bg-white h-40"
                            readonly
                        ></textarea>
                        <button @click="copyToClipboard(jsonResult)" class="btn btn-outline w-full mt-2">
                            <Icon name="solar:copy-linear" class="mr-2" />Copy
                        </button>
                    </div>
                    <div v-else class="alert" :class="jsonResult.valid ? 'alert-success' : 'alert-error'">
                        <div>
                            <Icon :name="jsonResult.valid ? 'solar:check-circle-bold' : 'solar:close-circle-bold'" class="h-6 w-6" />
                            <span>{{ jsonResult.valid ? 'JSON is valid!' : 'Invalid JSON: ' + jsonResult.error }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CSV to JSON Converter -->
            <div :class="converterType === 'csv'">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Input</label>
                    <textarea
                        v-model="csvInput.data"
                        class="textarea w-full bg-white h-40"
                        :placeholder="csvInput.mode === 'csvToJson' ? 'Enter CSV data' : 'Enter JSON array'"
                    ></textarea>
                </div>

                <div class="mb-4 flex justify-center">
                    <div class="btn-group">
                        <button 
                            @click="csvInput.mode = 'csvToJson'"
                            class="btn btn-sm"
                            :class="csvInput.mode === 'csvToJson' ? 'btn-active' : ''"
                        >
                            CSV to JSON
                        </button>
                        <button 
                            @click="csvInput.mode = 'jsonToCsv'"
                            class="btn btn-sm"
                            :class="csvInput.mode === 'jsonToCsv' ? 'btn-active' : ''"
                        >
                            JSON to CSV
                        </button>
                    </div>
                </div>

                <div v-if="csvInput.mode === 'csvToJson'" class="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-zinc-700 text-sm font-medium mb-2">Delimiter</label>
                        <select v-model="csvInput.delimiter" class="select w-full bg-white">
                            <option value=",">Comma (,)</option>
                            <option value=";">Semicolon (;)</option>
                            <option value="\t">Tab</option>
                            <option value="|">Pipe (|)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-sm font-medium mb-2">First row is header</label>
                        <input type="checkbox" v-model="csvInput.header" class="toggle" checked />
                    </div>
                </div>

                                <button @click="convertCSV" class="btn btn-primary w-full mb-4">
                    <Icon name="solar:refresh-linear" class="mr-2" />Convert
                </button>

                <div v-if="csvResult" class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Output</label>
                    <textarea
                        v-model="csvResult"
                        class="textarea w-full bg-white h-40"
                        readonly
                    ></textarea>
                    <button @click="copyToClipboard(csvResult)" class="btn btn-outline w-full mt-2">
                        <Icon name="solar:copy-linear" class="mr-2" />Copy
                    </button>
                </div>
            </div>

            <!-- Timestamp Converter -->
            <div :class="converterType === 'timestamp'">
                <div class="mb-6">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Unix Timestamp</label>
                    <div class="join w-full">
                        <input
                            v-model="timestampInput.timestamp"
                            type="text"
                            class="input join-item flex-1 bg-white"
                            placeholder="Enter Unix timestamp"
                        />
                        <button @click="convertTimestamp" class="btn join-item">Convert</button>
                    </div>
                </div>

                <div v-if="timestampInput.formattedDate" class="mb-6 p-4 bg-zinc-50 rounded-lg">
                    <h3 class="font-medium mb-2">Date & Time</h3>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-zinc-700 text-xs mb-1">Local Date & Time</label>
                            <div class="flex">
                                <input type="text" class="input input-sm flex-1 bg-white" readonly :value="timestampInput.formattedDate.local" />
                                <button @click="copyToClipboard(timestampInput.formattedDate.local)" class="btn btn-sm btn-square ml-1">
                                    <Icon name="solar:copy-linear" class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-zinc-700 text-xs mb-1">ISO Format</label>
                            <div class="flex">
                                <input type="text" class="input input-sm flex-1 bg-white" readonly :value="timestampInput.formattedDate.iso" />
                                <button @click="copyToClipboard(timestampInput.formattedDate.iso)" class="btn btn-sm btn-square ml-1">
                                    <Icon name="solar:copy-linear" class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="divider">OR</div>

                <div class="mb-6">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Date & Time</label>
                    <input
                        v-model="timestampInput.date"
                        type="datetime-local"
                        class="input w-full bg-white"
                    />
                    <button @click="convertDate" class="btn btn-primary w-full mt-2">Get Timestamp</button>
                </div>

                <div v-if="timestampInput.convertedTimestamp" class="mb-6 p-4 bg-zinc-50 rounded-lg">
                    <h3 class="font-medium mb-2">Unix Timestamp</h3>
                    <div class="flex">
                        <input type="text" class="input input-sm flex-1 bg-white" readonly :value="timestampInput.convertedTimestamp" />
                        <button @click="copyToClipboard(timestampInput.convertedTimestamp)" class="btn btn-sm btn-square ml-2">
                            <Icon name="solar:copy-linear" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Text Case Converter -->
            <div :class="converterType === 'case'">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Input Text</label>
                    <textarea
                        v-model="caseInput.text"
                        class="textarea w-full bg-white h-32"
                        placeholder="Enter text to convert"
                        @input="convertCase"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">lowercase</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.lower" />
                            <button @click="copyToClipboard(caseResults.lower)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">UPPERCASE</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.upper" />
                            <button @click="copyToClipboard(caseResults.upper)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">Title Case</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.title" />
                            <button @click="copyToClipboard(caseResults.title)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">camelCase</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.camel" />
                            <button @click="copyToClipboard(caseResults.camel)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">PascalCase</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.pascal" />
                            <button @click="copyToClipboard(caseResults.pascal)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">snake_case</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.snake" />
                            <button @click="copyToClipboard(caseResults.snake)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="p-3 bg-zinc-50 rounded-lg">
                        <label class="block text-zinc-700 text-sm font-medium mb-1">kebab-case</label>
                        <div class="flex">
                            <input type="text" class="input input-sm flex-1 bg-white" readonly :value="caseResults.kebab" />
                            <button @click="copyToClipboard(caseResults.kebab)" class="btn btn-sm btn-square ml-1">
                                <Icon name="solar:copy-linear" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Text Statistics -->
            <div :class="converterType === 'text-stats'">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Input Text</label>
                    <textarea
                        v-model="statsInput.text"
                        class="textarea w-full bg-white h-40"
                        placeholder="Enter text to analyze"
                        @input="analyzeText"
                    ></textarea>
                </div>

                <div v-if="statsInput.stats" class="mb-6 p-4 bg-zinc-100 rounded-xl shadow-sm">
                    <h3 class="font-medium mb-3 text-zinc-900">Text Statistics</h3>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-zinc-700 text-sm mb-1">Characters (with spaces)</label>
                            <input
                                :value="statsInput.stats.characters"
                                type="text"
                                class="input input-sm w-full bg-white"
                                readonly
                            />
                        </div>
                        <div>
                            <label class="block text-zinc-700 text-sm mb-1">Characters (no spaces)</label>
                            <input
                                :value="statsInput.stats.charactersNoSpaces"
                                type="text"
                                class="input input-sm w-full bg-white"
                                readonly
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label class="block text-zinc-700 text-sm mb-1">Words</label>
                            <input
                                :value="statsInput.stats.words"
                                type="text"
                                class="input input-sm w-full bg-white"
                                readonly
                            />
                        </div>
                        <div>
                            <label class="block text-zinc-700 text-sm mb-1">Lines</label>
                            <input
                                :value="statsInput.stats.lines"
                                type="text"
                                class="input input-sm w-full bg-white"
                                readonly
                            />
                        </div>
                    </div>

                    <div class="mt-2">
                        <label class="block text-zinc-700 text-sm mb-1">Reading Time</label>
                        <input
                            :value="statsInput.stats.readingTimeMinutes + ' minute(s)'"
                            type="text"
                            class="input input-sm w-full bg-white"
                            readonly
                        />
                    </div>
                </div>
            </div>

            <!-- Toast Notification -->
            <div v-if="showToast" class="toast toast-end toast-bottom">
                <div class="alert alert-success">
                    <span>Copied to clipboard!</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { dataConverters, numberConverters, timeConverters, textConverters } from '~/utils/advanced-converters';

// Props
const props = defineProps({
    converterType: {
        type: String,
        // required: true,
        validator: (value) => ['base', 'base64', 'url', 'json', 'csv', 'timestamp', 'case', 'text-stats'].includes(value),
        default: 'text-stats'
    }
});

// Toast state
const showToast = ref(false);

// Computed properties for titles
const converterTitle = computed(() => {
    switch (props.converterType) {
        case 'base': return 'Number Base Converter';
        case 'base64': return 'Base64 Encoder/Decoder';
        case 'url': return 'URL Encoder/Decoder';
        case 'json': return 'JSON Formatter & Validator';
        case 'csv': return 'CSV ↔ JSON Converter';
        case 'timestamp': return 'Timestamp Converter';
        case 'case': return 'Text Case Converter';
        case 'text-stats': return 'Text Statistics';
        default: return 'Converter';
    }
});

// Number Base Converter
const baseInput = ref({
    value: '',
    format: 'decimal'
});

const baseResults = ref({
    decimal: '',
    binary: '',
    octal: '',
    hex: '',
    roman: ''
});

const convertBase = () => {
    try {
        if (!baseInput.value.value) {
            baseResults.value = {
                decimal: '',
                binary: '',
                octal: '',
                hex: '',
                roman: ''
            };
            return;
        }

        let decimal;

        // Convert from selected format to decimal
        switch (baseInput.value.format) {
            case 'decimal':
                decimal = baseInput.value.value;
                break;
            case 'binary':
                decimal = numberConverters.binaryToDecimal(baseInput.value.value);
                break;
            case 'octal':
                decimal = numberConverters.octalToDecimal(baseInput.value.value);
                break;
            case 'hex':
                decimal = numberConverters.hexToDecimal(baseInput.value.value);
                break;
            case 'roman':
                decimal = numberConverters.romanToDecimal(baseInput.value.value);
                break;
        }

        // Handle errors
        if (decimal && decimal.error) {
            baseResults.value = {
                decimal: decimal.error,
                binary: '',
                octal: '',
                hex: '',
                roman: ''
            };
            return;
        }

        // Convert decimal to all formats
        baseResults.value = {
            decimal: decimal,
            binary: numberConverters.decimalToBinary(decimal),
            octal: numberConverters.decimalToOctal(decimal),
            hex: numberConverters.decimalToHex(decimal),
            roman: numberConverters.decimalToRoman(decimal)
        };
    } catch (error) {
        console.error('Conversion error:', error);
    }
};

// Base64 Converter
const base64Input = ref({
    text: '',
    base64: ''
});

const convertBase64 = () => {
    if (!base64Input.value.text) {
        base64Input.value.base64 = '';
        return;
    }
    base64Input.value.base64 = dataConverters.textToBase64(base64Input.value.text);
};

const convertBase64FromBase64 = () => {
    if (!base64Input.value.base64) {
        base64Input.value.text = '';
        return;
    }
    const result = dataConverters.base64ToText(base64Input.value.base64);
    if (result && result.error) {
        // Handle error
        return;
    }
    base64Input.value.text = result;
};

const encodeBase64 = () => {
    convertBase64();
};

const decodeBase64 = () => {
    convertBase64FromBase64();
};

// URL Encoder/Decoder
const urlInput = ref({
    text: '',
    encoded: ''
});

const convertURL = () => {
    if (!urlInput.value.text) {
        urlInput.value.encoded = '';
        return;
    }
    urlInput.value.encoded = dataConverters.encodeURL(urlInput.value.text);
};

const convertURLFromEncoded = () => {
    if (!urlInput.value.encoded) {
        urlInput.value.text = '';
        return;
    }
    const result = dataConverters.decodeURL(urlInput.value.encoded);
    if (result && result.error) {
        // Handle error
        return;
    }
    urlInput.value.text = result;
};

const encodeURL = () => {
    convertURL();
};

const decodeURL = () => {
    convertURLFromEncoded();
};

// JSON Formatter
const jsonInput = ref('');
const jsonResult = ref('');

const formatJSON = () => {
    if (!jsonInput.value) {
        jsonResult.value = '';
        return;
    }
    jsonResult.value = dataConverters.formatJSON(jsonInput.value);
};

const minifyJSON = () => {
    if (!jsonInput.value) {
        jsonResult.value = '';
        return;
    }
    jsonResult.value = dataConverters.minifyJSON(jsonInput.value);
};

const validateJSON = () => {
    if (!jsonInput.value) {
        jsonResult.value = '';
        return;
    }
    jsonResult.value = dataConverters.validateJSON(jsonInput.value);
};

// CSV Converter
const csvInput = ref({
    data: '',
    mode: 'csvToJson',
    delimiter: ',',
    header: true
});

const csvResult = ref('');

const convertCSV = () => {
    if (!csvInput.value.data) {
        csvResult.value = '';
        return;
    }

    if (csvInput.value.mode === 'csvToJson') {
        const result = dataConverters.csvToJSON(
            csvInput.value.data, 
            csvInput.value.delimiter, 
            csvInput.value.header
        );
        
        if (result && result.error) {
            csvResult.value = `Error: ${result.error}`;
            return;
        }
        
        csvResult.value = JSON.stringify(result, null, 2);
    } else {
        // JSON to CSV
        const result = dataConverters.jsonToCSV(
            csvInput.value.data, 
            csvInput.value.delimiter
        );
        
        if (result && result.error) {
            csvResult.value = `Error: ${result.error}`;
            return;
        }
        
        csvResult.value = result;
    }
};

// Timestamp Converter
const timestampInput = ref({
    timestamp: '',
    date: '',
    formattedDate: null,
    convertedTimestamp: null
});

const convertTimestamp = () => {
    if (!timestampInput.value.timestamp) {
        timestampInput.value.formattedDate = null;
        return;
    }

    const iso = timeConverters.timestampToDate(timestampInput.value.timestamp, 'iso');
    const local = timeConverters.timestampToDate(timestampInput.value.timestamp, 'local');
    
    if (iso && iso.error) {
        // Handle error
        return;
    }

    timestampInput.value.formattedDate = {
        iso,
        local
    };
};

const convertDate = () => {
    if (!timestampInput.value.date) {
        timestampInput.value.convertedTimestamp = null;
        return;
    }

    const timestamp = timeConverters.dateToTimestamp(timestampInput.value.date);
    
    if (timestamp && timestamp.error) {
        // Handle error
        return;
    }

    timestampInput.value.convertedTimestamp = timestamp;
};

// Text Case Converter
const caseInput = ref({
    text: ''
});

const caseResults = ref({
    lower: '',
    upper: '',
    title: '',
    camel: '',
    pascal: '',
    snake: '',
    kebab: ''
});

const convertCase = () => {
    if (!caseInput.value.text) {
        caseResults.value = {
            lower: '',
            upper: '',
            title: '',
            camel: '',
            pascal: '',
            snake: '',
            kebab: ''
        };
        return;
    }

    caseResults.value = {
        lower: textConverters.toLowerCase(caseInput.value.text),
        upper: textConverters.toUpperCase(caseInput.value.text),
        title: textConverters.toTitleCase(caseInput.value.text),
        camel: textConverters.toCamelCase(caseInput.value.text),
        pascal: textConverters.toPascalCase(caseInput.value.text),
        snake: textConverters.toSnakeCase(caseInput.value.text),
        kebab: textConverters.toKebabCase(caseInput.value.text)
    };
};

// Text Statistics
const statsInput = ref({
    text: '',
    stats: null
});

const analyzeText = () => {
    if (!statsInput.value.text) {
        statsInput.value.stats = null;
        return;
    }

    statsInput.value.stats = textConverters.getTextStats(statsInput.value.text);
};

// Copy to clipboard functionality
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000); // Hide toast after 2 seconds
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};
</script>