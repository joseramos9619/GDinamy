<template>
  <v-container>
    <h1 class="text-h5 mb-4">
      Historial
    </h1>
    <v-card>
      <TablaHistorial :entradas="entradas" />
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useHistorialStore } from "@/stores/historialStore";
import TablaHistorial from "./TablaHistorial.vue";

const store = useHistorialStore();
const { entradas } = storeToRefs(store);

onMounted(() => {
  store.cargarHistorial();
});
</script>
