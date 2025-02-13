// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Meow Meow Meow',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
      ],
    },
  },
  css: [
    "@/assets/styles/fonts.css",
    "@/assets/styles/main.css",
  ],
  modules: ['@nuxt/icon', '@nuxtjs/tailwindcss'],
})
