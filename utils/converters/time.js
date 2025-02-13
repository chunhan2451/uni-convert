export const timeConverters = {
    "hours-to-minutes": {
        id: "hours-to-minutes",
        name: "Hours to Minutes",
        description: "Convert hours to minutes",
        formula: "minutes = hours * 60",
        inputLabel: "Hours",
        outputLabel: "Minutes",
        category: "time",
        inputType: "number",
        convert: (input) => (Number(input) * 60).toFixed(2),
    },
};
