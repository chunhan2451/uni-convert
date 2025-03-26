<!-- components/Convert/HealthTools/BmiCalculator.vue -->
<template>
    <div class="max-w-xl mx-auto">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.heartPulse" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-6 text-center">BMI Calculator</h1>
        </div>

        <!-- Height Section -->
        <div class="mb-4">
            <label class="block text-base-content text-sm font-medium mb-2">Height</label>
            <div class="join w-full">
                <input
                    v-model="height"
                    type="number"
                    class="input input-bordered join-item flex-1"
                    placeholder="Height"
                    min="1"
                    @input="calculateBMI"
                />
                <select v-model="heightUnit" class="select select-bordered join-item w-2/5" @change="calculateBMI">
                    <option value="cm">Centimeters (cm)</option>
                    <option value="m">Meters (m)</option>
                    <option value="in">Inches (in)</option>
                    <option value="ft">Feet (ft)</option>
                </select>
            </div>
        </div>

        <!-- Weight Section -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">Weight</label>
            <div class="join w-full">
                <input
                    v-model="weight"
                    type="number"
                    class="input input-bordered join-item flex-1"
                    placeholder="Weight"
                    min="1"
                    @input="calculateBMI"
                />
                <select v-model="weightUnit" class="select select-bordered join-item w-2/5" @change="calculateBMI">
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lb">Pounds (lb)</option>
                </select>
            </div>
        </div>

        <!-- Result Section -->
        <div v-if="bmiResult" class="bg-base-200 p-4 rounded-lg mb-4">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-lg font-bold">BMI: {{ bmiResult.toFixed(1) }}</p>
                    <p class="text-base-content/70">{{ getBMICategory(bmiResult) }}</p>
                </div>
                <button
                    @click="copyToClipboard(`BMI: ${bmiResult.toFixed(1)} - ${getBMICategory(bmiResult)}`)"
                    class="btn btn-sm btn-primary"
                >
                    <Icon :name="uiIcons.copy" class="h-4 w-4 mr-1" />
                    Copy
                </button>
            </div>
        </div>

        <!-- BMI Categories Table -->
        <details class="collapse collapse-arrow bg-base-200 mt-6 mb-8" open>
            <summary class="collapse-title font-medium">BMI Categories</summary>
            <div class="collapse-content">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>BMI Range</th>
                            <th>Category</th>
                            <th>Health Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Below 18.5</td>
                            <td>Underweight</td>
                            <td>Minimal</td>
                        </tr>
                        <tr>
                            <td>18.5 - 24.9</td>
                            <td>Normal weight</td>
                            <td>Low</td>
                        </tr>
                        <tr>
                            <td>25.0 - 29.9</td>
                            <td>Overweight</td>
                            <td>Increased</td>
                        </tr>
                        <tr>
                            <td>30.0 - 34.9</td>
                            <td>Obesity Class I</td>
                            <td>High</td>
                        </tr>
                        <tr>
                            <td>35.0 - 39.9</td>
                            <td>Obesity Class II</td>
                            <td>Very High</td>
                        </tr>
                        <tr>
                            <td>40.0 and above</td>
                            <td>Obesity Class III</td>
                            <td>Extremely High</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </details>

        <!-- Information Section -->
        <div class="bg-base-200 p-4 rounded-lg text-sm mb-8">
            <h3 class="font-bold mb-2">About BMI</h3>
            <p class="mb-3">
                BMI (Body Mass Index) is a measure of body fat based on height and weight that applies to adult men and women.
            </p>
            <p class="mb-2">BMI Formula:</p>
            <p class="bg-base-300 p-2 rounded mb-3">BMI = weight(kg) / [height(m)]²</p>
            <p class="text-base-content/70">
                Note: BMI is a general guideline and doesn't account for factors like muscle mass, bone density, or overall body
                composition.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';

const appState = useAppState();

// Form state
const height = ref(null);
const weight = ref(null);
const heightUnit = ref('cm');
const weightUnit = ref('kg');
const bmiResult = ref(null);

// Calculate BMI when inputs change
const calculateBMI = () => {
    if (!height.value || !weight.value || isNaN(height.value) || isNaN(weight.value)) {
        bmiResult.value = null;
        return;
    }

    let heightInMeters;
    let weightInKg;

    // Convert height to meters
    if (heightUnit.value === 'cm') {
        heightInMeters = height.value / 100;
    } else if (heightUnit.value === 'm') {
        heightInMeters = height.value;
    } else if (heightUnit.value === 'in') {
        heightInMeters = height.value * 0.0254;
    } else if (heightUnit.value === 'ft') {
        heightInMeters = height.value * 0.3048;
    }

    // Convert weight to kg
    if (weightUnit.value === 'kg') {
        weightInKg = weight.value;
    } else if (weightUnit.value === 'lb') {
        weightInKg = weight.value * 0.453592;
    }

    // Calculate BMI: weight (kg) / height^2 (m^2)
    bmiResult.value = weightInKg / (heightInMeters * heightInMeters);
};

// Get BMI category based on value
const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    if (bmiValue < 35) return 'Obesity Class I';
    if (bmiValue < 40) return 'Obesity Class II';
    return 'Obesity Class III';
};

// Copy result to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        appState.value.showToast = true;
        setTimeout(() => (appState.value.showToast = false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Watch for changes in units to recalculate
watch([heightUnit, weightUnit], calculateBMI);
</script>
