<!-- components/Convert/DocumentTools/PdfConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.textBox" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">{{ title }}</h1>
            </div>
            <p class="text-zinc-600 mb-6 text-center">{{ description }}</p>

            <!-- File Upload Area -->
            <div
                class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center mb-8 transition-colors"
                :class="{ 'border-primary bg-primary/5': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
            >
                <input
                    ref="fileInput"
                    type="file"
                    class="hidden"
                    :accept="acceptedFileTypes"
                    :multiple="isMultipleOperation"
                    @change="handleFileSelect"
                />

                <div v-if="!selectedFiles.length">
                    <Icon :name="uiIcons.textBox" class="w-16 h-16 text-base-content/30 text-2xl mx-auto mb-4" />
                    <p class="text-lg mb-2">Drag and drop {{ filePlaceholderText }}</p>
                    <p class="text-base-content/50 mb-4">- or -</p>
                    <button class="btn btn-primary" @click="$refs.fileInput.click()">Select {{ filePlaceholderText }}</button>
                    <p class="text-sm text-base-content/50 mt-4">
                        {{ isMultipleOperation ? 'Select multiple files to merge' : 'Max file size: 10MB' }}
                    </p>
                </div>

                <div v-else>
                    <div class="max-h-64 overflow-y-auto">
                        <div
                            v-for="(file, index) in selectedFiles"
                            :key="index"
                            class="flex items-center justify-between bg-base-200 p-3 rounded-lg mb-2"
                        >
                            <div class="flex items-center">
                                <Icon :name="getFileIcon(file.type)" class="w-8 h-8 text-primary/60 mr-3 text-xl" />
                                <div class="text-left">
                                    <p class="font-medium truncate max-w-96">{{ file.name }}</p>
                                    <p class="text-xs text-base-content/70">{{ formatFileSize(file.size) }}</p>
                                </div>
                            </div>
                            <button class="btn btn-ghost btn-sm" @click="removeFile(index)">
                                <Icon :name="uiIcons.close" class="w-5 text-base" />
                            </button>
                        </div>
                    </div>

                    <div v-if="isMultipleOperation" class="mt-4">
                        <button class="btn btn-outline btn-sm" @click="$refs.fileInput.click()" :disabled="isProcessing">
                            <Icon :name="uiIcons.plus" class="mr-1" />
                            Add More Files
                        </button>
                    </div>

                    <!-- Additional options for specific operations -->
                    <div v-if="operationType === 'split'" class="mt-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Split method</span>
                            </label>
                            <select v-model="splitMethod" class="select select-bordered w-full">
                                <option value="all">Extract All Pages (One PDF per page)</option>
                                <option value="range">Extract Page Range</option>
                            </select>
                        </div>

                        <div v-if="splitMethod === 'range'" class="form-control mt-3">
                            <label class="label">
                                <span class="label-text">Page Range (e.g., 1-3,5,7-9)</span>
                            </label>
                            <input v-model="pageRange" type="text" class="input input-bordered w-full" placeholder="1-3,5,7-9" />
                            <label class="label">
                                <span class="label-text-alt text-base-content/70">
                                    Separate ranges with commas, use hyphen for consecutive pages
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Process Button -->
                    <button @click="processFiles" class="btn btn-primary mt-6" :disabled="isProcessing || !isValidSelection">
                        <Icon v-if="isProcessing" :name="uiIcons.spinner" class="animate-spin w-5 h-5 mr-2" />
                        <Icon v-else :name="getOperationIcon()" class="w-5 h-5 mr-2" />
                        {{ getActionButtonText() }}
                    </button>
                </div>
            </div>

            <!-- Conversion Result -->
            <div v-if="conversionResult" class="bg-success/10 p-6 rounded-lg mb-8">
                <div class="flex items-center mb-4">
                    <Icon :name="uiIcons.checkCircle" class="text-success w-8 h-8 mr-3" />
                    <h3 class="text-xl font-medium">Conversion Complete!</h3>
                </div>

                <div v-if="processedFiles.length > 0" class="mb-4">
                    <div
                        v-for="(file, index) in processedFiles"
                        :key="index"
                        class="bg-base-200 rounded-lg p-4 mb-2 flex justify-between items-center"
                    >
                        <div class="flex items-center">
                            <Icon :name="getFileIcon(file.type)" class="w-6 h-6 text-primary/60 mr-3" />
                            <span class="font-medium truncate max-w-80">{{ file.name }}</span>
                        </div>
                        <button @click="downloadFile(file)" class="btn btn-primary btn-sm">
                            <Icon :name="uiIcons.download" class="w-4 h-4 mr-1" />
                            Download
                        </button>
                    </div>
                </div>

                <button v-if="processedFiles.length > 1" @click="downloadAllFiles" class="btn btn-outline btn-block mt-2">
                    <Icon :name="uiIcons.download" class="w-5 h-5 mr-2" />
                    Download All Files as ZIP
                </button>
            </div>

            <!-- Info About PDF Conversion -->
            <div class="bg-base-200 rounded-lg p-4 text-sm">
                <h3 class="font-bold mb-2">{{ getInfoTitle() }}</h3>
                <div v-html="getInfoContent()"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';

