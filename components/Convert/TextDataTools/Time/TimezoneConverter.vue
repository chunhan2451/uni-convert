<!-- components/Convert/TextDataTools/Time/TimezoneConverter.vue -->
<template>
    <div class="container mx-auto p-4">
        <div class="max-w-3xl mx-auto">
            <div class="justify-center">
                <div class="p-2 bg-primary/10 rounded-lg flex mb-3 justify-self-center">
                    <Icon :name="uiIcons.clock" class="text-primary h-6 w-6 text-2xl" />
                </div>
                <h1 class="text-3xl font-bold mb-2 text-center">Timezone Converter</h1>
            </div>
            <p class="text-zinc-600 mb-6 text-center">See the time across different cities around the world</p>

            <!-- Local Time Display - Always shown at the top -->
            <div class="bg-base-100 rounded-lg shadow-sm mb-6 overflow-hidden">
                <div class="bg-base-200 px-4 py-2">
                    <h3 class="font-bold">Your Local Time</h3>
                </div>
                <div class="p-6 border-b border-base-200">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-lg font-medium">{{ localTimezoneName.split('/').pop().replace('_', ' ') }}</p>
                            <p class="text-zinc-500 text-sm">Today, +0HRS</p>
                        </div>
                        <div class="text-right">
                            <div class="text-5xl font-bold font-mono">{{ formatTime(localTime) }}</div>
                            <div class="text-xs text-zinc-500">
                                <span class="ml-1">{{ localTimezoneOffsetFormatted }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- City Selection -->
            <div class="bg-base-100 rounded-lg shadow-sm mb-6 overflow-hidden">
                <div class="bg-base-200 px-4 py-2 flex justify-between items-center">
                    <h3 class="font-bold">Add City</h3>
                    <div class="flex items-center">
                        <div v-if="isLoading" class="mr-2">
                            <Icon :name="uiIcons.spinner" class="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </div>
                </div>

                <div class="p-4">
                    <div class="relative">
                        <div class="flex items-center px-3 py-2 rounded-lg input input-bordered w-full">
                            <Icon :name="uiIcons.search" class="h-5 w-5 text-zinc-500 mr-2" />
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search for a city..."
                                @focus="showDropdown = true"
                                @input="filterCities"
                            />
                            <button
                                v-if="searchQuery"
                                @click="
                                    searchQuery = '';
                                    filterCities();
                                "
                                class="text-zinc-500 cursor-pointer"
                            >
                                <Icon :name="uiIcons.close" class="h-5 w-5 text-base" />
                            </button>
                        </div>

                        <div
                            v-if="showDropdown && filteredCities.length > 0"
                            class="mt-2 bg-base-100 shadow-lg rounded-lg max-h-96 overflow-y-auto relative w-full z-50 border border-base-200"
                        >
                            <ul class="py-1 divide-y divide-base-200">
                                <li
                                    v-for="city in filteredCities"
                                    :key="city.id"
                                    class="px-4 py-3 hover:bg-base-200 cursor-pointer transition-colors duration-150"
                                    @click="addCity(city)"
                                >
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="font-medium">{{ city.name }}</p>
                                            <p class="text-xs text-zinc-500">{{ city.countryName || city.region }}</p>
                                        </div>
                                        <div class="text-right text-sm">
                                            {{ formatTimezoneOffset(city.offset) }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="searchQuery && filteredCities.length === 0" class="mt-4 text-center text-zinc-500">
                        <p>No cities found matching "{{ searchQuery }}"</p>
                    </div>

                    <div v-if="!searchQuery" class="mt-4">
                        <p class="text-sm text-zinc-500 mb-2">Popular cities:</p>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="city in popularCities"
                                :key="city.id"
                                @click="addCity(city)"
                                class="btn btn-sm btn-outline"
                            >
                                {{ city.name }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Added Cities Clock Display -->
            <div v-if="selectedCities.length > 0" class="bg-base-100 rounded-lg shadow-sm overflow-hidden">
                <div class="bg-base-200 px-4 py-2 flex justify-between items-center">
                    <h3 class="font-bold">Time Zone</h3>
                    <span class="text-sm text-zinc-500">{{ selectedCities.length }} Cities</span>
                </div>

                <div
                    v-for="(city, index) in selectedCities"
                    :key="city.id"
                    class="p-6 relative"
                    :class="{ 'border-b border-base-200': index < selectedCities.length - 1 }"
                >
                    <button @click="removeCity(city)" class="absolute top-4 right-0 btn btn-ghost btn-circle btn-sm">
                        <Icon :name="uiIcons.close" class="h-5 w-5 text-base" />
                    </button>

                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-medium">{{ city.name }}</h3>
                            <p class="text-zinc-500 text-sm">Today, {{ getTimeOffsetLabel(city.offset) }}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-5xl font-bold font-mono">{{ formatTime(getCityTime(city)) }}</div>
                            <div class="text-xs text-zinc-500">{{ formatTimezoneOffset(city.offset) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="bg-base-100 rounded-lg shadow-sm p-8 text-center">
                <div v-if="isLoading">
                    <Icon :name="uiIcons.spinner" class="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                    <h3 class="text-lg font-medium mb-2">Loading time zone data...</h3>
                    <p class="text-zinc-600 mb-4">Please wait while we fetch timezone information</p>
                </div>
                <div v-else>
                    <Icon :name="uiIcons.globe" class="h-16 w-16 mx-auto mb-4 text-zinc-400 text-2xl" />
                    <h3 class="text-lg font-medium mb-2">No cities added yet</h3>
                    <p class="text-zinc-600 mb-4">Add cities to your time zone to see the current time around the world</p>
                </div>
            </div>

            <!-- Only show compact info link instead of full text -->
            <div class="mt-4 text-center">
                <button @click="showInfo = !showInfo" class="btn btn-ghost btn-sm">
                    <Icon :name="uiIcons.info" class="h-4 w-4 mr-1" />
                    {{ showInfo ? 'Hide Info' : 'About Time Zone' }}
                </button>

                <!-- Information panel (collapsed by default) -->
                <div v-if="showInfo" class="mt-4 bg-base-200 rounded-lg p-4 text-left">
                    <h3 class="text-lg font-medium mb-2">About Time Zone</h3>
                    <p class="text-zinc-600 mb-2">
                        The world is divided into 24 time zones, each roughly 15° of longitude apart. UTC (Coordinated Universal
                        Time) serves as the reference point.
                    </p>
                    <p class="text-zinc-600">
                        This tool displays the current time in cities around the world, allowing you to easily see the time
                        differences between your location and other places.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { uiIcons } from '~/utils/appConstant';
import { useAppState } from '~/composables/states';
import { timezoneApi } from '~/utils/timezoneApi';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const apiKey = config.public.timezoneDbApiKey;

const appState = useAppState();

// State
const localTime = ref(new Date());
const selectedCities = ref([]);
const searchQuery = ref('');
const showDropdown = ref(false);
const filteredCities = ref([]);
const cities = ref([]);
const timerInterval = ref(null);
const popularCities = ref([]);
const showInfo = ref(false);
const isLoading = ref(false);

// Get local timezone info
const localTimezoneName = computed(() => {
    const options = Intl.DateTimeFormat().resolvedOptions();
    return `${options.timeZone}`;
});

// Get local timezone offset in minutes
const getLocalTimezoneOffset = () => {
    const now = new Date();
    // getTimezoneOffset returns the offset in minutes, but with opposite sign
    // E.g., for UTC+8, it returns -480 minutes
    return -now.getTimezoneOffset();
};

// Timer to update time
onMounted(() => {
    // Update time every second
    timerInterval.value = setInterval(() => {
        localTime.value = new Date();
    }, 1000);

    // Fetch cities from API
    fetchCities();

    // Close dropdown when clicking outside
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    clearInterval(timerInterval.value);
    document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) => {
    if (!event.target.closest('input') && !event.target.closest('.dropdown')) {
        showDropdown.value = false;
    }
};

// Format time as HH:MM
const formatTime = (date) => {
    if (!date) return '';

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Local timezone offset in formatted UTC+/- format
const localTimezoneOffsetFormatted = computed(() => {
    return formatTimezoneOffset(getLocalTimezoneOffset());
});

// Format timezone offset as UTC+/- format
const formatTimezoneOffset = (offsetMinutes) => {
    if (offsetMinutes === undefined) return 'UTC';
    if (Math.abs(offsetMinutes) < 1) return 'UTC';

    // Round to nearest minute to avoid floating point issues
    const roundedOffset = Math.round(offsetMinutes);

    const hours = Math.floor(Math.abs(roundedOffset) / 60);
    const minutes = Math.abs(roundedOffset) % 60;
    const sign = roundedOffset > 0 ? '+' : '-';

    if (minutes === 0) {
        return `UTC${sign}${hours}`;
    }

    return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
};

// Get time offset label in the style of iPhone world clock (e.g., "+8HRS")
const getTimeOffsetLabel = (targetOffsetMinutes) => {
    if (targetOffsetMinutes === undefined) return '+0HRS';

    const localDate = new Date();
    const localOffsetMinutes = -localDate.getTimezoneOffset();

    const diffMinutes = targetOffsetMinutes - localOffsetMinutes;
    const diffHours = diffMinutes / 60;

    if (Math.abs(diffHours) < 0.1) return '+0HRS';

    const sign = diffHours > 0 ? '+' : '-';
    // Round to nearest integer for cleaner display
    const hours = Math.round(Math.abs(diffHours));
    return `${sign}${hours}HRS`;
};

// Get time in a specific city based on its UTC offset
const getCityTime = (city) => {
    if (!city || city.offset === undefined) {
        return new Date(); // Return current time if no offset info
    }

    const now = new Date();

    // Calculate local offset in minutes
    const localOffsetMinutes = -now.getTimezoneOffset();

    // Calculate time difference between local and target timezone
    const diffMinutes = city.offset - localOffsetMinutes;

    // Create a new date with the adjusted time
    const cityTime = new Date(now.getTime() + diffMinutes * 60000);

    return cityTime;
};

// Helper function to show toast messages
const showToastMessage = (message) => {
    appState.value.showToast = true;
    appState.value.toastMessage = message;
    setTimeout(() => {
        if (appState && appState.value) {
            appState.value.showToast = false;
            appState.value.toastMessage = '';
        }
    }, 2000);
};

// Fetch city data from API
const fetchCities = async () => {
    // First, set popular cities for immediate display
    try {
        popularCities.value = timezoneApi.getPopularCities();

        // Initialize with popular cities first for responsive UI
        cities.value = [...popularCities.value];
        filterCities();
    } catch (error) {
        console.warn('Error loading popular cities:', error);
        cities.value = [];
        popularCities.value = [];
    }

    // Then try to fetch all timezones from API
    try {
        // Show loading state
        isLoading.value = true;

        // Fetch all timezones
        const allTimezones = await timezoneApi.getAllTimezones(apiKey);

        // Remove loading state
        isLoading.value = false;

        // Update the cities list
        if (Array.isArray(allTimezones) && allTimezones.length > 0) {
            // Get existing IDs to avoid duplicates
            const existingIds = new Set(cities.value.map((city) => city.id));

            // Add new timezones, avoiding duplicates
            const newCities = allTimezones.filter((city) => !existingIds.has(city.id));
            cities.value = [...cities.value, ...newCities];

            // Re-filter cities based on the search term
            filterCities();
        }
    } catch (error) {
        console.error('Error fetching all timezones:', error);
        isLoading.value = false;

        // Show error toast only if we couldn't even load popular cities
        if (cities.value.length === 0) {
            showToastMessage('Unable to load timezone data');
        }
    }
};

// Filter cities based on search query
const filterCities = () => {
    if (!Array.isArray(cities.value)) {
        filteredCities.value = [];
        return;
    }

    if (!searchQuery.value.trim()) {
        // If no search query, organize cities by continent/region
        const regionMap = {};

        // Group cities by region
        cities.value.forEach((city) => {
            if (!city || !city.region) return;

            if (!regionMap[city.region]) {
                regionMap[city.region] = [];
            }
            regionMap[city.region].push(city);
        });

        // Show a mix of popular cities from various regions
        let result = [];

        // First add some popular cities if available
        if (popularCities.value.length > 0) {
            result = [...popularCities.value.slice(0, 5)];
        }

        // Then add some cities from each major region
        const majorRegions = ['Africa', 'America', 'Asia', 'Europe', 'Pacific', 'Australia'];
        majorRegions.forEach((region) => {
            if (regionMap[region] && regionMap[region].length > 0) {
                // Add a few cities from each region
                const regionCities = regionMap[region].slice(0, 3);
                result.push(...regionCities);
            }
        });

        // Deduplicate by ID
        const uniqueIds = new Set();
        filteredCities.value = result
            .filter((city) => {
                if (!city || !city.id || uniqueIds.has(city.id)) return false;
                uniqueIds.add(city.id);
                return true;
            })
            .slice(0, 20); // Limit to 20 cities

        return;
    }

    // When there's a search query, filter by name, country, or timezone
    const query = searchQuery.value.toLowerCase();

    // First try exact matches
    let matches = cities.value.filter((city) => {
        if (!city) return false;

        // Exact name match
        if (city.name && city.name.toLowerCase() === query) return true;

        // Exact country match
        if (city.countryName && city.countryName.toLowerCase() === query) return true;

        return false;
    });

    // If no exact matches, try partial matches
    if (matches.length === 0) {
        matches = cities.value.filter((city) => {
            if (!city) return false;

            const nameMatch = city.name && city.name.toLowerCase().includes(query);
            const timezoneMatch = city.timezone && city.timezone.toLowerCase().includes(query);
            const countryMatch = city.countryName && city.countryName.toLowerCase().includes(query);

            return nameMatch || timezoneMatch || countryMatch;
        });
    }

    // Sort matches by relevance
    matches.sort((a, b) => {
        // Prefer exact name matches
        if (a.name.toLowerCase() === query && b.name.toLowerCase() !== query) return -1;
        if (b.name.toLowerCase() === query && a.name.toLowerCase() !== query) return 1;

        // Then prefer starts with
        if (a.name.toLowerCase().startsWith(query) && !b.name.toLowerCase().startsWith(query)) return -1;
        if (b.name.toLowerCase().startsWith(query) && !a.name.toLowerCase().startsWith(query)) return 1;

        // Default to alphabetical
        return a.name.localeCompare(b.name);
    });

    filteredCities.value = matches.slice(0, 30); // Show more results, up to 30
};

// Add a city to selected cities
const addCity = async (city) => {
    try {
        if (!city && searchQuery.value.trim()) {
            // Try to find a matching city from the filtered list
            const foundCity = filteredCities.value.find(
                (c) => c && c.name && c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );

            if (foundCity) {
                city = foundCity;
            } else {
                // No matching city found
                showToastMessage(`No city found matching "${searchQuery.value}"`);
                return;
            }
        }

        if (!city) return;

        // Check if city already exists
        if (selectedCities.value.some((c) => c.id === city.id)) {
            showToastMessage(`${city.name} is already in your time zone`);
            return;
        }

        // Create a copy to avoid reference issues
        const cityToAdd = { ...city };

        // Add the city
        selectedCities.value.push(cityToAdd);
        searchQuery.value = '';
        showDropdown.value = false;

        // Show success message
        showToastMessage(`Added ${cityToAdd.name} to your time zone`);
    } catch (error) {
        console.error('Error adding city:', error);
        isLoading.value = false;

        showToastMessage('Error adding city, please try again');
    }
};

// Remove a city from selected cities
const removeCity = (city) => {
    selectedCities.value = selectedCities.value.filter((c) => c.id !== city.id);
};
</script>
