// utils/unit.js
import { colorCategory } from './color';
import { uiIcons } from './appConstant';

// Original unit conversion categories
export const unitConvertCategories = [
    {
        id: 'angle',
        name: 'Angle',
        units: [
            { id: 'deg', name: 'Degree (°)', factor: 1 },
            { id: 'rad', name: 'Radian (rad)', factor: 57.2958 },
            { id: 'grad', name: 'Gradian (grad)', factor: 0.9 },
            { id: 'arcmin', name: "Arcminute (')", factor: 0.0166667 },
            { id: 'arcsec', name: 'Arcsecond (")', factor: 0.000277778 },
        ],
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
            { id: 'mi2', name: 'Square Mile (mi²)', factor: 2590000 },
        ],
    },
    {
        id: 'css',
        name: 'CSS Units',
        units: [
            { id: 'px', name: 'Pixels (px)', factor: 1 },
            { id: 'rem', name: 'Root EM (rem)', factor: 16 }, // Assuming 1rem = 16px default
            { id: 'em', name: 'EM (em)', factor: 16 }, // Assuming 1em = 16px default
            { id: 'percent', name: 'Percentage (%)', factor: 0.01 }, // 1% = 0.01 of base
            { id: 'pt', name: 'Points (pt)', factor: 1.333333 }, // 1pt = 1.333333px
            { id: 'vh', name: 'Viewport Height (vh)', factor: 0 }, // Special handling required
            { id: 'vw', name: 'Viewport Width (vw)', factor: 0 }, // Special handling required
        ],
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
            { id: 'TB', name: 'Terabyte (TB)', factor: 1099511627776 },
        ],
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
            { id: 'kwh', name: 'Kilowatt-hour (kWh)', factor: 3600000 },
        ],
    },
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
            { id: 'mi', name: 'Mile (mi)', factor: 1609.344 },
        ],
    },
    {
        id: 'pressure',
        name: 'Pressure',
        units: [
            { id: 'pa', name: 'Pascal (Pa)', factor: 1 },
            { id: 'kpa', name: 'Kilopascal (kPa)', factor: 1000 },
            { id: 'bar', name: 'Bar', factor: 100000 },
            { id: 'psi', name: 'PSI', factor: 6894.76 },
            { id: 'atm', name: 'Atmosphere (atm)', factor: 101325 },
        ],
    },
    {
        id: 'speed',
        name: 'Speed',
        units: [
            { id: 'mps', name: 'Meters per Second (m/s)', factor: 1 },
            { id: 'kph', name: 'Kilometers per Hour (km/h)', factor: 0.277778 },
            { id: 'mph', name: 'Miles per Hour (mph)', factor: 0.44704 },
            { id: 'kn', name: 'Knot (kn)', factor: 0.514444 },
        ],
    },
    {
        id: 'temperature',
        name: 'Temperature',
        units: [
            { id: 'c', name: 'Celsius (°C)', factor: 1 },
            { id: 'f', name: 'Fahrenheit (°F)', factor: 1 },
            { id: 'k', name: 'Kelvin (K)', factor: 1 },
        ],
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
            { id: 'yr', name: 'Year (365 days)', factor: 31536000 },
        ],
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
            { id: 'ft3', name: 'Cubic Foot (ft³)', factor: 0.0283168 },
        ],
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
            { id: 'st', name: 'Stone (st)', factor: 6.35029 },
        ],
    },
    // Color category
    colorCategory,
];

// Additional converter categories (not unit-based)
export const additionalConverterCategories = [
    {
        id: 'text-data',
        name: 'Text & Data',
        description: 'Convert between text formats and encodings',
        tools: [
            { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode or decode text using Base64' },
            { id: 'url', name: 'URL Encoder/Decoder', description: 'Encode or decode text for URLs' },
            { id: 'json', name: 'JSON Formatter/Validator', description: 'Format, minify, or validate JSON' },
            { id: 'csv', name: 'CSV to JSON Converter', description: 'Convert between CSV and JSON formats' },
        ],
        icon: uiIcons.textBox,
    },
    {
        id: 'number-systems',
        name: 'Number Systems',
        description: 'Convert between different number systems and formats',
        tools: [
            { id: 'binary', name: 'Binary Converter', description: 'Convert between decimal, binary, octal, and hex' },
            { id: 'roman', name: 'Roman Numerals', description: 'Convert between decimal and Roman numerals' },
        ],
        icon: uiIcons.numeric,
    },
    {
        id: 'time-date',
        name: 'Time & Date',
        description: 'Convert and format times and dates',
        tools: [
            { id: 'timestamp', name: 'Timestamp Converter', description: 'Convert between date/time and Unix timestamps' },
            { id: 'timezone', name: 'Time Zone Converter', description: 'Convert times between different time zones' },
            { id: 'duration', name: 'Duration Formatter', description: 'Format and parse time durations' },
            { id: 'age', name: 'Age Calculator', description: 'Calculate age from birthdate' },
        ],
        icon: uiIcons.clock,
    },
    {
        id: 'text-transform',
        name: 'Text Transformation',
        description: 'Transform and analyze text',
        tools: [
            { id: 'case', name: 'Case Converter', description: 'Convert text case (upper, lower, title, camel, etc.)' },
            { id: 'stats', name: 'Text Statistics', description: 'Count characters, words, and analyze text' },
            { id: 'lines', name: 'Line Tools', description: 'Sort, deduplicate, and manipulate text lines' },
        ],
        icon: uiIcons.textVariant,
    },
    {
        id: 'qr',
        name: 'QR Code',
        description: 'Generate QR codes for text, URLs, and more',
        tools: [{ id: 'qr-code', name: 'QR Code Generator', description: 'Generate QR codes for text, URLs, and more' }],
        icon: uiIcons.qr,
    },
    {
        id: 'images',
        name: 'Image Tools',
        description: 'Convert and manipulate image files',
        tools: [
            {
                id: 'image-format',
                name: 'Image Format Converter',
                description: 'Convert between JPG, PNG, WebP, SVG, and other image formats',
            },
        ],
        icon: uiIcons.png,
    },
];

// Combined categories for global access
export const allConverterCategories = [...unitConvertCategories, ...additionalConverterCategories];
