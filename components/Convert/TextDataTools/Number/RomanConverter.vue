<!-- components/Convert/Number/RomanConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Roman Numerals Converter</h1>
            <p class="text-zinc-600 mb-6 text-center">Convert between Roman numerals and decimal numbers</p>

            <!-- Mode selection -->
            <div class="tabs tabs-boxed justify-center mb-8">
                <a class="tab" :class="{ 'tab-active': mode === 'decimal-to-roman' }" @click="mode = 'decimal-to-roman'">
                    Decimal to Roman
                </a>
                <a class="tab" :class="{ 'tab-active': mode === 'roman-to-decimal' }" @click="mode = 'roman-to-decimal'">
                    Roman to Decimal
                </a>
            </div>

            <!-- Input Area -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center mb-8">
                <div class="flex-1">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">
                        {{ mode === 'decimal-to-roman' ? 'Decimal Number' : 'Roman Numeral' }}
                    </label>
                    <input
                        v-model="inputValue"
                        type="text"
                        class="input input-bordered w-full text-center text-xl"
                        :class="{ 'border-error': inputError }"
                        :placeholder="
                            mode === 'decimal-to-roman' ? 'Enter a number (1-3999)' : 'Enter roman numeral (e.g., MCMXCIV)'
                        "
                        @input="convertValue"
                    />
                    <div v-if="inputError" class="text-error text-sm mt-1">{{ inputError }}</div>
                </div>

                <div class="flex justify-center items-center">
                    <div class="bg-primary text-primary-content rounded-full p-2">
                        <Icon name="solar:arrow-right-linear" class="h-6 w-6" />
                    </div>
                </div>

                <div class="flex-1">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">
                        {{ mode === 'decimal-to-roman' ? 'Roman Numeral' : 'Decimal Number' }}
                    </label>
                    <input
                        v-model="outputValue"
                        type="text"
                        class="input input-bordered w-full text-center text-xl font-bold"
                        readonly
                        :placeholder="mode === 'decimal-to-roman' ? 'Roman numeral result' : 'Decimal number result'"
                    />
                </div>
            </div>

            <!-- Quick Reference -->
            <div class="flex flex-wrap justify-center gap-4 mb-8">
                <div v-for="num in quickReferenceNumbers" :key="num" class="btn btn-outline" @click="selectQuickReference(num)">
                    {{ num }}
                </div>
            </div>

            <!-- Roman Numeral Info -->
            <div class="mb-6 bg-base-200 rounded-lg p-6">
                <h3 class="text-lg font-medium mb-4">Roman Numeral Reference</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div
                        class="flex justify-between items-center bg-base-100 rounded-md p-3 shadow-sm"
                        v-for="symbol in romanSymbols"
                        :key="symbol.numeral"
                    >
                        <span class="text-xl font-bold">{{ symbol.numeral }}</span>
                        <span class="text-xl">=</span>
                        <span class="text-xl">{{ symbol.value }}</span>
                    </div>
                </div>

                <h3 class="text-lg font-medium mt-6 mb-3">Rules</h3>
                <ul class="list-disc pl-5 space-y-2 text-zinc-600">
                    <li>Roman numerals range from 1 to 3,999 (I to MMMCMXCIX)</li>
                    <li>Numerals are generally written largest to smallest from left to right</li>
                    <li>When a smaller numeral precedes a larger one, it is subtracted (e.g., IV = 4)</li>
                    <li>A numeral cannot be repeated more than three times in a row</li>
                </ul>

                <h3 class="text-lg font-medium mt-6 mb-3">Examples</h3>
                <div class="overflow-x-auto">
                    <table class="table w-full">
                        <thead>
                            <tr>
                                <th>Roman</th>
                                <th>Decimal</th>
                                <th>Explanation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="font-bold">MCMXCIV</td>
                                <td>1994</td>
                                <td>M=1000, CM=900, XC=90, IV=4</td>
                            </tr>
                            <tr>
                                <td class="font-bold">CDXLIV</td>
                                <td>444</td>
                                <td>CD=400, XL=40, IV=4</td>
                            </tr>
                            <tr>
                                <td class="font-bold">MMXXIII</td>
                                <td>2023</td>
                                <td>MM=2000, X=10, X=10, III=3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { numberConverters } from '~/utils/numberConverters';

// State
const mode = ref('decimal-to-roman');
const inputValue = ref('');
const outputValue = ref('');
const inputError = ref('');

// Quick reference numbers
const quickReferenceNumbers = [1, 5, 10, 50, 100, 500, 1000];

// Roman symbols
const romanSymbols = [
    { numeral: 'I', value: 1 },
    { numeral: 'V', value: 5 },
    { numeral: 'X', value: 10 },
    { numeral: 'L', value: 50 },
    { numeral: 'C', value: 100 },
    { numeral: 'D', value: 500 },
    { numeral: 'M', value: 1000 },
];

// Convert the value based on current mode
const convertValue = () => {
    inputError.value = '';
    outputValue.value = '';

    if (!inputValue.value.trim()) {
        return;
    }

    try {
        if (mode.value === 'decimal-to-roman') {
            // Validate input is a number within range
            const num = parseInt(inputValue.value);
            if (isNaN(num)) {
                inputError.value = 'Please enter a valid number';
                return;
            }

            if (num < 1 || num > 3999) {
                inputError.value = 'Number must be between 1 and 3999';
                return;
            }

            const result = numberConverters.decimalToRoman(inputValue.value);

            if (result && typeof result === 'object' && result.error) {
                inputError.value = result.error;
                return;
            }

            outputValue.value = result;
        } else {
            // Validate input is a roman numeral
            if (!/^[IVXLCDM]+$/i.test(inputValue.value)) {
                inputError.value = 'Please enter a valid Roman numeral';
                return;
            }

            const result = numberConverters.romanToDecimal(inputValue.value);

            if (result && typeof result === 'object' && result.error) {
                inputError.value = result.error;
                return;
            }

            outputValue.value = result;
        }
    } catch (error) {
        inputError.value = error.message || 'Error converting value';
    }
};

// Set quick reference number or numeral
const selectQuickReference = (num) => {
    if (mode.value === 'decimal-to-roman') {
        inputValue.value = num.toString();
    } else {
        // Find corresponding roman numeral
        const symbol = romanSymbols.find((s) => s.value === num);
        if (symbol) {
            inputValue.value = symbol.numeral;
        }
    }
    convertValue();
};

// Watch for mode changes
watch(mode, () => {
    // Clear values when switching modes
    inputValue.value = '';
    outputValue.value = '';
    inputError.value = '';
});

// Watch for input changes
watch(inputValue, convertValue);
</script>
