<!-- components/Convert/HealthTools/BmrCalculator.vue -->
<template>
    <div class="max-w-xl container mx-auto px-4 py-3">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.heartPulse" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-2 text-center">BMR Calculator</h1>
            <p class="text-base-content/70 mb-6 text-center">Calculate your Basal Metabolic Rate and daily calorie needs</p>
        </div>

        <!-- Gender Selection -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">Gender</label>
            <div class="flex gap-2">
                <button @click="gender = 'male'" class="btn flex-1" :class="gender === 'male' ? 'btn-primary' : 'btn-outline'">
                    Male
                </button>
                <button
                    @click="gender = 'female'"
                    class="btn flex-1"
                    :class="gender === 'female' ? 'btn-primary' : 'btn-outline'"
                >
                    Female
                </button>
            </div>
        </div>

        <!-- Age, Weight, Height Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Age Input -->
            <div>
                <label class="block text-base-content text-sm font-medium mb-2">Age</label>
                <div class="join w-full">
                    <input
                        v-model="age"
                        type="number"
                        class="input input-bordered join-item w-full"
                        placeholder="Age"
                        min="15"
                        max="100"
                    />
                    <div class="join-item bg-base-200 px-3 flex items-center">yrs</div>
                </div>
            </div>

            <!-- Weight Input -->
            <div>
                <label class="block text-base-content text-sm font-medium mb-2">Weight</label>
                <div class="join w-full">
                    <input
                        v-model="weight"
                        type="number"
                        class="input input-bordered join-item w-full"
                        placeholder="Weight"
                        min="30"
                        max="300"
                    />
                    <select v-model="weightUnit" class="select select-bordered join-item">
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                    </select>
                </div>
            </div>

            <!-- Height Input -->
            <div>
                <label class="block text-base-content text-sm font-medium mb-2">Height</label>
                <div class="join w-full">
                    <input
                        v-model="height"
                        type="number"
                        class="input input-bordered join-item w-full"
                        placeholder="Height"
                        min="100"
                        max="250"
                    />
                    <select v-model="heightUnit" class="select select-bordered join-item">
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Activity Level -->
        <div class="mb-6">
            <label class="block text-base-content text-sm font-medium mb-2">Activity Level</label>
            <select v-model="activityLevel" class="select select-bordered w-full">
                <option value="1.2">Sedentary (little or no exercise)</option>
                <option value="1.375">Lightly active (exercise 1-3 days/week)</option>
                <option value="1.55">Moderately active (exercise 3-5 days/week)</option>
                <option value="1.725">Very active (exercise 6-7 days/week)</option>
                <option value="1.9">Extra active (very intense exercise daily)</option>
            </select>
        </div>

        <!-- Calculate Button -->
        <button @click="calculateBMR" class="btn btn-primary w-full mb-6" :disabled="!isValid">
            <Icon :name="uiIcons.calculator" class="mr-2" />Calculate BMR and TDEE
        </button>

        <!-- Results Section -->
        <div v-if="bmrResult && tdeeResult" class="bg-base-200 p-5 rounded-lg mb-6">
            <div class="grid grid-cols-2 gap-6">
                <div class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                    <h3 class="text-primary font-medium mb-1">Your Basal Metabolic Rate</h3>
                    <p class="text-3xl font-bold mb-1">{{ Math.round(bmrResult) }}</p>
                    <p class="text-sm text-base-content/70">calories/day at rest</p>
                </div>

                <div class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                    <h3 class="text-primary font-medium mb-1">Total Daily Energy</h3>
                    <p class="text-3xl font-bold mb-1">{{ Math.round(tdeeResult) }}</p>
                    <p class="text-sm text-base-content/70">calories/day with activity</p>
                </div>
            </div>

            <!-- Weight Goals -->
            <div class="mt-6">
                <h3 class="font-semibold mb-3">Daily Calories by Goal</h3>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Goal</th>
                                <th>Calories</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Weight Loss</td>
                                <td>{{ Math.round(tdeeResult * 0.8) }}</td>
                                <td>20% calorie deficit</td>
                            </tr>
                            <tr>
                                <td>Mild Weight Loss</td>
                                <td>{{ Math.round(tdeeResult * 0.9) }}</td>
                                <td>10% calorie deficit</td>
                            </tr>
                            <tr>
                                <td>Maintenance</td>
                                <td>{{ Math.round(tdeeResult) }}</td>
                                <td>Maintain current weight</td>
                            </tr>
                            <tr>
                                <td>Weight Gain</td>
                                <td>{{ Math.round(tdeeResult * 1.1) }}</td>
                                <td>10% calorie surplus</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Copy Results Button -->
            <button @click="copyResults" class="btn btn-outline w-full mt-4">
                <Icon :name="uiIcons.copy" class="mr-2" />Copy Results
            </button>
        </div>

        <!-- Explanation Section -->
        <details class="collapse collapse-arrow bg-base-200 my-6" open>
            <summary class="collapse-title font-medium">About BMR and TDEE</summary>
            <div class="collapse-content">
                <h3 class="font-bold mb-2">What is BMR?</h3>
                <p class="text-base-content/70 mb-4">
                    Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic physiological functions
                    while at rest - including breathing, circulating blood, and cell production.
                </p>

                <h3 class="font-bold mb-2">What is TDEE?</h3>
                <p class="text-base-content/70 mb-4">
                    Total Daily Energy Expenditure (TDEE) is the total number of calories you burn daily, accounting for your
                    activity level. It's your BMR multiplied by an activity factor.
                </p>

                <h3 class="font-bold mb-2">BMR Formula Used:</h3>
                <p class="text-base-content/70 mb-4">
                    This calculator uses the Mifflin-St Jeor Equation, which is considered one of the most accurate equations for
                    calculating BMR:
                </p>
                <div class="bg-base-300 p-3 rounded-lg mb-4">
                    <p><strong>For men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
                    <p>
                        <strong>For women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
                    </p>
                </div>

                <p class="text-xs text-base-content/70 mt-4">
                    Note: This calculator provides estimates only. Individual metabolism varies, and factors like medical
                    conditions, medications, and specific dietary needs should be considered. Always consult a healthcare
                    professional for personalized advice.
                </p>
            </div>
        </details>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';

