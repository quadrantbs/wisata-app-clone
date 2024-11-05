import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VNumberInput } from "vuetify/labs/VNumberInput";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      VNumberInput,
    },
    directives,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#1976D2",
            // info: "#42A5F5",
          },
        },
      },
    },
    defaultAssets: {
      font: {
        family: "Google Sans",
      },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
