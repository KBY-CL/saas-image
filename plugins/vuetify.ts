// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    blueprint: md3,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: '#9E9E9E',
            'primary-darken-1': '#757575',
            secondary: '#8BC34A',
            'secondary-darken-1': '#7CB342',
          },
        },
      },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
