<!-- components/Convert/Text/Base64Converter.vue -->
<template>
    <div>
        <BaseTextConverter
            title="Base64 Encoder/Decoder"
            description="Convert plain text to Base64 or decode Base64 back to text"
            :input-label="mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'"
            :output-label="mode === 'encode' ? 'Base64 Output' : 'Decoded Text'"
            :convert-button-text="mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'"
            :convert-function="convertFunction"
            ref="converter"
            :auto-convert="true"
        >
            <template #options>
                <div class="tabs tabs-boxed justify-center mb-6">
                    <a class="tab" :class="{ 'tab-active': mode === 'encode' }" @click="switchMode('encode')">
                        Encode Text to Base64
                    </a>
                    <a class="tab" :class="{ 'tab-active': mode === 'decode' }" @click="switchMode('decode')">
                        Decode Base64 to Text
                    </a>
                </div>
            </template>

            <template #input-actions>
                <button v-if="mode === 'encode'" @click="pasteClipboard" class="btn btn-xs btn-ghost">
                    <Icon :name="uiIcons.clipboard" class="h-4 w-4" />
                    Paste
                </button>
            </template>

            <template #additional-content>
                <div class="mt-8 bg-base-200 rounded-lg p-4">
                    <h3 class="text-lg font-medium mb-2">About Base64 Encoding</h3>
                    <p class="text-zinc-600 mb-3">
                        Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's
                        commonly used when there's a need to encode binary data that needs to be stored and transferred over media
                        that are designed to deal with text.
                    </p>
                    <p class="text-zinc-600">Common uses of Base64 encoding include:</p>
                    <ul class="list-disc pl-6 mt-2 text-zinc-600">
                        <li>Email attachments (MIME format)</li>
                        <li>Data URLs in web development</li>
                        <li>Storing complex data in XML or JSON</li>
                        <li>Basic authentication headers in HTTP</li>
                    </ul>
                </div>
            </template>
        </BaseTextConverter>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseTextConverter from '../../BaseTextConverter.vue';
import { dataConverters } from '~/utils/textDataConverters';

const converter = ref(null);
const mode = ref('encode');

// Computed conversion function that changes based on mode
const convertFunction = computed(() => {
    return mode.value === 'encode' ? dataConverters.textToBase64 : dataConverters.base64ToText;
});

// Switch between encode and decode modes
const switchMode = (newMode) => {
    if (mode.value === newMode) return;

    mode.value = newMode;

    // Clear input/output when switching modes
    if (converter.value) {
        converter.value.inputText = '';
        converter.value.outputText = '';
        converter.value.inputError = '';
    }
};

// Paste from clipboard
const pasteClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (converter.value) {
            converter.value.inputText = text;
        }
    } catch (err) {
        console.error('Failed to read clipboard:', err);
    }
};
</script>
