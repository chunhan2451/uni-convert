<!-- components/FinancialTools/CompoundInterestCalculator.vue -->
<template>
    <div class="max-w-3xl mx-auto p-4">
        <div class="justify-center text-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.currencyCircleDollar" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-2 text-center">Compound Interest Calculator</h1>
            <p class="text-base-content/70 mb-8">Calculate how your investments grow over time with compound interest</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left column - Inputs -->
            <div class="space-y-6">
                <!-- Principal Amount -->
                <div>
                    <label class="text-sm font-medium mb-2 block">Principal Amount</label>
                    <div class="join w-full">
                        <div class="join-item bg-base-200 px-4 flex items-center">$</div>
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
                <div>
                    <label class="text-sm font-medium mb-2 block">Annual Interest Rate</label>
                    <div class="join w-full">
                        <input
                            v-model="rate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            class="input input-bordered join-item w-full"
                            placeholder="5"
                        />
                        <div class="join-item bg-base-200 px-4 flex items-center">%</div>
                    </div>
                    <input type="range" v-model="rate" min="0" max="20" step="0.1" class="range range-success mt-2" />
                </div>

                <!-- Time Period -->
                <div>
                    <label class="text-sm font-medium mb-2 block">Time Period</label>
                    <div class="join w-full">
                        <input
                            v-model="years"
                            type="number"
                            min="1"
                            max="50"
                            step="1"
                            class="input input-bordered join-item w-full"
                            placeholder="5"
                        />
                        <select v-model="timeUnit" class="select select-bordered join-item">
                            <option value="years">years</option>
                            <option value="months">months</option>
                        </select>
                    </div>
                    <input
                        v-if="timeUnit === 'years'"
                        type="range"
                        v-model="years"
                        min="1"
                        max="50"
                        class="range range-success mt-2"
                    />
                    <input v-else type="range" v-model="years" min="1" max="120" class="range range-success mt-2" />
                </div>

                <!-- Compound Frequency -->
                <div>
                    <label class="text-sm font-medium mb-2 block">Compound Frequency</label>
                    <select v-model="compoundFrequency" class="select select-bordered w-full">
                        <option value="1">Annually</option>
                        <option value="2">Semi-Annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                </div>

                <!-- Regular Contribution -->
                <div>
                    <label class="text-sm font-medium mb-2 block">Regular Contribution (optional)</label>
                    <div class="join w-full">
                        <div class="join-item bg-base-200 px-4 flex items-center">$</div>
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

                <!-- Contribution Frequency -->
                <div>
                    <label class="text-sm font-medium mb-2 block">Contribution Frequency</label>
                    <select v-model="contributionFrequency" class="select select-bordered w-full" :disabled="!contribution">
                        <option value="1">Annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                    </select>
                </div>

                <!-- Calculate Button -->
                <button @click="calculateCompoundInterest" class="btn btn-primary w-full" :disabled="!isValidInput">
                    <Icon :name="uiIcons.calculator" class="mr-2 h-5 w-5" />
                    Calculate
                </button>
            </div>

            <!-- Right column - Results -->
            <div class="space-y-6">
                <!-- Future Value -->
                <div class="bg-base-100 p-5 rounded-lg shadow-sm border border-base-200">
                    <div class="text-sm text-base-content/70 mb-1">Future Value</div>
                    <div class="text-3xl font-bold">{{ formatCurrency(futureValue) }}</div>
                    <div class="text-xs text-base-content/70 mt-1">Total balance after {{ formatTimePeriod() }}</div>
                </div>

                <!-- Two columns for Total Principal and Total Interest -->
                <div class="grid grid-cols-2 gap-4">
                    <!-- Total Principal -->
                    <div class="bg-base-100 p-5 rounded-lg shadow-sm border border-base-200">
                        <div class="text-sm text-base-content/70 mb-1">Total Principal</div>
                        <div class="text-2xl font-bold text-sky-600 truncate">{{ formatCurrency(totalPrincipal) }}</div>
                    </div>

                    <!-- Total Interest -->
                    <div class="bg-base-100 p-5 rounded-lg shadow-sm border border-base-200">
                        <div class="text-sm text-base-content/70 mb-1">Total Interest</div>
                        <div class="text-2xl font-bold text-amber-500 truncate">{{ formatCurrency(totalInterest) }}</div>
                    </div>
                </div>

                <!-- Visual Breakdown with Pie Chart -->
                <div v-if="futureValue > 0" class="bg-base-100 p-5 rounded-lg shadow-sm border border-base-200">
                    <div class="text-sm font-medium mb-4">Growth Breakdown</div>

                    <!-- Simple visual representation of the breakdown -->
                    <div class="flex justify-center py-4">
                        <div class="relative w-48 h-48">
                            <!-- Using a different approach with SVG paths -->
                            <svg class="w-full h-full" viewBox="0 0 100 100">
                                <defs>
                                    <clipPath id="donutHole">
                                        <circle cx="50" cy="50" r="30" />
                                    </clipPath>
                                </defs>

                                <!-- Background circle (blue/principal) -->
                                <circle cx="50" cy="50" r="50" fill="#0284c7" />

                                <!-- Interest portion (amber wedge) -->
                                <path
                                    v-if="interestPercentage > 0"
                                    :d="`M 50 50 L 50 0 A 50 50 0 ${interestPercentage > 50 ? 1 : 0} 1 ${
                                        50 + 50 * Math.sin((interestPercentage / 100) * 2 * Math.PI)
                                    } ${50 - 50 * Math.cos((interestPercentage / 100) * 2 * Math.PI)} Z`"
                                    fill="#f59e0b"
                                />

                                <!-- White center hole -->
                                <circle cx="50" cy="50" r="30" fill="white" />
                            </svg>

                            <!-- Text overlay -->
                            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span class="text-sm font-medium">Total</span>
                                <span class="text-lg font-bold">{{ formatCurrency(futureValue) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded-full bg-sky-600 mr-2"></div>
                            <div>Principal</div>
                            <div class="ml-auto font-medium">{{ formatCurrency(totalPrincipal) }}</div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                            <div>Interest</div>
                            <div class="ml-auto font-medium">{{ formatCurrency(totalInterest) }}</div>
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

// Computed percentage for chart
const interestPercentage = computed(() => {
    if (futureValue.value === 0) return 0;
    return (totalInterest.value / futureValue.value) * 100;
});

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

// Function to create an SVG arc path
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

// Helper function to calculate cartesian coordinates from polar
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}
</script>
