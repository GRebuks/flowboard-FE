// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  css: ['~/assets/scss/main.scss'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  typescript: {
    shim: false,
  }
})