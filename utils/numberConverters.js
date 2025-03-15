// utils/numberConverters.js
// Number System Converters
export const numberConverters = {
    // Decimal to other bases
    decimalToBinary(decimal) {
        try {
            return parseInt(decimal).toString(2);
        } catch (e) {
            return { error: 'Invalid decimal number' };
        }
    },

    decimalToOctal(decimal) {
        try {
            return parseInt(decimal).toString(8);
        } catch (e) {
            return { error: 'Invalid decimal number' };
        }
    },

    decimalToHex(decimal) {
        try {
            return parseInt(decimal).toString(16).toUpperCase();
        } catch (e) {
            return { error: 'Invalid decimal number' };
        }
    },

    // Other bases to decimal
    binaryToDecimal(binary) {
        try {
            if (!/^[01]+$/.test(binary)) {
                return { error: 'Invalid binary number' };
            }
            return parseInt(binary, 2).toString();
        } catch (e) {
            return { error: 'Invalid binary number' };
        }
    },

    octalToDecimal(octal) {
        try {
            if (!/^[0-7]+$/.test(octal)) {
                return { error: 'Invalid octal number' };
            }
            return parseInt(octal, 8).toString();
        } catch (e) {
            return { error: 'Invalid octal number' };
        }
    },

    hexToDecimal(hex) {
        try {
            if (!/^[0-9A-Fa-f]+$/.test(hex)) {
                return { error: 'Invalid hexadecimal number' };
            }
            return parseInt(hex, 16).toString();
        } catch (e) {
            return { error: 'Invalid hexadecimal number' };
        }
    },

    // Direct conversions between different bases
    binaryToHex(binary) {
        try {
            const decimal = this.binaryToDecimal(binary);
            if (decimal.error) return decimal;
            return this.decimalToHex(decimal);
        } catch (e) {
            return { error: 'Invalid binary number' };
        }
    },

    hexToBinary(hex) {
        try {
            const decimal = this.hexToDecimal(hex);
            if (decimal.error) return decimal;
            return this.decimalToBinary(decimal);
        } catch (e) {
            return { error: 'Invalid hexadecimal number' };
        }
    },

    // Roman numeral conversion
    decimalToRoman(num) {
        try {
            const decimal = parseInt(num);

            if (isNaN(decimal) || decimal <= 0 || decimal > 3999) {
                return { error: 'Number must be between 1 and 3999' };
            }

            const romanNumerals = [
                { value: 1000, symbol: 'M' },
                { value: 900, symbol: 'CM' },
                { value: 500, symbol: 'D' },
                { value: 400, symbol: 'CD' },
                { value: 100, symbol: 'C' },
                { value: 90, symbol: 'XC' },
                { value: 50, symbol: 'L' },
                { value: 40, symbol: 'XL' },
                { value: 10, symbol: 'X' },
                { value: 9, symbol: 'IX' },
                { value: 5, symbol: 'V' },
                { value: 4, symbol: 'IV' },
                { value: 1, symbol: 'I' },
            ];

            let result = '';
            let remaining = decimal;

            for (const { value, symbol } of romanNumerals) {
                while (remaining >= value) {
                    result += symbol;
                    remaining -= value;
                }
            }

            return result;
        } catch (e) {
            return { error: 'Invalid decimal number' };
        }
    },

    romanToDecimal(roman) {
        try {
            if (!roman || typeof roman !== 'string') {
                return { error: 'Invalid Roman numeral' };
            }

            roman = roman.toUpperCase();

            if (!/^[MDCLXVI]+$/.test(roman)) {
                return { error: 'Invalid Roman numeral' };
            }

            const romanValues = {
                M: 1000,
                D: 500,
                C: 100,
                L: 50,
                X: 10,
                V: 5,
                I: 1,
            };

            let result = 0;

            for (let i = 0; i < roman.length; i++) {
                const current = romanValues[roman[i]];
                const next = romanValues[roman[i + 1]];

                if (next && current < next) {
                    result += next - current;
                    i++;
                } else {
                    result += current;
                }
            }

            return result.toString();
        } catch (e) {
            return { error: 'Invalid Roman numeral' };
        }
    },
};
