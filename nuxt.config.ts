import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    runtimeConfig: {
        public: {
            timezoneDbApiKey: 'MJNLLNMLZDC7',
        },
    },
    app: {
        head: {
            title: 'Meow Meow Meow',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
                },
                {
                    name: 'Cache-Control',
                    content: 'no-cache, no-store, must-revalidate',
                },
                {
                    name: 'Expires',
                    content: '0',
                },
                {
                    name: 'Pragma',
                    content: 'no-cache',
                },
            ],
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
    css: ['@/assets/styles/main.css'],
    modules: ['@nuxt/icon'],
});
