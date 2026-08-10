import { defineStore } from "pinia";

import state from "./state";
import ejecucionActions from "./actions/ejecucion";
import utilidadesActions from "./actions/utilidades";
import wizardActions from "./actions/wizard";

export const useRespaldosStore = defineStore("respaldosStore", {
  state,
  actions: {
    ...utilidadesActions,
    ...wizardActions,
    ...ejecucionActions,
  },
});
