<!-- components/Convert/TextDataTools/Images/ImageCompressor.vue -->
<template>
    <div class="container mx-auto p-2 sm:p-4">
        <div class="max-w-xl mx-auto">
            <!-- Dynamic Header that changes based on state -->
            <div class="text-center mb-6 sm:mb-8">
                <div class="flex justify-center mb-3 sm:mb-4">
                    <div class="relative">
                        <div class="p-2 bg-primary/10 rounded-lg flex justify-self-center">
                            <Icon :name="uiIcons.png" class="text-primary h-5 w-5 sm:h-6 sm:w-6 text-xl sm:text-2xl" />
                        </div>
                        <div
                            v-if="hasCompressedFiles"
                            class="absolute -top-2 -right-2 bg-success rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center border-2 border-white"
                        >
                            <Icon :name="uiIcons.checkCircle" class="text-white h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-center">
                    {{ hasCompressedFiles ? 'Compression Complete!' : 'Image Compressor' }}
                </h1>
                <p class="text-sm sm:text-base text-base-content/70">
                    {{
                        hasCompressedFiles
                            ? `${fileList.length} ${
                                  fileList.length === 1 ? 'image' : 'images'
                              } processed • ${totalCompressionRate}% average reduction`
                            : 'Reduce image size while preserving quality'
                    }}
                </p>
            </div>

            <!-- Main Content: Upload Area  -->
            <div
                class="border-2 border-dashed border-base-300 rounded-lg p-6 sm:p-10 mb-6 sm:mb-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                @click="$refs.fileInput.click()"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
                :class="{ 'border-primary bg-primary/5 scale-[1.01]': isDragging }"
            >
                <input
                    ref="fileInput"
                    type="file"
                    multiple
                    class="hidden"
                    @change="handleFileSelect"
                    accept=".jpg,.jpeg,.png,.webp,.avif,.svg,image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                />

                <div class="relative inline-block mb-4 sm:mb-5">
                    <div
                        class="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 bg-primary/90 text-white rounded-full p-1.5 sm:p-2 shadow-md animate-pulse flex"
                    >
                        <Icon :name="uiIcons.arrowDown" class="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div class="bg-primary/10 rounded-full p-4 sm:p-6 flex">
                        <Icon :name="uiIcons.png" class="h-14 w-14 sm:h-20 sm:w-20 text-primary/90 text-xl sm:text-2xl" />
                    </div>
                </div>

                <h3 class="text-xl sm:text-2xl font-medium mb-2 sm:mb-4">Drop Images Here!</h3>
                <p class="text-base-content/50 mb-4">- or -</p>
                <button class="btn btn-primary" >Select Images</button>

                <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mt-5 sm:mt-8 max-w-md mx-auto">
                    <div class="bg-base-100 px-3 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm">
                        Up to {{ MAX_FILES }} images
                    </div>
                    <!-- <div class="bg-base-100 px-3 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm">Max 10MB per file</div> -->
                </div>
            </div>

            <!-- Results Section -->
            <div v-if="fileList.length > 0">
                <!-- Summary Card - Showing Results First -->
                <div v-if="hasCompressedFiles" class="bg-base-100 rounded-lg shadow-md mb-6 sm:mb-8 overflow-hidden">
                    <div class="bg-success/10 p-3 sm:p-5 border-b border-base-200">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div class="flex items-center mb-3 sm:mb-0">
                                <Icon :name="uiIcons.checkCircle" class="h-6 w-6 sm:h-7 sm:w-7 text-success mr-2 sm:mr-3" />
                                <h3 class="font-semibold text-lg sm:text-xl">Compression Results</h3>
                            </div>
                            <button
                                @click="downloadAllFiles"
                                class="btn btn-primary btn-sm sm:btn-md gap-1 sm:gap-2 w-full sm:w-auto"
                                :disabled="isProcessing"
                            >
                                <Icon :name="isProcessing ? uiIcons.spinner : uiIcons.download" class="h-4 w-4 sm:h-5 sm:w-5" />
                                Download All
                            </button>
                        </div>
                    </div>

                    <div class="p-4 sm:p-6">
                        <div class="grid gap-3 sm:gap-4 grid-cols-3">
                            <div class="bg-base-200/50 rounded-lg p-2 sm:p-4 text-center">
                                <p class="text-xs sm:text-sm text-base-content/70 mb-1">Original</p>
                                <p class="text-lg sm:text-2xl font-bold">{{ formatFileSize(totalOriginalSize) }}</p>
                            </div>
                            <div class="bg-base-200/50 rounded-lg p-2 sm:p-4 text-center">
                                <p class="text-xs sm:text-sm text-base-content/70 mb-1">Compressed</p>
                                <p class="text-lg sm:text-2xl font-bold">{{ formatFileSize(totalCompressedSize) }}</p>
                            </div>
                            <div class="bg-success/10 rounded-lg p-2 sm:p-4 text-center">
                                <p class="text-xs sm:text-sm text-base-content/70 mb-1">Saved</p>
                                <p class="text-lg sm:text-2xl font-bold text-success">{{ totalCompressionRate }}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- File List Section -->
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 class="text-lg sm:text-xl font-bold flex items-center">
                        <span
                            class="bg-primary/10 rounded-full h-6 w-6 sm:h-8 sm:w-8 inline-flex items-center justify-center mr-2"
                        >
                            <span class="text-primary font-bold text-sm sm:text-base">{{ fileList.length }}</span>
                        </span>
                        Images
                    </h2>
                    <button @click="clearFiles" class="btn btn-xs sm:btn-sm btn-outline" :disabled="isProcessing">
                        <Icon :name="uiIcons.eraser" class="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1" />
                        <span class="hidden xs:inline">Clear All</span>
                        <span class="xs:hidden">Clear</span>
                    </button>
                </div>

                <!-- File List -->
                <div class="bg-base-100 rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8">
                    <div
                        v-for="(file, index) in fileList"
                        :key="file.id"
                        class="p-3 sm:p-4 border-b border-base-200 last:border-0 hover:bg-base-100/50 transition-colors"
                    >
                        <div class="flex items-center gap-3 sm:gap-4">
                            <!-- Image preview with status indicator -->
                            <div class="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                                <div class="h-full w-full bg-base-200 rounded-lg overflow-hidden">
                                    <img
                                        v-if="file.previewUrl"
                                        :src="file.previewUrl"
                                        class="h-full w-full object-cover"
                                        alt="Image preview"
                                    />
                                    <Icon
                                        v-else
                                        :name="getFileIcon(file.type)"
                                        class="h-full w-full p-2 sm:p-3 text-primary/60"
                                    />
                                </div>

                                <!-- Status indicator -->
                                <div
                                    v-if="file.status === 'compressed'"
                                    class="absolute -bottom-1 -right-1 bg-success text-white rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-md"
                                >
                                    <Icon :name="uiIcons.checkCircle" class="h-3 w-3 sm:h-4 sm:w-4" />
                                </div>
                                <div
                                    v-else-if="file.status === 'processing'"
                                    class="absolute -bottom-1 -right-1 bg-primary text-white rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-md"
                                >
                                    <Icon :name="uiIcons.spinner" class="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                </div>
                                <div
                                    v-else-if="file.status === 'error'"
                                    class="absolute -bottom-1 -right-1 bg-error text-white rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-md"
                                >
                                    <Icon :name="uiIcons.warning" class="h-3 w-3 sm:h-4 sm:w-4" />
                                </div>
                            </div>

                            <!-- File info -->
                            <div class="flex-grow min-w-0">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="font-medium truncate text-sm sm:text-base whitespace-pre-wrap">
                                            {{ file.name }}
                                        </p>
                                        <div class="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                                            <span class="text-xs sm:text-sm text-base-content/70">{{
                                                formatFileSize(file.size)
                                            }}</span>

                                            <!-- Compression results info -->
                                            <template v-if="file.status === 'compressed'">
                                                <Icon
                                                    :name="uiIcons.arrowRight"
                                                    class="h-3 w-3 sm:h-4 sm:w-4 text-base-content/40"
                                                />
                                                <span class="text-xs sm:text-sm">{{ formatFileSize(file.compressedSize) }}</span>
                                                <span class="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                                                    {{ file.compressionRate }}%
                                                </span>
                                            </template>

                                            <!-- Processing indicator -->
                                            <span
                                                v-else-if="file.status === 'processing'"
                                                class="flex items-center text-xs sm:text-sm text-primary"
                                            >
                                                <span>Compressing...</span>
                                            </span>

                                            <!-- Error message -->
                                            <span
                                                v-else-if="file.status === 'error'"
                                                class="flex items-center text-xs sm:text-sm text-error"
                                            >
                                                {{ file.error || 'Failed' }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Action buttons -->
                                    <div class="flex items-center gap-1 sm:gap-2 ml-1">
                                        <button
                                            v-if="file.status === 'compressed'"
                                            @click="downloadFile(file)"
                                            class="btn btn-xs sm:btn-sm btn-primary btn-circle"
                                            title="Download compressed image"
                                        >
                                            <Icon :name="uiIcons.download" class="h-3 w-3 sm:h-4 sm:w-4 text-base" />
                                        </button>
                                        <button
                                            @click="removeFile(index)"
                                            class="btn btn-xs sm:btn-sm btn-ghost btn-circle"
                                            :disabled="isProcessing"
                                            title="Remove image"
                                        >
                                            <Icon
                                                :name="uiIcons.close"
                                                class="h-3.5 w-3.5 sm:h-5 sm:w-5 text-base hover:text-error"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAppState } from '~/composables/states';
