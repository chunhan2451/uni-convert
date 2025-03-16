<!-- components/Convert/Text/TextStats.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Text Statistics</h1>
            <p class="text-zinc-600 mb-6 text-center">Analyze your text for character count, word count, and more</p>

            <!-- Input Area -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-zinc-700 text-sm font-medium">Text Input</label>
                    <div class="flex space-x-2">
                        <button @click="clearInput" class="btn btn-xs btn-ghost">Clear</button>
                        <button @click="pasteClipboard" class="btn btn-xs btn-ghost">
                            <Icon name="solar:clipboard-linear" class="h-4 w-4 mr-1" />
                            Paste
                        </button>
                    </div>
                </div>
                <textarea
                    v-model="inputText"
                    class="textarea textarea-bordered w-full min-h-40"
                    placeholder="Type or paste your text here..."
                    @input="analyzeText"
                ></textarea>
            </div>

            <!-- Stats Display -->
            <div class="bg-base-200 rounded-lg p-6 mb-8">
                <!-- Main stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                        <div class="text-3xl font-bold text-primary">{{ stats.characters || 0 }}</div>
                        <div class="text-sm text-zinc-600">Characters</div>
                    </div>

                    <div class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                        <div class="text-3xl font-bold text-primary">{{ stats.charactersNoSpaces || 0 }}</div>
                        <div class="text-sm text-zinc-600">Characters (no spaces)</div>
                    </div>

                    <div class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                        <div class="text-3xl font-bold text-primary">{{ stats.words || 0 }}</div>
                        <div class="text-sm text-zinc-600">Words</div>
                    </div>

                    <div class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                        <div class="text-3xl font-bold text-primary">{{ stats.lines || 0 }}</div>
                        <div class="text-sm text-zinc-600">Lines</div>
                    </div>
                </div>

                <!-- Additional stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-base-100 p-4 rounded-lg shadow-sm">
                        <h3 class="font-medium mb-2 flex items-center">
                            <Icon name="solar:time-square-bold" class="h-5 w-5 mr-2 text-secondary" />
                            Reading Time
                        </h3>
                        <div class="flex items-center">
                            <div class="text-2xl font-bold">{{ stats.readingTimeMinutes || 0 }}</div>
                            <div class="ml-2 text-zinc-600">minute{{ stats.readingTimeMinutes !== 1 ? 's' : '' }}</div>
                        </div>
                        <div class="text-xs text-zinc-500 mt-1">Based on average reading speed of 200 words per minute</div>
                    </div>

                    <div class="bg-base-100 p-4 rounded-lg shadow-sm">
                        <h3 class="font-medium mb-2 flex items-center">
                            <Icon name="solar:notebook-linear" class="h-5 w-5 mr-2 text-secondary" />
                            Paragraph Count
                        </h3>
                        <div class="flex items-center">
                            <div class="text-2xl font-bold">{{ paragraphCount }}</div>
                            <div class="ml-2 text-zinc-600">paragraph{{ paragraphCount !== 1 ? 's' : '' }}</div>
                        </div>
                        <div class="text-xs text-zinc-500 mt-1">Calculated based on empty line breaks</div>
                    </div>
                </div>
            </div>

            <!-- Word Frequency Analysis -->
            <div v-if="showWordFrequency && Object.keys(wordFrequency).length > 0" class="bg-base-200 rounded-lg p-6 mb-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Word Frequency</h3>
                    <button @click="toggleWordFrequency" class="btn btn-xs btn-ghost">Hide</button>
                </div>

                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th class="text-right">Count</th>
                                <th class="text-right">Frequency</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in sortedWordFrequency.slice(0, 10)" :key="index">
                                <td>{{ item.word }}</td>
                                <td class="text-right">{{ item.count }}</td>
                                <td class="text-right">{{ (item.frequency * 100).toFixed(1) }}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-else class="mb-8">
                <button @click="toggleWordFrequency" class="btn btn-outline w-full">
                    <Icon name="solar:chart-line-linear" class="h-5 w-5 mr-2" />
                    Show Word Frequency Analysis
                </button>
            </div>

            <!-- Export Options -->
            <div class="flex flex-wrap justify-center gap-2">
                <button @click="copyStats" class="btn btn-primary">
                    <Icon name="solar:copy-linear" class="mr-2" />
                    Copy Stats
                </button>
                <button @click="downloadReport" class="btn btn-outline">
                    <Icon name="solar:download-linear" class="mr-2" />
                    Download Report
                </button>
            </div>
        </div>

        <!-- Toast Notification -->
        <div v-if="showToast" class="toast toast-end toast-middle">
            <div class="alert alert-success">
                <span>Copied to clipboard!</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { textConverters } from '~/utils/textDataConverters';

