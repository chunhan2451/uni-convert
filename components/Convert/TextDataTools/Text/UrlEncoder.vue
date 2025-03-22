<!-- components/Convert/Text/UrlEncoder.vue -->
<template>
    <div>
        <BaseTextConverter
            title="URL Encoder/Decoder"
            description="Convert plain text to URL encoded format or decode URL encoded text"
            :input-label="mode === 'encode' ? 'Text to Encode' : 'URL to Decode'"
            :output-label="mode === 'encode' ? 'URL Encoded Output' : 'Decoded Text'"
            :convert-button-text="mode === 'encode' ? 'Encode URL' : 'Decode URL'"
            :convert-function="convertFunction"
            ref="converter"
            :auto-convert="true"
        >
            <template #options>
                <div class="tabs tabs-lift justify-center mb-6">
                    <a class="tab" :class="{ 'tab-active': mode === 'encode' }" @click="switchMode('encode')">
                        Encode Text to URL
                    </a>
                    <a class="tab" :class="{ 'tab-active': mode === 'decode' }" @click="switchMode('decode')">
                        Decode URL to Text
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
                    <h3 class="text-lg font-medium mb-2">About URL Encoding</h3>
                    <p class="text-zinc-600 mb-3">
                        URL encoding converts characters that are not allowed in a URL into a format that can be transmitted over
                        the Internet. It replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.
                    </p>
                    <p class="text-zinc-600">Common uses of URL encoding include:</p>
                    <ul class="list-disc pl-6 mt-2 text-zinc-600">
                        <li>Creating valid URLs for web requests</li>
                        <li>Submitting form data in HTTP requests</li>
                        <li>Passing parameters in URLs</li>
                        <li>Handling special characters in REST API calls</li>
                    </ul>
                </div>
            </template>
        </BaseTextConverter>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import BaseTextConverter from '../../BaseTextConverter.vue';
import { dataConverters } from '~/utils/textDataConverters';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

const { updateUrlPath } = useUrlUpdate();

const converter = ref(null);
const mode = ref('encode');

// Computed conversion function that changes based on mode
const convertFunction = computed(() => {
    return mode.value === 'encode' ? dataConverters.encodeURL : dataConverters.decodeURL;
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

    if (newMode === 'encode') {
        updateUrlPath('text', 'url');
    } else {
        updateUrlPath('url', 'text');
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

// Initialize path when component mounts
const initializePath = () => {
    const urlPath = window.location.pathname.split('/').pop();
    if (urlPath === 'text-to-url-converter') {
        switchMode('encode');
    } else {
        switchMode('decode');
    }
};

// Initialize on mount
onMounted(() => {
    initializePath();
});
</script>
