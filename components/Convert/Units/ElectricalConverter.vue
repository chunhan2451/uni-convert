<!-- components/Convert/Units/ElectricalConverter.vue -->
<template>
    <BaseConverter
        :category="category"
        title="Electrical Converter"
        :convertFunction="convertElectricalUnits"
        :formulaFunction="getElectricalFormula"
    />
    <!-- <div class="container mx-auto p-4">
        <details class="bg-base-200 rounded-lg" open>
            <summary class="p-3 font-medium cursor-pointer hover:bg-base-300 rounded-lg">Ohm's Law Reference</summary>
            <div class="p-4 pt-2">
                <h3 class="font-bold mb-3">Ohm's Law Formulas:</h3>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Find</th>
                                <th>Formula</th>
                                <th>Given</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Voltage (V)</td>
                                <td>V = I × R</td>
                                <td>Current and Resistance</td>
                            </tr>
                            <tr>
                                <td>Current (I)</td>
                                <td>I = V ÷ R</td>
                                <td>Voltage and Resistance</td>
                            </tr>
                            <tr>
                                <td>Resistance (R)</td>
                                <td>R = V ÷ I</td>
                                <td>Voltage and Current</td>
                            </tr>
                            <tr>
                                <td>Power (P)</td>
                                <td>P = V × I</td>
                                <td>Voltage and Current</td>
                            </tr>
                            <tr>
                                <td>Power (P)</td>
                                <td>P = I² × R</td>
                                <td>Current and Resistance</td>
                            </tr>
                            <tr>
                                <td>Power (P)</td>
                                <td>P = V² ÷ R</td>
                                <td>Voltage and Resistance</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="font-bold mt-4 mb-3">Notes:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Voltage (V) is measured in volts</li>
                    <li>Current (I) is measured in amperes or amps</li>
                    <li>Resistance (R) is measured in ohms</li>
                    <li>Power (P) is measured in watts</li>
                </ul>

                <div class="mt-4 text-sm text-base-content/70">
                    <p>
                        This calculator provides approximate conversions using common values. For precise calculations with
                        multiple variables, a more advanced circuit calculator is recommended.
                    </p>
                </div>
            </div>
        </details>
    </div> -->
</template>

<script setup>
import { unitConvertCategories } from '~/utils/unit';
import BaseConverter from '../BaseConverter.vue';

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === 'electrical');

// Default values for calculations
const standardValues = {
    v: 120, // volts
    r: 10, // ohms
    i: 1, // amps
    p: 100, // watts
};

// Custom electrical conversion function
const convertElectricalUnits = (value, fromUnit, toUnit) => {
    if (!value || isNaN(value) || value <= 0) return 0;

    // If the from unit is the same as to unit, just return the same value
    if (fromUnit === toUnit) return value;

    let result;

    // Voltage conversions
    if (fromUnit === 'v') {
        if (toUnit === 'i') {
            // V to I: I = V/R (assume standard resistance)
            result = value / standardValues.r;
        } else if (toUnit === 'r') {
            // V to R: R = V/I (assume standard current)
            result = value / standardValues.i;
        } else if (toUnit === 'p') {
            // V to P: P = V*I (assume standard current)
            result = value * standardValues.i;
        }
    }
    // Current conversions
    else if (fromUnit === 'i') {
        if (toUnit === 'v') {
            // I to V: V = I*R (assume standard resistance)
            result = value * standardValues.r;
        } else if (toUnit === 'r') {
            // I to R: R = V/I (assume standard voltage)
            result = standardValues.v / value;
        } else if (toUnit === 'p') {
            // I to P: P = I*V (assume standard voltage)
            result = value * standardValues.v;
        }
    }
    // Resistance conversions
    else if (fromUnit === 'r') {
        if (toUnit === 'v') {
            // R to V: V = I*R (assume standard current)
            result = standardValues.i * value;
        } else if (toUnit === 'i') {
            // R to I: I = V/R (assume standard voltage)
            result = standardValues.v / value;
        } else if (toUnit === 'p') {
            // R to P: P = V²/R (assume standard voltage)
            result = (standardValues.v * standardValues.v) / value;
        }
    }
    // Power conversions
    else if (fromUnit === 'p') {
        if (toUnit === 'v') {
            // P to V: V = P/I (assume standard current)
            result = value / standardValues.i;
        } else if (toUnit === 'i') {
            // P to I: I = P/V (assume standard voltage)
            result = value / standardValues.v;
        } else if (toUnit === 'r') {
            // P to R: R = V²/P (assume standard voltage)
            result = (standardValues.v * standardValues.v) / value;
        }
    }

    return result;
};

// Custom formula display
const getElectricalFormula = (fromUnit, toUnit) => {
    const formulas = {
        'v-i': 'I = V/R (Current = Voltage/Resistance)',
        'v-r': 'R = V/I (Resistance = Voltage/Current)',
        'v-p': 'P = V×I (Power = Voltage×Current)',

        'i-v': 'V = I×R (Voltage = Current×Resistance)',
        'i-r': 'R = V/I (Resistance = Voltage/Current)',
        'i-p': 'P = I×V (Power = Current×Voltage)',

        'r-v': 'V = I×R (Voltage = Current×Resistance)',
        'r-i': 'I = V/R (Current = Voltage/Resistance)',
        'r-p': 'P = V²/R (Power = Voltage²/Resistance)',

        'p-v': 'V = P/I (Voltage = Power/Current)',
        'p-i': 'I = P/V (Current = Power/Voltage)',
        'p-r': 'R = V²/P (Resistance = Voltage²/Power)',
    };

    const key = `${fromUnit}-${toUnit}`;
    return formulas[key] || "Ohm's Law Relationship";
};
</script>