import { uiIcons } from '~/utils/appConstant';

const appState = useAppState();
const fileList = ref([]);
const isProcessing = ref(false);
const isDragging = ref(false);
const librariesLoaded = ref(false);
const fileIdCounter = ref(0);

// Maximum files allowed
const MAX_FILES = 20;

// Libraries references
let Compressor, JSZip;

// Load libraries
onMounted(async () => {
    try {
        const [compressorModule, jsZipModule] = await Promise.all([import('compressorjs'), import('jszip')]);

        Compressor = compressorModule.default;
        JSZip = jsZipModule.default;
        librariesLoaded.value = true;
    } catch (error) {
        console.error('Failed to load libraries:', error);
        showToast('Error loading compression libraries', 'error');
    }
});

// Handle file select via upload input
const handleFileSelect = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > 0) {
        const imageFiles = Array.from(selectedFiles).filter(
            (file) =>
                file.type.startsWith('image/jpeg') ||
                file.type.startsWith('image/png') ||
                file.type.startsWith('image/webp') ||
                file.type.startsWith('image/avif') ||
                file.type.startsWith('image/svg+xml')
        );

        if (imageFiles.length !== selectedFiles.length) {
            showToast('Only image files are supported', 'warning');
        }

        // Filter out files larger than 10MB
        // const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        const validSizeFiles = imageFiles.filter((file) => {
            // if (file.size > MAX_FILE_SIZE) {
            //     showToast(`"${file.name}" exceeds 10MB limit`, 'error');
            //     return false;
            // }
            return true;
        });

        if (validSizeFiles.length > 0) {
            addFiles(validSizeFiles);
        }
    }

    // Reset the input value to allow selecting the same files again
    event.target.value = null;
};

