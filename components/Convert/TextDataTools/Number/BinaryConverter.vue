<!-- components/Convert/Number/BinaryConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.numeric" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">Number System Converter</h1>
            </div>
            <p class="text-zinc-600 mb-6 text-center">Convert between decimal, binary, octal, and hexadecimal</p>

            <!-- From section -->
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-medium mb-2">From</label>
                <div class="flex">
                    <input
                        v-model="inputValue"
                        :placeholder="getInputPlaceholder(fromBase)"
                        class="input input-bordered rounded-r-none w-full font-mono"
                        :class="{ 'border-error': inputError }"
                        @input="onInputChange"
                    />
                    <select
                        v-model="fromBase"
                        class="select select-bordered rounded-l-none border-l-0 min-w-36"
                        @change="onFromBaseChange"
                    >
                        <option v-for="base in numberBases.filter((item) => item.id != toBase)" :key="base.id" :value="base.id">
                            {{ base.name }}
                        </option>
                    </select>
                </div>
                <div v-if="inputError" class="text-error text-sm mt-1">{{ inputError }}</div>
            </div>

            <!-- Swap button -->
            <div class="flex justify-center mb-6">
                <button @click="swapBases" class="btn btn-circle btn-outline">
                    <Icon :name="uiIcons.transfer" class="text-xl" />
                </button>
            </div>

            <!-- To section -->
            <div class="mb-8">
                <label class="block text-zinc-700 text-sm font-medium mb-2">To</label>
                <div class="flex">
                    <input
                        :value="currentResult"
                        :placeholder="getOutputPlaceholder(toBase)"
                        class="input input-bordered rounded-r-none w-full font-mono"
                        readonly
                    />
                    <select
                        v-model="toBase"
                        class="select select-bordered rounded-l-none border-l-0 min-w-36"
                        @change="onToBaseChange"
                    >
                        <option v-for="base in numberBases.filter((item) => item.id != fromBase)" :key="base.id" :value="base.id">
                            {{ base.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Copy Button -->
            <button v-show="currentResult && toBase" @click="copyToClipboard(currentResult)" class="btn btn-primary w-full mb-6">
                <Icon :name="uiIcons.copy" class="mr-2" />Copy Result
            </button>

            <!-- Additional info -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">About Number Systems</h3>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Base</th>
                                <th>Description</th>
                                <th>Digits</th>
                                <th>Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Binary</td>
                                <td>Base-2 number system</td>
                                <td>0, 1</td>
                                <td class="font-mono">1101 = 13₁₀</td>
                            </tr>
                            <tr>
                                <td>Octal</td>
                                <td>Base-8 number system</td>
                                <td>0-7</td>
                                <td class="font-mono">15 = 13₁₀</td>
                            </tr>
                            <tr>
                                <td>Decimal</td>
                                <td>Base-10 number system</td>
                                <td>0-9</td>
                                <td class="font-mono">13 = 13₁₀</td>
                            </tr>
                            <tr>
                                <td>Hexadecimal</td>
                                <td>Base-16 number system</td>
                                <td>0-9, A-F</td>
                                <td class="font-mono">D = 13₁₀</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { numberConverters } from '~/utils/numberConverters';
import { useAppState } from '~/composables/states';
import { uiIcons } from '~/utils/appConstant';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

const appState = useAppState();
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();

// Available number bases
const numberBases = [
    { id: 'binary', name: 'Binary', regex: /^[01]+$/ },
    { id: 'octal', name: 'Octal', regex: /^[0-7]+$/ },
    { id: 'decimal', name: 'Decimal', regex: /^[0-9]+$/ },
    { id: 'hexadecimal', name: 'Hexadecimal', regex: /^[0-9A-Fa-f]+$/ },
];

// State
const fromBase = ref('decimal');
const toBase = ref('binary');
const inputValue = ref('');
const inputError = ref('');
const results = reactive({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
});

// Get initial units from URL
onMounted(() => {
    const urlUnits = getUnitsFromUrl();
    if (urlUnits) {
        fromBase.value = urlUnits.fromUnit;
        toBase.value = urlUnits.toUnit;
    } else {
        // If no units in URL, set the default URL
        updateUrlPath(fromBase.value, toBase.value);
    }
});

// Computed property for the current result based on toBase
const currentResult = computed(() => {
    return results[toBase.value] || '';
});

// Get placeholder text based on base
const getInputPlaceholder = (base) => {
    switch (base) {
        case 'binary':
            return 'Enter binary number (e.g., 1010)';
        case 'octal':
            return 'Enter octal number (e.g., 12)';
        case 'decimal':
            return 'Enter decimal number (e.g., 10)';
        case 'hexadecimal':
            return 'Enter hexadecimal number (e.g., A)';
        default:
            return 'Enter value';
    }
};

// Get output placeholder
const getOutputPlaceholder = (base) => {
    return `${base.charAt(0).toUpperCase() + base.slice(1)} result will appear here`;
};

// Swap from and to bases
const swapBases = () => {
    // Store current values
    const temp = fromBase.value;
    fromBase.value = toBase.value;
    toBase.value = temp;

    // If we have a result already, set it as the new input
    if (results[temp]) {
        inputValue.value = results[temp];
    } else {
        inputValue.value = '';
    }

    // Update URL and reconvert with new bases
    updateUrlPath(fromBase.value, toBase.value);
    convertNumber();
};

// Convert number based on selected bases
const convertNumber = () => {
    inputError.value = '';

    if (!inputValue.value.trim()) {
        // Clear results if input is empty
        Object.keys(results).forEach((key) => {
            results[key] = '';
        });
        return;
    }

    // Validate input format for the selected base
    const baseObj = numberBases.find((b) => b.id === fromBase.value);
    if (baseObj && !baseObj.regex.test(inputValue.value)) {
        inputError.value = `Invalid ${baseObj.name.toLowerCase()} number format`;
        return;
    }

    try {
        let decimalValue;

        // First convert to decimal as intermediate step
        switch (fromBase.value) {
            case 'binary':
                decimalValue = numberConverters.binaryToDecimal(inputValue.value);
                break;
            case 'octal':
                decimalValue = numberConverters.octalToDecimal(inputValue.value);
                break;
            case 'decimal':
                decimalValue = parseInt(inputValue.value, 10);
                break;
            case 'hexadecimal':
                decimalValue = numberConverters.hexToDecimal(inputValue.value);
                break;
        }

        // Check for error in conversion to decimal
        if (decimalValue && typeof decimalValue === 'object' && decimalValue.error) {
            inputError.value = decimalValue.error;
            return;
        }

        // Then convert from decimal to all other bases
        results.binary = fromBase.value === 'binary' ? inputValue.value : numberConverters.decimalToBinary(decimalValue);
        results.octal = fromBase.value === 'octal' ? inputValue.value : numberConverters.decimalToOctal(decimalValue);
        results.decimal = fromBase.value === 'decimal' ? inputValue.value : decimalValue.toString();
        results.hexadecimal = fromBase.value === 'hexadecimal' ? inputValue.value : numberConverters.decimalToHex(decimalValue);
    } catch (error) {
        inputError.value = error.message || 'An error occurred during conversion';
    }
};

// Handle input changes
const onInputChange = () => {
    convertNumber();
};

// Clear input and results
const clearInput = () => {
    inputValue.value = '';
    inputError.value = '';
    Object.keys(results).forEach((key) => {
        results[key] = '';
    });
};

// Copy result to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        appState.value.showToast = true;
        setTimeout(() => (appState.value.showToast = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Handler for fromBase change
const onFromBaseChange = () => {
    if (inputValue.value) {
        convertNumber();
    }
    updateUrlPath(fromBase.value, toBase.value);
};

// Handler for toBase change
const onToBaseChange = () => {
    if (inputValue.value) {
        convertNumber();
    }
    updateUrlPath(fromBase.value, toBase.value);
};

// Watch for changes in from/to base (as a backup)
watch([fromBase, toBase], () => {
    if (inputValue.value) {
        convertNumber();
    }
});
</script>
