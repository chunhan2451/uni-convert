<!-- components/Convert/Time/DurationConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.clock" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">Duration Converter</h1>
            </div>
            <p class="text-zinc-600 mb-6 text-center">Convert between different time duration formats</p>

            <!-- Mode selection -->
            <div class="tabs tabs-lift justify-center mb-8">
                <a class="tab" :class="{ 'tab-active': mode === 'seconds-to-human' }" @click="mode = 'seconds-to-human'">
                    Seconds to Human Format
                </a>
                <a class="tab" :class="{ 'tab-active': mode === 'human-to-seconds' }" @click="mode = 'human-to-seconds'">
                    Human Format to Seconds
                </a>
            </div>

            <!-- Seconds to Human Format -->
            <div v-if="mode === 'seconds-to-human'" class="rounded-lg mb-8">
                <div class="mb-6">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Seconds</label>
                    <div class="flex gap-2">
                        <input
                            v-model="secondsInput"
                            type="number"
                            min="0"
                            class="input input-bordered w-full text-base"
                            placeholder="Enter number of seconds"
                            @input="convertSecondsToHuman"
                        />
                        <button @click="clearSeconds" class="btn btn-ghost">
                            <Icon :name="uiIcons.eraser" class="h-5 w-5 text-lg" />
                        </button>
                    </div>
                    <div v-if="secondsError" class="text-error text-sm mt-1">{{ secondsError }}</div>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">Human Readable Format</label>
                        <button v-if="humanDuration" @click="copyToClipboard(humanDuration)" class="btn btn-xs btn-primary">
                            <Icon :name="uiIcons.copy" class="mr-1" />Copy
                        </button>
                    </div>
                    <div class="p-4 bg-base-200 rounded-lg min-h-10 text-xl">
                        {{ humanDuration || 'Enter seconds to convert' }}
                    </div>
                </div>

                <!-- Quick presets -->
                <div class="mt-6">
                    <h3 class="text-sm font-medium text-zinc-700 mb-2">Quick Presets</h3>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="preset in secondsPresets"
                            :key="preset.seconds"
                            @click="applySecondsPreset(preset.seconds)"
                            class="btn btn-outline btn-sm"
                        >
                            {{ preset.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Human Format to Seconds -->
            <div v-else class="rounded-lg mb-8">
                <div class="mb-4">
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Human Duration Format</label>
                    <input
                        v-model="humanInput"
                        type="text"
                        class="input input-bordered w-full text-base"
                        placeholder="e.g. 2 days 5 hours 30 min"
                        @input="convertHumanToSeconds"
                    />
                    <div class="text-xs text-zinc-500 mt-1">
                        Examples: "2 days 5 hours", "1h 30m", "90 minutes", "2d 6h 30m 15s"
                    </div>
                    <div v-if="humanError" class="text-error text-sm mt-1">{{ humanError }}</div>
                </div>

                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">Seconds</label>
                        <button v-if="seconds" @click="copyToClipboard(seconds.toString())" class="btn btn-xs btn-primary">
                            <Icon :name="uiIcons.copy" class="mr-1" />Copy
                        </button>
                    </div>
                    <div class="p-4 bg-base-200 rounded-lg min-h-10 text-xl">
                        {{ seconds || 'Enter duration to convert' }}
                    </div>
                </div>

                <!-- Component selector -->
                <div class="mt-6">
                    <h3 class="text-sm font-medium text-zinc-700 mb-2">Build Duration</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div>
                            <label class="block text-zinc-700 text-xs mb-1">Days</label>
                            <input
                                v-model="durationComponents.days"
                                type="number"
                                min="0"
                                class="input input-bordered w-full"
                                @input="buildDurationFromComponents"
                            />
                        </div>
                        <div>
                            <label class="block text-zinc-700 text-xs mb-1">Hours</label>
                            <input
                                v-model="durationComponents.hours"
                                type="number"
                                min="0"
                                max="23"
                                class="input input-bordered w-full"
                                @input="buildDurationFromComponents"
                            />
                        </div>
                        <div>
                            <label class="block text-zinc-700 text-xs mb-1">Minutes</label>
                            <input
                                v-model="durationComponents.minutes"
                                type="number"
                                min="0"
                                max="59"
                                class="input input-bordered w-full"
                                @input="buildDurationFromComponents"
                            />
                        </div>
                        <div>
                            <label class="block text-zinc-700 text-xs mb-1">Seconds</label>
                            <input
                                v-model="durationComponents.seconds"
                                type="number"
                                min="0"
                                max="59"
                                class="input input-bordered w-full"
                                @input="buildDurationFromComponents"
                            />
                        </div>
                    </div>
                    <button @click="applyComponents" class="btn btn-primary btn-sm w-full">Use This Duration</button>
                </div>
            </div>

            <!-- Duration Conversion Table -->
            <div class="bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">Common Duration Equivalents</h3>

                <div class="overflow-x-auto">
                    <table class="table w-full">
                        <thead>
                            <tr>
                                <th>Duration</th>
                                <th>Seconds</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1 minute</td>
                                <td>60</td>
                                <td>Time for a quick coffee</td>
                            </tr>
                            <tr>
                                <td>1 hour</td>
                                <td>3,600</td>
                                <td>Typical meeting length</td>
                            </tr>
                            <tr>
                                <td>1 day</td>
                                <td>86,400</td>
                                <td>Full 24-hour cycle</td>
                            </tr>
                            <tr>
                                <td>1 week</td>
                                <td>604,800</td>
                                <td>7 complete days</td>
                            </tr>
                            <tr>
                                <td>30 days</td>
                                <td>2,592,000</td>
                                <td>Average month length</td>
                            </tr>
                            <tr>
                                <td>365 days</td>
                                <td>31,536,000</td>
                                <td>Non-leap year</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { timeConverters } from '~/utils/timeConverters';
import { useAppState } from '~/composables/states'

const appState = useAppState();

// State
const mode = ref('seconds-to-human');
const secondsInput = ref('');
const humanInput = ref('');
const humanDuration = ref('');
const seconds = ref('');
const secondsError = ref('');
const humanError = ref('');

// Duration components builder
const durationComponents = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
});

