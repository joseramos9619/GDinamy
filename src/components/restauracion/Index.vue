<template>
  <v-container>
    <h1 class="pagina-titulo mb-4">
      Restauración
    </h1>

    <v-card>
      <v-card-text>
        <v-select
          v-model="conexionId"
          :items="itemsConexiones"
          label="Conexión destino"
          @update:model-value="handleSeleccionarConexion"
        />

        <template v-if="uri">
          <SelectorOrigenRestore
            :model-value="origen"
            @elegir="store.elegirOrigen"
          />

          <SelectorColeccionesRestore
            :model-value="espaciosNombresTexto"
            :eliminar-antes="eliminarAntes"
            @update:model-value="(valor) => (espaciosNombresTexto = valor)"
            @update:eliminar-antes="(valor) => (eliminarAntes = valor)"
          />

          <v-alert
            v-if="isError"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            {{ errorMensaje }}
          </v-alert>

          <div class="d-flex justify-end mt-4">
            <v-btn
              color="primary"
              :disabled="!puedeIniciar"
              :loading="ejecutando"
              @click="handleIniciar"
            >
              Iniciar restauración
            </v-btn>
          </div>

          <ConsolaProgreso
            v-if="lineasConsola.length || ejecutando"
            class="mt-4"
            :lineas="lineasConsola"
            :ejecutando="ejecutando"
          />
        </template>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.abierto"
      :color="snackbar.color"
    >
      {{ snackbar.texto }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";

import { useConexionesStore } from "@/stores/conexionesStore";
import { useRestauracionStore } from "@/stores/restauracion";
import ConsolaProgreso from "@/components/comunes/ConsolaProgreso.vue";
import SelectorColeccionesRestore from "./SelectorColeccionesRestore.vue";
import SelectorOrigenRestore from "./SelectorOrigenRestore.vue";

const conexionesStore = useConexionesStore();
const { perfiles } = storeToRefs(conexionesStore);

const store = useRestauracionStore();
const {
  conexionId,
  uri,
  origen,
  eliminarAntes,
  espaciosNombresTexto,
  isError,
  errorMensaje,
  ejecutando,
  lineasConsola,
} = storeToRefs(store);

const snackbar = reactive({ abierto: false, texto: "", color: "success" });

const itemsConexiones = computed(() =>
  perfiles.value.map((perfil) => ({ title: perfil.nombre, value: perfil.id })),
);

const puedeIniciar = computed(() => !!uri.value && !!origen.value && !ejecutando.value);

const handleSeleccionarConexion = (id) => {
  const perfil = perfiles.value.find((p) => p.id === id);
  if (perfil) store.seleccionarConexion(perfil);
};

const handleIniciar = async () => {
  const resultado = await store.iniciarRestauracion();
  snackbar.texto = resultado.success ? "Restauración completada" : resultado.error;
  snackbar.color = resultado.success ? "success" : "error";
  snackbar.abierto = true;
};

onMounted(() => {
  conexionesStore.cargarPerfiles();
});
</script>
