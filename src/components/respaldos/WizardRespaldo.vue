<template>
  <v-card>
    <v-card-text>
      <v-select
        v-model="conexionId"
        :items="itemsConexiones"
        label="Conexión"
        @update:model-value="handleSeleccionarConexion"
      />

      <template v-if="uri">
        <v-btn-toggle
          v-model="tipo"
          mandatory
          class="mb-4"
          @update:model-value="handleCambiarTipo"
        >
          <v-btn value="completo">
            Completo
          </v-btn>
          <v-btn value="parcial">
            Parcial
          </v-btn>
        </v-btn-toggle>

        <SelectorBaseDatos
          :bases-datos="basesDatos"
          :model-value="baseDatos"
          :cargando="isLoading"
          @update:model-value="handleSeleccionarBase"
        />

        <SelectorColecciones
          v-if="tipo === 'parcial' && baseDatos"
          :colecciones="seleccionColecciones"
          class="mt-4"
          @toggle="store.toggleColeccion"
          @query="store.setQueryColeccion"
        />

        <v-text-field
          :model-value="destino"
          label="Carpeta destino"
          readonly
          append-inner-icon="mdi-folder-open"
          class="mt-4 fuente-datos"
          @click:append-inner="store.elegirDestino"
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
            Iniciar respaldo
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
</template>

<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useConexionesStore } from "@/stores/conexionesStore";
import { useRespaldosStore } from "@/stores/respaldos";
import ConsolaProgreso from "@/components/comunes/ConsolaProgreso.vue";
import SelectorBaseDatos from "./SelectorBaseDatos.vue";
import SelectorColecciones from "./SelectorColecciones.vue";

const emit = defineEmits(["finalizado"]);

const conexionesStore = useConexionesStore();
const { perfiles } = storeToRefs(conexionesStore);

const store = useRespaldosStore();
const {
  conexionId,
  uri,
  tipo,
  basesDatos,
  baseDatos,
  seleccionColecciones,
  destino,
  isLoading,
  isError,
  errorMensaje,
  ejecutando,
  lineasConsola,
} = storeToRefs(store);

const itemsConexiones = computed(() =>
  perfiles.value.map((perfil) => ({ title: perfil.nombre, value: perfil.id })),
);

const puedeIniciar = computed(() => {
  if (!uri.value || !destino.value || ejecutando.value) return false;
  if (tipo.value === "parcial") {
    return !!baseDatos.value && seleccionColecciones.value.some((c) => c.seleccionada);
  }
  return true;
});

const handleSeleccionarConexion = (id) => {
  const perfil = perfiles.value.find((p) => p.id === id);
  if (perfil) store.seleccionarConexion(perfil);
  store.cargarBasesDatos();
};

const handleCambiarTipo = () => {
  baseDatos.value = null;
};

const handleSeleccionarBase = (nombreBase) => {
  store.seleccionarBaseDatos(nombreBase);
};

const handleIniciar = async () => {
  const resultado = await store.iniciarRespaldo();
  emit("finalizado", resultado);
};

onMounted(() => {
  conexionesStore.cargarPerfiles();
});
</script>
