<!-- components/Units/ClothingSizeConverter.vue -->
<template>
    <div class="converter-container max-w-3xl mx-auto">
        <div class="justify-center">
            <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                <Icon :name="uiIcons.currencyCircleDollar" class="text-primary h-6 w-6 text-2xl" />
            </div>
            <h1 class="text-3xl font-bold mb-8 text-center">Clothing & Shoe Size Converter</h1>
        </div>

        <!-- Main Tabs -->
        <div role="tablist" class="tabs tabs-lift justify-center mb-6">
            <a
                v-for="tab in tabs"
                :key="tab.id"
                role="tab"
                :class="['tab', { 'tab-active': activeTab === tab.id }]"
                @click="activeTab = tab.id; initializeUnits();"
            >
                {{ tab.name }}
            </a>
        </div>

        <!-- Gender Selection -->
        <div role="tablist" class="tabs tabs-border justify-center mb-6">
            <a
                v-for="gender in genders"
                :key="gender.id"
                role="tab"
                :class="['tab', { 'tab-active': selectedGender === gender.id }]"
                @click="selectedGender = gender.id"
            >
                {{ gender.name }}
            </a>
        </div>

        <!-- Clothing Type Selection (for women's clothing only) -->
        <div
            v-if="activeTab === 'clothing' && selectedGender === 'women'"
            role="tablist"
            class="tabs tabs-border justify-center mb-6"
        >
            <a
                v-for="type in clothingTypes"
                :key="type.id"
                role="tab"
                :class="['tab', { 'tab-active': selectedType === type.id }]"
                @click="selectedType = type.id"
            >
                {{ type.name }}
            </a>
        </div>

        <div class="mb-8">
            <!-- From Section -->
            <div class="mb-4">
                <label class="block text-base-content font-medium mb-2">From</label>
                <div class="join w-full">
                    <input
                        v-if="activeTab === 'shoes'"
                        type="number"
                        v-model="inputValue"
                        class="input input-bordered join-item w-3/5"
                        step="0.5"
                        min="0"
                        @input="debounceConvert"
                    />
                    <input
                        v-else
                        type="text"
                        v-model="clothingInputValue"
                        class="input input-bordered join-item w-3/5"
                        @input="debounceClothingConvert"
                    />
                    <select v-if="activeTab === 'shoes'" v-model="fromUnit" class="select select-bordered join-item w-2/5">
                        <option v-for="unit in shoeUnits.filter((item) => item.id != toUnit)" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                    <select v-else v-model="fromClothingUnit" class="select select-bordered join-item w-2/5">
                        <option
                            v-for="unit in clothingUnits.filter((item) => item.id != toClothingUnit)"
                            :key="unit.id"
                            :value="unit.id"
                        >
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center my-4">
                <button class="btn btn-circle btn-outline" @click="activeTab === 'shoes' ? swapUnits() : swapClothingUnits()">
                    <Icon name="ph:arrows-vertical-bold" class="h-6 w-6" />
                </button>
            </div>

            <!-- To Section -->
            <div class="mb-4">
                <label class="block text-base-content font-medium mb-2">To</label>
                <div class="join w-full">
                    <input
                        v-if="activeTab === 'shoes'"
                        type="text"
                        :value="convertedValue"
                        class="input input-bordered join-item w-3/5"
                        readonly
                    />
                    <input
                        v-else
                        type="text"
                        :value="convertedClothingValue"
                        class="input input-bordered join-item w-3/5"
                        readonly
                    />
                    <select v-if="activeTab === 'shoes'" v-model="toUnit" class="select select-bordered join-item w-2/5">
                        <option v-for="unit in shoeUnits.filter((item) => item.id != fromUnit)" :key="unit.id" :value="unit.id">
                            {{ unit.name }}
                        </option>
                    </select>
                    <select v-else v-model="toClothingUnit" class="select select-bordered join-item w-2/5">
                        <option
                            v-for="unit in clothingUnits.filter((item) => item.id != fromClothingUnit)"
                            :key="unit.id"
                            :value="unit.id"
                        >
                            {{ unit.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Copy Result Button - Only shown when there's a result -->
            <button
                v-if="(activeTab === 'shoes' && convertedValue) || (activeTab === 'clothing' && convertedClothingValue)"
                class="btn btn-primary w-full mt-4"
                @click="copyToClipboard(activeTab === 'shoes' ? convertedValue : convertedClothingValue)"
            >
                <Icon name="ph:copy-bold" class="h-5 w-5 mr-2" />
                Copy Result
            </button>

            <!-- Conversion Formula -->
            <div class="bg-base-200 p-4 rounded-lg mt-6 text-center">
                <p v-if="activeTab === 'shoes' && convertedValue">
                    {{ inputValue }} {{ getUnitNameById(fromUnit) }} = {{ convertedValue }} {{ getUnitNameById(toUnit) }}
                </p>
                <p v-else-if="activeTab === 'clothing' && convertedClothingValue">
                    {{ clothingInputValue }} {{ getClothingUnitNameById(fromClothingUnit) }} = {{ convertedClothingValue }}
                    {{ getClothingUnitNameById(toClothingUnit) }}
                </p>
                <p v-else>Enter a value to see conversion</p>
            </div>
        </div>

        <!-- Size Chart - Using details/summary instead of collapse for better compatibility -->
        <details class="bg-base-200 rounded-lg p-1" open>
            <summary class="p-3 font-medium cursor-pointer hover:bg-base-300 rounded-lg">
                {{ selectedGender === 'men' ? "Men's" : "Women's" }}
                {{
                    activeTab === 'shoes'
                        ? 'Shoe'
                        : selectedGender === 'women'
                        ? selectedType === 'tops'
                            ? 'Tops'
                            : 'Bottoms'
                        : 'Clothing'
                }}
                Size Chart
            </summary>
            <div class="p-4 pt-2">
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th v-for="unit in activeTab === 'shoes' ? shoeUnits : clothingUnits" :key="unit.id">
                                    {{ unit.name }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, index) in activeTab === 'shoes' ? getSizeChart() : getClothingSizeChart()"
                                :key="index"
                            >
                                <td v-for="unit in activeTab === 'shoes' ? shoeUnits : clothingUnits" :key="unit.id">
                                    {{ row[unit.id] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </details>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states'
import { useUrlUpdate } from '~/composables/useUrlUpdate';

// Get URL update functionality
const { updateUrlPath, getUnitsFromUrl } = useUrlUpdate();
const appState = useAppState();

// General setup
const tabs = [
    { id: 'shoes', name: 'Shoe Sizes' },
    { id: 'clothing', name: 'Clothing Sizes' },
];
const activeTab = ref('shoes');
const genders = [
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
];
const selectedGender = ref('men');

// Clothing type options (for women)
const clothingTypes = [
    { id: 'tops', name: 'Tops' },
    { id: 'bottoms', name: 'Bottoms' },
];
const selectedType = ref('tops');

// Shoe units
const shoeUnits = [
    { id: 'us', name: 'US Size' },
    { id: 'uk', name: 'UK Size' },
    { id: 'eu', name: 'EU Size' },
    { id: 'cm', name: 'CM' },
];
const fromUnit = ref('us');
const toUnit = ref('eu');
const inputValue = ref(9);
const convertedValue = ref('');

// Clothing units
const clothingUnits = [
    { id: 'us', name: 'US Size' },
    { id: 'uk', name: 'UK Size' },
    { id: 'eu', name: 'EU Size' },
    { id: 'intl', name: 'International' },
];
const fromClothingUnit = ref('us');
const toClothingUnit = ref('eu');
const clothingInputValue = ref('M');
const convertedClothingValue = ref('');

// Initialize units when component mounts
const initializeUnits = () => {
    const urlUnits = getUnitsFromUrl();

    if (urlUnits && urlUnits.fromUnit && urlUnits.toUnit) {
        if (activeTab.value == 'shoes') {
            fromUnit.value = urlUnits.fromUnit;
            toUnit.value = urlUnits.toUnit;
        } else {
            fromClothingUnit.value = urlUnits.fromUnit;
            toClothingUnit.value = urlUnits.toUnit;
        }
    }
};

// Debounce function to prevent too many calculations
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

// Debounced conversion functions
const debounceConvert = debounce(() => {
    convertShoeSize();
}, 300);

const debounceClothingConvert = debounce(() => {
    convertClothingSize();
}, 300);

// Utility functions to get unit names
const getUnitNameById = (id) => {
    const unit = shoeUnits.find((u) => u.id === id);
    return unit ? unit.name : '';
};

const getClothingUnitNameById = (id) => {
    const unit = clothingUnits.find((u) => u.id === id);
    return unit ? unit.name : '';
};

// Swap unit functions
const swapUnits = () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    convertShoeSize();
    updateUrlPath(fromUnit.value, toUnit.value);
};

const swapClothingUnits = () => {
    const temp = fromClothingUnit.value;
    fromClothingUnit.value = toClothingUnit.value;
    toClothingUnit.value = temp;
    convertClothingSize();
    updateUrlPath(fromClothingUnit.value, toClothingUnit.value);
};

// Copy to clipboard
const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    appState.value.showToast = true;
    setTimeout(() => (appState.value.showToast = false), 2000); // Hide toast after 2 seconds
};

// Shoe size charts
const mensShoeSizes = [
    { us: 6, uk: 5.5, eu: 39, cm: 24 },
    { us: 6.5, uk: 6, eu: 39.5, cm: 24.5 },
    { us: 7, uk: 6.5, eu: 40, cm: 25 },
    { us: 7.5, uk: 7, eu: 40.5, cm: 25.5 },
    { us: 8, uk: 7.5, eu: 41, cm: 26 },
    { us: 8.5, uk: 8, eu: 42, cm: 26.5 },
    { us: 9, uk: 8.5, eu: 42.5, cm: 27 },
    { us: 9.5, uk: 9, eu: 43, cm: 27.5 },
    { us: 10, uk: 9.5, eu: 44, cm: 28 },
    { us: 10.5, uk: 10, eu: 44.5, cm: 28.5 },
    { us: 11, uk: 10.5, eu: 45, cm: 29 },
    { us: 11.5, uk: 11, eu: 45.5, cm: 29.5 },
    { us: 12, uk: 11.5, eu: 46, cm: 30 },
    { us: 13, uk: 12.5, eu: 47.5, cm: 31 },
];

const womensShoeSizes = [
    { us: 5, uk: 3, eu: 35.5, cm: 22 },
    { us: 5.5, uk: 3.5, eu: 36, cm: 22.5 },
    { us: 6, uk: 4, eu: 36.5, cm: 23 },
    { us: 6.5, uk: 4.5, eu: 37, cm: 23.5 },
    { us: 7, uk: 5, eu: 37.5, cm: 24 },
    { us: 7.5, uk: 5.5, eu: 38, cm: 24.5 },
    { us: 8, uk: 6, eu: 38.5, cm: 25 },
    { us: 8.5, uk: 6.5, eu: 39, cm: 25.5 },
    { us: 9, uk: 7, eu: 40, cm: 26 },
    { us: 9.5, uk: 7.5, eu: 40.5, cm: 26.5 },
    { us: 10, uk: 8, eu: 41, cm: 27 },
];

// Clothing size charts
const mensClothingSizes = [
    { us: 'XS', uk: 'XS', eu: '44', intl: 'XS' },
    { us: 'S', uk: 'S', eu: '46-48', intl: 'S' },
    { us: 'M', uk: 'M', eu: '48-50', intl: 'M' },
    { us: 'L', uk: 'L', eu: '50-52', intl: 'L' },
    { us: 'XL', uk: 'XL', eu: '52-54', intl: 'XL' },
    { us: '2XL', uk: 'XXL', eu: '54-56', intl: '2XL' },
    { us: '3XL', uk: '3XL', eu: '58-60', intl: '3XL' },
];

const womensTopSizes = [
    { us: '0', uk: '4', eu: '32', intl: 'XXS' },
    { us: '2', uk: '6', eu: '34', intl: 'XS' },
    { us: '4', uk: '8', eu: '36', intl: 'S' },
    { us: '6', uk: '10', eu: '38', intl: 'S' },
    { us: '8', uk: '12', eu: '40', intl: 'M' },
    { us: '10', uk: '14', eu: '42', intl: 'M' },
    { us: '12', uk: '16', eu: '44', intl: 'L' },
    { us: '14', uk: '18', eu: '46', intl: 'L' },
    { us: '16', uk: '20', eu: '48', intl: 'XL' },
    { us: '18', uk: '22', eu: '50', intl: 'XL' },
    { us: '20', uk: '24', eu: '52', intl: '2XL' },
    { us: '22', uk: '26', eu: '54', intl: '2XL' },
];

const womensBottomSizes = [
    { us: '00', uk: '2', eu: '30', intl: 'XXS' },
    { us: '0', uk: '4', eu: '32', intl: 'XXS' },
    { us: '2', uk: '6', eu: '34', intl: 'XS' },
    { us: '4', uk: '8', eu: '36', intl: 'S' },
    { us: '6', uk: '10', eu: '38', intl: 'S' },
    { us: '8', uk: '12', eu: '40', intl: 'M' },
    { us: '10', uk: '14', eu: '42', intl: 'M' },
    { us: '12', uk: '16', eu: '44', intl: 'L' },
    { us: '14', uk: '18', eu: '46', intl: 'L' },
    { us: '16', uk: '20', eu: '48', intl: 'XL' },
    { us: '18', uk: '22', eu: '50', intl: 'XL' },
    { us: '20', uk: '24', eu: '52', intl: '2XL' },
    { us: '22', uk: '26', eu: '54', intl: '2XL' },
];

// Get the appropriate size chart based on selection
const getSizeChart = () => {
    return selectedGender.value === 'men' ? mensShoeSizes : womensShoeSizes;
};

const getClothingSizeChart = () => {
    if (selectedGender.value === 'men') {
        return mensClothingSizes;
    } else {
        return selectedType.value === 'tops' ? womensTopSizes : womensBottomSizes;
    }
};

// Find closest size match in the chart
const findClosestSize = (value, fromUnitId, toUnitId, chart) => {
    // For CM conversion which can be decimal
    if (fromUnitId === 'cm') {
        const numValue = parseFloat(value);
        const closest = chart.reduce((prev, curr) => {
            return Math.abs(curr.cm - numValue) < Math.abs(prev.cm - numValue) ? curr : prev;
        }, chart[0]);
        return closest[toUnitId];
    }

    // For standard sizes
    const matchedSize = chart.find((size) => String(size[fromUnitId]).toLowerCase() === String(value).toLowerCase());
    return matchedSize ? matchedSize[toUnitId] : 'N/A';
};

// Conversion functions
const convertShoeSize = () => {
    if (!inputValue.value) {
        convertedValue.value = '';
        return;
    }

    const sizeChart = getSizeChart();
    convertedValue.value = findClosestSize(inputValue.value, fromUnit.value, toUnit.value, sizeChart);
};

const convertClothingSize = () => {
    if (!clothingInputValue.value) {
        convertedClothingValue.value = '';
        return;
    }

    const sizeChart = getClothingSizeChart();
    convertedClothingValue.value = findClosestSize(
        clothingInputValue.value,
        fromClothingUnit.value,
        toClothingUnit.value,
        sizeChart
    );
};

// Watch for changes and update conversions
watch([selectedGender, fromUnit, toUnit, inputValue], () => {
    convertShoeSize();
});

watch([selectedGender, selectedType, fromClothingUnit, toClothingUnit, clothingInputValue], () => {
    convertClothingSize();
});

// When units change, update both the conversion and the URL
watch(fromUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateUrlPath(newVal, toUnit.value);
    }
});

watch(toUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateUrlPath(fromUnit.value, newVal);
    }
});

watch(fromClothingUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateUrlPath(newVal, toClothingUnit.value);
    }
});

watch(toClothingUnit, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        updateUrlPath(fromClothingUnit.value, newVal);
    }
});

// Initialize conversions
initializeUnits();
convertShoeSize();
convertClothingSize();
</script>
