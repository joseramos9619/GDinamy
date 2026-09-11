import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "./estilos.css";

import { createVuetify } from "vuetify";

export default createVuetify({
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "gdinamy",
    themes: {
      gdinamy: {
        dark: false,
        colors: {
          background: "#F2F5F4",
          surface: "#FFFFFF",
          primary: "#C0862E",
          "on-primary": "#12191C",
          secondary: "#3E7EA6",
          error: "#C24B3D",
          info: "#3E7EA6",
          success: "#2E8B67",
          warning: "#D0993A",
          "on-background": "#17211F",
          "on-surface": "#17211F",
        },
      },
      "gdinamy-lateral": {
        dark: true,
        colors: {
          background: "#12191C",
          surface: "#12191C",
          primary: "#C0862E",
          "on-primary": "#12191C",
          "on-surface": "#E7ECEA",
          "on-background": "#E7ECEA",
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: "lg", elevation: 0 },
    VCard: { rounded: "lg", elevation: 0, variant: "outlined" },
    VTextField: { variant: "outlined", density: "comfortable" },
    VSelect: { variant: "outlined", density: "comfortable" },
    VTextarea: { variant: "outlined", density: "comfortable" },
    VChip: { rounded: "pill" },
    VDataTable: { density: "comfortable" },
  },
});
