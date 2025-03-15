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
    angle: () => import('./Categories/AngleConverter.vue').catch(() => BaseConverter),
    area: () => import('./Categories/AreaConverter.vue').catch(() => BaseConverter),
    color: () => import('./Categories/ColorConverter.vue').catch(() => BaseConverter),
    css: () => import('./Categories/CssConverter.vue').catch(() => BaseConverter),
    data: () => import('./Categories/DataConverter.vue').catch(() => BaseConverter),
    energy: () => import('./Categories/EnergyConverter.vue').catch(() => BaseConverter),
    length: () => import('./Categories/LengthConverter.vue').catch(() => BaseConverter),
    pressure: () => import('./Categories/PressureConverter.vue').catch(() => BaseConverter),
    speed: () => import('./Categories/SpeedConverter.vue').catch(() => BaseConverter),
    temperature: () => import('./Categories/TemperatureConverter.vue').catch(() => BaseConverter),
    time: () => import('./Categories/TimeConverter.vue').catch(() => BaseConverter),
    volume: () => import('./Categories/VolumeConverter.vue').catch(() => BaseConverter),
    weight: () => import('./Categories/WeightConverter.vue').catch(() => BaseConverter),

    // Text & Data converters
    'text-data': () => import('./Text/Base64Converter.vue').catch(() => BaseConverter),
    base64: () => import('./Text/Base64Converter.vue').catch(() => BaseConverter),
    url: () => import('./Text/UrlEncoder.vue').catch(() => BaseConverter),
    json: () => import('./Text/JsonFormatter.vue').catch(() => BaseConverter),
    csv: () => import('./Text/CsvConverter.vue').catch(() => BaseConverter),

    // Number system converters
    'number-systems': () => import('./Number/BinaryConverter.vue').catch(() => BaseConverter),
    binary: () => import('./Number/BinaryConverter.vue').catch(() => BaseConverter),
    roman: () => import('./Number/RomanConverter.vue').catch(() => BaseConverter),

    // Time & Date converters
    'time-date': () => import('./Time/TimestampConverter.vue').catch(() => BaseConverter),
    timestamp: () => import('./Time/TimestampConverter.vue').catch(() => BaseConverter),
    timezone: () => import('./Time/TimezoneConverter.vue').catch(() => BaseConverter),
    duration: () => import('./Time/DurationConverter.vue').catch(() => BaseConverter),

    // Text transformation
    'text-transform': () => import('./Text/CaseConverter.vue').catch(() => BaseConverter),
    case: () => import('./Text/CaseConverter.vue').catch(() => BaseConverter),
    stats: () => import('./Text/TextStats.vue').catch(() => BaseConverter),
    lines: () => import('./Text/LineTools.vue').catch(() => BaseConverter),
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
