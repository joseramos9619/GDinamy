<template>
  <v-form
    ref="formRef"
    @submit.prevent="handleGuardar"
  >
    <v-text-field
      v-model="nombre"
      label="Nombre"
      :rules="[reglaRequerido]"
    />
    <v-text-field
      v-model="uri"
      label="URI de conexión"
      placeholder="mongodb://usuario:contraseña@host:puerto"
      class="fuente-datos"
      :rules="[reglaRequerido]"
    />
    <div class="d-flex ga-2 justify-end">
      <v-btn
        variant="text"
        @click="emit('cancelar')"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        type="submit"
      >
        Guardar
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  perfil: { type: Object, default: null },
});

const emit = defineEmits(["guardar", "cancelar"]);

const formRef = ref(null);
const nombre = ref(props.perfil?.nombre || "");
const uri = ref(props.perfil?.uri || "");

const reglaRequerido = (valor) => !!valor || "Campo requerido";

watch(
  () => props.perfil,
  (nuevo) => {
    nombre.value = nuevo?.nombre || "";
    uri.value = nuevo?.uri || "";
  },
);

const handleGuardar = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("guardar", { ...props.perfil, nombre: nombre.value, uri: uri.value });
};
</script>
