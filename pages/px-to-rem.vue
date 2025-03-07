<template>
  <div class="container mx-auto p-4">
    <div class="max-w-xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-center">Universal Converter</h1>

      <!-- Conversion Type Selection -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Conversion Type</label>
        <select 
          v-model="selectedCategory" 
          class="select select-bordered w-full bg-white" 
          @change="handleCategoryChange"
        >
          <option disabled value="">Select type</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- From Section -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-medium mb-2">From</label>
        <div class="flex">
          <input
            v-model="fromValue"
            type="number"
            class="input input-bordered rounded-r-none flex-1 bg-white"
            placeholder="Value"
            @input="convertFromValue"
          />
          <select 
            v-model="fromUnit" 
            class="select select-bordered rounded-l-none border-l-0 bg-white w-1/3" 
            @change="convertFromValue"
          >
            <option disabled value="">Unit</option>
            <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Swap Button -->
      <div class="flex justify-center mb-4">
        <button 
          @click="swapUnits" 
          class="btn btn-circle btn-sm btn-outline"
          title="Swap units"
        >
          <Icon name="solar:arrow-up-down-linear" size="1.25rem" />
        </button>
      </div>

      <!-- To Section -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">To</label>
        <div class="flex relative">
          <input
            v-model="toValue"
            type="text"
            class="input input-bordered rounded-r-none flex-1 bg-white"
            placeholder="Result"
            readonly
          />
          <select 
            v-model="toUnit" 
            class="select select-bordered rounded-l-none border-l-0 bg-white w-1/3" 
            @change="convertFromValue"
          >
            <option disabled value="">Unit</option>
            <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>
          <button 
            @click="copyToClipboard(toValue.toString())" 
            class="btn btn-ghost btn-sm absolute right-1 top-1/2 transform -translate-y-1/2"
            title="Copy result"
          >
            <Icon name="solar:copy-linear" size="1.25rem" />
          </button>

        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast toast-end toast-bottom">
      <div class="alert alert-success">
        <span>Copied to clipboard!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Categories and their respective units
