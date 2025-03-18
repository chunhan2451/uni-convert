// utils/timezoneApi.js
/**
 * Utility for fetching timezone data from TimezoneDB API
 * Get your API key at https://timezonedb.com/register
 */
import { $fetch } from 'ofetch';

// Sample popular cities for quick access with browser-calculated offsets
const getPopularCitiesWithOffsets = () => {
    const popularCityData = [
        { id: 'america-new_york', name: 'New York', timezone: 'America/New_York', region: 'America' },
        { id: 'europe-london', name: 'London', timezone: 'Europe/London', region: 'Europe' },
        { id: 'asia-tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo', region: 'Asia' },
        { id: 'australia-sydney', name: 'Sydney', timezone: 'Australia/Sydney', region: 'Australia' },
        { id: 'europe-paris', name: 'Paris', timezone: 'Europe/Paris', region: 'Europe' },
        { id: 'asia-dubai', name: 'Dubai', timezone: 'Asia/Dubai', region: 'Asia' },
        { id: 'asia-singapore', name: 'Singapore', timezone: 'Asia/Singapore', region: 'Asia' },
        { id: 'america-los_angeles', name: 'Los Angeles', timezone: 'America/Los_Angeles', region: 'America' },
        { id: 'asia-kuala_lumpur', name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', region: 'Asia' },
        { id: 'asia-ho_chi_minh', name: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh', region: 'Asia' },
    ];

    return popularCityData.map((city) => {
        try {
            // Calculate offset based on client's browser
            const date = new Date();
            const targetDate = new Date(date.toLocaleString('en-US', { timeZone: city.timezone }));
            const localOffsetMinutes = -date.getTimezoneOffset();
            const diff = (targetDate - date) / 60000; // Convert ms to minutes

            return {
                ...city,
                offset: localOffsetMinutes + diff,
            };
        } catch (e) {
            console.warn(`Cannot determine offset for ${city.name}`, e);
            return {
                ...city,
                offset: 0,
            };
        }
    });
};

export const timezoneApi = {
    /**
     * Get a list of all available timezones from TimezoneDB
     * @returns {Promise<Array>} Array of timezone objects
     */
    async getAllTimezones(apiKey) {
        try {
            // Using Nuxt's $fetch utility
            const response = await $fetch('https://api.timezonedb.com/v2.1/list-time-zone', {
                params: {
                    key: apiKey,
                    format: 'json',
                },
                timeout: 8000, // 8 second timeout
            });

            if (response.status !== 'OK') {
                throw new Error(`API error: ${response.message || 'Unknown error'}`);
            }

            // Transform the response into our format
            return response.zones.map((zone) => {
                // Extract region and city from zoneName
                const parts = zone.zoneName.split('/');
                const region = parts[0];
                const city = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : zone.zoneName;

                return {
                    id: zone.zoneName.toLowerCase().replace(/\//g, '-'),
                    name: this.formatCityName(zone.zoneName),
                    timezone: zone.zoneName,
                    region: region,
                    countryCode: zone.countryCode,
                    countryName: zone.countryName,
                    offset: zone.gmtOffset / 60, // Convert seconds to minutes
                    timestamp: zone.timestamp,
                };
            });
        } catch (error) {
            console.error('Error fetching timezones:', error);
            throw error;
        }
    },

    /**
     * Format city name from timezone
     * @param {string} timezone - Timezone string (e.g., "America/New_York")
     * @returns {string} Formatted city name
     */
    formatCityName(timezone) {
        if (!timezone || typeof timezone !== 'string' || !timezone.includes('/')) {
            return timezone || '';
        }

        // Get the city part (after the last slash)
        const parts = timezone.split('/');
        let city = parts[parts.length - 1];

        // Replace underscores with spaces
        city = city.replace(/_/g, ' ');

        // Handle special cases
        if (city === 'Ho Chi Minh') {
            return 'Ho Chi Minh City';
        }

        return city;
    },

    /**
     * Get popular cities with their current time offset
     * This uses client-side calculation to avoid API calls for common cities
     * @returns {Array} Array of popular city objects with calculated offsets
     */
    getPopularCities() {
        return getPopularCitiesWithOffsets();
    },
};
