<template>
  <v-container>
    <h1 class="pagina-titulo mb-4">
      Respaldos
    </h1>
    <WizardRespaldo @finalizado="handleFinalizado" />

    <v-snackbar
      v-model="snackbar.abierto"
      :color="snackbar.color"
    >
      {{ snackbar.texto }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive } from "vue";

import WizardRespaldo from "./WizardRespaldo.vue";

const snackbar = reactive({ abierto: false, texto: "", color: "success" });

const handleFinalizado = (resultado) => {
  snackbar.texto = resultado.success ? "Respaldo completado" : resultado.error;
  snackbar.color = resultado.success ? "success" : "error";
  snackbar.abierto = true;
};
</script>
