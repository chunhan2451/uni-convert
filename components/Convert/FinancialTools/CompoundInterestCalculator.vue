<!-- components/FinancialTools/CompoundInterestCalculator.vue -->
<template>
    <div class="max-w-3xl mx-auto px-4 py-8">
        <!-- Header Section -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-3">Compound Interest Calculator</h1>
            <p class="text-base-content/70">Calculate how your investments grow over time with compound interest</p>
        </div>

        <div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
            <!-- Calculator Card (Left) -->
            <div class="lg:col-span-2 card bg-base-100 shadow-lg">
                <div class="card-body">
                    <div class="grid gap-6">
                        <!-- Principal Amount -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-medium">Principal Amount</span>
                            </label>
                            <div class="join w-full">
                                <div class="join-item btn btn-base text-base btn-neutral">$</div>
                                <input
                                    v-model="principal"
                                    type="number"
                                    min="0"
                                    step="100"
                                    class="input input-bordered join-item w-full"
                                    placeholder="10000"
                                />
                            </div>
                        </div>

                        <!-- Annual Interest Rate -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-medium">Annual Interest Rate (%)</span>
                            </label>
                            <input
                                v-model="rate"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                class="input input-bordered w-full"
                                placeholder="5"
                            />
                        </div>

                        <!-- Time Period -->
                        <div class="grid grid-cols-3 gap-4">
                            <div class="form-control col-span-2">
                                <label class="label">
                                    <span class="label-text font-medium">Time Period</span>
                                </label>
                                <input
                                    v-model="years"
                                    type="number"
                                    min="1"
                                    step="1"
                                    class="input input-bordered w-full"
                                    placeholder="5"
                                />
                            </div>
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text font-medium">Unit</span>
                                </label>
                                <select v-model="timeUnit" class="select select-bordered w-full">
                                    <option value="years">Years</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        </div>

                        <!-- Compound Frequency -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-medium">Compound Frequency</span>
                            </label>
                            <select v-model="compoundFrequency" class="select select-bordered w-full">
                                <option value="1">Annually</option>
                                <option value="2">Semi-Annually</option>
                                <option value="4">Quarterly</option>
                                <option value="12">Monthly</option>
                                <option value="365">Daily</option>
                            </select>
                        </div>

                        <!-- Additional Contribution -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-medium">Regular Contribution (optional)</span>
                            </label>
                            <div class="join w-full">
                                <div class="join-item btn btn-base text-base btn-neutral">$</div>
                                <input
                                    v-model="contribution"
                                    type="number"
                                    min="0"
                                    step="50"
                                    class="input input-bordered join-item w-full"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-medium">Contribution Frequency</span>
                            </label>
                            <select
                                v-model="contributionFrequency"
                                class="select select-bordered w-full"
                                :disabled="!contribution"
                            >
                                <option value="1">Annually</option>
                                <option value="4">Quarterly</option>
                                <option value="12">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <!-- Calculate Button -->
                    <div class="form-control mt-6">
                        <button @click="calculateCompoundInterest" class="btn btn-primary" :disabled="!isValidInput">
                            <Icon :name="uiIcons.calculator" class="mr-2 h-5 w-5" />
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            <!-- Results Card (Right) -->
            <div class="lg:col-span-1 card bg-base-100 shadow-lg self-start">
                <div class="card-body">
                    <h2 class="card-title mb-4">Results</h2>

                    <div class="space-y-6">
                        <!-- Future Value -->
                        <div class="bg-base-200 p-4 rounded-lg">
                            <div class="text-sm font-medium mb-1">Future Value</div>
                            <div class="text-2xl font-bold text-primary truncate">
                                {{ formatCurrency(futureValue) }}
                            </div>
                            <div class="text-xs text-base-content/70 mt-1">Total balance after {{ formatTimePeriod() }}</div>
                        </div>

                        <!-- Total Principal -->
                        <div class="bg-base-200 p-4 rounded-lg">
                            <div class="text-sm font-medium mb-1">Total Principal</div>
                            <div class="text-xl font-bold text-success truncate">
                                {{ formatCurrency(totalPrincipal) }}
                            </div>
                        </div>

                        <!-- Total Interest -->
                        <div class="bg-base-200 p-4 rounded-lg">
                            <div class="text-sm font-medium mb-1">Total Interest</div>
                            <div class="text-xl font-bold text-accent truncate">
                                {{ formatCurrency(totalInterest) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useUrlUpdate } from '~/composables/useUrlUpdate';

// Input values
const principal = ref(10000);
const rate = ref(5);
const years = ref(5);
const timeUnit = ref('years');
const compoundFrequency = ref(12); // Monthly by default
const contribution = ref(0);
const contributionFrequency = ref(12); // Monthly by default

// Output values
const futureValue = ref(0);
const totalPrincipal = ref(0);
const totalInterest = ref(0);

// Validation
const isValidInput = computed(() => {
    return principal.value > 0 && rate.value >= 0 && years.value > 0;
});

// URL handling
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();

// Load values from URL or localStorage if available
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Try to get values from URL parameters
    if (urlParams.has('principal')) principal.value = Number(urlParams.get('principal'));
    if (urlParams.has('rate')) rate.value = Number(urlParams.get('rate'));
    if (urlParams.has('years')) years.value = Number(urlParams.get('years'));
    if (urlParams.has('timeUnit')) timeUnit.value = urlParams.get('timeUnit');
    if (urlParams.has('compoundFrequency')) compoundFrequency.value = Number(urlParams.get('compoundFrequency'));
    if (urlParams.has('contribution')) contribution.value = Number(urlParams.get('contribution'));
    if (urlParams.has('contributionFrequency')) contributionFrequency.value = Number(urlParams.get('contributionFrequency'));

    // Initial calculation
    calculateCompoundInterest();
});

