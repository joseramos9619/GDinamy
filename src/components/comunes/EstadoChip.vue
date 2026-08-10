<template>
  <v-chip
    :color="color"
    size="small"
    variant="tonal"
  >
    {{ texto }}
  </v-chip>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  estado: { type: String, required: true },
  texto: { type: String, default: "" },
});

const colores = {
  exito: "success",
  error: "error",
  pendiente: "warning",
  "en-progreso": "info",
};

const color = computed(() => colores[props.estado] || "grey");
</script>
