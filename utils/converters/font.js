export const fontConverters = {
    "pt-to-px": {
        id: "pt-to-px",
        name: "Points to Pixels",
        description: "Convert font points to pixels",
        formula: "px = pt * (96 / 72)",
        inputLabel: "Points (pt)",
        outputLabel: "Pixels (px)",
        category: "font",
        inputType: "number",
        convert: (input) => (Number(input) * (96 / 72)).toFixed(2),
    },
};