// Handle file drop
const handleFileDrop = (event) => {
    isDragging.value = false;

    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'));

    if (droppedFiles.length !== event.dataTransfer.files.length) {
        showToast('Only image files are supported', 'warning');
    }

    // Filter out files larger than 10MB
    // const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const validSizeFiles = droppedFiles.filter((file) => {
        // if (file.size > MAX_FILE_SIZE) {
        //     showToast(`"${file.name}" exceeds 10MB limit`, 'error');
        //     return false;
        // }
        return true;
    });

    if (validSizeFiles.length > 0) {
        addFiles(validSizeFiles);
    }
};

// Check if libraries are loaded
const checkLibraries = () => {
    if (!librariesLoaded.value) {
        showToast('Compression libraries are still loading...', 'error');
        return false;
    }
    return true;
};

// Create image preview URL
const createImagePreview = (file) => {
    return URL.createObjectURL(file);
};

// Add files to the list
const addFiles = (newFiles) => {
    if (!checkLibraries()) return;

    const remainingSlots = MAX_FILES - fileList.value.length;

    if (remainingSlots <= 0) {
        showToast(`Maximum ${MAX_FILES} images allowed`, 'error');
        return;
    }

    const filesToAdd = newFiles.slice(0, remainingSlots);

    if (newFiles.length > remainingSlots) {
        showToast(`Only added ${remainingSlots} images (maximum reached)`, 'warning');
    }

    // Add files with a unique ID and initial status
    const filesToProcess = filesToAdd.map((file) => {
        const fileId = `file-${fileIdCounter.value++}`;
        const previewUrl = createImagePreview(file);

        return {
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending',
            previewUrl,
            compressedSize: 0,
            compressionRate: 0,
            compressedBlob: null,
            error: null,
        };
    });

    // Add to file list
    fileList.value.push(...filesToProcess);

    // Start processing files
    processFiles(filesToProcess);
};