const appState = useAppState();

// Form data
const gender = ref('male');
const age = ref('');
const weight = ref('');
const weightUnit = ref('kg');
const height = ref('');
const heightUnit = ref('cm');
const activityLevel = ref('1.55');

// Results
const bmrResult = ref(null);
const tdeeResult = ref(null);

// Computed values for validation
const isValid = computed(() => {
    return (
        age.value && age.value >= 15 && age.value <= 100 && weight.value && weight.value > 0 && height.value && height.value > 0
    );
});

// Calculate BMR using the Mifflin-St Jeor Equation
const calculateBMR = () => {
    if (!isValid.value) return;

    // Convert units if needed
    let weightInKg = parseFloat(weight.value);
    let heightInCm = parseFloat(height.value);

    if (weightUnit.value === 'lb') {
        weightInKg = weightInKg * 0.453592; // Convert pounds to kg
    }

    if (heightUnit.value === 'in') {
        heightInCm = heightInCm * 2.54; // Convert inches to cm
    }

    // Calculate BMR based on gender
    if (gender.value === 'male') {
        bmrResult.value = 10 * weightInKg + 6.25 * heightInCm - 5 * age.value + 5;
    } else {
        bmrResult.value = 10 * weightInKg + 6.25 * heightInCm - 5 * age.value - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    tdeeResult.value = bmrResult.value * parseFloat(activityLevel.value);
};

// Copy results to clipboard
const copyResults = async () => {
    if (!bmrResult.value || !tdeeResult.value) return;

    const resultText = `BMR and TDEE Results:
BMR: ${Math.round(bmrResult.value)} calories/day
TDEE: ${Math.round(tdeeResult.value)} calories/day

Daily Calorie Goals:
Weight Loss (20% deficit): ${Math.round(tdeeResult.value * 0.8)} calories/day
Mild Weight Loss (10% deficit): ${Math.round(tdeeResult.value * 0.9)} calories/day
Maintenance: ${Math.round(tdeeResult.value)} calories/day
Weight Gain (10% surplus): ${Math.round(tdeeResult.value * 1.1)} calories/day

Calculator based on the Mifflin-St Jeor Equation
`;

    try {
        await navigator.clipboard.writeText(resultText);
        appState.value.showToast = true;
        appState.value.toastMessage = 'Results copied to clipboard';
        setTimeout(() => {
            appState.value.showToast = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

// Watch for changes to perform calculations if needed
watch([gender, age, weight, weightUnit, height, heightUnit, activityLevel], () => {
    if (bmrResult.value && tdeeResult.value) {
        calculateBMR();
    }
});
</script>
