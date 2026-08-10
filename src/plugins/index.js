import router from "@/router";
import pinia from "@/stores";
import vuetify from "./vuetify";

export function registerPlugins(app) {
  app.use(vuetify).use(router).use(pinia);
}
