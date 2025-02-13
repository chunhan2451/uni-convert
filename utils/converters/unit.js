export const unitConverters = {
    "px-to-rem": {
        id: "px-to-rem",
        name: "PX to REM",
        description: "Convert pixels to CSS rem units",
        formula: "rem = px / rootFontSize",
        inputLabel: "Pixels (px)",
        outputLabel: "REM",
        category: "unit",
        inputType: "number",
        convert: (input, config) => (Number(input) / (config?.rootFontSize || 16)).toFixed(4),
    },
    "rem-to-px": {
        id: "rem-to-px",
        name: "REM to PX",
        description: "Convert rem units to pixels",
        formula: "px = rem * rootFontSize",
        inputLabel: "REM",
        outputLabel: "Pixels (px)",
        category: "unit",
        inputType: "number",
        convert: (input, config) => (Number(input) * (config?.rootFontSize || 16)).toFixed(2),
    },
};
