// utils/timeConverters.js
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
    
    // List common time zones
    getCommonTimeZones() {
        return [
            { id: "UTC", name: "UTC (Coordinated Universal Time)" },
            { id: "America/New_York", name: "New York (Eastern Time)" },
            { id: "America/Chicago", name: "Chicago (Central Time)" },
            { id: "America/Denver", name: "Denver (Mountain Time)" },
            { id: "America/Los_Angeles", name: "Los Angeles (Pacific Time)" },
            { id: "America/Anchorage", name: "Anchorage (Alaska Time)" },
            { id: "Pacific/Honolulu", name: "Honolulu (Hawaii Time)" },
            { id: "Europe/London", name: "London (GMT/BST)" },
            { id: "Europe/Paris", name: "Paris (Central European Time)" },
            { id: "Europe/Berlin", name: "Berlin (Central European Time)" },
            { id: "Europe/Moscow", name: "Moscow (Moscow Time)" },
            { id: "Asia/Tokyo", name: "Tokyo (Japan Standard Time)" },
            { id: "Asia/Shanghai", name: "Shanghai (China Standard Time)" },
            { id: "Asia/Kolkata", name: "Kolkata (India Standard Time)" },
            { id: "Australia/Sydney", name: "Sydney (Australian Eastern Time)" },
            { id: "Pacific/Auckland", name: "Auckland (New Zealand Time)" }
        ];
    }
};