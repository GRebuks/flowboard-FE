import { ColorScheme } from "#build/components";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },
  typescript: {
    shim: false,
  },
  ui: {
    global: true,
  }
})
