<!-- components/Convert/Units/FuelEfficiencyConverter.vue -->
<template>
    <BaseConverter
        :category="category"
        title="Fuel Efficiency Converter"
        :convertFunction="convertFuelEfficiency"
        :formulaFunction="getFuelEfficiencyFormula"
    />
    <!-- <div class="container mx-auto p-4">
        <div class="mt-8 bg-base-100 p-6 rounded-lg shadow-md border border-base-300">
            <h2 class="text-xl font-semibold mb-4">Conversion Formulas</h2>
            <div class="grid gap-4">
                <div>
                    <h3 class="font-medium">Miles per Gallon (MPG) to Kilometers per Liter (km/L)</h3>
                    <p class="text-base-content/70 mt-1">1 MPG = 0.425144 km/L</p>
                </div>
                <div>
                    <h3 class="font-medium">Miles per Gallon (MPG) to Liters per 100 km (L/100km)</h3>
                    <p class="text-base-content/70 mt-1">L/100km = 235.215 / MPG</p>
                </div>
                <div>
                    <h3 class="font-medium">Kilometers per Liter (km/L) to Liters per 100 km (L/100km)</h3>
                    <p class="text-base-content/70 mt-1">L/100km = 100 / km/L</p>
                </div>
            </div>
        </div>
        <div class="mt-8 bg-base-100 p-6 rounded-lg shadow-md border border-base-300">
            <h2 class="text-xl font-semibold mb-4">Common Fuel Efficiency Values</h2>
            <div class="overflow-x-auto">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>MPG</th>
                            <th>km/L</th>
                            <th>L/100km</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>15</td>
                            <td>6.38</td>
                            <td>15.68</td>
                            <td>Large SUV/Truck</td>
                        </tr>
                        <tr>
                            <td>25</td>
                            <td>10.63</td>
                            <td>9.41</td>
                            <td>Midsize Sedan</td>
                        </tr>
                        <tr>
                            <td>35</td>
                            <td>14.88</td>
                            <td>6.72</td>
                            <td>Compact Car</td>
                        </tr>
                        <tr>
                            <td>50</td>
                            <td>21.26</td>
                            <td>4.70</td>
                            <td>Hybrid Vehicle</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div> -->
</template>

<script setup>
import { unitConvertCategories } from '~/utils/unit';
import BaseConverter from '../BaseConverter.vue';

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === 'fuel');

// Custom conversion function for fuel efficiency
const convertFuelEfficiency = (value, fromUnit, toUnit) => {
    if (!value || isNaN(value) || value <= 0) return 0;

    // Handle special case for same units
    if (fromUnit === toUnit) return value;

    let result;

    // Convert to MPG as standard unit
    let mpgValue;
    if (fromUnit === 'mpg') {
        mpgValue = value;
    } else if (fromUnit === 'kml') {
        mpgValue = value / 0.425144;
    } else if (fromUnit === 'l100km') {
        mpgValue = 235.215 / value;
    }

    // Convert from MPG to target unit
    if (toUnit === 'mpg') {
        result = mpgValue;
    } else if (toUnit === 'kml') {
        result = mpgValue * 0.425144;
    } else if (toUnit === 'l100km') {
        result = 235.215 / mpgValue;
    }

    return result;
};

// Custom formula display
const getFuelEfficiencyFormula = (fromUnit, toUnit) => {
    const formulas = {
        'mpg-kml': '1 MPG = 0.425144 km/L',
        'mpg-l100km': 'L/100km = 235.215 / MPG',
        'kml-mpg': '1 km/L = 2.35215 MPG',
        'kml-l100km': 'L/100km = 100 / km/L',
        'l100km-mpg': 'MPG = 235.215 / L/100km',
        'l100km-kml': 'km/L = 100 / L/100km',
    };

    const key = `${fromUnit}-${toUnit}`;
    return formulas[key] || 'Fuel efficiency conversion';
};
</script>
