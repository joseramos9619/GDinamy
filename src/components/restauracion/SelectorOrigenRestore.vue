<template>
  <v-text-field
    :model-value="modelValue"
    label="Carpeta del respaldo"
    readonly
    append-inner-icon="mdi-folder-open"
    class="fuente-datos"
    @click:append-inner="emit('elegir')"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["elegir"]);
</script>
