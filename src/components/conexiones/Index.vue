<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">
        Conexiones
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="handleAbrirCrear"
      >
        Nueva conexión
      </v-btn>
    </div>

    <v-card>
      <ListaConexiones
        :perfiles="perfiles"
        :probando="probando"
        @editar="handleEditar"
        @eliminar="handleEliminar"
        @probar="handleProbar"
      />
    </v-card>

    <v-dialog
      v-model="mostrarFormulario"
      max-width="520"
    >
      <v-card>
        <v-card-title>{{ perfilEditando ? "Editar conexión" : "Nueva conexión" }}</v-card-title>
        <v-card-text>
          <FormConexion
            :perfil="perfilEditando"
            @guardar="handleGuardar"
            @cancelar="mostrarFormulario = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.abierto"
      :color="snackbar.color"
    >
      {{ snackbar.texto }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";

import { useConexionesStore } from "@/stores/conexionesStore";
import FormConexion from "./FormConexion.vue";
import ListaConexiones from "./ListaConexiones.vue";

const store = useConexionesStore();
const { perfiles, probando } = storeToRefs(store);

const mostrarFormulario = ref(false);
const perfilEditando = ref(null);
const snackbar = reactive({ abierto: false, texto: "", color: "success" });

const notificar = (texto, color = "success") => {
  snackbar.texto = texto;
  snackbar.color = color;
  snackbar.abierto = true;
};

const handleAbrirCrear = () => {
  perfilEditando.value = null;
  mostrarFormulario.value = true;
};

const handleEditar = (perfil) => {
  perfilEditando.value = perfil;
  mostrarFormulario.value = true;
};

const handleGuardar = async (perfil) => {
  const resultado = await (perfil.id
    ? store.actualizarPerfil(perfil)
    : store.crearPerfil(perfil));

  if (resultado.success) {
    notificar("Conexión guardada");
    mostrarFormulario.value = false;
  } else {
    notificar(resultado.error, "error");
  }
};

const handleEliminar = async (id) => {
  const resultado = await store.quitarPerfil(id);
  notificar(resultado.success ? "Conexión eliminada" : resultado.error, resultado.success ? "success" : "error");
};

const handleProbar = async (perfil) => {
  const resultado = await store.probarPerfil(perfil.id, perfil.uri);
  notificar(resultado.success ? "Conexión exitosa" : resultado.error, resultado.success ? "success" : "error");
};

onMounted(() => {
  store.cargarPerfiles();
});
</script>
