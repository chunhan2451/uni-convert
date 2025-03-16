<!-- components/Convert/Utility/QrCodeGenerator.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">QR Code Generator</h1>
            <p class="text-zinc-600 mb-6 text-center">Generate customized QR codes with optional logo</p>

            <!-- QR Code Content Input -->
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-medium mb-2 text-center">QR Code Content</label>
                <div class="tabs tabs-boxed justify-center mb-4">
                    <a class="tab" :class="{ 'tab-active': contentType === 'url' }" @click="contentType = 'url'"> URL </a>
                    <a class="tab" :class="{ 'tab-active': contentType === 'text' }" @click="contentType = 'text'"> Text </a>
                    <a class="tab" :class="{ 'tab-active': contentType === 'email' }" @click="contentType = 'email'"> Email </a>
                    <a class="tab" :class="{ 'tab-active': contentType === 'phone' }" @click="contentType = 'phone'"> Phone </a>
                </div>

                <!-- URL Input -->
                <div v-if="contentType === 'url'">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Website URL</span>
                        </label>
                        <div class="join w-full">
                            <div class="join-item bg-base-200 px-3 flex items-center text-zinc-500">
                                <Icon :name="uiIcons.globe" class="text-lg" />
                            </div>
                            <input
                                v-model="qrData.url"
                                type="url"
                                placeholder="https://example.com"
                                class="input join-item input-bordered w-full"
                                @input="updateQrCode"
                            />
                        </div>
                    </div>
                </div>

                <!-- Text Input -->
                <div v-if="contentType === 'text'">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Text Content</span>
                        </label>
                        <textarea
                            v-model="qrData.text"
                            placeholder="Enter text to encode"
                            class="textarea textarea-bordered w-full"
                            rows="3"
                            @input="updateQrCode"
                        ></textarea>
                    </div>
                </div>

                <!-- Email Input -->
                <div v-if="contentType === 'email'">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Email Address</span>
                        </label>
                        <div class="join w-full">
                            <div class="join-item bg-base-200 px-3 flex items-center text-zinc-500">
                                <Icon :name="uiIcons.envelope" class="text-lg" />
                            </div>
                            <input
                                v-model="qrData.email"
                                type="email"
                                placeholder="contact@example.com"
                                class="input join-item input-bordered w-full"
                                @input="updateQrCode"
                            />
                        </div>
                    </div>

                    <div class="form-control mt-2">
                        <label class="label">
                            <span class="label-text">Subject (optional)</span>
                        </label>
                        <input
                            v-model="qrData.emailSubject"
                            type="text"
                            placeholder="Email subject"
                            class="input input-bordered w-full"
                            @input="updateQrCode"
                        />
                    </div>

                    <div class="form-control mt-2">
                        <label class="label">
                            <span class="label-text">Body (optional)</span>
                        </label>
                        <textarea
                            v-model="qrData.emailBody"
                            placeholder="Email body text"
                            class="textarea textarea-bordered w-full"
                            rows="2"
                            @input="updateQrCode"
                        ></textarea>
                    </div>
                </div>

                <!-- Phone Input -->
                <div v-if="contentType === 'phone'">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Phone Number</span>
                        </label>
                        <div class="join w-full">
                            <div class="join-item bg-base-200 px-3 flex items-center text-zinc-500">
                                <Icon :name="uiIcons.phone" class="text-lg" />
                            </div>
                            <input
                                v-model="qrData.phone"
                                type="tel"
                                placeholder="+1234567890"
                                class="input join-item input-bordered w-full"
                                @input="updateQrCode"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- QR Code Customization -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-base-100 p-4 rounded-lg shadow-sm">
                    <h3 class="font-semibold mb-3">QR Code Settings</h3>

                    <!-- Color Picker -->
                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Foreground Color</span>
                        </label>
                        <div class="flex space-x-2">
                            <input
                                v-model="qrOptions.foregroundColor"
                                type="color"
                                class="input input-bordered h-10 w-14 p-1 cursor-pointer"
                                @input="updateQrCode"
                            />
                            <input
                                v-model="qrOptions.foregroundColor"
                                type="text"
                                class="input input-bordered w-full"
                                @input="updateQrCode"
                            />
                        </div>
                    </div>

                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Background Color</span>
                        </label>
                        <div class="flex space-x-2">
                            <input
                                v-model="qrOptions.backgroundColor"
                                type="color"
                                class="input input-bordered h-10 w-14 p-1 cursor-pointer"
                                @input="updateQrCode"
                            />
                            <input
                                v-model="qrOptions.backgroundColor"
                                type="text"
                                class="input input-bordered w-full"
                                @input="updateQrCode"
                            />
                        </div>
                    </div>

                    <!-- Size Slider -->
                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Size (px)</span>
                            <span class="label-text-alt">{{ qrOptions.size }}px</span>
                        </label>
                        <input
                            v-model="qrOptions.size"
                            type="range"
                            min="100"
                            max="400"
                            step="10"
                            class="range range-primary"
                            @input="updateQrCode"
                        />
                    </div>

                    <!-- Error Correction -->
                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Error Correction</span>
                            <span
                                class="tooltip tooltip-bottom"
                                data-tip="Higher correction levels make QR codes more resistant to damage but increase complexity"
                            >
                                <Icon :name="uiIcons.question" class="text-zinc-500" />
                            </span>
                        </label>
                        <select
                            v-model="qrOptions.errorCorrectionLevel"
                            class="select select-bordered w-full"
                            @change="updateQrCode"
                        >
                            <option value="L">Low (7%)</option>
                            <option value="M">Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                        </select>
                    </div>

                    <!-- Logo Options -->
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Add Logo/Image</span>
                            <input
                                v-model="qrOptions.includeLogo"
                                type="checkbox"
                                class="toggle toggle-primary"
                                @change="updateQrCode"
                            />
                        </label>
                    </div>

                    <div v-if="qrOptions.includeLogo" class="mt-2">
                        <label class="block text-zinc-700 text-sm mb-2">Upload Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            class="file-input file-input-bordered w-full"
                            @change="handleLogoUpload"
                        />

                        <div class="form-control mt-3">
                            <label class="label">
                                <span class="label-text">Logo Size (%)</span>
                                <span class="label-text-alt">{{ qrOptions.logoSize }}%</span>
                            </label>
                            <input
                                v-model="qrOptions.logoSize"
                                type="range"
                                min="5"
                                max="20"
                                step="1"
                                class="range range-primary"
                                @input="updateQrCode"
                            />
                        </div>
                    </div>
                </div>

                <!-- QR Code Preview -->
                <div class="bg-base-100 p-4 rounded-lg shadow-sm flex flex-col">
                    <h3 class="font-semibold mb-3">Preview</h3>

                    <div
                        class="flex-grow flex items-center justify-center bg-base-200 rounded-lg overflow-hidden"
                        :class="{ 'p-4': qrCodeUrl }"
                    >
                        <div v-if="isGenerating" class="text-center">
                            <div class="loading loading-spinner loading-lg"></div>
                            <p class="mt-2">Generating QR Code...</p>
                        </div>

                        <div v-else-if="qrError" class="text-center text-error p-4">
                            <Icon :name="uiIcons.warning" class="text-4xl text-error" />
                            <p class="mt-2">{{ qrError }}</p>
                        </div>

                        <img v-else-if="qrCodeUrl" :src="qrCodeUrl" alt="Generated QR Code" class="max-w-full max-h-full" />

                        <div v-else class="text-center text-zinc-500 p-4">
                            <Icon :name="uiIcons.qr" class="text-5xl text-zinc-500" />
                            <p class="mt-2">Enter content to generate a QR code</p>
                        </div>
                    </div>

                    <div class="mt-4 flex justify-center space-x-2">
                        <button @click="downloadQrCode('png')" class="btn btn-primary" :disabled="!qrCodeUrl">
                            <Icon :name="uiIcons.png" class="h-5 w-5 mr-1" />
                            Download PNG
                        </button>

                        <button @click="downloadQrCode('svg')" class="btn btn-outline" :disabled="!qrCodeUrl">
                            <Icon :name="uiIcons.svg" class="h-5 w-5 mr-1" />
                            Download SVG
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tips and Usage Section -->
            <div class="bg-base-200 rounded-lg p-4 mt-8">
                <h3 class="font-semibold mb-2">Tips for QR Codes</h3>
                <ul class="list-disc pl-5 space-y-1 text-zinc-600">
                    <li>Use high contrast between foreground and background colors for better scanning</li>
                    <li>If adding a logo, use the high error correction level</li>
                    <li>Test your QR code on multiple devices to ensure it scans properly</li>
                    <li>Keep the content concise – complex data creates more dense QR codes that are harder to scan</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import QRCode from 'qrcode';

