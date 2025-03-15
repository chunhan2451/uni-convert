// utils/textDataConverters.js
// Text and Data Converters
export const dataConverters = {
    // Base64 encoding/decoding
    textToBase64(text) {
        try {
            return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
        } catch (e) {
            return { error: 'Invalid input for Base64 encoding' };
        }
    },

    base64ToText(base64) {
        try {
            return decodeURIComponent(
                Array.prototype.map.call(atob(base64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
        } catch (e) {
            return { error: 'Invalid Base64 string' };
        }
    },

    // URL encoding/decoding
    encodeURL(text) {
        try {
            return encodeURIComponent(text);
        } catch (e) {
            return { error: 'Invalid input for URL encoding' };
        }
    },

    decodeURL(text) {
        try {
            return decodeURIComponent(text);
        } catch (e) {
            return { error: 'Invalid input for URL decoding' };
        }
    },

    // JSON formatter/validator
    formatJSON(json) {
        try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return { error: 'Invalid JSON' };
        }
    },

    minifyJSON(json) {
        try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            return JSON.stringify(obj);
        } catch (e) {
            return { error: 'Invalid JSON' };
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
    csvToJSON(csv, delimiter = ',', hasHeader = true) {
        try {
            const lines = csv.split('\n');
            const result = [];
            const headers = hasHeader
                ? lines[0].split(delimiter).map((h) => h.trim())
                : Array.from({ length: lines[0].split(delimiter).length }, (_, i) => `field${i + 1}`);

            const startIndex = hasHeader ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;

                const obj = {};
                const currentLine = lines[i].split(delimiter);

                for (let j = 0; j < headers.length; j++) {
                    const value = currentLine[j] ? currentLine[j].trim() : '';
                    obj[headers[j]] = value;
                }

                result.push(obj);
            }

            return result;
        } catch (e) {
            return { error: 'Invalid CSV format' };
        }
    },

    jsonToCSV(json, delimiter = ',') {
        try {
            const jsonArray = typeof json === 'string' ? JSON.parse(json) : json;

            if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
                return { error: 'Input must be a non-empty array' };
            }

            const headers = Object.keys(jsonArray[0]);
            const csvArray = [];

            // Add header row
            csvArray.push(headers.join(delimiter));

            // Add data rows
            jsonArray.forEach((item) => {
                const row = headers.map((header) => {
                    const cell = item[header] === null || item[header] === undefined ? '' : item[header];
                    // Escape commas, quotes, etc.
                    return typeof cell === 'string' && cell.includes(delimiter) ? `"${cell.replace(/"/g, '""')}"` : cell;
                });
                csvArray.push(row.join(delimiter));
            });

            return csvArray.join('\n');
        } catch (e) {
            return { error: 'Failed to convert JSON to CSV' };
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
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    toCamelCase(text) {
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
    },

    toPascalCase(text) {
        return text
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
    },

    toSnakeCase(text) {
        return text
            .replace(/\s+/g, '_')
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '')
            .replace(/_+/g, '_');
    },

    toKebabCase(text) {
        return text
            .replace(/\s+/g, '-')
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '')
            .replace(/-+/g, '-');
    },

    // Text stats
    countCharacters(text) {
        return {
            withSpaces: text.length,
            withoutSpaces: text.replace(/\s/g, '').length,
        };
    },

    countWords(text) {
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    },

    countLines(text) {
        return text.trim() === '' ? 0 : text.split(/\r\n|\r|\n/).length;
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
        return uniqueLines.join('\n');
    },

    // Sort lines
    sortLines(text, reverse = false) {
        const lines = text.split(/\r\n|\r|\n/);
        const sortedLines = lines.sort();

        if (reverse) {
            sortedLines.reverse();
        }

        return sortedLines.join('\n');
    },
};
