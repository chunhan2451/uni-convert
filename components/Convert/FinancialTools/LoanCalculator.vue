<!-- components/Convert/FinancialTools/LoanCalculator.vue -->
<template>
    <div class="w-full max-w-4xl mx-auto">
        <div class="justify-center text-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.currencyCircleDollar" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-2 text-center">Universal Loan Calculator</h1>
        </div>
        <div class="p-2">
            <!-- Loan Type Selector -->
            <div class="mb-6">
                <label class="block text-base-content/80 mb-2">Loan Type</label>
                <div class="gap-2 grid grid-cols-2 md:grid-cols-3">
                    <button
                        @click="loanType = 'mortgage'"
                        class="btn flex-1"
                        :class="loanType === 'mortgage' ? 'btn-primary' : 'btn-outline'"
                    >
                        <Icon :name="uiIcons.mortgage" class="w-4 h-4 mr-2" />
                        Mortgage
                    </button>
                    <button
                        @click="loanType = 'auto'"
                        class="btn flex-1"
                        :class="loanType === 'auto' ? 'btn-primary' : 'btn-outline'"
                    >
                        <Icon :name="uiIcons.car" class="w-4 h-4 mr-2" />
                        Auto Loan
                    </button>
                    <button
                        @click="loanType = 'personal'"
                        class="btn flex-1"
                        :class="loanType === 'personal' ? 'btn-primary' : 'btn-outline'"
                    >
                        <Icon :name="uiIcons.wallet" class="w-4 h-4 mr-2" />
                        Personal Loan
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Input Column -->
                <div class="space-y-6">
                    <!-- Loan Amount -->
                    <div>
                        <label class="block text-base-content/80 mb-2">Loan Amount</label>
                        <div class="flex w-full">
                            <span
                                class="flex items-center justify-center px-4 bg-base-200 border-y border-l border-base-300 rounded-l-lg"
                                >$</span
                            >
                            <input
                                v-model="loanAmount"
                                type="number"
                                min="1000"
                                max="100000000"
                                step="1000"
                                class="input input-bordered rounded-l-none w-full focus:outline-none"
                                placeholder="Enter loan amount"
                                @input="validateInputs"
                            />
                        </div>
                    </div>

                    <!-- Interest Calculation Method (for Auto/Personal loans) -->
                    <div v-if="loanType !== 'mortgage'">
                        <label class="block text-base-content/80 mb-2">Interest Calculation</label>
                        <select v-model="interestMethod" class="select select-bordered w-full">
                            <option value="amortizing">Amortizing (Based on remaining balance)</option>
                            <option value="simple">Simple (Pre-calculated)</option>
                        </select>
                    </div>

                    <!-- Down Payment (for Auto/Mortgage) -->
                    <div v-if="loanType !== 'personal'">
                        <label class="block text-base-content/80 mb-2">Down Payment</label>
                        <div class="flex w-full">
                            <span
                                class="flex items-center justify-center px-4 bg-base-200 border-y border-l border-base-300 rounded-l-lg"
                                >$</span
                            >
                            <input
                                v-model="downPayment"
                                type="number"
                                min="0"
                                step="1000"
                                class="input input-bordered rounded-l-none w-full focus:outline-none"
                                placeholder="Enter down payment"
                            />
                        </div>
                    </div>

                    <!-- Trade-in Value (Auto only) -->
                    <div v-if="loanType === 'auto'">
                        <label class="block text-base-content/80 mb-2">Trade-in Value</label>
                        <div class="flex w-full">
                            <span
                                class="flex items-center justify-center px-4 bg-base-200 border-y border-l border-base-300 rounded-l-lg"
                                >$</span
                            >
                            <input
                                v-model="tradeInValue"
                                type="number"
                                min="0"
                                step="1000"
                                class="input input-bordered rounded-l-none w-full focus:outline-none"
                                placeholder="Enter trade-in value"
                            />
                        </div>
                    </div>

                    <!-- Interest Rate -->
                    <div>
                        <label class="block text-base-content/80 mb-2">Interest Rate</label>
                        <div class="flex w-full">
                            <input
                                v-model="interestRate"
                                type="number"
                                min="0.1"
                                max="20"
                                step="0.1"
                                class="input input-bordered rounded-r-none w-full focus:outline-none"
                                placeholder="Enter annual interest rate"
                            />
                            <span
                                class="flex items-center justify-center px-4 bg-base-200 border-y border-r border-base-300 rounded-r-lg"
                                >%</span
                            >
                        </div>
                        <input
                            v-model="interestRate"
                            type="range"
                            min="0.1"
                            max="15"
                            step="0.1"
                            class="range range-primary range-sm mt-4 w-full"
                        />
                    </div>

                    <!-- Loan Term -->
                    <div>
                        <label class="block text-base-content/80 mb-2">Loan Term (Years)</label>
                        <div class="flex w-full">
                            <input
                                v-model="loanTermYears"
                                type="number"
                                min="1"
                                max="35"
                                class="input input-bordered rounded-r-none w-full focus:outline-none"
                                placeholder="Enter loan term"
                            />
                            <span
                                class="flex items-center justify-center px-4 bg-base-200 border-y border-r border-base-300 rounded-r-lg"
                                >years</span
                            >
                        </div>
                        <input
                            v-model="loanTermYears"
                            type="range"
                            min="1"
                            max="35"
                            step="1"
                            class="range range-primary range-sm mt-4 w-full"
                        />
                    </div>

                    <!-- Monthly Property Tax & Insurance (Mortgage only) -->
                    <div v-if="loanType === 'mortgage'" class="space-y-4">
                        <div>
                            <label class="block text-base-content/80 mb-2">Property Tax (Yearly)</label>
                            <div class="flex w-full">
                                <span
                                    class="flex items-center justify-center px-4 bg-base-200 border-y border-l border-base-300 rounded-l-lg"
                                    >$</span
                                >
                                <input
                                    v-model="propertyTax"
                                    type="number"
                                    min="0"
                                    step="100"
                                    class="input input-bordered rounded-l-none w-full focus:outline-none"
                                    placeholder="Yearly property tax"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-base-content/80 mb-2">Home Insurance (Yearly)</label>
                            <div class="flex w-full">
                                <span
                                    class="flex items-center justify-center px-4 bg-base-200 border-y border-l border-base-300 rounded-l-lg"
                                    >$</span
                                >
                                <input
                                    v-model="homeInsurance"
                                    type="number"
                                    min="0"
                                    step="100"
                                    class="input input-bordered rounded-l-none w-full focus:outline-none"
                                    placeholder="Yearly insurance"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-base-content/80 mb-2">PMI (% of Loan, if < 20% down)</label>
                            <div class="flex w-full">
                                <input
                                    v-model="pmiRate"
                                    type="number"
                                    min="0"
                                    max="2"
                                    step="0.01"
                                    class="input input-bordered rounded-r-none w-full focus:outline-none"
                                    placeholder="PMI rate"
                                />
                                <span
                                    class="flex items-center justify-center px-4 bg-base-200 border-y border-r border-base-300 rounded-r-lg"
                                    >%</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Extra Payment Amount (conditional) -->
                    <div v-if="includeExtraPayment">
                        <label class="block text-base-content/80 mb-2">Extra Payment (Monthly)</label>
                        <div class="flex w-full">
                            <span
                                class="flex items-center justify-center px-4 bg-base-200 border-y border-l border-base-300 rounded-l-lg"
                                >$</span
                            >
                            <input
                                v-model="extraPayment"
                                type="number"
                                min="0"
                                step="10"
                                class="input input-bordered rounded-l-none w-full focus:outline-none"
                                placeholder="Extra monthly payment"
                            />
                        </div>
                    </div>
                </div>

                <!-- Results Column -->
                <div class="space-y-6">
                    <!-- Result Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="bg-base-100 border border-base-200 rounded-lg p-4 shadow-sm">
                            <div class="text-sm text-base-content/70 mb-1">Monthly Payment</div>
                            <div class="text-2xl font-bold">${{ formatCurrency(monthlyPayment) }}</div>
                        </div>

                        <div class="bg-base-100 border border-base-200 rounded-lg p-4 shadow-sm">
                            <div class="text-sm text-base-content/70 mb-1">Total Payment</div>
                            <div class="text-2xl font-bold">${{ formatCurrency(totalPayment) }}</div>
                        </div>

                        <div class="bg-base-100 border border-base-200 rounded-lg p-4 shadow-sm">
                            <div class="text-sm text-base-content/70 mb-1">Total Interest</div>
                            <div class="text-2xl font-bold">${{ formatCurrency(totalInterest) }}</div>
                        </div>

                        <div v-if="includeExtraPayment" class="bg-base-100 border border-success/20 rounded-lg p-4 shadow-sm">
                            <div class="text-sm text-success-content/70 mb-1">Interest Savings</div>
                            <div class="text-2xl font-bold text-success">${{ formatCurrency(interestSavings) }}</div>
                        </div>
                    </div>

                    <!-- Payment Breakdown -->
                    <div class="mt-6">
                        <h3 class="text-base-content/80 mb-4">Payment Breakdown</h3>
                        <div class="flex flex-col items-center">
                            <div class="w-32 h-32 relative">
                                <svg viewBox="0 0 100 100" class="w-full h-full">
                                    <!-- Principal section (full circle background) -->
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#c5e8c8"
                                        stroke-width="15"
                                        stroke-dasharray="251.2"
                                        stroke-dashoffset="0"
                                        transform="rotate(-90 50 50)"
                                    />

                                    <!-- Interest section (overlay) -->
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#4ade80"
                                        stroke-width="15"
                                        :stroke-dasharray="`${251.2 * (totalInterest / totalPayment)} ${
                                            251.2 * (1 - totalInterest / totalPayment)
                                        }`"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                            </div>

                            <!-- Legend and detailed breakdown -->
                            <div class="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm">
                                <div class="flex items-center">
                                    <div class="w-3 h-3 rounded-full mr-2" style="background-color: #4ade80"></div>
                                    <span>Interest</span>
                                </div>
                                <div class="text-right font-medium">${{ formatCurrency(totalInterest) }}</div>

                                <div class="flex items-center">
                                    <div class="w-3 h-3 rounded-full mr-2" style="background-color: #c5e8c8"></div>
                                    <span>Principal</span>
                                </div>
                                <div class="text-right font-medium">${{ formatCurrency(totalPayment - totalInterest) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Amortization Schedule -->
            <div class="mt-8 border-t border-base-200 pt-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium">Amortization Schedule</h3>
                    <button
                        @click="showAmortizationTable = !showAmortizationTable"
                        class="flex items-center gap-2 text-base-content/70 hover:text-primary"
                    >
                        <Icon :name="showAmortizationTable ? uiIcons.arrowUp : uiIcons.arrowDown" class="w-4 h-4" />
                        {{ showAmortizationTable ? 'Hide' : 'Show' }} Schedule
                    </button>
                </div>

                <div v-if="showAmortizationTable" class="overflow-x-auto mt-4">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th class="bg-base-200/50">Payment #</th>
                                <th class="bg-base-200/50">Payment Amount</th>
                                <th class="bg-base-200/50">Principal</th>
                                <th class="bg-base-200/50">Interest</th>
                                <th v-if="loanType === 'mortgage'" class="bg-base-200/50">Taxes & Ins.</th>
                                <th v-if="loanType === 'mortgage' && showPmi" class="bg-base-200/50">PMI</th>
                                <th class="bg-base-200/50">Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(payment, index) in amortizationSchedule.slice(0, 12)" :key="index">
                                <td>{{ payment.paymentNumber }}</td>
                                <td>${{ formatCurrency(payment.paymentAmount) }}</td>
                                <td>${{ formatCurrency(payment.principalPayment) }}</td>
                                <td>${{ formatCurrency(payment.interestPayment) }}</td>
                                <td v-if="loanType === 'mortgage'">${{ formatCurrency(payment.tax + payment.insurance) }}</td>
                                <td v-if="loanType === 'mortgage' && showPmi">${{ formatCurrency(payment.pmi) }}</td>
                                <td>${{ formatCurrency(payment.remainingBalance) }}</td>
                            </tr>
                            <tr v-if="amortizationSchedule.length > 12" class="text-center">
                                <td colspan="7" class="py-2">
                                    <button @click="expandedTable = !expandedTable" class="text-sm text-primary hover:underline">
                                        {{ expandedTable ? 'Show Less' : 'Show All Payments' }}
                                    </button>
                                </td>
                            </tr>
                            <tr
                                v-if="expandedTable"
                                v-for="payment in amortizationSchedule.slice(12)"
                                :key="'full-' + payment.paymentNumber"
                            >
                                <td>{{ payment.paymentNumber }}</td>
                                <td>${{ formatCurrency(payment.paymentAmount) }}</td>
                                <td>${{ formatCurrency(payment.principalPayment) }}</td>
                                <td>${{ formatCurrency(payment.interestPayment) }}</td>
                                <td v-if="loanType === 'mortgage'">${{ formatCurrency(payment.tax + payment.insurance) }}</td>
                                <td v-if="loanType === 'mortgage' && showPmi">${{ formatCurrency(payment.pmi) }}</td>
                                <td>${{ formatCurrency(payment.remainingBalance) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 border-t border-base-200 pt-6 flex flex-wrap gap-3">
                <button class="btn btn-outline gap-2" @click="copyResultsToClipboard">
                    <Icon :name="uiIcons.copy" class="w-4 h-4" />
                    Copy Results
                </button>
                <button class="btn btn-outline gap-2" @click="resetCalculator">
                    <Icon :name="uiIcons.eraser" class="w-4 h-4" />
                    Reset
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';

const appState = useAppState();

// Form inputs - Common
const loanType = ref('mortgage'); // 'mortgage', 'auto', 'personal'
const loanAmount = ref(250000);
const interestRate = ref(5.5);
const loanTermYears = ref(30);
const includeExtraPayment = ref(false);
const extraPayment = ref(100);

// Interest calculation method
const interestMethod = ref('amortizing'); // 'amortizing' or 'simple'

// Auto/Mortgage specific
const downPayment = ref(50000);
const tradeInValue = ref(0);

// Mortgage specific
const propertyTax = ref(3600); // $3,600/year
const homeInsurance = ref(1200); // $1,200/year
const pmiRate = ref(0.5); // 0.5% of loan amount per year if down payment < 20%

// UI state
const showAmortizationTable = ref(false);
const expandedTable = ref(false);

// Set defaults based on loan type
watch(loanType, (newType) => {
    if (newType === 'mortgage') {
        loanAmount.value = 250000;
        downPayment.value = 50000;
        loanTermYears.value = 30;
        interestRate.value = 5.5;
        interestMethod.value = 'amortizing';
    } else if (newType === 'auto') {
        loanAmount.value = 30000;
        downPayment.value = 5000;
        tradeInValue.value = 0;
        loanTermYears.value = 5;
        interestRate.value = 4.5;
    } else if (newType === 'personal') {
        loanAmount.value = 15000;
        loanTermYears.value = 3;
        interestRate.value = 10.5;
    }
});

// Calculations
const actualLoanAmount = computed(() => {
    // Check if loan amount is too large
    const parsedAmount = parseFloat(loanAmount.value);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return 0; // Prevent errors with invalid input
    }

    // For auto and mortgage, subtract down payment and trade-in (if applicable)
    if (loanType.value === 'auto') {
        return Math.max(0, parsedAmount - parseFloat(downPayment.value || 0) - parseFloat(tradeInValue.value || 0));
    } else if (loanType.value === 'mortgage') {
        return Math.max(0, parsedAmount - parseFloat(downPayment.value || 0));
    } else {
        return parsedAmount;
    }
});

const downPaymentPercentage = computed(() => {
    const total = parseFloat(loanAmount.value);
    if (total <= 0) return 0;
    return (parseFloat(downPayment.value) / total) * 100;
});

const showPmi = computed(() => {
    return loanType.value === 'mortgage' && downPaymentPercentage.value < 20;
});

const monthlyInterestRate = computed(() => {
    return interestRate.value / 100 / 12;
});

const numberOfPayments = computed(() => {
    return loanTermYears.value * 12;
});

const monthlyPayment = computed(() => {
    const principal = actualLoanAmount.value;
    const monthlyRate = monthlyInterestRate.value;
    const payments = numberOfPayments.value;

    if (principal <= 0 || payments <= 0) {
        return 0;
    }

    if (interestMethod.value === 'simple') {
        // Simple interest: principal + total interest, divided by term
        const totalInterest = principal * (interestRate.value / 100) * loanTermYears.value;
        return (principal + totalInterest) / payments;
    } else {
        // Amortizing interest formula
        if (monthlyRate <= 0) return principal / payments; // Handle 0% interest

        // Handle potential errors with very large numbers
        try {
            const payment =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);

            // Check if the result is a valid number
            if (isNaN(payment) || !isFinite(payment)) {
                return 0;
            }

            return payment;
        } catch (e) {
            // If any calculation error occurs, return a reasonable fallback
            console.error('Error calculating payment:', e);
            return principal / payments; // Fallback to simple division
        }
    }
});

const monthlyPropertyTax = computed(() => {
    return propertyTax.value / 12;
});

const monthlyHomeInsurance = computed(() => {
    return homeInsurance.value / 12;
});

const monthlyPmi = computed(() => {
    if (!showPmi.value) return 0;
    return (actualLoanAmount.value * (pmiRate.value / 100)) / 12;
});

const totalMonthlyPayment = computed(() => {
    if (loanType.value !== 'mortgage') return monthlyPayment.value;

    return monthlyPayment.value + monthlyPropertyTax.value + monthlyHomeInsurance.value + monthlyPmi.value;
});

const amortizationSchedule = computed(() => {
    const schedule = [];
    let balance = actualLoanAmount.value;
    const monthlyRate = monthlyInterestRate.value;
    const basePayment = monthlyPayment.value;
    const extraAmount = includeExtraPayment.value ? parseFloat(extraPayment.value) : 0;
    const totalMonths = numberOfPayments.value;

    let paymentNumber = 1;
    let pmiRemoved = false;

    if (interestMethod.value === 'simple') {
        // For simple interest, pre-calculate total interest and distribute evenly
        const totalInterest = balance * (interestRate.value / 100) * loanTermYears.value;
        const interestPerPayment = totalInterest / totalMonths;
        const principalPerPayment = balance / totalMonths;

        while (paymentNumber <= totalMonths) {
            const remainingBalance = balance - principalPerPayment * (paymentNumber - 1);

            // Apply extra payment to reduce the principal faster
            let adjustedPrincipal = principalPerPayment;
            if (includeExtraPayment.value && extraAmount > 0) {
                adjustedPrincipal += extraAmount;
            }

            // Ensure we don't pay more than the remaining balance
            const actualPrincipal = Math.min(adjustedPrincipal, remainingBalance);

            schedule.push({
                paymentNumber,
                paymentAmount: actualPrincipal + interestPerPayment,
                principalPayment: actualPrincipal,
                interestPayment: interestPerPayment,
                remainingBalance: Math.max(0, remainingBalance - actualPrincipal),
                // Include mortgage-specific details if applicable
                pmi: loanType.value === 'mortgage' && showPmi.value && !pmiRemoved ? monthlyPmi.value : 0,
                tax: loanType.value === 'mortgage' ? monthlyPropertyTax.value : 0,
                insurance: loanType.value === 'mortgage' ? monthlyHomeInsurance.value : 0,
            });

            paymentNumber++;

            // If balance is paid off, break early
            if (remainingBalance - actualPrincipal <= 0) {
                break;
            }
        }
    } else {
        // Amortizing interest calculation
        while (balance > 0 && paymentNumber <= totalMonths) {
            const interestPayment = balance * monthlyRate;
            let principalPayment = basePayment - interestPayment;

            // Add extra payment
            if (includeExtraPayment.value && extraAmount > 0) {
                principalPayment += extraAmount;
            }

            // Ensure we don't pay more than the remaining balance
            if (principalPayment > balance) {
                principalPayment = balance;
            }

            balance -= principalPayment;

            // Ensure we don't have negative balance due to rounding
            if (balance < 0) {
                balance = 0;
            }

            // Check if PMI should be removed (for mortgage only)
            // PMI is typically removed when loan-to-value ratio reaches 80%
            if (loanType.value === 'mortgage' && showPmi.value && !pmiRemoved) {
                const currentLoanToValue = (balance / loanAmount.value) * 100;
                if (currentLoanToValue <= 80) {
                    pmiRemoved = true;
                }
            }

            schedule.push({
                paymentNumber,
                paymentAmount: principalPayment + interestPayment,
                principalPayment,
                interestPayment,
                remainingBalance: balance,
                // Include mortgage-specific details if applicable
                pmi: loanType.value === 'mortgage' && showPmi.value && !pmiRemoved ? monthlyPmi.value : 0,
                tax: loanType.value === 'mortgage' ? monthlyPropertyTax.value : 0,
                insurance: loanType.value === 'mortgage' ? monthlyHomeInsurance.value : 0,
            });

            paymentNumber++;

            // Break if we've paid off the loan early
            if (balance <= 0) {
                break;
            }
        }
    }

    return schedule;
});

const totalPmiCost = computed(() => {
    if (!showPmi.value) return 0;

    return amortizationSchedule.value.reduce((sum, payment) => {
        return sum + payment.pmi;
    }, 0);
});

const totalPayment = computed(() => {
    if (amortizationSchedule.value.length === 0) return 0;

    let total = amortizationSchedule.value.reduce((sum, payment) => {
        return sum + payment.paymentAmount;
    }, 0);

    // For mortgage, add tax, insurance, and PMI
    if (loanType.value === 'mortgage') {
        total += amortizationSchedule.value.reduce((sum, payment) => {
            return sum + payment.tax + payment.insurance + payment.pmi;
        }, 0);
    }

    return total;
});

const totalInterest = computed(() => {
    if (amortizationSchedule.value.length === 0) return 0;

    return amortizationSchedule.value.reduce((sum, payment) => {
        return sum + payment.interestPayment;
    }, 0);
});

const standardScheduleLength = computed(() => {
    return numberOfPayments.value;
});

const interestSavings = computed(() => {
    if (!includeExtraPayment.value || extraPayment.value <= 0) return 0;

    // Calculate what the total interest would be without extra payments
    let standardInterest = 0;

    if (interestMethod.value === 'simple') {
        // For simple interest, it's straightforward
        standardInterest = actualLoanAmount.value * (interestRate.value / 100) * loanTermYears.value;
    } else {
        // For amortizing loans, need to calculate the full schedule without extra payments
        const standardMonthlyPayment =
            (actualLoanAmount.value *
                monthlyInterestRate.value *
                Math.pow(1 + monthlyInterestRate.value, standardScheduleLength.value)) /
            (Math.pow(1 + monthlyInterestRate.value, standardScheduleLength.value) - 1);

        let tempBalance = actualLoanAmount.value;
        for (let i = 0; i < standardScheduleLength.value; i++) {
            const interest = tempBalance * monthlyInterestRate.value;
            standardInterest += interest;
            tempBalance -= standardMonthlyPayment - interest;

            if (tempBalance <= 0) break;
        }
    }

    return Math.max(0, standardInterest - totalInterest.value);
});

const formatCurrency = (value) => {
    // Handle very large numbers better
    if (value >= 1000000000) {
        // Billions
        return (value / 1000000000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' billion';
    } else if (value >= 1000000) {
        // Millions
        return (value / 1000000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' million';
    } else {
        return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
};

const validateInputs = () => {
    // Ensure loan amount doesn't exceed maximum
    if (parseFloat(loanAmount.value) > 100000000) {
        loanAmount.value = 100000000;
    }

    // Ensure interest rate is reasonable
    if (parseFloat(interestRate.value) > 50) {
        interestRate.value = 50;
    }

    // Ensure loan term is reasonable
    if (parseFloat(loanTermYears.value) > 50) {
        loanTermYears.value = 50;
    }
};

const copyResultsToClipboard = async () => {
    let results = `
  Loan Type: ${loanType.value.charAt(0).toUpperCase() + loanType.value.slice(1)}
  Loan Amount: ${formatCurrency(loanAmount.value)}
  `;

    if (loanType.value !== 'personal') {
        results += `Down Payment: ${formatCurrency(downPayment.value)} (${downPaymentPercentage.value.toFixed(1)}%)\n`;
    }

    if (loanType.value === 'auto') {
        results += `Trade-in Value: ${formatCurrency(tradeInValue.value)}\n`;
    }

    results += `
  Interest Rate: ${interestRate.value}%
  Loan Term: ${loanTermYears.value} years
  Monthly Principal & Interest: ${formatCurrency(monthlyPayment.value)}
  `;

    if (loanType.value === 'mortgage') {
        results += `
  Monthly with Taxes & Insurance: ${formatCurrency(totalMonthlyPayment.value)}
  Property Tax: ${formatCurrency(propertyTax.value)}/year
  Home Insurance: ${formatCurrency(homeInsurance.value)}/year
  `;

        if (showPmi.value) {
            results += `PMI: ${formatCurrency(monthlyPmi.value)}/month (Total: ${formatCurrency(totalPmiCost.value)})\n`;
        }
    }

    results += `
  Total Loan Payment: ${formatCurrency(totalPayment.value)}
  Total Interest: ${formatCurrency(totalInterest.value)}
  `;

    if (includeExtraPayment.value) {
        results += `
  Extra Payment: ${formatCurrency(extraPayment.value)}/month
  Interest Savings: ${formatCurrency(interestSavings.value)}
  `;
    }

    await navigator.clipboard.writeText(results.trim());
    appState.value.showToast = true;
    setTimeout(() => (appState.value.showToast = false), 2000);
};

const resetCalculator = () => {
    // Reset based on loan type
    if (loanType.value === 'mortgage') {
        loanAmount.value = 250000;
        downPayment.value = 50000;
        loanTermYears.value = 30;
        interestRate.value = 5.5;
        propertyTax.value = 3600;
        homeInsurance.value = 1200;
        pmiRate.value = 0.5;
    } else if (loanType.value === 'auto') {
        loanAmount.value = 30000;
        downPayment.value = 5000;
        tradeInValue.value = 0;
        loanTermYears.value = 5;
        interestRate.value = 4.5;
    } else {
        loanAmount.value = 15000;
        loanTermYears.value = 3;
        interestRate.value = 10.5;
    }

    interestMethod.value = loanType.value === 'mortgage' ? 'amortizing' : 'amortizing';
    includeExtraPayment.value = false;
    extraPayment.value = 100;
    showAmortizationTable.value = false;
    expandedTable.value = false;
};
</script>