// Process files for compression
const processFiles = async (filesToProcess) => {
    if (!checkLibraries() || isProcessing.value) return;

    isProcessing.value = true;

    try {
        // Process files one by one
        for (const file of filesToProcess) {
            // Update status to processing
            updateFileStatus(file.id, 'processing');

            // Small delay to ensure UI updates
            await new Promise((resolve) => setTimeout(resolve, 50));

            try {
                await compressImage(file);
            } catch (error) {
                console.error(`Error compressing image ${file.name}:`, error);
                updateFileStatus(file.id, 'error', { error: error.message || 'Compression failed' });
            }
        }
    } finally {
        isProcessing.value = false;
    }
};

const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
        try {
            // Keep the original file type - don't convert to other formats
            const options = {
                quality: 0.7, // Compression quality
                maxWidth: 1600, // Limit max dimensions if needed
                maxHeight: 1600,
                mimeType: file.type, // Maintain original file type
                convertSize: 0, // Don't convert formats
                strict: true, // Enforce compression
                checkOrientation: true, // Fix orientation issues
                success(result) {
                    const originalSize = file.size;
                    const compressedSize = result.size;

                    // Only save if we actually reduced the size
                    if (compressedSize < originalSize) {
                        const compressionRate = Math.round(((originalSize - compressedSize) / originalSize) * 100);

                        // Mark as compressed
                        updateFileStatus(file.id, 'compressed', {
                            compressedSize,
                            compressionRate,
                            compressedBlob: result,
                        });
                    } else {
                        // If compression didn't work well, try again with more aggressive settings
                        // but still maintain the original file format
                        const moreAggressiveOptions = {
                            quality: 0.5, // More aggressive compression
                            maxWidth: 1400, // Reduce dimensions slightly
                            maxHeight: 1400,
                            mimeType: file.type, // Maintain original file type
                            convertSize: 0, // Don't convert formats
                            success(result2) {
                                const compressedSize2 = result2.size;
                                const compressionRate2 = Math.round(((originalSize - compressedSize2) / originalSize) * 100);

                                if (compressedSize2 < originalSize) {
                                    // Mark as compressed
                                    updateFileStatus(file.id, 'compressed', {
                                        compressedSize: compressedSize2,
                                        compressionRate: compressionRate2,
                                        compressedBlob: result2,
                                    });
                                } else {
                                    // Use the original file if second attempt doesn't reduce size
                                    updateFileStatus(file.id, 'compressed', {
                                        compressedSize: originalSize,
                                        compressionRate: 0,
                                        compressedBlob: file.file,
                                    });
                                }
                                resolve();
                            },
                            error() {
                                // Use the original file if second attempt fails
                                updateFileStatus(file.id, 'compressed', {
                                    compressedSize: originalSize,
                                    compressionRate: 0,
                                    compressedBlob: file.file,
                                });
                                resolve();
                            },
                        };

                        new Compressor(file.file, moreAggressiveOptions);
                    }
                    resolve();
                },
                error(err) {
                    updateFileStatus(file.id, 'error', { error: err.message || 'Image compression failed' });
                    reject(err);
                },
            };

            new Compressor(file.file, options);
        } catch (error) {
            updateFileStatus(file.id, 'error', { error: 'Failed to initialize compression' });
            reject(error);
        }
    });
};

// Get appropriate icon for file type
const getFileIcon = (fileType) => {
    if (fileType.includes('image/jpeg') || fileType.includes('image/jpg')) return uiIcons.png;
    if (fileType.includes('image/png')) return uiIcons.svg;
    if (fileType.includes('image/gif')) return uiIcons.png;
    if (fileType.includes('image/webp')) return uiIcons.png;
    if (fileType.includes('image/svg')) return uiIcons.svg;
    return uiIcons.png; // Default for images
};

// Update file status and properties
const updateFileStatus = (fileId, status, properties = {}) => {
    const fileIndex = fileList.value.findIndex((f) => f.id === fileId);
    if (fileIndex !== -1) {
        // Update status
        fileList.value[fileIndex].status = status;

        // Update additional properties
        Object.entries(properties).forEach(([key, value]) => {
            fileList.value[fileIndex][key] = value;
        });
    }
};

