// Text and Data Converters
export const dataConverters = {
    // Base64 encoding/decoding
    textToBase64(text) {
        try {
            return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
        } catch (e) {
            return { error: "Invalid input for Base64 encoding" };
        }
    },

    base64ToText(base64) {
        try {
            return decodeURIComponent(
                Array.prototype.map.call(atob(base64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
            );
        } catch (e) {
            return { error: "Invalid Base64 string" };
        }
    },

    // URL encoding/decoding
    encodeURL(text) {
        try {
            return encodeURIComponent(text);
        } catch (e) {
            return { error: "Invalid input for URL encoding" };
        }
    },

    decodeURL(text) {
        try {
            return decodeURIComponent(text);
        } catch (e) {
            return { error: "Invalid input for URL decoding" };
        }
    },

    // JSON formatter/validator
    formatJSON(json) {
        try {
            const obj = typeof json === "string" ? JSON.parse(json) : json;
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return { error: "Invalid JSON" };
        }
    },

    minifyJSON(json) {
        try {
            const obj = typeof json === "string" ? JSON.parse(json) : json;
            return JSON.stringify(obj);
        } catch (e) {
            return { error: "Invalid JSON" };
        }
    },

    validateJSON(json) {
        try {
            JSON.parse(json);
            return { valid: true };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    },

    // CSV to JSON and vice versa
    csvToJSON(csv, delimiter = ",", hasHeader = true) {
        try {
            const lines = csv.split("\n");
            const result = [];
            const headers = hasHeader
                ? lines[0].split(delimiter).map((h) => h.trim())
                : Array.from({ length: lines[0].split(delimiter).length }, (_, i) => `field${i + 1}`);

            const startIndex = hasHeader ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                if (lines[i].trim() === "") continue;

                const obj = {};
                const currentLine = lines[i].split(delimiter);

                for (let j = 0; j < headers.length; j++) {
                    const value = currentLine[j] ? currentLine[j].trim() : "";
                    obj[headers[j]] = value;
                }

                result.push(obj);
            }

            return result;
        } catch (e) {
            return { error: "Invalid CSV format" };
        }
    },

    jsonToCSV(json, delimiter = ",") {
        try {
            const jsonArray = typeof json === "string" ? JSON.parse(json) : json;

            if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
                return { error: "Input must be a non-empty array" };
            }

            const headers = Object.keys(jsonArray[0]);
            const csvArray = [];

            // Add header row
            csvArray.push(headers.join(delimiter));

            // Add data rows
            jsonArray.forEach((item) => {
                const row = headers.map((header) => {
                    const cell = item[header] === null || item[header] === undefined ? "" : item[header];
                    // Escape commas, quotes, etc.
                    return typeof cell === "string" && cell.includes(delimiter) ? `"${cell.replace(/"/g, '""')}"` : cell;
                });
                csvArray.push(row.join(delimiter));
            });

            return csvArray.join("\n");
        } catch (e) {
            return { error: "Failed to convert JSON to CSV" };
        }
    },
};

// Number System Converters
export const numberConverters = {
    // Decimal to other bases
    decimalToBinary(decimal) {
        try {
            return parseInt(decimal).toString(2);
        } catch (e) {
            return { error: "Invalid decimal number" };
        }
    },

    decimalToOctal(decimal) {
        try {
            return parseInt(decimal).toString(8);
        } catch (e) {
            return { error: "Invalid decimal number" };
        }
    },

    decimalToHex(decimal) {
        try {
            return parseInt(decimal).toString(16).toUpperCase();
        } catch (e) {
            return { error: "Invalid decimal number" };
        }
    },

    // Other bases to decimal
    binaryToDecimal(binary) {
        try {
            if (!/^[01]+$/.test(binary)) {
                return { error: "Invalid binary number" };
            }
            return parseInt(binary, 2).toString();
        } catch (e) {
            return { error: "Invalid binary number" };
        }
    },

    octalToDecimal(octal) {
        try {
            if (!/^[0-7]+$/.test(octal)) {
                return { error: "Invalid octal number" };
            }
            return parseInt(octal, 8).toString();
        } catch (e) {
            return { error: "Invalid octal number" };
        }
    },

    hexToDecimal(hex) {
        try {
            if (!/^[0-9A-Fa-f]+$/.test(hex)) {
                return { error: "Invalid hexadecimal number" };
            }
            return parseInt(hex, 16).toString();
        } catch (e) {
            return { error: "Invalid hexadecimal number" };
        }
    },

    // Direct conversions between different bases
    binaryToHex(binary) {
        try {
            const decimal = this.binaryToDecimal(binary);
            if (decimal.error) return decimal;
            return this.decimalToHex(decimal);
        } catch (e) {
            return { error: "Invalid binary number" };
        }
    },

    hexToBinary(hex) {
        try {
            const decimal = this.hexToDecimal(hex);
            if (decimal.error) return decimal;
            return this.decimalToBinary(decimal);
        } catch (e) {
            return { error: "Invalid hexadecimal number" };
        }
    },

    // Roman numeral conversion
    decimalToRoman(num) {
        try {
            const decimal = parseInt(num);

            if (isNaN(decimal) || decimal <= 0 || decimal > 3999) {
                return { error: "Number must be between 1 and 3999" };
            }

            const romanNumerals = [
                { value: 1000, symbol: "M" },
                { value: 900, symbol: "CM" },
                { value: 500, symbol: "D" },
                { value: 400, symbol: "CD" },
                { value: 100, symbol: "C" },
                { value: 90, symbol: "XC" },
                { value: 50, symbol: "L" },
                { value: 40, symbol: "XL" },
                { value: 10, symbol: "X" },
                { value: 9, symbol: "IX" },
                { value: 5, symbol: "V" },
                { value: 4, symbol: "IV" },
                { value: 1, symbol: "I" },
            ];

            let result = "";
            let remaining = decimal;

            for (const { value, symbol } of romanNumerals) {
                while (remaining >= value) {
                    result += symbol;
                    remaining -= value;
                }
            }

            return result;
        } catch (e) {
            return { error: "Invalid decimal number" };
        }
    },

    romanToDecimal(roman) {
        try {
            if (!roman || typeof roman !== "string") {
                return { error: "Invalid Roman numeral" };
            }

            roman = roman.toUpperCase();

            if (!/^[MDCLXVI]+$/.test(roman)) {
                return { error: "Invalid Roman numeral" };
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
            return { error: "Invalid Roman numeral" };
        }
    },
};

// Time and Date Converters
export const timeConverters = {
    // Unix timestamp conversion
    dateToTimestamp(dateStr) {
        try {
            const date = new Date(dateStr);

            if (isNaN(date.getTime())) {
                return { error: "Invalid date format" };
            }

            return Math.floor(date.getTime() / 1000).toString();
        } catch (e) {
            return { error: "Invalid date" };
        }
    },

    timestampToDate(timestamp, format = "iso") {
        try {
            const ts = parseInt(timestamp);

            if (isNaN(ts)) {
                return { error: "Invalid timestamp" };
            }

            // Convert to milliseconds if needed
            const msTimestamp = ts < 10000000000 ? ts * 1000 : ts;
            const date = new Date(msTimestamp);

            if (isNaN(date.getTime())) {
                return { error: "Invalid timestamp" };
            }

            switch (format.toLowerCase()) {
                case "iso":
                    return date.toISOString();
                case "local":
                    return date.toLocaleString();
                case "date":
                    return date.toLocaleDateString();
                case "time":
                    return date.toLocaleTimeString();
                default:
                    return date.toString();
            }
        } catch (e) {
            return { error: "Invalid timestamp" };
        }
    },

    // Time zone conversion
    convertTimeZone(dateTime, fromTZ, toTZ) {
        try {
            // Ensure the date is properly formatted
            const date = new Date(dateTime);

            if (isNaN(date.getTime())) {
                return { error: "Invalid date format" };
            }

            // Create formatter for source timezone
            const fromFormatter = new Intl.DateTimeFormat("en-US", {
                timeZone: fromTZ,
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            });

            // Create formatter for target timezone
            const toFormatter = new Intl.DateTimeFormat("en-US", {
                timeZone: toTZ,
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            });

            return {
                from: fromFormatter.format(date),
                to: toFormatter.format(date),
            };
        } catch (e) {
            return { error: e.message || "Error converting time zone" };
        }
    },

    // Duration converter (seconds to formatted time)
    formatDuration(seconds) {
        try {
            seconds = parseInt(seconds);

            if (isNaN(seconds) || seconds < 0) {
                return { error: "Invalid duration" };
            }

            const days = Math.floor(seconds / 86400);
            seconds %= 86400;

            const hours = Math.floor(seconds / 3600);
            seconds %= 3600;

            const minutes = Math.floor(seconds / 60);
            seconds %= 60;

            const parts = [];

            if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
            if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
            if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
            if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

            return parts.join(", ");
        } catch (e) {
            return { error: "Error formatting duration" };
        }
    },

    // Parse duration string to seconds
    parseDuration(durationStr) {
        try {
            const regex = /(\d+)\s*(d|day|days|h|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)/gi;
            let match;
            let totalSeconds = 0;

            while ((match = regex.exec(durationStr)) !== null) {
                const value = parseInt(match[1]);
                const unit = match[2].toLowerCase();

                if (unit.startsWith("d")) {
                    totalSeconds += value * 86400;
                } else if (unit.startsWith("h")) {
                    totalSeconds += value * 3600;
                } else if (unit.startsWith("m")) {
                    totalSeconds += value * 60;
                } else if (unit.startsWith("s")) {
                    totalSeconds += value;
                }
            }

            return totalSeconds === 0 && durationStr.trim() !== "0" && durationStr.trim() !== "0s"
                ? { error: "Invalid duration format" }
                : totalSeconds.toString();
        } catch (e) {
            return { error: "Error parsing duration" };
        }
    },
};

// Text Transformers
export const textConverters = {
    // Case conversion
    toLowerCase(text) {
        return text.toLowerCase();
    },

    toUpperCase(text) {
        return text.toUpperCase();
    },

    toTitleCase(text) {
        return text
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    },

    toCamelCase(text) {
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
    },

    toPascalCase(text) {
        return text
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, "");
    },

    toSnakeCase(text) {
        return text
            .replace(/\s+/g, "_")
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase()
            .replace(/^_/, "")
            .replace(/_+/g, "_");
    },

    toKebabCase(text) {
        return text
            .replace(/\s+/g, "-")
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .replace(/^-/, "")
            .replace(/-+/g, "-");
    },

    // Text stats
    countCharacters(text) {
        return {
            withSpaces: text.length,
            withoutSpaces: text.replace(/\s/g, "").length,
        };
    },

    countWords(text) {
        return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    },

    countLines(text) {
        return text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length;
    },

    // Get text statistics
    getTextStats(text) {
        const charCount = this.countCharacters(text);
        const wordCount = this.countWords(text);
        const lineCount = this.countLines(text);

        // Calculate reading time (average reading speed: 200 words per minute)
        const readingTime = Math.ceil(wordCount / 200);

        return {
            characters: charCount.withSpaces,
            charactersNoSpaces: charCount.withoutSpaces,
            words: wordCount,
            lines: lineCount,
            readingTimeMinutes: readingTime,
        };
    },

    // Remove duplicate lines
    removeDuplicateLines(text) {
        const lines = text.split(/\r\n|\r|\n/);
        const uniqueLines = [...new Set(lines)];
        return uniqueLines.join("\n");
    },

    // Sort lines
    sortLines(text, reverse = false) {
        const lines = text.split(/\r\n|\r|\n/);
        const sortedLines = lines.sort();

        if (reverse) {
            sortedLines.reverse();
        }

        return sortedLines.join("\n");
    },
};
