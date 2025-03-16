<!-- components/Convert/Time/AgeCalculator.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center">Age Calculator</h1>
            <p class="text-zinc-600 mb-6 text-center">Calculate exact age and see equivalent animal ages</p>

            <!-- Date Input -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-base-100 p-6 rounded-lg shadow-sm">
                    <h3 class="font-semibold mb-4">Date of Birth</h3>

                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Birth Date</span>
                        </label>
                        <input
                            v-model="birthDate"
                            type="date"
                            class="input input-bordered w-full"
                            :max="today"
                            @change="calculateAge"
                        />
                    </div>

                    <div class="flex flex-col md:flex-row gap-2 mt-4">
                        <button @click="useCurrentDate" class="btn btn-outline flex-1">
                            <Icon :name="uiIcons.calendar" class="h-5 w-5 mr-2 text-xl" />
                            Use Today's Date
                        </button>

                        <button @click="resetForm" class="btn btn-outline btn-error flex-1">
                            <Icon :name="uiIcons.refresh" class="h-5 w-5 mr-2 text-xl" />
                            Reset
                        </button>
                    </div>
                </div>

                <!-- Comparison Date (defaults to today) -->
                <div class="bg-base-100 p-6 rounded-lg shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold">As of Date</h3>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text mr-2">Today</span>
                                <input
                                    v-model="useToday"
                                    type="checkbox"
                                    class="toggle toggle-primary toggle-sm"
                                    @change="handleToggleToday"
                                />
                            </label>
                        </div>
                    </div>

                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Comparison Date</span>
                        </label>
                        <input
                            v-model="comparisonDate"
                            type="date"
                            class="input input-bordered w-full"
                            :min="birthDate"
                            :disabled="useToday"
                            @change="calculateAge"
                        />
                    </div>

                    <div class="mt-6 text-center text-zinc-500 flex justify-center items-center">
                        <Icon :name="uiIcons.info" class="h-5 w-5 mr-1 text-xl" />
                        <span class="text-sm">{{
                            useToday ? "Using today's date for calculation" : 'You can calculate age as of any future date'
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- Age Results -->
            <div v-if="ageResult.years !== undefined" class="mb-8">
                <div class="bg-base-100 p-6 rounded-lg shadow-sm mb-6">
                    <h3 class="font-semibold mb-4 text-center">Human Age</h3>

                    <!-- Primary Age Display -->
                    <div class="text-center mb-6">
                        <p class="text-4xl font-bold text-primary mb-2">
                            {{ ageResult.years }} <span class="text-2xl">years</span> {{ ageResult.months }}
                            <span class="text-2xl">months</span> {{ ageResult.days }} <span class="text-2xl">days</span>
                        </p>
                        <p class="text-zinc-500">{{ ageResult.totalDays.toLocaleString() }} total days</p>
                    </div>

                    <!-- Additional Age Information -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div class="bg-base-200 p-3 rounded-lg">
                            <p class="text-zinc-500 text-sm">In Months</p>
                            <p class="text-xl font-semibold">{{ ageResult.totalMonths }}</p>
                        </div>
                        <div class="bg-base-200 p-3 rounded-lg">
                            <p class="text-zinc-500 text-sm">In Weeks</p>
                            <p class="text-xl font-semibold">{{ Math.floor(ageResult.totalDays / 7) }}</p>
                        </div>
                        <div class="bg-base-200 p-3 rounded-lg">
                            <p class="text-zinc-500 text-sm">In Hours</p>
                            <p class="text-xl font-semibold">{{ Math.floor(ageResult.totalDays * 24).toLocaleString() }}</p>
                        </div>
                        <div class="bg-base-200 p-3 rounded-lg">
                            <p class="text-zinc-500 text-sm">Next Birthday</p>
                            <p class="text-xl font-semibold">{{ nextBirthdayDays }} days</p>
                        </div>
                    </div>
                </div>

                <!-- Animal Age Section -->
                <h3 class="font-semibold mb-4 text-center">Equivalent Animal Ages</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="animal in animalAges" :key="animal.type" class="bg-base-100 p-4 rounded-lg shadow-sm text-center">
                        <div class="mb-2">
                            <i :class="`ph ph-${animal.icon} text-3xl text-primary`"></i>
                        </div>
                        <h4 class="font-medium">{{ animal.name }}</h4>
                        <p class="text-2xl font-bold">{{ animal.age }} <span class="text-sm">years</span></p>
                        <p class="text-xs text-zinc-500 mt-1">{{ animal.note }}</p>
                    </div>
                </div>
            </div>

            <!-- Placeholder for empty state -->
            <div v-else class="bg-base-100 p-8 rounded-lg shadow-sm text-center">
                <Icon :name="uiIcons.calendar" class="h-16 w-16 text-base-content/20 mx-auto mb-4 text-5xl" />
                <p class="mt-2 text-zinc-500">Enter a birth date to calculate age</p>
            </div>

            <!-- Age Facts Section -->
            <div class="bg-base-200 rounded-lg p-4 mt-8">
                <h3 class="font-semibold mb-2">Age Calculation Facts</h3>
                <ul class="list-disc pl-5 space-y-1 text-zinc-600">
                    <li>Age calculations account for leap years and different month lengths</li>
                    <li>Animal age conversions are approximations based on common formulas</li>
                    <li>Different dog breeds age at different rates - smaller dogs generally live longer</li>
                    <li>The "7 dog years per human year" rule is a simplified approximation</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Date inputs
const birthDate = ref('');
const comparisonDate = ref('');
const useToday = ref(true);

// Age calculation results
const ageResult = ref({});

// Get today's date in YYYY-MM-DD format
const today = computed(() => {
    const date = new Date();
    return formatDateForInput(date);
});

// Format a Date object as YYYY-MM-DD for input elements
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Calculate next birthday in days
const nextBirthdayDays = computed(() => {
    if (!birthDate.value) return 0;

    const today = useToday.value ? new Date() : new Date(comparisonDate.value);
    const birth = new Date(birthDate.value);

    // Create date for this year's birthday
    const birthMonth = birth.getMonth();
    const birthDay = birth.getDate();

    let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);

    // If birthday has passed this year, set to next year
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    // Calculate difference in days
    const diffTime = nextBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
});

// Calculate equivalent animal ages
const animalAges = computed(() => {
    if (!ageResult.value.years && ageResult.value.years !== 0) return [];

    const humanYears = ageResult.value.years + ageResult.value.months / 12;

    return [
        {
            name: 'Dog (Small)',
            age: calculateDogAge(humanYears, 'small'),
            icon: 'dog',
            type: 'dog-small',
            note: 'For dogs under 20 lbs',
        },
        {
            name: 'Dog (Medium)',
            age: calculateDogAge(humanYears, 'medium'),
            icon: 'dog',
            type: 'dog-medium',
            note: 'For dogs 21-50 lbs',
        },
        {
            name: 'Dog (Large)',
            age: calculateDogAge(humanYears, 'large'),
            icon: 'dog',
            type: 'dog-large',
            note: 'For dogs over 50 lbs',
        },
        {
            name: 'Cat',
            age: calculateCatAge(humanYears),
            icon: 'cat',
            type: 'cat',
            note: 'Domestic house cat',
        },
        {
            name: 'Horse',
            age: calculateHorseAge(humanYears),
            icon: 'horse',
            type: 'horse',
            note: 'Domestic horse',
        },
        {
            name: 'Rabbit',
            age: calculateRabbitAge(humanYears),
            icon: 'campfire', // Using alternative icon as phosphor doesn't have a rabbit
            type: 'rabbit',
            note: 'Domestic rabbit',
        },
        {
            name: 'Hamster',
            age: calculateHamsterAge(humanYears),
            icon: 'mouse', // Using mouse icon for hamster
            type: 'hamster',
            note: 'Average for most species',
        },
        {
            name: 'Elephant',
            age: calculateElephantAge(humanYears),
            icon: 'tree', // Using alternative icon
            type: 'elephant',
            note: 'African/Asian elephant',
        },
    ];
});

// Calculate dog age based on size and human years
function calculateDogAge(humanYears, size) {
    // More accurate dog age calculation based on size
    if (humanYears <= 0) return 0;

    // First year of a dog's life counts as more dog years
    let dogAge;

    if (size === 'small') {
        // Small dogs (under 20 lbs)
        if (humanYears <= 1) {
            dogAge = humanYears * 15;
        } else if (humanYears <= 2) {
            dogAge = 15 + (humanYears - 1) * 9;
        } else {
            dogAge = 24 + (humanYears - 2) * 4;
        }
    } else if (size === 'medium') {
        // Medium dogs (21-50 lbs)
        if (humanYears <= 1) {
            dogAge = humanYears * 15;
        } else if (humanYears <= 2) {
            dogAge = 15 + (humanYears - 1) * 9;
        } else {
            dogAge = 24 + (humanYears - 2) * 5;
        }
    } else {
        // Large dogs (over 50 lbs)
        if (humanYears <= 1) {
            dogAge = humanYears * 15;
        } else if (humanYears <= 2) {
            dogAge = 15 + (humanYears - 1) * 9;
        } else {
            dogAge = 24 + (humanYears - 2) * 7;
        }
    }

    return Math.round(dogAge);
}

// Calculate cat age
function calculateCatAge(humanYears) {
    if (humanYears <= 0) return 0;

    let catAge;

    // Cats age quickly in their first two years
    if (humanYears <= 1) {
        catAge = humanYears * 15;
    } else if (humanYears <= 2) {
        catAge = 15 + (humanYears - 1) * 9;
    } else {
        // After 2 years, each human year is about 4 cat years
        catAge = 24 + (humanYears - 2) * 4;
    }

    return Math.round(catAge);
}

// Calculate horse age
function calculateHorseAge(humanYears) {
    if (humanYears <= 0) return 0;

    // A more accurate horse age calculation
    // First two years age faster, then slower
    let horseAge;

    if (humanYears <= 1) {
        horseAge = humanYears * 6.5;
    } else if (humanYears <= 2) {
        horseAge = 6.5 + (humanYears - 1) * 5;
    } else if (humanYears <= 3) {
        horseAge = 11.5 + (humanYears - 2) * 4;
    } else {
        horseAge = 15.5 + (humanYears - 3) * 2.5;
    }

    return Math.round(horseAge);
}

// Calculate rabbit age
function calculateRabbitAge(humanYears) {
    if (humanYears <= 0) return 0;

    // Rabbits age very quickly in the first year
    let rabbitAge;

    if (humanYears <= 1) {
        rabbitAge = humanYears * 18;
    } else {
        rabbitAge = 18 + (humanYears - 1) * 8;
    }

    return Math.round(rabbitAge);
}

// Calculate hamster age
function calculateHamsterAge(humanYears) {
    if (humanYears <= 0) return 0;

    // Hamsters have very short lifespans
    // 1 human year is roughly 14 hamster years
    return Math.round(humanYears * 25);
}

// Calculate elephant age
function calculateElephantAge(humanYears) {
    if (humanYears <= 0) return 0;

    // Elephants age more slowly than humans
    // 1 human year is roughly 0.7 elephant years
    return Math.round(humanYears * 0.7);
}

// Calculate age based on birth date and comparison date
function calculateAge() {
    if (!birthDate.value) return;

    const birth = new Date(birthDate.value);
    const comparison = useToday.value ? new Date() : new Date(comparisonDate.value);

    // Ensure birth date is before comparison date
    if (birth > comparison) {
        ageResult.value = {};
        return;
    }

    // Calculate age
    let years = comparison.getFullYear() - birth.getFullYear();
    let months = comparison.getMonth() - birth.getMonth();
    let days = comparison.getDate() - birth.getDate();

    // Adjust for negative days (borrow from months)
    if (days < 0) {
        // Get the last day of the previous month
        let lastDayOfPrevMonth = new Date(comparison.getFullYear(), comparison.getMonth(), 0).getDate();

        days += lastDayOfPrevMonth;
        months--;
    }

    // Adjust for negative months (borrow from years)
    if (months < 0) {
        months += 12;
        years--;
    }

    // Calculate total days
    const diffTime = comparison - birth;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate total months (approximate)
    const totalMonths = Math.floor(totalDays / 30.4375);

    ageResult.value = {
        years,
        months,
        days,
        totalDays,
        totalMonths,
    };
}

// Handle toggle today checkbox
function handleToggleToday() {
    if (useToday.value) {
        comparisonDate.value = today.value;
    }
    calculateAge();
}

// Use current date for birthdate (for testing)
function useCurrentDate() {
    birthDate.value = today.value;
    calculateAge();
}

// Reset the form
function resetForm() {
    birthDate.value = '';
    useToday.value = true;
    comparisonDate.value = today.value;
    ageResult.value = {};
}

// Initialize
onMounted(() => {
    // Set comparison date to today
    comparisonDate.value = today.value;

    // Calculate age if birth date is already set
    if (birthDate.value) {
        calculateAge();
    }
});

// Watch for date changes
watch([birthDate, comparisonDate, useToday], () => {
    calculateAge();
});
</script>
