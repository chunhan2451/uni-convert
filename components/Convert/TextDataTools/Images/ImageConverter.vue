<!-- components/Convert/TextDataTools/Images/ImageConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="card-body">
                <div class="justify-center text-center">
                    <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                        <Icon :name="uiIcons.png" class="text-primary h-6 w-6 text-2xl" />
                    </div>
                    <h1 class="text-3xl font-bold mb-2 text-center">Image Format Converter</h1>
                    <p class="text-base-content/70 mb-4">Convert your images between different formats (JPG, PNG, WebP, SVG)</p>
                </div>

                <!-- File Upload Area -->
                <div
                    class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center mb-4 transition-colors"
                    :class="{ 'border-primary bg-primary/5': isDragging }"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleFileDrop"
                >
                    <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileSelect" />

                    <div v-if="!selectedFile">
                        <Icon :name="uiIcons.download" class="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                        <p class="text-lg mb-2">Drag and drop an image here</p>
                        <p class="text-base-content/50 mb-4">- or -</p>
                        <button class="btn btn-primary" @click="$refs.fileInput.click()">Select Image</button>
                        <p class="text-sm text-base-content/50 mt-4">Supported formats: JPG, PNG, WebP, SVG</p>
                    </div>

                    <div v-else class="text-left">
                        <div class="flex items-center mb-4">
                            <div class="w-16 h-16 mr-4 rounded-lg overflow-hidden bg-base-200 flex items-center justify-center">
                                <img
                                    v-if="previewUrl"
                                    :src="previewUrl"
                                    class="max-w-full max-h-full object-contain"
                                    alt="Preview"
                                />
                                <Icon v-else :name="uiIcons.png" class="w-8 h-8 text-base-content/30" />
                            </div>
                            <div class="flex-1">
                                <div class="font-medium truncate">{{ selectedFile.name }}</div>
                                <div class="text-sm text-base-content/70">
                                    {{ getFileSize(selectedFile.size) }} · {{ getFileType(selectedFile.type) }}
                                </div>
                            </div>
                            <button class="btn btn-ghost btn-sm" @click="clearFile">
                                <Icon :name="uiIcons.close" class="w-5 h-5 text-lg" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Conversion Options -->
                <div v-if="selectedFile" class="mb-6">
                    <div class="mb-4">
                        <label class="font-medium mb-2 block">Convert to:</label>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="format in availableFormats"
                                :key="format.id"
                                class="btn"
                                :class="targetFormat === format.id ? 'btn-primary' : 'btn-outline'"
                                @click="targetFormat = format.id"
                                :disabled="getCurrentFormat() === format.id"
                            >
                                {{ format.name }}
                            </button>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="font-medium mb-2 block">Quality:</label>
                        <div class="flex items-center gap-4">
                            <input
                                v-model="quality"
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                class="range range-primary"
                                :disabled="targetFormat === 'svg'"
                            />
                            <span class="text-base-content/70 w-12 text-center">{{ quality }}%</span>
                        </div>
                    </div>

                    <button class="btn btn-primary w-full mt-4" @click="convertImage" :disabled="!canConvert || isConverting">
                        <Icon v-if="isConverting" :name="uiIcons.refresh" class="animate-spin w-5 h-5 mr-2" />
                        <Icon v-else :name="uiIcons.transfer" class="w-5 h-5 mr-2" />
                        {{ isConverting ? 'Converting...' : 'Convert Image' }}
                    </button>
                </div>

                <!-- Conversion Result -->
                <div v-if="convertedImageUrl" class="bg-base-200 p-4 rounded-lg">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-medium">Converted Image</h3>
                        <div class="text-sm text-base-content/70">
                            {{ getFileSize(convertedSize) }}
                        </div>
                    </div>

                    <div class="bg-base-100 p-2 rounded-lg mb-4 flex justify-center">
                        <img :src="convertedImageUrl" class="max-w-full max-h-64 object-contain rounded" alt="Converted image" />
                    </div>

                    <div class="flex gap-2">
                        <button class="btn btn-primary flex-1" @click="downloadImage">
                            <Icon :name="uiIcons.download" class="w-5 h-5 mr-2" />
                            Download
                        </button>
                    </div>
                </div>

                <!-- Info Alert -->
                <div class="alert alert-info mt-6 text-sm">
                    <Icon :name="uiIcons.info" class="w-5 h-5" />
                    <div>All conversion happens in your browser - your images are never uploaded to any server.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { uiIcons } from '~/utils/appConstant';

const isDragging = ref(false);
const fileInput = ref(null);
const selectedFile = ref(null);
const previewUrl = ref(null);
const targetFormat = ref('png');
const quality = ref(85);
const isConverting = ref(false);
const convertedImageUrl = ref(null);
const convertedSize = ref(0);

// Available image formats
const availableFormats = [
    { id: 'jpeg', name: 'JPG', mimeType: 'image/jpeg', extension: '.jpg' },
    { id: 'png', name: 'PNG', mimeType: 'image/png', extension: '.png' },
    { id: 'webp', name: 'WebP', mimeType: 'image/webp', extension: '.webp' },
    { id: 'svg', name: 'SVG', mimeType: 'image/svg+xml', extension: '.svg' },
];

// Computed property to determine if conversion is possible
const canConvert = computed(() => {
    return selectedFile.value && getCurrentFormat() !== targetFormat.value;
});

