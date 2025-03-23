<!-- components/Convert/HealthTools/CaloriesConverter.vue -->
<template>
    <div class="max-w-xl mx-auto">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.heartPulse" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-6 text-center">Calories Burned Converter</h1>
        </div>

        <!-- From Section -->
        <div class="mb-4">
            <label class="block text-base-content text-sm font-medium mb-2">From</label>
            <div class="join w-full">
                <input
                    v-model="fromValue"
                    type="number"
                    class="input input-bordered join-item flex-1"
                    placeholder="Value"
                    min="0"
                    step="any"
                    @input="convert"
                />
                <select v-model="fromUnit" class="select select-bordered join-item w-2/5" @change="convert">
                    <option v-for="unit in units.filter(item => item.id != toUnit)" :key="unit.id" :value="unit.id">
                        {{ unit.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Swap Button -->
        <div class="flex justify-center my-2">
            <button @click="swapUnits" class="btn btn-circle btn-sm btn-outline">
                <Icon :name="uiIcons.transfer" class="h-5 w-5" />
            </button>
        </div>

        <!-- To Section -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">To</label>
            <div class="join w-full">
                <input
                    v-model="toValue"
                    type="text"
                    class="input input-bordered join-item flex-1"
                    placeholder="Result"
                    readonly
                />
                <select v-model="toUnit" class="select select-bordered join-item w-2/5" @change="convert">
                    <option v-for="unit in units.filter(item => item.id != fromUnit)" :key="unit.id" :value="unit.id">
                        {{ unit.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Activity Type Selection -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">Activity Type</label>
            <select v-model="selectedActivity" class="select select-bordered w-full" @change="convert">
                <option v-for="activity in activities" :key="activity.id" :value="activity.id">
                    {{ activity.name }} ({{ activity.rate }} cal/min)
                </option>
            </select>
        </div>

        <!-- Copy Result Button -->
        <button v-if="toValue" @click="copyToClipboard(toValue)" class="btn btn-primary w-full mb-6">
            <Icon :name="uiIcons.copy" class="mr-2" />Copy Result
        </button>

        <!-- Formula Display -->
        <div v-if="fromValue && toValue" class="mt-2 text-base-content p-4 bg-base-200 rounded-xl">
            <p class="font-semibold">{{ fromValue }} {{ getUnitName(fromUnit) }} = {{ toValue }} {{ getUnitName(toUnit) }}</p>
            <p class="text-sm mt-1 text-base-content/70">
                Based on {{ getActivityName(selectedActivity) }} ({{ getActivityRate(selectedActivity) }} calories/minute)
            </p>
        </div>

        <!-- Common Exercise Calorie Chart -->
        <details class="collapse collapse-arrow bg-base-200 mt-6 mb-8" open>
            <summary class="collapse-title font-medium">Exercise Calorie Burn Rates</summary>
            <div class="collapse-content">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Calories/Min</th>
                            <th>For 30 mins</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in activities" :key="activity.id">
                            <td>{{ activity.name }}</td>
                            <td>{{ activity.rate }}</td>
                            <td>{{ (activity.rate * 30).toFixed(0) }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-xs mt-2 text-base-content/70">
                    * Rates are approximate for a 155 lb (70 kg) person. Actual values vary based on weight, intensity, and
                    fitness level.
                </p>
            </div>
        </details>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';

const appState = useAppState();

// Unit definitions
const units = [
    { id: 'calories', name: 'Calories' },
    { id: 'minutes', name: 'Minutes' },
];

// Activities with their calorie burn rates (cal/min)
const activities = [
    { id: 'walking', name: 'Walking (3 mph)', rate: 4.5 },
    { id: 'jogging', name: 'Jogging (5 mph)', rate: 8.3 },
    { id: 'running', name: 'Running (7.5 mph)', rate: 13.5 },
    { id: 'cycling', name: 'Cycling (moderate)', rate: 8.0 },
    { id: 'swimming', name: 'Swimming (leisurely)', rate: 6.0 },
    { id: 'weightLifting', name: 'Weight Lifting', rate: 5.0 },
    { id: 'yoga', name: 'Yoga', rate: 3.0 },
    { id: 'hiit', name: 'HIIT Workout', rate: 14.0 },
    { id: 'zumba', name: 'Zumba', rate: 7.5 },
    { id: 'elliptical', name: 'Elliptical Trainer', rate: 6.0 },
];

// State variables
const fromUnit = ref('calories');
const toUnit = ref('minutes');
const fromValue = ref('');
const toValue = ref('');
const selectedActivity = ref('walking');

// Get unit and activity details
const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : unitId;
};

const getActivityName = (activityId) => {
    const activity = activities.find((a) => a.id === activityId);
    return activity ? activity.name : activityId;
};

const getActivityRate = (activityId) => {
    const activity = activities.find((a) => a.id === activityId);
    return activity ? activity.rate : 5;
};

// Conversion function
const convert = () => {
    if (!fromValue.value || isNaN(fromValue.value) || parseFloat(fromValue.value) < 0) {
        toValue.value = '';
        return;
    }

    const value = parseFloat(fromValue.value);
    const activity = activities.find((a) => a.id === selectedActivity.value);
    const rate = activity ? activity.rate : 5;

    let result;

    if (fromUnit.value === 'calories' && toUnit.value === 'minutes') {
        // Convert calories to minutes
        result = value / rate;
    } else if (fromUnit.value === 'minutes' && toUnit.value === 'calories') {
        // Convert minutes to calories
        result = value * rate;
    } else {
        // Same unit, no conversion needed
        result = value;
    }

    // Format the result
    if (toUnit.value === 'calories') {
        toValue.value = result.toFixed(0);
    } else {
        toValue.value = result.toFixed(1);
    }
};

// Swap units function
const swapUnits = () => {
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    convert();
};

// Copy to clipboard function
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        appState.value.showToast = true;
        setTimeout(() => (appState.value.showToast = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Watch for changes to perform conversion
watch([fromUnit, toUnit, selectedActivity], convert);
</script>
