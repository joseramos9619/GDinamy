<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="pagina-titulo">
        Historial
      </h1>
      <v-btn
        color="error"
        variant="text"
        prepend-icon="mdi-delete-sweep"
        :disabled="!entradas.length"
        @click="mostrarConfirmacion = true"
      >
        Vaciar historial
      </v-btn>
    </div>

    <v-card>
      <TablaHistorial
        :entradas="entradas"
        @eliminar="handleEliminar"
      />
    </v-card>

    <v-dialog
      v-model="mostrarConfirmacion"
      max-width="420"
    >
      <v-card>
        <v-card-title>Vaciar historial</v-card-title>
        <v-card-text>
          Esto eliminará las {{ entradas.length }} entradas del historial. Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            @click="mostrarConfirmacion = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="handleVaciar"
          >
            Vaciar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { useHistorialStore } from "@/stores/historialStore";
import TablaHistorial from "./TablaHistorial.vue";

const store = useHistorialStore();
const { entradas } = storeToRefs(store);

const mostrarConfirmacion = ref(false);

const handleEliminar = (id) => {
  store.eliminarEntrada(id);
};

const handleVaciar = async () => {
  await store.vaciarHistorial();
  mostrarConfirmacion.value = false;
};

onMounted(() => {
  store.cargarHistorial();
});
</script>
