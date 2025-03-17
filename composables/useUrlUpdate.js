// composables/useUrlUpdate.js
import { navigateTo } from '#app';

/**
 * Composable to handle URL updates for converter units
 * without triggering full page navigation
 */
export const useUrlUpdate = () => {
    const route = useRoute();

    /**
     * Updates the URL path without triggering a page refresh
     *
     * @param {string} fromUnit - The source unit ID
     * @param {string} toUnit - The target unit ID
     * @param {Object} options - Additional options
     * @param {boolean} options.replace - Whether to replace the current history entry (default: true)
     */
    const updateUrlPath = (fromUnit, toUnit, options = { replace: true }) => {
        if (!fromUnit || !toUnit) return;

        // Create the new path in the format /{fromUnit}-to-{toUnit}-converter
        const newPath = `/${fromUnit}-to-${toUnit}-converter`;

        // Don't update if we're already on this path
        if (route.path === newPath) return;

        // Update the URL without triggering a navigation
        navigateTo(newPath, {
            replace: options.replace,
            redirectCode: false, // Doesn't send a redirect response
            external: false, // Handles internally, not as external link
        });
    };

    /**
     * Get current from and to units from the URL if they exist
     */
    const getUnitsFromUrl = () => {
        // Check if the path matches our pattern
        const pattern = /\/([^-]+)-to-([^-]+)-converter/;
        const match = route.path.match(pattern);

        if (match && match.length === 3) {
            return {
                fromUnit: match[1],
                toUnit: match[2],
            };
        }

        return null;
    };

    return {
        updateUrlPath,
        getUnitsFromUrl,
    };
};
