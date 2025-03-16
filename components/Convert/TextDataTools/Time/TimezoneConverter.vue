<!-- components/Convert/Time/TimezoneConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Time Zone Converter</h1>
            <p class="text-zinc-600 mb-6 text-center">Convert times across different time zones</p>

            <!-- Current time display -->
            <div class="alert bg-base-200 mb-8">
                <div>
                    <Icon :name="uiIcons.clock" class="h-5 w-5 mr-2" />
                    <span
                        >Local Time Now: <strong>{{ currentLocalTime }}</strong></span
                    >
                </div>
                <div>
                    <button @click="useCurrentTime" class="btn btn-sm btn-primary">Use Current Time</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Source Time Zone -->
                <div class="bg-base-100 p-6 rounded-lg shadow-sm">
                    <h3 class="font-bold text-lg mb-4">From</h3>

                    <div class="mb-4">
                        <label class="block text-zinc-700 text-sm font-medium mb-2">Time Zone</label>
                        <select v-model="sourceTimeZone" class="select select-bordered w-full" @change="convertTime">
                            <option value="">Select time zone</option>
                            <optgroup v-for="group in timeZones" :key="group.label" :label="group.label">
                                <option
                                    v-for="tz in group.zones"
                                    :key="tz.id"
                                    :value="tz.id === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone : tz.id"
                                >
                                    {{ tz.name }}
                                </option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="block text-zinc-700 text-sm font-medium mb-2">Date & Time</label>
                        <div class="grid grid-cols-2 gap-2">
                            <input v-model="sourceDate" type="date" class="input input-bordered w-full" @change="convertTime" />
                            <input v-model="sourceTime" type="time" class="input input-bordered w-full" @change="convertTime" />
                        </div>
                    </div>

                    <div v-if="sourceTimeDisplay" class="text-sm text-zinc-600 mt-2 mb-4">
                        {{ sourceTimeDisplay }}
                    </div>
                </div>

                <!-- Target Time Zone -->
                <div class="bg-base-100 p-6 rounded-lg shadow-sm">
                    <h3 class="font-bold text-lg mb-4">To</h3>

                    <div class="mb-4">
                        <label class="block text-zinc-700 text-sm font-medium mb-2">Time Zone</label>
                        <select v-model="targetTimeZone" class="select select-bordered w-full" @change="convertTime">
                            <option value="">Select time zone</option>
                            <optgroup v-for="group in timeZones" :key="group.label" :label="group.label">
                                <option
                                    v-for="tz in group.zones"
                                    :key="tz.id"
                                    :value="tz.id === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone : tz.id"
                                >
                                    {{ tz.name }}
                                </option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-zinc-700 text-sm font-medium">Converted Time</label>
                            <button v-if="convertedTime" @click="copyToClipboard(convertedTime)" class="btn btn-xs btn-primary">
                                <Icon :name="uiIcons.copy" class="mr-1" />Copy
                            </button>
                        </div>
                        <div class="p-4 bg-base-200 rounded-lg min-h-10 text-lg font-mono">
                            {{ convertedTime || 'Select time zones and date to convert' }}
                        </div>
                    </div>

                    <div v-if="targetTimeDisplay" class="text-sm text-zinc-600 mt-2">
                        {{ targetTimeDisplay }}
                    </div>
                </div>
            </div>

            <!-- Time Zone Comparison Table -->
            <div v-if="showComparisonTable" class="mt-8 bg-base-200 rounded-lg p-6">
                <h3 class="text-lg font-medium mb-4">Time Around the World Now</h3>
                <div class="overflow-x-auto">
                    <table class="table w-full">
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Current Time</th>
                                <th>Time Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(time, index) in worldTimes" :key="index">
                                <td>{{ time.name }}</td>
                                <td class="font-mono">{{ time.time }}</td>
                                <td>{{ time.difference }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-else class="mt-8">
                <button @click="showComparisonTable = true" class="btn btn-outline w-full">
                    <Icon :name="uiIcons.globe" class="h-5 w-5 mr-2" />
                    Show Time Across Major Cities
                </button>
            </div>

            <!-- Common Time Zone Information -->
            <div class="mt-8 bg-base-200 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">About Time Zones</h3>
                <p class="text-zinc-600 mb-3">
                    Time zones are regions of the globe that observe a uniform standard time for legal, commercial, and social
                    purposes. Time zones tend to follow the boundaries of countries and their subdivisions.
                </p>
                <p class="text-zinc-600">
                    UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time. It
                    is the successor to GMT (Greenwich Mean Time) and is used as the reference point for all time zones.
                </p>
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
import { ref, computed, onMounted } from 'vue';
import { timeConverters } from '~/utils/timeConverters';

// State
const sourceTimeZone = ref('');
const targetTimeZone = ref('');
const sourceDate = ref('');
const sourceTime = ref('');
const convertedTime = ref('');
const sourceTimeDisplay = ref('');
const targetTimeDisplay = ref('');
const showToast = ref(false);
const showComparisonTable = ref(false);
const worldTimes = ref([]);

// Get time zones
const timeZones = computed(() => {
    // Create a comprehensive list of time zones
    const commonZones = timeConverters.getCommonTimeZones();

    // Add all GMT/UTC offsets
    const gmtOffsets = [];
    for (let i = -12; i <= 14; i++) {
        const sign = i >= 0 ? '+' : '';
        gmtOffsets.push({
            id: `Etc/GMT${i === 0 ? '' : sign + i.toString()}`,
            name: `GMT${i === 0 ? '' : sign + i.toString()}`,
        });
    }

    // Group time zones by region
    return [
        {
            label: 'Your Local Timezone',
            zones: [{ id: 'local', name: `Your Local Time (${Intl.DateTimeFormat().resolvedOptions().timeZone})` }],
        },
        { label: 'GMT/UTC', zones: gmtOffsets },
        { label: 'Common Cities', zones: commonZones },
    ];
});

// Format the current local time
const currentLocalTime = computed(() => {
    const now = new Date();
    return now.toLocaleString();
});

// Use current time
const useCurrentTime = () => {
    const now = new Date();

    // Format date as YYYY-MM-DD (required for date input)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    sourceDate.value = `${year}-${month}-${day}`;

    // Format time as HH:MM (required for time input)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    sourceTime.value = `${hours}:${minutes}`;

    // Set source time zone to local time zone if not already set
    if (!sourceTimeZone.value) {
        // Use the browser's time zone
        sourceTimeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    convertTime();
};

// Convert time between time zones
const convertTime = () => {
    if (!sourceTimeZone.value || !targetTimeZone.value || !sourceDate.value || !sourceTime.value) {
        convertedTime.value = '';
        sourceTimeDisplay.value = '';
        targetTimeDisplay.value = '';
        return;
    }

    try {
        // Create a date string in ISO format
        const dateTimeString = `${sourceDate.value}T${sourceTime.value}:00`;

        // Convert time between zones
        const result = timeConverters.convertTimeZone(dateTimeString, sourceTimeZone.value, targetTimeZone.value);

        if (result && typeof result === 'object' && result.error) {
            console.error('Conversion error:', result.error);
            convertedTime.value = 'Error: ' + result.error;
            return;
        }

        // Display source and target time with formatting
        sourceTimeDisplay.value = `Local time in ${getTimeZoneName(sourceTimeZone.value)}`;
        targetTimeDisplay.value = `Local time in ${getTimeZoneName(targetTimeZone.value)}`;

        // Format the converted time for display
        const targetDate = new Date(result.to);
        convertedTime.value = targetDate.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        // If comparison table is open, update it
        if (showComparisonTable.value) {
            updateWorldTimes();
        }
    } catch (error) {
        console.error('Error converting time:', error);
        convertedTime.value = 'Error: Could not convert time';
    }
};

// Get time zone name from ID
const getTimeZoneName = (tzId) => {
    const tz = timeZones.find((t) => t.id === tzId);
    return tz ? tz.name : tzId;
};

// Update world times comparison
const updateWorldTimes = () => {
    const now = new Date();
    const majorTimeZones = [
        { id: 'UTC', name: 'UTC (Coordinated Universal Time)' },
        { id: 'America/New_York', name: 'New York (Eastern Time)' },
        { id: 'America/Chicago', name: 'Chicago (Central Time)' },
        { id: 'America/Denver', name: 'Denver (Mountain Time)' },
        { id: 'America/Los_Angeles', name: 'Los Angeles (Pacific Time)' },
        { id: 'Europe/London', name: 'London (GMT/BST)' },
        { id: 'Europe/Paris', name: 'Paris (Central European Time)' },
        { id: 'Europe/Moscow', name: 'Moscow (Moscow Time)' },
        { id: 'Asia/Tokyo', name: 'Tokyo (Japan Standard Time)' },
        { id: 'Asia/Shanghai', name: 'Shanghai (China Standard Time)' },
        { id: 'Asia/Dubai', name: 'Dubai (Gulf Standard Time)' },
        { id: 'Asia/Kolkata', name: 'India (IST)' },
        { id: 'Australia/Sydney', name: 'Sydney (Australian Eastern Time)' },
        { id: Intl.DateTimeFormat().resolvedOptions().timeZone, name: 'Your Local Time' },
    ];

    // Get the current time in each zone
    worldTimes.value = majorTimeZones.map((tz) => {
        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tz.id,
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                weekday: 'short',
                day: 'numeric',
                month: 'short',
            });

            const time = formatter.format(now);

            // Calculate difference from local time
            // This is a simplified approach; more accurate methods would account for DST
            const localOffset = now.getTimezoneOffset();
            const targetOffset = new Date(now.toLocaleString('en-US', { timeZone: tz.id })).getTimezoneOffset();
            const diffHours = (localOffset - targetOffset) / 60;

            const differenceText =
                diffHours === 0
                    ? 'Same as local time'
                    : `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours > 0 ? 'ahead' : 'behind'}`;

            return {
                name: tz.name,
                time,
                difference: differenceText,
            };
        } catch (e) {
            return {
                name: tz.name,
                time: 'Not available',
                difference: 'Unknown',
            };
        }
    });
};

// Copy to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Initialize on mount
onMounted(() => {
    // Set up sensible defaults
    useCurrentTime();

    // Set target timezone to UTC by default if not already set
    if (!targetTimeZone.value) {
        targetTimeZone.value = 'UTC';
        convertTime();
    }
});
</script>
