// pages/color-converter.vue
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto">
            <!-- Narrower max-width for single column -->
            <h1 class="text-4xl font-bold mb-4 text-center">Color Converter</h1>
            <p class="text-gray-600 mb-8 text-center text-lg">
                Convert between HEX, RGB, HSL, and CMYK formats instantly
            </p>

            <!-- Color Preview -->
            <div class="mb-8">
                <div
                    class="w-full h-32 rounded-2xl shadow-lg transition-colors duration-200"
                    :style="{ backgroundColor: previewColor }"
                ></div>
            </div>

            <!-- Color Inputs -->
            <div class="space-y-8">
                <!-- HEX Input -->
                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">HEX</h2>
                    <div class="flex gap-2">
                        <input
                            v-model="hex"
                            type="text"
                            class="flex-1 p-3 border rounded-lg text-lg"
                            placeholder="#000000"
                            @input="updateFromHex"
                        />
                        <button
                            @click="copyToClipboard(hex)"
                            class="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-lg"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <!-- RGB Input -->
                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">RGB</h2>
                    <div class="grid grid-cols-3 gap-2">
                        <input
                            v-for="(label, i) in ['R', 'G', 'B']"
                            :key="i"
                            v-model="rgb[i]"
                            type="number"
                            min="0"
                            max="255"
                            class="w-full p-3 border rounded-lg text-lg"
                            :placeholder="label"
                            @input="updateFromRgb"
                        />
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600">rgb({{ rgb.join(", ") }})</span>
                        <button
                            @click="copyToClipboard(`rgb(${rgb.join(', ')})`)"
                            class="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <!-- HSL Input -->
                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">HSL</h2>
                    <div class="grid grid-cols-3 gap-2">
                        <div
                            v-for="(item, i) in [
                                { label: 'H', max: 360, unit: '°' },
                                { label: 'S', max: 100, unit: '%' },
                                { label: 'L', max: 100, unit: '%' },
                            ]"
                            :key="i"
                        >
                            <input
                                v-model="hsl[item.label.toLowerCase()]"
                                type="number"
                                :min="0"
                                :max="item.max"
                                class="w-full p-3 border rounded-lg text-lg"
                                :placeholder="`${item.label} (${item.unit})`"
                                @input="updateFromHsl"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600"
                            >hsl({{ hsl.h }}°, {{ hsl.s }}%, {{ hsl.l }}%)</span
                        >
                        <button
                            @click="copyToClipboard(`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`)"
                            class="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <!-- CMYK Input -->
                <div class="space-y-2">
                    <h2 class="text-xl font-semibold">CMYK</h2>
                    <div class="grid grid-cols-4 gap-2">
                        <input
                            v-for="(label, i) in ['C', 'M', 'Y', 'K']"
                            :key="i"
                            v-model="cmyk[i]"
                            type="number"
                            min="0"
                            max="100"
                            class="w-full p-3 border rounded-lg text-lg"
                            :placeholder="`${label}%`"
                            @input="updateFromCmyk"
                        />
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600">cmyk({{ cmyk.join("%, ") }}%)</span>
                        <button
                            @click="copyToClipboard(`cmyk(${cmyk.join('%, ')}%)`)"
                            class="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div
        v-if="showToast"
        class="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg"
    >
        Copied to clipboard!
    </div>
</template>

<script setup>
// Reference: https://convertacolor.com/
import { colorConversions } from "~/utils/converters/color";

const hex = ref("#000000");
const rgb = ref([0, 0, 0]);
const hsl = ref({ h: 0, s: 0, l: 0 });
const cmyk = ref([0, 0, 0, 0]);

const previewColor = computed(() => `rgb(${rgb.value.join(",")})`);

const showToast = ref(false);

// Conversion functions remain the same...
const updateFromHex = () => {
    const rgbColor = colorConversions.hexToRgb(hex.value);
    if (rgbColor) {
        rgb.value = [rgbColor.r, rgbColor.g, rgbColor.b];
        updateFromRgb();
    }
};

const updateFromRgb = () => {
    const [r, g, b] = rgb.value;
    hex.value = colorConversions.rgbToHex(r, g, b);
    const hslColor = colorConversions.rgbToHsl(r, g, b);
    hsl.value = hslColor;
    const cmykColor = colorConversions.rgbToCmyk(r, g, b);
    cmyk.value = [cmykColor.c, cmykColor.m, cmykColor.y, cmykColor.k];
};

const updateFromHsl = () => {
    const rgbColor = colorConversions.hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l);
    rgb.value = [rgbColor.r, rgbColor.g, rgbColor.b];
    updateFromRgb();
};

const updateFromCmyk = () => {
    const [c, m, y, k] = cmyk.value;
    const rgbColor = colorConversions.cmykToRgb(c, m, y, k);
    rgb.value = [rgbColor.r, rgbColor.g, rgbColor.b];
    updateFromRgb();
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000); // Hide toast after 2 seconds
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};

updateFromHex();
</script>