// State
const inputText = ref('');
const stats = ref({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    readingTimeMinutes: 0,
});
const wordFrequency = ref({});
const showWordFrequency = ref(false);
const showToast = ref(false);

// Compute paragraph count
const paragraphCount = computed(() => {
    if (!inputText.value.trim()) return 0;

    // Count groups of text separated by one or more blank lines
    const paragraphs = inputText.value.split(/\n{2,}/);
    return paragraphs.filter((p) => p.trim() !== '').length;
});

// Sort word frequency
const sortedWordFrequency = computed(() => {
    return Object.entries(wordFrequency.value)
        .map(([word, count]) => ({
            word,
            count,
            frequency: count / (stats.value.words || 1),
        }))
        .sort((a, b) => b.count - a.count);
});

// Analyze text
const analyzeText = () => {
    if (!inputText.value) {
        stats.value = {
            characters: 0,
            charactersNoSpaces: 0,
            words: 0,
            lines: 0,
            readingTimeMinutes: 0,
        };
        wordFrequency.value = {};
        return;
    }

    stats.value = textConverters.getTextStats(inputText.value);

    // Calculate word frequency
    if (showWordFrequency.value) {
        updateWordFrequency();
    }
};

// Update word frequency
const updateWordFrequency = () => {
    const frequency = {};
    const text = inputText.value.toLowerCase();

    // Extract words using regex
    const words = text.match(/\b[a-z']+\b/g) || [];

    // Count occurrences
    words.forEach((word) => {
        if (!frequency[word]) {
            frequency[word] = 0;
        }
        frequency[word]++;
    });

    wordFrequency.value = frequency;
};

// Toggle word frequency analysis
const toggleWordFrequency = () => {
    showWordFrequency.value = !showWordFrequency.value;

    if (showWordFrequency.value && inputText.value) {
        updateWordFrequency();
    }
};

// Clear input
const clearInput = () => {
    inputText.value = '';
    analyzeText();
};

// Paste from clipboard
const pasteClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
        analyzeText();
    } catch (err) {
        console.error('Failed to read clipboard:', err);
    }
};

// Copy stats to clipboard
const copyStats = async () => {
    if (!inputText.value) return;

    const statsText = `Text Statistics:
  Characters: ${stats.value.characters}
  Characters (no spaces): ${stats.value.charactersNoSpaces}
  Words: ${stats.value.words}
  Lines: ${stats.value.lines}
  Paragraphs: ${paragraphCount.value}
  Reading Time: ${stats.value.readingTimeMinutes} minute(s)
  `;

    try {
        await navigator.clipboard.writeText(statsText);
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Download report
const downloadReport = () => {
    if (!inputText.value) return;

    // Create report content
    let reportContent = `# Text Statistics Report
  
  ## Basic Statistics
  - Characters: ${stats.value.characters}
  - Characters (no spaces): ${stats.value.charactersNoSpaces}
  - Words: ${stats.value.words}
  - Lines: ${stats.value.lines}
  - Paragraphs: ${paragraphCount.value}
  - Reading Time: ${stats.value.readingTimeMinutes} minute(s)
  
  `;

    // Add word frequency if available
    if (Object.keys(wordFrequency.value).length > 0) {
        reportContent += `## Word Frequency (Top 20)
  `;

        sortedWordFrequency.value.slice(0, 20).forEach((item, index) => {
            reportContent += `${index + 1}. "${item.word}": ${item.count} (${(item.frequency * 100).toFixed(1)}%)
  `;
        });
    }

    // Create download link
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-stats-report.md';
    a.click();
    URL.revokeObjectURL(url);
};
</script>