// Content type selection
const contentType = ref('url');

// QR code data based on type
const qrData = ref({
    url: 'https://',
    text: '',
    email: '',
    emailSubject: '',
    emailBody: '',
    phone: '',
});

// QR code options
const qrOptions = ref({
    size: 200,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
    includeLogo: false,
    logoImage: null,
    logoSize: 15, // As percentage of QR code size
});

// State management
const qrCodeUrl = ref('');
const isGenerating = ref(false);
const qrError = ref('');

// Compute the actual content based on the selected type
const qrContent = computed(() => {
    switch (contentType.value) {
        case 'url':
            return qrData.value.url || '';
        case 'text':
            return qrData.value.text || '';
        case 'email':
            let emailContent = `mailto:${qrData.value.email}`;
            const hasSubject = qrData.value.emailSubject.trim() !== '';
            const hasBody = qrData.value.emailBody.trim() !== '';

            if (hasSubject || hasBody) {
                emailContent += '?';
                if (hasSubject) {
                    emailContent += `subject=${encodeURIComponent(qrData.value.emailSubject)}`;
                }
                if (hasBody) {
                    emailContent += `${hasSubject ? '&' : ''}body=${encodeURIComponent(qrData.value.emailBody)}`;
                }
            }
            return emailContent;
        case 'phone':
            return `tel:${qrData.value.phone}`;
        default:
            return '';
    }
});

