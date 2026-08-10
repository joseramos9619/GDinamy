<template>
  <v-select
    :model-value="modelValue"
    :items="itemsSelect"
    :loading="cargando"
    label="Base de datos"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from "vue";

import { formatoBytes } from "@/utils/formatoBytes";

const props = defineProps({
  basesDatos: { type: Array, default: () => [] },
  modelValue: { type: String, default: null },
  cargando: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const itemsSelect = computed(() =>
  props.basesDatos.map((base) => ({
    title: `${base.nombre} (${formatoBytes(base.tamanoBytes)})`,
    value: base.nombre,
  })),
);
</script>