// Calculate compound interest
function calculateCompoundInterest() {
    if (!isValidInput.value) return;

    // Convert inputs to numbers and handle time unit conversion
    const p = Number(principal.value);
    const r = Number(rate.value) / 100; // Convert percentage to decimal
    const n = Number(compoundFrequency.value);
    let t = Number(years.value);
    const pmt = Number(contribution.value);
    const pmtFreq = Number(contributionFrequency.value);

    // Convert time to years if months is selected
    if (timeUnit.value === 'months') {
        t = t / 12;
    }

    // Calculate total principal (initial + contributions)
    const totalContributions = pmt * pmtFreq * t;
    totalPrincipal.value = p + totalContributions;

    // Calculate future value
    if (pmt > 0) {
        // With regular contributions
        // Adjust contribution timing to match compounding frequency
        const adjustedRate = r / n;
        const adjustedPmt = pmt * (n / pmtFreq);
        const periods = n * t;

        const baseAmount = p * Math.pow(1 + adjustedRate, periods);
        const contributionAmount = adjustedPmt * ((Math.pow(1 + adjustedRate, periods) - 1) / adjustedRate);

        futureValue.value = baseAmount + contributionAmount;
    } else {
        // Without contributions - simple compound interest
        futureValue.value = p * Math.pow(1 + r / n, n * t);
    }

    // Calculate total interest earned
    totalInterest.value = futureValue.value - totalPrincipal.value;

    // Update URL
    updateUrlWithParams();
}

// Update URL with current parameters
function updateUrlWithParams() {
    const params = new URLSearchParams();
    params.set('principal', principal.value);
    params.set('rate', rate.value);
    params.set('years', years.value);
    params.set('timeUnit', timeUnit.value);
    params.set('compoundFrequency', compoundFrequency.value);
    params.set('contribution', contribution.value);
    params.set('contributionFrequency', contributionFrequency.value);

    const newUrl = window.location.pathname + '?' + params.toString();
    history.replaceState({}, '', newUrl);
}

// Format currency display
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: value > 1000000 ? 'compact' : 'standard',
    }).format(value);
}

// Format time period display
function formatTimePeriod() {
    const time = years.value;
    if (timeUnit.value === 'years') {
        return `${time} ${time === 1 ? 'year' : 'years'}`;
    } else {
        return `${time} ${time === 1 ? 'month' : 'months'}`;
    }
}
</script>
