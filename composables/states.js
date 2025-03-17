// composables/states.js
export const useAppState = () =>
    useState('app', () => ({
        showToast: false,
    }));
