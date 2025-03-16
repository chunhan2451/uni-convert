<!-- components/Convert/Number/BinaryConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Number System Converter</h1>
            <p class="text-zinc-600 mb-6 text-center">Convert between decimal, binary, octal, and hexadecimal</p>

            <!-- Number base selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                    <label class="block text-zinc-700 text-sm font-medium mb-2">From Base</label>
                    <select v-model="fromBase" class="select select-bordered w-full" @change="convertNumber">
                        <option v-for="base in numberBases" :key="base.id" :value="base.id">
                            {{ base.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-zinc-700 text-sm font-medium mb-2">To Base</label>
                    <select v-model="toBase" class="select select-bordered w-full" @change="convertNumber">
                        <option v-for="base in numberBases" :key="base.id" :value="base.id">
                            {{ base.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- From input -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">
                        {{ getInputLabel(fromBase) }}
                    </label>
                    <div>
                        <button @click="clearInput" class="btn btn-xs btn-ghost">Clear</button>
                    </div>
                </div>
                <div class="flex">
                    <div class="flex-grow">
                        <input
                            v-model="inputValue"
                            :placeholder="getInputPlaceholder(fromBase)"
                            class="input input-bordered w-full font-mono"
                            :class="{ 'border-error': inputError }"
                            @input="onInputChange"
                        />
                        <div v-if="inputError" class="text-error text-sm mt-1">{{ inputError }}</div>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div class="space-y-4">
                <div v-for="base in numberBases.filter((b) => b.id !== fromBase)" :key="base.id">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">
                            {{ base.name }}
                        </label>
                        <button v-if="results[base.id]" @click="copyToClipboard(results[base.id])" class="btn btn-xs btn-primary">
                            <Icon :name="uiIcons.copy" class="mr-1" />Copy
                        </button>
                    </div>
                    <input
                        :value="results[base.id]"
                        :placeholder="getOutputPlaceholder(base.id)"
                        class="input input-bordered w-full font-mono"
                        readonly
                    />
                </div>
            </div>

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

        <!-- Toast Notification -->
        <div v-if="showToast" class="toast toast-end toast-middle">
            <div class="alert alert-success">
                <span>Copied to clipboard!</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { numberConverters } from '~/utils/numberConverters';

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
const showToast = ref(false);

// Get input label based on selected base
const getInputLabel = (base) => {
    const baseObj = numberBases.find((b) => b.id === base);
    return `${baseObj ? baseObj.name : 'Input'} Value`;
};

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
                decimalValue = inputValue.value;
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
        // Skip the original base
        if (fromBase.value !== 'binary') {
            results.binary = numberConverters.decimalToBinary(decimalValue);
        }

        if (fromBase.value !== 'octal') {
            results.octal = numberConverters.decimalToOctal(decimalValue);
        }

        if (fromBase.value !== 'decimal') {
            results.decimal = decimalValue;
        }

        if (fromBase.value !== 'hexadecimal') {
            results.hexadecimal = numberConverters.decimalToHex(decimalValue);
        }
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
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Watch for changes in from/to base
watch([fromBase, toBase], () => {
    if (inputValue.value) {
        convertNumber();
    }
});
</script>