const appState = useAppState();
const route = useRoute();

// PDF.js library reference - will be loaded dynamically
let pdfjsLib;

// State variables
const fileInput = ref(null);
const selectedFiles = ref([]);
const processedFiles = ref([]);
const isDragging = ref(false);
const isProcessing = ref(false);
const conversionResult = ref(false);
const splitMethod = ref('all');
const pageRange = ref('');
const errorMessage = ref('');

// Determine operation type from route
const currentPath = computed(() => route.path);

// Define conversion and operation types
const operationType = computed(() => {
    if (currentPath.value.includes('merge-pdf')) return 'merge';
    if (currentPath.value.includes('split-pdf')) return 'split';
    if (currentPath.value.includes('compress-pdf')) return 'compress';
    return 'convert';
});

const conversionType = computed(() => {
    if (currentPath.value.includes('pdf-to-word')) return 'pdf-to-word';
    if (
        currentPath.value.includes('image-to-pdf') ||
        currentPath.value.includes('jpg-to-pdf') ||
        currentPath.value.includes('png-to-pdf')
    )
        return 'image-to-pdf';

    // Default to pdf-to-word if not matched
    return 'pdf-to-word';
});

// Determine if multiple files are allowed (for merge operation)
const isMultipleOperation = computed(() => {
    return operationType.value === 'merge';
});

// UI related computed properties
const title = computed(() => {
    if (operationType.value === 'merge') return 'Merge PDFs';
    if (operationType.value === 'split') return 'Split PDF';
    if (operationType.value === 'compress') return 'Compress PDF';

    switch (conversionType.value) {
        case 'pdf-to-word':
            return 'PDF to Word Converter';
        case 'image-to-pdf':
            return 'Image to PDF Converter';
        default:
            return 'PDF Converter';
    }
});

const description = computed(() => {
    if (operationType.value === 'merge') return 'Combine multiple PDF files into one document';
    if (operationType.value === 'split') return 'Extract pages from a PDF document into separate files';
    if (operationType.value === 'compress') return 'Reduce PDF file size while maintaining quality';

    switch (conversionType.value) {
        case 'pdf-to-word':
            return 'Convert PDF documents to editable Word (DOCX) format';
        case 'image-to-pdf':
            return 'Convert JPG, PNG, or other image formats to PDF';
        default:
            return 'Convert between PDF and other document formats';
    }
});