// Quick presets for seconds
const secondsPresets = [
    { label: '1 minute', seconds: 60 },
    { label: '15 minutes', seconds: 900 },
    { label: '30 minutes', seconds: 1800 },
    { label: '1 hour', seconds: 3600 },
    { label: '1 day', seconds: 86400 },
    { label: '1 week', seconds: 604800 },
];

// Convert seconds to human readable format
const convertSecondsToHuman = () => {
    secondsError.value = '';
    humanDuration.value = '';

    if (!secondsInput.value) {
        return;
    }

    const secs = parseInt(secondsInput.value);

    if (isNaN(secs)) {
        secondsError.value = 'Please enter a valid number';
        return;
    }

    if (secs < 0) {
        secondsError.value = 'Seconds cannot be negative';
        return;
    }

    try {
        const result = timeConverters.formatDuration(secs);

        if (result && typeof result === 'object' && result.error) {
            secondsError.value = result.error;
            return;
        }

        humanDuration.value = result;
    } catch (error) {
        secondsError.value = error.message || 'Error formatting duration';
    }
};

// Convert human readable format to seconds
const convertHumanToSeconds = () => {
    humanError.value = '';
    seconds.value = '';

    if (!humanInput.value) {
        return;
    }

    try {
        const result = timeConverters.parseDuration(humanInput.value);

        if (result && typeof result === 'object' && result.error) {
            humanError.value = result.error;
            return;
        }

        seconds.value = result;
    } catch (error) {
        humanError.value = error.message || 'Error parsing duration';
    }
};

// Build duration string from components
const buildDurationFromComponents = () => {
    const { days, hours, minutes, seconds: secs } = durationComponents.value;

    const parts = [];

    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (secs > 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(' ') : '0 seconds';
};

// Apply components to input
const applyComponents = () => {
    humanInput.value = buildDurationFromComponents();
    convertHumanToSeconds();
};

// Apply seconds preset
const applySecondsPreset = (value) => {
    secondsInput.value = value.toString();
    convertSecondsToHuman();
};

// Clear seconds input
const clearSeconds = () => {
    secondsInput.value = '';
    humanDuration.value = '';
    secondsError.value = '';
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

// Watch for mode changes
watch(mode, () => {
    // Reset fields when switching modes
    secondsInput.value = '';
    humanInput.value = '';
    humanDuration.value = '';
    seconds.value = '';
    secondsError.value = '';
    humanError.value = '';

    // Reset duration components
    durationComponents.value = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };
});
</script>
