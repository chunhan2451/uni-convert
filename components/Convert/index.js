// components/Convert/index.js
// Import all converter components
import BaseConverter from './BaseConverter.vue';
import CategoryCard from './CategoryCard.vue';

// Dynamically import category-specific converters to prevent errors
// when components haven't been created yet
import { defineAsyncComponent } from 'vue';

// Map of category IDs to their component loaders
const converterComponents = {
    // Unit-based converters
    angle: () => import('./Units/AngleConverter.vue').catch(() => BaseConverter),
    area: () => import('./Units/AreaConverter.vue').catch(() => BaseConverter),
    color: () => import('./Units/ColorConverter.vue').catch(() => BaseConverter),
    css: () => import('./Units/CssConverter.vue').catch(() => BaseConverter),
    data: () => import('./Units/DataConverter.vue').catch(() => BaseConverter),
    energy: () => import('./Units/EnergyConverter.vue').catch(() => BaseConverter),
    length: () => import('./Units/LengthConverter.vue').catch(() => BaseConverter),
    pressure: () => import('./Units/PressureConverter.vue').catch(() => BaseConverter),
    speed: () => import('./Units/SpeedConverter.vue').catch(() => BaseConverter),
    temperature: () => import('./Units/TemperatureConverter.vue').catch(() => BaseConverter),
    time: () => import('./Units/TimeConverter.vue').catch(() => BaseConverter),
    volume: () => import('./Units/VolumeConverter.vue').catch(() => BaseConverter),
    weight: () => import('./Units/WeightConverter.vue').catch(() => BaseConverter),

    // Text & Data converters
    'text-data': () => import('./TextDataTools/Text/Base64Converter.vue').catch(() => BaseConverter),
    base64: () => import('./TextDataTools/Text/Base64Converter.vue').catch(() => BaseConverter),
    url: () => import('./TextDataTools/Text/UrlEncoder.vue').catch(() => BaseConverter),
    json: () => import('./TextDataTools/Text/JsonFormatter.vue').catch(() => BaseConverter),
    csv: () => import('./TextDataTools/Text/CsvConverter.vue').catch(() => BaseConverter),

    // Number system converters
    'number-systems': () => import('./TextDataTools/Number/BinaryConverter.vue').catch(() => BaseConverter),
    binary: () => import('./TextDataTools/Number/BinaryConverter.vue').catch(() => BaseConverter),
    roman: () => import('./TextDataTools/Number/RomanConverter.vue').catch(() => BaseConverter),

    // Time & Date converters
    'time-date': () => import('./TextDataTools/Time/TimestampConverter.vue').catch(() => BaseConverter),
    timestamp: () => import('./TextDataTools/Time/TimestampConverter.vue').catch(() => BaseConverter),
    timezone: () => import('./TextDataTools/Time/TimezoneConverter.vue').catch(() => BaseConverter),
    duration: () => import('./TextDataTools/Time/DurationConverter.vue').catch(() => BaseConverter),

    // Text transformation
    'text-transform': () => import('./TextDataTools/Text/CaseConverter.vue').catch(() => BaseConverter),
    case: () => import('./TextDataTools/Text/CaseConverter.vue').catch(() => BaseConverter),
    stats: () => import('./TextDataTools/Text/TextStats.vue').catch(() => BaseConverter),
    lines: () => import('./TextDataTools/Text/LineTools.vue').catch(() => BaseConverter),
};

// Export base components
export { BaseConverter, CategoryCard };

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