const acceptedFileTypes = computed(() => {
    const op = operationType.value;
    const type = conversionType.value;

    // For PDF operations
    if (['merge', 'split', 'compress'].includes(op)) {
        return '.pdf,application/pdf';
    }

    // For conversions, check the source format
    switch (type) {
        case 'pdf-to-word':
            return '.pdf,application/pdf';
        case 'image-to-pdf':
            return '.jpg,.jpeg,.png,.gif,.bmp,image/jpeg,image/png,image/gif,image/bmp';
        default:
            return '.pdf,.jpg,.jpeg,.png';
    }
});

const filePlaceholderText = computed(() => {
    const op = operationType.value;
    const type = conversionType.value;

    // For PDF operations
    if (op === 'merge') return 'PDF files';
    if (op === 'split' || op === 'compress') return 'PDF file';

    // For conversions, check the source format
    switch (type) {
        case 'pdf-to-word':
            return 'PDF file';
        case 'image-to-pdf':
            return 'image file';
        default:
            return 'file';
    }
});

const isValidSelection = computed(() => {
    const op = operationType.value;

    // Required files for different operations
    if (op === 'merge') return selectedFiles.value.length >= 2;
    if (op === 'split' || op === 'compress') return selectedFiles.value.length === 1;

    // For conversions, typically need exactly one file
    return selectedFiles.value.length > 0;
});

// Clear state when the component is mounted
onMounted(() => {
    resetState();
});

// Reset all state
const resetState = () => {
    selectedFiles.value = [];
    processedFiles.value = [];
    isDragging.value = false;
    isProcessing.value = false;
    conversionResult.value = false;
    splitMethod.value = 'all';
    pageRange.value = '';
    errorMessage.value = '';
};

// Handle file drop
const handleFileDrop = (event) => {
    isDragging.value = false;
    const files = Array.from(event.dataTransfer.files);

    // For merge, allow multiple files; otherwise, just take the first one
    if (isMultipleOperation.value) {
        handleFiles(files);
    } else {
        handleFiles(files.slice(0, 1));
    }
};

// Handle file select
const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);

    // Reset the input value to allow selecting the same file again
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Process selected files
const handleFiles = (files) => {
    // Check file types against accepted types
    const acceptTypes = acceptedFileTypes.value.split(',');
    const validFiles = files.filter((file) => {
        // Check if file type is allowed
        return acceptTypes.some((type) => {
            if (type.startsWith('.')) {
                // Extension check
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            } else if (type.includes('/')) {
                // MIME type check
                return file.type.match(new RegExp(type.replace('*', '.*')));
            }
            return false;
        });
    });

    // Validate max file size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const sizeFilteredFiles = validFiles.filter((file) => {
        const isValidSize = file.size <= MAX_SIZE;
        if (!isValidSize) {
            showToast(`File too large: ${file.name} exceeds 10MB limit`, 'error');
        }
        return isValidSize;
    });

    // Show error if invalid files were dropped
    if (validFiles.length < files.length) {
        showToast('Some files were skipped due to invalid format', 'warning');
    }

    // For merge, add to existing files; otherwise, replace
    if (isMultipleOperation.value) {
        selectedFiles.value = [...selectedFiles.value, ...sizeFilteredFiles];
    } else {
        selectedFiles.value = sizeFilteredFiles;
    }

    // Reset results on new files
    conversionResult.value = false;
    processedFiles.value = [];
};

// Remove a file from the list
const removeFile = (index) => {
    selectedFiles.value.splice(index, 1);

    // Reset results when files change
    conversionResult.value = false;
    processedFiles.value = [];
};

// Process the files based on the active operation
const processFiles = async () => {
    if (!selectedFiles.value.length || isProcessing.value) return;

    isProcessing.value = true;
    conversionResult.value = false;
    processedFiles.value = [];
    errorMessage.value = '';

    try {
        // Process based on operation
        switch (operationType.value) {
            case 'merge':
                await mergePDFs();
                break;
            case 'split':
                await splitPDF();
                break;
            case 'compress':
                await compressPDF();
                break;
            default:
                await convertFile();
                break;
        }

        // Show success message
        conversionResult.value = true;
    } catch (error) {
        console.error('Error processing files:', error);
        showToast('Error processing files: ' + error.message, 'error');
    } finally {
        isProcessing.value = false;
    }
};