// Generate QR code
const generateQrCode = async () => {
    const content = qrContent.value;

    if (!content) {
        qrCodeUrl.value = '';
        return;
    }

    try {
        isGenerating.value = true;
        qrError.value = '';

        // QR Code generation options
        const options = {
            errorCorrectionLevel: qrOptions.value.errorCorrectionLevel,
            width: qrOptions.value.size,
            margin: 4,
            color: {
                dark: qrOptions.value.foregroundColor,
                light: qrOptions.value.backgroundColor,
            },
        };

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(content, options);

        // If we want to add a logo
        if (qrOptions.value.includeLogo && qrOptions.value.logoImage) {
            // Create a new image element with the QR code
            const qrImage = new Image();
            qrImage.src = qrCodeDataUrl;

            // Create a canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Wait for QR code image to load
            await new Promise((resolve) => {
                qrImage.onload = resolve;
            });

            // Set canvas size
            canvas.width = qrOptions.value.size;
            canvas.height = qrOptions.value.size;

            // Draw QR code on canvas
            ctx.drawImage(qrImage, 0, 0, canvas.width, canvas.height);

            // Calculate logo size
            const logoSize = qrOptions.value.size * (qrOptions.value.logoSize / 100);
            const logoX = (canvas.width - logoSize) / 2;
            const logoY = (canvas.height - logoSize) / 2;

            // Draw logo on canvas
            ctx.drawImage(qrOptions.value.logoImage, logoX, logoY, logoSize, logoSize);

            // Convert canvas to data URL
            qrCodeUrl.value = canvas.toDataURL('image/png');
        } else {
            // Use QR code without logo
            qrCodeUrl.value = qrCodeDataUrl;
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrError.value = 'Failed to generate QR code. Please check your input.';
    } finally {
        isGenerating.value = false;
    }
};

// Update QR code when content changes
const updateQrCode = () => {
    // Debounce the update to avoid too many renders
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
        generateQrCode();
    }, 300);
};

let updateTimer;

// Handle logo upload
const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        qrError.value = 'Please upload an image file';
        return;
    }

    // Create a new FileReader to read the file
    const reader = new FileReader();

    reader.onload = (e) => {
        // Create an image element
        const img = new Image();
        img.src = e.target.result;

        // Once image is loaded, save it
        img.onload = () => {
            qrOptions.value.logoImage = img;
            updateQrCode();
        };
    };

    reader.readAsDataURL(file);
};

// Download QR code
const downloadQrCode = async (format) => {
    if (!qrCodeUrl.value) return;

    try {
        const link = document.createElement('a');

        if (format === 'svg' && !qrOptions.value.includeLogo) {
            // For SVG format without logo
            const svgString = await QRCode.toString(qrContent.value, {
                errorCorrectionLevel: qrOptions.value.errorCorrectionLevel,
                width: qrOptions.value.size,
                margin: 4,
                color: {
                    dark: qrOptions.value.foregroundColor,
                    light: qrOptions.value.backgroundColor,
                },
                type: 'svg',
            });

            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            link.href = URL.createObjectURL(blob);
            link.download = `qrcode-${Date.now()}.svg`;
        } else {
            // For PNG format or when logo is included
            link.href = qrCodeUrl.value;
            link.download = `qrcode-${Date.now()}.png`;
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading QR code:', error);
        qrError.value = 'Failed to download QR code';
    }
};

// Watch for content type changes
watch(contentType, () => {
    updateQrCode();
});

// Initialize
onMounted(() => {
    // Set default URL if empty
    if (!qrData.value.url) {
        qrData.value.url = 'https://';
    }
});
</script>