// Handle file selection from file input
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
};

// Handle file drop
const handleFileDrop = (event) => {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
};

// Process the selected file
const processFile = (file) => {
    selectedFile.value = file;

    // Create preview URL
    previewUrl.value = URL.createObjectURL(file);

    // Auto-select target format based on current format
    const currentFormat = getCurrentFormat();
    if (currentFormat === targetFormat.value) {
        // Choose a different format by default
        const formats = availableFormats.map((f) => f.id);
        const currentIndex = formats.indexOf(currentFormat);
        targetFormat.value = formats[(currentIndex + 1) % formats.length];
    }

    // Clear previous conversion
    convertedImageUrl.value = null;
};

// Get current file format
const getCurrentFormat = () => {
    if (!selectedFile.value) return null;

    const mimeType = selectedFile.value.type;
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpeg';
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('webp')) return 'webp';
    if (mimeType.includes('svg')) return 'svg';

    // Default to png if unknown
    return 'png';
};

// Format file size
const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get friendly file type name
const getFileType = (mimeType) => {
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'JPEG Image';
    if (mimeType.includes('png')) return 'PNG Image';
    if (mimeType.includes('webp')) return 'WebP Image';
    if (mimeType.includes('svg')) return 'SVG Image';
    return 'Image';
};

// Clear selected file
const clearFile = () => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    if (convertedImageUrl.value) {
        URL.revokeObjectURL(convertedImageUrl.value);
    }

    selectedFile.value = null;
    previewUrl.value = null;
    convertedImageUrl.value = null;
    convertedSize.value = 0;

    // Reset file input
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Convert image to target format
const convertImage = async () => {
    if (!selectedFile.value || !targetFormat.value) return;

    isConverting.value = true;

    try {
        // Special handling for SVG conversion
        if (getCurrentFormat() === 'svg' && targetFormat.value !== 'svg') {
            await convertFromSvg();
        }
        // Special handling for conversion to SVG
        else if (targetFormat.value === 'svg' && getCurrentFormat() !== 'svg') {
            await convertToSvg();
        }
        // Regular raster to raster conversion
        else {
            await convertRasterToRaster();
        }
    } catch (error) {
        console.error('Conversion error:', error);
        alert('Error converting image. Please try another image or format.');
    } finally {
        isConverting.value = false;
    }
};

// Convert from SVG to raster format
const convertFromSvg = async () => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const svgString = e.target.result;
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Set reasonable dimensions for the output image
                canvas.width = img.width || 800;
                canvas.height = img.height || 600;

                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white'; // White background for SVG
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Get format info
                const format = availableFormats.find((f) => f.id === targetFormat.value);
                if (!format) return reject(new Error('Invalid format'));

                // Convert to target format
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Conversion failed'));

                        processConvertedBlob(blob, format);
                        resolve();
                    },
                    format.mimeType,
                    quality.value / 100
                );
            };

            img.onerror = reject;

            // Set SVG as src with data URL
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            img.src = URL.createObjectURL(svgBlob);
        };

        reader.onerror = reject;
        reader.readAsText(selectedFile.value);
    });
};

// Convert to SVG format
const convertToSvg = async () => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            try {
                // Create SVG with embedded image
                const svgWidth = img.naturalWidth || 800;
                const svgHeight = img.naturalHeight || 600;

                // Convert image to base64
                const canvas = document.createElement('canvas');
                canvas.width = svgWidth;
                canvas.height = svgHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Get image as data URL
                const imageData = canvas.toDataURL(getCurrentFormat() === 'png' ? 'image/png' : 'image/jpeg');

                // Create SVG content
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
    <image width="${svgWidth}" height="${svgHeight}" href="${imageData}"/>
  </svg>`;

                // Create blob from SVG content
                const blob = new Blob([svgContent], { type: 'image/svg+xml' });

                const format = availableFormats.find((f) => f.id === 'svg');
                processConvertedBlob(blob, format);
                resolve();
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(selectedFile.value);
    });
};

// Convert between raster formats
const convertRasterToRaster = async () => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Get format info
                const format = availableFormats.find((f) => f.id === targetFormat.value);
                if (!format) return reject(new Error('Invalid format'));

                // Convert to target format
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Conversion failed'));

                        processConvertedBlob(blob, format);
                        resolve();
                    },
                    format.mimeType,
                    quality.value / 100
                );
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(selectedFile.value);
    });
};

// Process converted blob
const processConvertedBlob = (blob, format) => {
    // Revoke previous URL if exists
    if (convertedImageUrl.value) {
        URL.revokeObjectURL(convertedImageUrl.value);
    }

    // Create new object URL
    convertedImageUrl.value = URL.createObjectURL(blob);
    convertedSize.value = blob.size;
};

// Download converted image
const downloadImage = () => {
    if (!convertedImageUrl.value) return;

    // Create format info
    const format = availableFormats.find((f) => f.id === targetFormat.value);
    if (!format) return;

    // Generate filename
    const originalName = selectedFile.value.name;
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const newFileName = `${baseName}${format.extension}`;

    // Create download link
    const a = document.createElement('a');
    a.href = convertedImageUrl.value;
    a.download = newFileName;
    a.click();
};

// Clean up URLs when component is unmounted
onBeforeUnmount(() => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    if (convertedImageUrl.value) {
        URL.revokeObjectURL(convertedImageUrl.value);
    }
});
</script>