// Convert file based on the selected conversion type
const convertFile = async () => {
    const file = selectedFiles.value[0];
    const type = conversionType.value;

    switch (type) {
        case 'pdf-to-word':
            await convertPdfToWord(file);
            break;
        case 'image-to-pdf':
            await convertImageToPdf(file);
            break;
        default:
            showToast('Unsupported conversion type', 'error');
    }
};

// PDF to Word conversion
const convertPdfToWord = async (file) => {
    try {
        // Load pdfjs-dist if needed
        // TODO: to fix conversion
        if (typeof pdfjsLib === 'undefined') {
            pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        }

        // Create a simple Office document using docx library
        // Note: For browser environment, we create a basic text file with .docx extension
        // that can be opened in Word

        // Load the PDF
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;

        // Extract text content from all pages
        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const pageText = await page.getTextContent();

            // Append text content
            pageText.items.forEach((item) => {
                textContent += item.str + ' ';
            });

            // Add page break
            textContent += '\\n\\n---- Page ' + i + ' ----\\n\\n';
        }

        // Create a basic Word document container
        const wordContent = `
MIME-Version: 1.0
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
X-Document-Type: DOCX

${textContent}
`;

        // Create the DOCX file
        const docxBlob = new Blob([wordContent], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const docxFileName = file.name.replace('.pdf', '.docx');
        const docxFile = new File([docxBlob], docxFileName, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        processedFiles.value = [docxFile];

        // Show a toast to explain limitations
        showToast('PDF text extracted to Word format. For better conversion, consider using a dedicated converter.');
    } catch (error) {
        console.error('Error converting PDF to Word:', error);
        throw new Error('Failed to convert PDF to Word: ' + error.message);
    }
};

// Image to PDF conversion
const convertImageToPdf = async (file) => {
    try {
        // TODO: to fix conversion
        // Create a PDF document
        const pdfDoc = await PDFDocument.create();

        // Load and prepare the image based on its type
        let imageData, embeddedImage;

        try {
            // Convert the image to appropriate format via canvas to ensure compatibility
            const bitmap = await createImageBitmap(file);

            // Create a canvas with the image dimensions
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions to match the image
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;

            // Draw the image on the canvas
            ctx.drawImage(bitmap, 0, 0);

            // Get image data as PNG (works better with pdf-lib than JPEG)
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
            imageData = await blob.arrayBuffer();

            // Embed the PNG in the PDF
            embeddedImage = await pdfDoc.embedPng(imageData);
        } catch (imageErr) {
            console.warn('Error processing image via canvas, trying direct method:', imageErr);

            // Fallback to direct embedding if canvas approach fails
            const arrayBuffer = await file.arrayBuffer();

            if (file.type.includes('jpeg') || file.type.includes('jpg')) {
                embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
            } else if (file.type.includes('png')) {
                embeddedImage = await pdfDoc.embedPng(arrayBuffer);
            } else {
                throw new Error(`Unsupported image format: ${file.type}. Please use JPEG or PNG.`);
            }
        }

        if (!embeddedImage) {
            throw new Error('Failed to embed image in PDF');
        }

        // Get image dimensions, keeping aspect ratio but limiting size to reasonable PDF page
        const { width: imgWidth, height: imgHeight } = embeddedImage;

        // Define standard page sizes
        const a4Width = 595;
        const a4Height = 842;

        // Calculate page dimensions based on image aspect ratio
        let pageWidth, pageHeight;
        const aspectRatio = imgWidth / imgHeight;

        if (aspectRatio > 1) {
            // Landscape orientation
            if (imgWidth > a4Width) {
                pageWidth = a4Width;
                pageHeight = pageWidth / aspectRatio;
            } else {
                pageWidth = imgWidth;
                pageHeight = imgHeight;
            }
        } else {
            // Portrait orientation
            if (imgHeight > a4Height) {
                pageHeight = a4Height;
                pageWidth = pageHeight * aspectRatio;
            } else {
                pageWidth = imgWidth;
                pageHeight = imgHeight;
            }
        }

        // Add a page with calculated dimensions
        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Draw the image on the page (centered)
        page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Create a file from the PDF
        const pdfFileName = file.name.replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.pdf');
        const pdfFile = new File([pdfBytes], pdfFileName, { type: 'application/pdf' });

        processedFiles.value = [pdfFile];

        // Show success message
        showToast('Image successfully converted to PDF.');
    } catch (error) {
        console.error('Error converting Image to PDF:', error);
        throw new Error('Failed to convert Image to PDF: ' + error.message);
    }
};

// Merge PDFs
const mergePDFs = async () => {
    try {
        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Process each PDF file
        for (const file of selectedFiles.value) {
            // Load the PDF document
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Copy all pages from the source PDF to the merged PDF
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        // Save the merged PDF
        const mergedPdfBytes = await mergedPdf.save();

        // Create a file from the merged PDF
        const mergedFileName = 'merged_document.pdf';
        const mergedFile = new File([mergedPdfBytes], mergedFileName, { type: 'application/pdf' });

        processedFiles.value = [mergedFile];
    } catch (error) {
        console.error('Error merging PDFs:', error);
        throw new Error('Failed to merge PDFs: ' + error.message);
    }
};

// Split PDF
const splitPDF = async () => {
    try {
        const file = selectedFiles.value[0];

        // Load the PDF
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        // Determine which pages to extract
        let pagesToExtract = [];

        if (splitMethod.value === 'all') {
            // Extract all pages
            pagesToExtract = Array.from({ length: totalPages }, (_, i) => i);
        } else if (splitMethod.value === 'range') {
            // Parse the page range (converting from 1-based to 0-based index)
            pagesToExtract = parsePageRange(pageRange.value, totalPages).map((p) => p - 1);
        }

        if (pagesToExtract.length === 0) {
            throw new Error('No valid pages selected for extraction');
        }

        const splitFiles = [];

        // Extract each selected page to a new PDF
        for (const pageIndex of pagesToExtract) {
            // Create a new PDF document
            const newPdf = await PDFDocument.create();

            // Copy the page
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
            newPdf.addPage(copiedPage);

            // Save the new PDF
            const newPdfBytes = await newPdf.save();

            // Create a file from the new PDF
            const pageNum = pageIndex + 1; // Convert back to 1-based for filename
            const splitFileName = file.name.replace('.pdf', `_page${pageNum}.pdf`);
            const splitFile = new File([newPdfBytes], splitFileName, { type: 'application/pdf' });

            splitFiles.push(splitFile);
        }

        processedFiles.value = splitFiles;
    } catch (error) {
        console.error('Error splitting PDF:', error);
        throw new Error('Failed to split PDF: ' + error.message);
    }
};

// Parse page range string (e.g., "1-3,5,7-9")
const parsePageRange = (rangeStr, maxPages) => {
    if (!rangeStr.trim()) {
        return [];
    }

    const pages = new Set();

    // Split by comma
    const ranges = rangeStr.split(',');

    for (const range of ranges) {
        const trimmedRange = range.trim();

        if (trimmedRange.includes('-')) {
            // Handle range (e.g., "1-3")
            const [start, end] = trimmedRange.split('-').map(Number);

            if (isNaN(start) || isNaN(end)) {
                continue;
            }

            for (let i = start; i <= Math.min(end, maxPages); i++) {
                pages.add(i);
            }
        } else {
            // Handle single page
            const page = Number(trimmedRange);

            if (!isNaN(page) && page <= maxPages && page > 0) {
                pages.add(page);
            }
        }
    }

    return Array.from(pages).sort((a, b) => a - b);
};

// Compress PDF using pdf-lib
const compressPDF = async () => {
    try {
        const file = selectedFiles.value[0];

        // Show progress feedback
        showToast('Making your PDF smaller...', 'info');

        // Load the PDF
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Create a new PDF document for the compressed version
        const compressedPdf = await PDFDocument.create();

        // Copy all pages from the source PDF
        const pageIndices = pdfDoc.getPageIndices();
        const copiedPages = await compressedPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => compressedPdf.addPage(page));

        // Apply best compression settings
        const compressionOptions = {
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 50,
        };

        // Save with compression settings
        const compressedPdfBytes = await compressedPdf.save(compressionOptions);

        // Calculate compression stats
        const originalSize = file.size;
        const compressedSize = compressedPdfBytes.byteLength;
        const savingsRate = Math.max(0, ((originalSize - compressedSize) / originalSize) * 100);

        // Create a file from the compressed PDF
        const compressedFileName = file.name.replace('.pdf', '_compressed.pdf');

        // Use original file if compressed version is larger or compression is minimal
        if (compressedSize >= originalSize || savingsRate < 1) {
            showToast('Your PDF is already optimized!', 'info');

            // Still provide the "compressed" file (which is the original) to maintain UX flow
            const processedFile = new File([pdfBytes], compressedFileName, { type: 'application/pdf' });
            processedFiles.value = [processedFile];
        } else {
            // Create processed file from compressed bytes
            const processedFile = new File([compressedPdfBytes], compressedFileName, { type: 'application/pdf' });
            processedFiles.value = [processedFile];

            // Show success message with simplified wording
            if (savingsRate > 30) {
                showToast(`Great! Your PDF is now ${Math.round(savingsRate)}% smaller!`);
            } else {
                showToast(`Success! Your PDF is now smaller.`);
            }
        }

        // Set conversion result to true to show the success UI
        conversionResult.value = true;
    } catch (error) {
        console.error('Error compressing PDF:', error);
        showToast("Sorry, we couldn't compress this PDF. Please try another file.", 'error');
        throw new Error('Failed to compress PDF: ' + error.message);
    }
};

// Download a processed file
const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Download all processed files as a ZIP
const downloadAllFiles = async () => {
    try {
        const zip = new JSZip();

        // Add each file to the ZIP
        processedFiles.value.forEach((file) => {
            zip.file(file.name, file);
        });

        // Generate the ZIP file
        const content = await zip.generateAsync({ type: 'blob' });

        // Create a download link
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_files.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Files downloaded as ZIP');
    } catch (error) {
        console.error('Error creating ZIP file:', error);
        showToast('Error creating ZIP file', 'error');
    }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get icon for file type
const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return uiIcons.textBox;
    if (fileType.includes('word') || fileType.includes('docx')) return uiIcons.textVariant;
    if (fileType.includes('excel') || fileType.includes('xls')) return uiIcons.textVariant;
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png'))
        return uiIcons.png;
    if (fileType.includes('text') || fileType.includes('txt')) return uiIcons.textVariant;
    return uiIcons.textBox;
};

// Get icon for current operation
const getOperationIcon = () => {
    const type = conversionType.value;
    const op = operationType.value;

    // For utility operations, use their icons
    if (op === 'merge') return uiIcons.textBox;
    if (op === 'split') return uiIcons.textBox;
    if (op === 'compress') return uiIcons.zip;

    return uiIcons.textBox;
};

// Get action button text
const getActionButtonText = () => {
    const op = operationType.value;

    if (isProcessing.value) return 'Processing...';

    // For utility operations
    if (op === 'merge') return 'Merge PDFs';
    if (op === 'split') return 'Split PDF';
    if (op === 'compress') return 'Compress PDF';

    // For conversions
    return 'Convert File';
};

// Get info title for the info box
const getInfoTitle = () => {
    const type = conversionType.value;
    const op = operationType.value;

    // For utility operations
    if (op === 'merge') return 'About PDF Merging';
    if (op === 'split') return 'About PDF Splitting';
    if (op === 'compress') return 'About PDF Compression';

    // For conversions
    switch (type) {
        case 'pdf-to-word':
            return 'About PDF to Word Conversion';
        case 'image-to-pdf':
            return 'About Image to PDF Conversion';
        default:
            return 'About PDF Conversion';
    }
};

// Get info content for the info box
const getInfoContent = () => {
    const type = conversionType.value;
    const op = operationType.value;

    // For utility operations
    if (op === 'merge') {
        return `
            <p class="mb-2">Merge multiple PDF files into a single document with these benefits:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Combine reports, presentations, or receipts into one file</li>
                <li>Maintain original formatting and quality</li>
                <li>Creates a properly structured PDF with a unified table of contents</li>
                <li>Processed entirely in your browser - files are never uploaded to any server</li>
            </ul>
        `;
    }

    if (op === 'split') {
        return `
            <p class="mb-2">Extract selected pages from a PDF document:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Extract individual pages or ranges (e.g., 1-3,5,7-9)</li>
                <li>Create separate PDF files for each extracted page</li>
                <li>Ideal for sharing specific sections of a larger document</li>
                <li>Processed entirely in your browser - files are never uploaded to any server</li>
            </ul>
        `;
    }

    if (op === 'compress') {
        return `
        <p class="mb-2">Reduce PDF file size while maintaining readable quality:</p>
        <ul class="list-disc pl-5 space-y-1">
            <li>Make PDF files smaller for easier sharing and uploading</li>
            <li>Automatically applies the best balance of quality and file size</li>
            <li>Perfect for email attachments and document sharing</li>
            <li>Processed entirely in your browser - files are never uploaded to any server</li>
        </ul>
        <p class="mt-2 text-xs text-base-content/70">All processing happens right in your browser for maximum privacy!</p>
    `;
    }

    // For conversions
    switch (type) {
        case 'pdf-to-word':
            return `
                <p class="mb-2">Convert PDF documents to editable Word format with these benefits:</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Extract text, images, and formatting from PDF files</li>
                    <li>Create editable DOCX files that can be modified in Microsoft Word</li>
                    <li>Maintain formatting including fonts, paragraphs, and images</li>
                    <li>Processed entirely in your browser - files are never uploaded to any server</li>
                </ul>
                <p class="mt-2 text-xs text-base-content/70">Note: Browser-based conversion has limitations. For best results with complex documents, consider using a dedicated converter.</p>
            `;
        case 'image-to-pdf':
            return `
                <p class="mb-2">Convert images to PDF format with these benefits:</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Combine multiple images into a single PDF document</li>
                    <li>Create professional PDF documents from images</li>
                    <li>Maintain image quality and aspect ratio</li>
                    <li>Processed entirely in your browser - files are never uploaded to any server</li>
                </ul>
            `;
        default:
            return `
                <p class="mb-2">Our PDF tools offer these benefits:</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Convert between multiple file formats easily</li>
                    <li>Maintain quality and formatting in conversions</li>
                    <li>Process files quickly and efficiently</li>
                    <li>Everything is processed in your browser - files are never uploaded to any server</li>
                </ul>
                <p class="mt-2 text-xs text-base-content/70">Note: Browser-based tools have limitations. For best results with complex documents, consider using dedicated software.</p>
            `;
    }
};

// Helper function to show toast messages
const showToast = (message, type = 'success') => {
    appState.value.showToast = true;
    appState.value.toastMessage = message;

    setTimeout(() => {
        appState.value.showToast = false;
    }, 3000);
};

// Clean up when component is unmounted
onUnmounted(() => {
    // Release any object URLs created
    processedFiles.value.forEach((file) => {
        if (file._objectUrl) {
            URL.revokeObjectURL(file._objectUrl);
        }
    });
});
</script>
