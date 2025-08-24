import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    public: {
      stage: process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_PROD_STAGE : process.env.NUXT_PUBLIC_DEV_STAGE,
      apiBaseUrl: process.env.NODE_ENV === 'production' ? '' : process.env.NUXT_PUBLIC_DEV_API_BASE_URL,
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  imports: {
    dirs: ['composables', 'composables/**'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  app: {
    baseURL: '/static/vue/dashboard/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=Nanum+Gothic:wght@400;700;800&family=Outfit:wght@100..900&display=swap' },
      ],
    },
  },

  css: ['gridstack/dist/gridstack.min.css', '~/assets/css/common.scss'],

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error: config.plugins is not defined
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@pinia/nuxt',
  ],
});
