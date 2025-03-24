// components/Convert/index.js
// Dynamically import category-specific converters to prevent errors
// when components haven't been created yet
import { defineAsyncComponent } from 'vue';

// Map of category IDs to their component loaders
const converterComponents = {
    // Unit-based converters
    angle: () => import('./Units/AngleConverter.vue'),
    area: () => import('./Units/AreaConverter.vue'),
    clothing: () => import('./Units/ClothingSizeConverter.vue'),
    color: () => import('./Units/ColorConverter.vue'),
    cooking: () => import('./Units/CookingConverter.vue'),
    css: () => import('./Units/CssConverter.vue'),
    data: () => import('./Units/DataConverter.vue'),
    dataspeed: () => import('./Units/DataSpeedConverter.vue'),
    electrical: () => import('./Units/ElectricalConverter.vue'),
    energy: () => import('./Units/EnergyConverter.vue'),
    fuel: () => import('./Units/FuelEfficiencyConverter.vue'),
    length: () => import('./Units/LengthConverter.vue'),
    pressure: () => import('./Units/PressureConverter.vue'),
    speed: () => import('./Units/SpeedConverter.vue'),
    temperature: () => import('./Units/TemperatureConverter.vue'),
    time: () => import('./Units/TimeConverter.vue'),
    volume: () => import('./Units/VolumeConverter.vue'),
    weight: () => import('./Units/WeightConverter.vue'),

    // Text & Data converters
    'text-data': () => import('./TextDataTools/Text/Base64Converter.vue'),
    base64: () => import('./TextDataTools/Text/Base64Converter.vue'),
    url: () => import('./TextDataTools/Text/UrlEncoder.vue'),
    json: () => import('./TextDataTools/Text/JsonFormatter.vue'),
    csv: () => import('./TextDataTools/Text/CsvConverter.vue'),

    // Number system converters
    'number-systems': () => import('./TextDataTools/Number/BinaryConverter.vue'),
    binary: () => import('./TextDataTools/Number/BinaryConverter.vue'),
    roman: () => import('./TextDataTools/Number/RomanConverter.vue'),

    // Time & Date converters
    'time-date': () => import('./TextDataTools/Time/TimestampConverter.vue'),
    timestamp: () => import('./TextDataTools/Time/TimestampConverter.vue'),
    timezone: () => import('./TextDataTools/Time/TimezoneConverter.vue'),
    duration: () => import('./TextDataTools/Time/DurationConverter.vue'),
    age: () => import('./TextDataTools/Time/AgeCalculator.vue'),

    // Text transformation
    'text-transform': () => import('./TextDataTools/Text/CaseConverter.vue'),
    case: () => import('./TextDataTools/Text/CaseConverter.vue'),
    stats: () => import('./TextDataTools/Text/TextStats.vue'),
    lines: () => import('./TextDataTools/Text/LineTools.vue'),

    // Utilities
    'qr-code': () => import('./Utility/QrCodeGenerator.vue'),

    // Image converters
    images: () => import('./TextDataTools/Images/ImageConverter.vue'),
    'image-format': () => import('./TextDataTools/Images/ImageConverter.vue'),
    'image-compressor': () => import('./TextDataTools/Images/ImageCompressor.vue'),

    // Financial tools
    loan: () => import('./FinancialTools/LoanCalculator.vue'),
    mortgage: () => import('./FinancialTools/LoanCalculator.vue'),
    compound: () => import('./FinancialTools/CompoundInterestCalculator.vue'),
    'compound-interest': () => import('./FinancialTools/CompoundInterestCalculator.vue'),

    // Health & Fitness tools
    bmi: () => import('./HealthTools/BmiCalculator.vue'),
    calories: () => import('./HealthTools/CaloriesConverter.vue'),
    steps: () => import('./HealthTools/StepsConverter.vue'),
    bloodsugar: () => import('./HealthTools/BloodSugarConverter.vue'),
};

// Helper function to get a converter component by category ID
export function getConverterByCategory(categoryId) {
    if (!converterComponents[categoryId]) {
        console.warn(`No converter component found for category: ${categoryId}`);
        return null;
    }

    // Return async component with loading fallback
    return defineAsyncComponent({
        loader: converterComponents[categoryId],
        // If the file doesn't exist yet, fall back to the base converter
        onError: (error, retry, fail, attempts) => {
            console.warn(`Error loading converter for ${categoryId}`, error);
            if (attempts > 1) {
                fail();
            } else {
                // You might want to create a default converter for this category
                retry();
            }
        },
    });
}
