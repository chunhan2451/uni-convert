<!-- components/Convert/Time/TimestampConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Unix Timestamp Converter</h1>
            <p class="text-zinc-600 mb-6 text-center">Convert between human-readable dates and Unix timestamps</p>

            <!-- Mode selection -->
            <div class="tabs tabs-boxed justify-center mb-6">
                <a class="tab" :class="{ 'tab-active': mode === 'timestamp-to-date' }" @click="mode = 'timestamp-to-date'">
                    Timestamp to Date
                </a>
                <a class="tab" :class="{ 'tab-active': mode === 'date-to-timestamp' }" @click="mode = 'date-to-timestamp'">
                    Date to Timestamp
                </a>
            </div>

            <!-- Current timestamp display -->
            <div class="alert bg-base-200 mb-6">
                <div>
                    <Icon :name="uiIcons.clock" class="h-5 w-5 mr-2" />
                    <span
                        >Current Timestamp: <strong>{{ currentTimestamp }}</strong></span
                    >
                </div>
                <div>
                    <button @click="copyToClipboard(currentTimestamp.toString())" class="btn btn-sm btn-ghost">
                        <Icon :name="uiIcons.copy" class="mr-1" />Copy
                    </button>
                    <button @click="useCurrentTimestamp" class="btn btn-sm btn-primary ml-2">Use This</button>
                </div>
            </div>

            <!-- Timestamp to Date Converter -->
            <div v-if="mode === 'timestamp-to-date'" class="space-y-6">
                <div>
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Unix Timestamp</label>
                    <div class="flex gap-2">
                        <input
                            v-model="timestampInput"
                            type="number"
                            class="input input-bordered w-full"
                            placeholder="Enter Unix timestamp (e.g., 1609459200)"
                            @input="convertTimestampToDate"
                        />
                        <button @click="clearTimestampInput" class="btn btn-ghost">
                            <Icon :name="uiIcons.eraser" class="h-5 w-5" />
                        </button>
                    </div>
                    <div v-if="timestampError" class="text-error text-sm mt-1">{{ timestampError }}</div>
                    <div class="text-xs text-zinc-500 mt-1">Enter seconds since Unix Epoch (January 1, 1970)</div>
                </div>

                <div>
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Format Options</label>
                    <div class="flex flex-wrap gap-2">
                        <label v-for="format in dateFormats" :key="format.id" class="flex items-center">
                            <input
                                type="radio"
                                v-model="selectedDateFormat"
                                :value="format.id"
                                class="radio radio-sm radio-primary mr-1"
                                @change="convertTimestampToDate"
                            />
                            <span class="text-sm">{{ format.label }}</span>
                        </label>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">Converted Date</label>
                        <button v-if="dateResult" @click="copyToClipboard(dateResult)" class="btn btn-xs btn-primary">
                            <Icon :name="uiIcons.copy" class="mr-1" />Copy
                        </button>
                    </div>
                    <input
                        :value="dateResult"
                        class="input input-bordered w-full"
                        placeholder="Converted date will appear here"
                        readonly
                    />
                </div>
            </div>

            <!-- Date to Timestamp Converter -->
            <div v-else class="space-y-6">
                <div>
                    <label class="block text-zinc-700 text-sm font-medium mb-2">Date and Time</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                v-model="dateInput"
                                type="date"
                                class="input input-bordered w-full"
                                @change="convertDateToTimestamp"
                            />
                        </div>
                        <div>
                            <input
                                v-model="timeInput"
                                type="time"
                                class="input input-bordered w-full"
                                @change="convertDateToTimestamp"
                            />
                        </div>
                    </div>
                    <div v-if="dateError" class="text-error text-sm mt-1">{{ dateError }}</div>
                    <div class="text-xs text-zinc-500 mt-1">Local date and time in your timezone</div>
                </div>

                <div>
                    <button @click="useCurrentDatetime" class="btn btn-sm btn-outline">
                        <Icon :name="uiIcons.clock" class="mr-1" />
                        Use Current Date & Time
                    </button>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-zinc-700 text-sm font-medium">Unix Timestamp</label>
                        <button v-if="timestampResult" @click="copyToClipboard(timestampResult)" class="btn btn-xs btn-primary">
                            <Icon :name="uiIcons.copy" class="mr-1" />Copy
                        </button>
                    </div>
                    <input
                        :value="timestampResult"
                        class="input input-bordered w-full"
                        placeholder="Timestamp will appear here"
                        readonly
                    />
                </div>
            </div>

            <!-- Reference table -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">About Unix Timestamps</h3>
                <p class="text-zinc-600 mb-3">
                    A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not
                    counting leap seconds. It's a way to track time as a running total of seconds.
                </p>

                <h4 class="font-medium mt-4 mb-2">Notable Unix Timestamps</h4>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Unix Timestamp</th>
                                <th>Human-readable Date (UTC)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Unix Epoch</td>
                                <td>0</td>
                                <td>January 1, 1970 00:00:00</td>
                            </tr>
                            <tr>
                                <td>1 Billion Seconds</td>
                                <td>1000000000</td>
                                <td>September 9, 2001 01:46:40</td>
                            </tr>
                            <tr>
                                <td>Y2K38 Problem</td>
                                <td>2147483647</td>
                                <td>January 19, 2038 03:14:07</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { timeConverters } from '~/utils/timeConverters';
