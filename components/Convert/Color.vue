<template>
    <div class="container mx-auto p-4">
        <div class="max-w-xl mx-auto">
            <!-- Narrower max-width for single column -->
            <h1 class="text-4xl font-bold mb-4 text-center">Color Converter</h1>
            <p class="text-gray-600 mb-8 text-center text-lg">Convert between HEX, RGB, HSL, and CMYK formats instantly</p>

            <!-- Color Preview -->
            <div class="mb-8">
                <div
                    class="w-full h-32 rounded-lg shadow-lg transition-colors duration-200"
                    :style="{ backgroundColor: previewColor }"
                ></div>
            </div>

            <!-- Color Inputs -->
            <div class="space-y-8">
                <!-- HEX Input -->
                <div class="form-control">
                    <label class="block text-gray-700 text-sm font-medium mb-2"> HEX </label>
                    <div class="input-group">
                        <input
                            v-model="hex"
                            type="text"
                            class="input input-bordered flex-1 text-lg w-full"
                            placeholder="#000000"
                            @input="updateFromHex"
                        />
                        <div class="flex justify-end items-center mt-2">
                            <button @click="copyToClipboard(hex)" class="btn btn-sm btn-primary">
                                <Icon name="solar:copy-linear" size="1.25rem" />Copy
                            </button>
                        </div>
                    </div>
                </div>

                <!-- RGB Input -->
                <div class="form-control">
                    <label class="block text-gray-700 text-sm font-medium mb-2"> RGB </label>
                    <div class="grid grid-cols-3 gap-2">
                        <input
                            v-for="(label, i) in ['R', 'G', 'B']"
                            :key="i"
                            v-model="rgb[i]"
                            type="number"
                            min="0"
                            max="255"
                            class="input input-bordered w-full text-lg"
                            :placeholder="label"
                            @input="updateFromRgb"
                        />
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600">rgb({{ rgb.join(", ") }})</span>
                        <button @click="copyToClipboard(`rgb(${rgb.join(', ')})`)" class="btn btn-sm btn-primary">
                            <Icon name="solar:copy-linear" size="1.25rem" />Copy
                        </button>
                    </div>
                </div>

                <!-- HSL Input -->
                <div class="form-control">
                    <label class="block text-gray-700 text-sm font-medium mb-2"> HSL </label>
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
                                class="input input-bordered w-full text-lg"
                                :placeholder="`${item.label} (${item.unit})`"
                                @input="updateFromHsl"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600">hsl({{ hsl.h }}°, {{ hsl.s }}%, {{ hsl.l }}%)</span>
                        <button @click="copyToClipboard(`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`)" class="btn btn-sm btn-primary">
                            <Icon name="solar:copy-linear" size="1.25rem" />Copy
                        </button>
                    </div>
                </div>

                <!-- CMYK Input -->
                <div class="form-control">
                    <label class="block text-gray-700 text-sm font-medium mb-2"> CMYK </label>
                    <div class="grid grid-cols-4 gap-2">
                        <input
                            v-for="(label, i) in ['C', 'M', 'Y', 'K']"
                            :key="i"
                            v-model="cmyk[i]"
                            type="number"
                            min="0"
                            max="100"
                            class="input input-bordered w-full text-lg"
                            :placeholder="`${label}%`"
                            @input="updateFromCmyk"
                        />
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600">cmyk({{ cmyk.join("%, ") }}%)</span>
                        <button @click="copyToClipboard(`cmyk(${cmyk.join('%, ')}%)`)" class="btn btn-sm btn-primary">
                            <Icon name="solar:copy-linear" size="1.25rem" />Copy
                        </button>
                    </div>
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
