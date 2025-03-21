<!-- components/Convert/BaseTextConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.textBox" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">{{ title }}</h1>
            </div>
            <p v-if="description" class="text-zinc-600 mb-6 text-center">{{ description }}</p>

            <slot name="options"></slot>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex flex-col h-full">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">{{ inputLabel }}</label>
                        <div class="flex space-x-1">
                            <button v-if="showClear" @click="clearInput" class="btn btn-xs btn-ghost">Clear</button>
                            <slot name="input-actions"></slot>
                        </div>
                    </div>
                    <textarea
                        v-model="inputText"
                        :placeholder="inputPlaceholder"
                        class="textarea textarea-bordered flex-grow min-h-40 font-mono text-sm"
                        :class="{ 'border-error': inputError }"
                    ></textarea>
                    <div v-if="inputError" class="text-error text-sm mt-1">{{ inputError }}</div>
                    <slot name="input-footer"></slot>
                </div>

                <div class="flex flex-col h-full">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">{{ outputLabel }}</label>
                        <div class="flex space-x-1">
                            <button v-if="outputText" @click="copyToClipboard(outputText)" class="btn btn-xs btn-primary">
                                <Icon :name="uiIcons.copy" class="mr-1" />Copy
                            </button>
                            <slot name="output-actions"></slot>
                        </div>
                    </div>
                    <textarea
                        v-model="outputText"
                        :placeholder="outputPlaceholder"
                        class="textarea textarea-bordered flex-grow min-h-40 font-mono text-sm"
                        readonly
                    ></textarea>
                    <div v-if="outputInfo" class="text-info text-sm mt-1">{{ outputInfo }}</div>
                    <slot name="output-footer"></slot>
                </div>
            </div>

            <slot name="actions">
                <div class="flex justify-center gap-2 my-4">
                    <button @click="convertText" class="btn btn-primary">
                        {{ convertButtonText }}
                    </button>
                    <slot name="extra-buttons"></slot>
                </div>
            </slot>

            <slot name="additional-content"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states'

const appState = useAppState();

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    inputLabel: {
        type: String,
        default: 'Input',
    },
    outputLabel: {
        type: String,
        default: 'Output',
    },
    inputPlaceholder: {
        type: String,
        default: 'Enter text to convert...',
    },
    outputPlaceholder: {
        type: String,
        default: 'Conversion result will appear here...',
    },
    convertButtonText: {
        type: String,
        default: 'Convert',
    },
    autoConvert: {
        type: Boolean,
        default: false,
    },
    showClear: {
        type: Boolean,
        default: true,
    },
    convertFunction: {
        type: Function,
        required: true,
    },
});

const inputText = ref('');
const outputText = ref('');
const inputError = ref('');
const outputInfo = ref('');

// Function to convert text using the provided function
const convertText = () => {
    inputError.value = '';
    outputInfo.value = '';

    if (!inputText.value.trim()) {
        outputText.value = '';
        return;
    }

    try {
        const result = props.convertFunction(inputText.value);

        // Check if the result has an error property
        if (result && typeof result === 'object' && result.error) {
            inputError.value = result.error;
            return;
        }

        outputText.value = result;
    } catch (error) {
        inputError.value = error.message || 'An error occurred during conversion';
    }
};

// Function to clear input
const clearInput = () => {
    inputText.value = '';
    if (props.autoConvert) {
        outputText.value = '';
        inputError.value = '';
        outputInfo.value = '';
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

// Auto convert feature
watch(inputText, (newValue) => {
    if (props.autoConvert && newValue.trim()) {
        convertText();
    }
});

// Expose functions for parent components
defineExpose({
    convertText,
    clearInput,
    copyToClipboard,
    inputText,
    outputText,
    inputError,
    outputInfo,
});
</script>