// Remove file from list
const removeFile = (index) => {
    if (isProcessing.value) return;

    // Release the preview URL to free memory
    if (fileList.value[index].previewUrl) {
        URL.revokeObjectURL(fileList.value[index].previewUrl);
    }

    fileList.value.splice(index, 1);
};

// Clear all files
const clearFiles = () => {
    if (isProcessing.value) return;

    // Clean up preview URLs
    fileList.value.forEach((file) => {
        if (file.previewUrl) {
            URL.revokeObjectURL(file.previewUrl);
        }
    });

    fileList.value = [];
};

// Download a single compressed file
const downloadFile = (file) => {
    if (!file.compressedBlob) return;

    // Create a URL for the blob
    const url = URL.createObjectURL(file.compressedBlob);

    // Get the file extension from the mimetype
    let extension = '.jpg';
    if (file.type === 'image/png') extension = '.png';
    if (file.type === 'image/avif') extension = '.avif';
    if (file.type === 'image/webp') extension = '.webp';
    if (file.type === 'image/svg+xml') extension = '.svg';

    // Get filename without extension
    const baseFilename = file.name.replace(/\.[^/.]+$/, '');

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseFilename}${extension}`;

    // Append to the document, click it, and clean up
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the object URL to free memory
    URL.revokeObjectURL(url);

    showToast('Image downloaded successfully');
};

// Download all compressed files as a zip archive
const downloadAllFiles = async () => {
    if (!hasCompressedFiles.value || isProcessing.value || !checkLibraries()) return;

    isProcessing.value = true;

    try {
        const zip = new JSZip();
        const compressedFolder = zip.folder('compressed_images');

        // Add each compressed file to the zip
        for (const file of fileList.value) {
            if (file.status === 'compressed' && file.compressedBlob) {
                // Get appropriate extension
                let extension;
                if (file.compressedBlob.type === 'image/jpeg') {
                    extension = '.jpg';
                } else if (file.compressedBlob.type === 'image/png') {
                    extension = '.png';
                } else if (file.compressedBlob.type === 'image/webp') {
                    extension = '.webp';
                } else if (file.compressedBlob.type === 'image/avif') {
                    extension = '.avif';
                } else if (file.compressedBlob.type === 'image/svg+xml') {
                    extension = '.svg';
                } else {
                    extension = '.' + file.name.split('.').pop();
                }

                // Create filename without extension
                const basename = file.name.replace(/\.[^/.]+$/, '');
                const filename = `${basename}${extension}`;

                compressedFolder.file(filename, file.compressedBlob);
            }
        }

        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        // Create a URL for the blob
        const url = URL.createObjectURL(zipBlob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_images_${new Date().toISOString().slice(0, 10)}.zip`;

        // Append to the document, click it, and clean up
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Release the object URL to free memory
        URL.revokeObjectURL(url);

        showToast('All images downloaded as ZIP', 'success');
    } catch (error) {
        console.error('Error creating zip:', error);
        showToast('Error creating zip file', 'error');
    }

    isProcessing.value = false;
};

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to show toast messages
const showToast = (message, type = 'info') => {
    appState.value.showToast = true;
    appState.value.toastMessage = message;
    appState.value.toastType = type;

    setTimeout(() => {
        appState.value.showToast = false;
    }, 3000);
};

// Computed properties
const hasCompressedFiles = computed(() => {
    return fileList.value.some((file) => file.status === 'compressed');
});

const totalOriginalSize = computed(() => {
    return fileList.value.filter((file) => file.status === 'compressed').reduce((total, file) => total + file.size, 0);
});

const totalCompressedSize = computed(() => {
    return fileList.value.filter((file) => file.status === 'compressed').reduce((total, file) => total + file.compressedSize, 0);
});

const totalCompressionRate = computed(() => {
    if (totalOriginalSize.value === 0) return 0;
    const savedPercentage = ((totalOriginalSize.value - totalCompressedSize.value) / totalOriginalSize.value) * 100;
    return Math.round(savedPercentage);
});

// Clean up when component is unmounted
onUnmounted(() => {
    // Release all preview URLs
    fileList.value.forEach((file) => {
        if (file.previewUrl) {
            URL.revokeObjectURL(file.previewUrl);
        }
    });
});

// SEO metadata
useHead({
    title: 'Image Compressor - Reduce Image Sizes Easily',
    meta: [
        {
            name: 'description',
            content:
                'Compress your images to reduce their file size while maintaining quality. Supports JPG, PNG, WebP, AVIF and SVG formats.',
        },
    ],
});
</script>
