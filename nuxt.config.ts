import { ColorScheme } from "#build/components";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
  ],
  css: ['~/assets/scss/main.scss'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  typescript: {
    shim: false,
  },
  ui: {
    global: true,
  }
})