const categories = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'mm', name: 'Millimeter (mm)', factor: 0.001 },
      { id: 'cm', name: 'Centimeter (cm)', factor: 0.01 },
      { id: 'm', name: 'Meter (m)', factor: 1 },
      { id: 'km', name: 'Kilometer (km)', factor: 1000 },
      { id: 'in', name: 'Inch (in)', factor: 0.0254 },
      { id: 'ft', name: 'Foot (ft)', factor: 0.3048 },
      { id: 'yd', name: 'Yard (yd)', factor: 0.9144 },
      { id: 'mi', name: 'Mile (mi)', factor: 1609.344 }
    ]
  },
  {
    id: 'weight',
    name: 'Weight',
    units: [
      { id: 'mg', name: 'Milligram (mg)', factor: 0.000001 },
      { id: 'g', name: 'Gram (g)', factor: 0.001 },
      { id: 'kg', name: 'Kilogram (kg)', factor: 1 },
      { id: 't', name: 'Metric Ton (t)', factor: 1000 },
      { id: 'oz', name: 'Ounce (oz)', factor: 0.0283495 },
      { id: 'lb', name: 'Pound (lb)', factor: 0.453592 },
      { id: 'st', name: 'Stone (st)', factor: 6.35029 }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    units: [
      { id: 'ml', name: 'Milliliter (ml)', factor: 0.000001 },
      { id: 'l', name: 'Liter (l)', factor: 0.001 },
      { id: 'm3', name: 'Cubic Meter (m³)', factor: 1 },
      { id: 'pt', name: 'Pint (pt)', factor: 0.000473176 },
      { id: 'qt', name: 'Quart (qt)', factor: 0.000946353 },
      { id: 'gal', name: 'Gallon (gal)', factor: 0.00378541 },
      { id: 'ft3', name: 'Cubic Foot (ft³)', factor: 0.0283168 }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius (°C)', factor: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 1 },
      { id: 'k', name: 'Kelvin (K)', factor: 1 }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    units: [
      { id: 'ms', name: 'Millisecond (ms)', factor: 0.001 },
      { id: 's', name: 'Second (s)', factor: 1 },
      { id: 'min', name: 'Minute (min)', factor: 60 },
      { id: 'h', name: 'Hour (h)', factor: 3600 },
      { id: 'd', name: 'Day (d)', factor: 86400 },
      { id: 'wk', name: 'Week (wk)', factor: 604800 },
      { id: 'mo', name: 'Month (30 days)', factor: 2592000 },
      { id: 'yr', name: 'Year (365 days)', factor: 31536000 }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    units: [
      { id: 'mm2', name: 'Square Millimeter (mm²)', factor: 0.000001 },
      { id: 'cm2', name: 'Square Centimeter (cm²)', factor: 0.0001 },
      { id: 'm2', name: 'Square Meter (m²)', factor: 1 },
      { id: 'ha', name: 'Hectare (ha)', factor: 10000 },
      { id: 'km2', name: 'Square Kilometer (km²)', factor: 1000000 },
      { id: 'in2', name: 'Square Inch (in²)', factor: 0.00064516 },
      { id: 'ft2', name: 'Square Foot (ft²)', factor: 0.092903 },
      { id: 'ac', name: 'Acre (ac)', factor: 4046.86 },
      { id: 'mi2', name: 'Square Mile (mi²)', factor: 2590000 }
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meters per Second (m/s)', factor: 1 },
      { id: 'kph', name: 'Kilometers per Hour (km/h)', factor: 0.277778 },
      { id: 'mph', name: 'Miles per Hour (mph)', factor: 0.44704 },
      { id: 'kn', name: 'Knot (kn)', factor: 0.514444 }
    ]
  },
  {
    id: 'data',
    name: 'Data',
    units: [
      { id: 'b', name: 'Bit (b)', factor: 0.125 },
      { id: 'B', name: 'Byte (B)', factor: 1 },
      { id: 'KB', name: 'Kilobyte (KB)', factor: 1024 },
      { id: 'MB', name: 'Megabyte (MB)', factor: 1048576 },
      { id: 'GB', name: 'Gigabyte (GB)', factor: 1073741824 },
      { id: 'TB', name: 'Terabyte (TB)', factor: 1099511627776 }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    units: [
      { id: 'pa', name: 'Pascal (Pa)', factor: 1 },
      { id: 'kpa', name: 'Kilopascal (kPa)', factor: 1000 },
      { id: 'bar', name: 'Bar', factor: 100000 },
      { id: 'psi', name: 'PSI', factor: 6894.76 },
      { id: 'atm', name: 'Atmosphere (atm)', factor: 101325 }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    units: [
      { id: 'j', name: 'Joule (J)', factor: 1 },
      { id: 'kj', name: 'Kilojoule (kJ)', factor: 1000 },
      { id: 'cal', name: 'Calorie (cal)', factor: 4.184 },
      { id: 'kcal', name: 'Kilocalorie (kcal)', factor: 4184 },
      { id: 'wh', name: 'Watt-hour (Wh)', factor: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour (kWh)', factor: 3600000 }
    ]
  },
  {
    id: 'angle',
    name: 'Angle',
    units: [
      { id: 'deg', name: 'Degree (°)', factor: 1 },
      { id: 'rad', name: 'Radian (rad)', factor: 57.2958 },
      { id: 'grad', name: 'Gradian (grad)', factor: 0.9 },
      { id: 'arcmin', name: 'Arcminute (\')', factor: 0.0166667 },
      { id: 'arcsec', name: 'Arcsecond (\")', factor: 0.000277778 }
    ]
  }
];

// State
const selectedCategory = ref('');
const fromUnit = ref('');
const toUnit = ref('');
const fromValue = ref('');
const toValue = ref('');
const showToast = ref(false);

// Get current units based on selected category
const currentUnits = computed(() => {
  const category = categories.find(cat => cat.id === selectedCategory.value);
  return category ? category.units : [];
});

// Initialize units when component mounts or category changes
const handleCategoryChange = () => {
  const category = categories.find(cat => cat.id === selectedCategory.value);
  
  if (category && category.units.length > 0) {
    fromUnit.value = category.units[0].id;
    toUnit.value = category.units.length > 1 ? category.units[1].id : category.units[0].id;
    
    // Reset values
    fromValue.value = '';
    toValue.value = '';
  }
};

// Convert from the "from" value
const convertFromValue = () => {
  if (!fromUnit.value || !toUnit.value || fromValue.value === '') {
    toValue.value = '';
    return;
  }
  
  const from = currentUnits.value.find(unit => unit.id === fromValue);
  const to = currentUnits.value.find(unit => unit.id === toValue);
  
  // Special case for temperature
  if (selectedCategory.value === 'temperature') {
    toValue.value = convertTemperature(parseFloat(fromValue.value), fromUnit.value, toUnit.value).toFixed(4);
    return;
  }
  
  // Standard conversion using factor
  const result = computeConversion(parseFloat(fromValue.value), fromUnit.value, toUnit.value);
  toValue.value = result.toFixed(4);
};

// Compute conversion between units using factors
const computeConversion = (value, fromUnitId, toUnitId) => {
  const fromUnit = currentUnits.value.find(unit => unit.id === fromUnitId);
  const toUnit = currentUnits.value.find(unit => unit.id === toUnitId);
  
  if (!fromUnit || !toUnit) return 0;
  
  return value * (fromUnit.factor / toUnit.factor);
};

// Temperature conversion requires special formulas
const convertTemperature = (value, fromUnit, toUnit) => {
  // Convert to Celsius first as an intermediate step
  let celsius;
  
  switch (fromUnit) {
    case 'c':
      celsius = value;
      break;
    case 'f':
      celsius = (value - 32) * (5/9);
      break;
    case 'k':
      celsius = value - 273.15;
      break;
    default:
      return 0;
  }
  
  // Convert from Celsius to target unit
  switch (toUnit) {
    case 'c':
      return celsius;
    case 'f':
      return (celsius * (9/5)) + 32;
    case 'k':
      return celsius + 273.15;
    default:
      return 0;
  }
};

// Copy to clipboard functionality
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 2000); // Hide toast after 2 seconds
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Swap units function
const swapUnits = () => {
  // Save current values
  const tempUnit = fromUnit.value;
  const tempValue = fromValue.value;
  
  // Swap units
  fromUnit.value = toUnit.value;
  toUnit.value = tempUnit;
  
  // Set from value to the result of the previous conversion
  fromValue.value = toValue.value;
  
  // Convert with new settings
  convertFromValue();
};

// Watch for from value changes
watch(fromValue, convertFromValue);
watch(fromUnit, convertFromValue);
watch(toUnit, convertFromValue);
</script>ƒ