import { useAppState } from '~/composables/states'

const appState = useAppState();

// State
const mode = ref('timestamp-to-date');
const timestampInput = ref('');
const timestampError = ref('');
const dateInput = ref('');
const timeInput = ref('');
const dateError = ref('');
const dateResult = ref('');
const timestampResult = ref('');
const selectedDateFormat = ref('local');

// Format options
const dateFormats = [
    { id: 'local', label: 'Local' },
    { id: 'iso', label: 'ISO 8601' },
    { id: 'date', label: 'Date Only' },
    { id: 'time', label: 'Time Only' },
];

// Current timestamp (updates every second)
const currentTimestamp = ref(Math.floor(Date.now() / 1000));
let timestampInterval;

// Initialize component
onMounted(() => {
    // Set default date and time to current
    useCurrentDatetime();

    // Start timer to update current timestamp
    timestampInterval = setInterval(() => {
        currentTimestamp.value = Math.floor(Date.now() / 1000);
    }, 1000);

    // Clean up on unmount
    onUnmounted(() => {
        clearInterval(timestampInterval);
    });
});

// Convert timestamp to date
const convertTimestampToDate = () => {
    timestampError.value = '';
    dateResult.value = '';

    if (!timestampInput.value) {
        return;
    }

    const result = timeConverters.timestampToDate(timestampInput.value, selectedDateFormat.value);

    if (result && typeof result === 'object' && result.error) {
        timestampError.value = result.error;
        return;
    }

    dateResult.value = result;
};

// Convert date to timestamp
const convertDateToTimestamp = () => {
    dateError.value = '';
    timestampResult.value = '';

    if (!dateInput.value) {
        dateError.value = 'Please select a date';
        return;
    }

    // Create date string in format that JS Date constructor understands
    const dateTimeString = `${dateInput.value}T${timeInput.value || '00:00'}:00`;

    const result = timeConverters.dateToTimestamp(dateTimeString);

    if (result && typeof result === 'object' && result.error) {
        dateError.value = result.error;
        return;
    }

    timestampResult.value = result;
};

// Use current timestamp
const useCurrentTimestamp = () => {
    timestampInput.value = currentTimestamp.value.toString();
    convertTimestampToDate();
};

// Use current datetime
const useCurrentDatetime = () => {
    const now = new Date();

    // Format date as YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;

    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;

    convertDateToTimestamp();
};

// Clear timestamp input
const clearTimestampInput = () => {
    timestampInput.value = '';
    timestampError.value = '';
    dateResult.value = '';
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
</script>
