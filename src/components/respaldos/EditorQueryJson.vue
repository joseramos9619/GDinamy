<template>
  <v-textarea
    :model-value="modelValue"
    :label="label"
    placeholder="{ &quot;estado&quot;: &quot;activo&quot; }"
    rows="3"
    :error-messages="errorMensaje"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from "vue";

import { esJsonValido } from "@/utils/validadorJson";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "Filtro (JSON, opcional)" },
});

const emit = defineEmits(["update:modelValue"]);

const errorMensaje = computed(() => (esJsonValido(props.modelValue) ? "" : "JSON inválido"));
</script>
