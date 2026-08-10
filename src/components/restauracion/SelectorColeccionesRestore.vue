<template>
  <div>
    <v-textarea
      :model-value="modelValue"
      label="Restaurar solo estos espacios de nombres (opcional)"
      placeholder="baseDatos.coleccion (una línea por cada uno; vacío = restaurar todo)"
      rows="3"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <v-checkbox
      :model-value="eliminarAntes"
      label="Eliminar colecciones existentes antes de restaurar (--drop)"
      @update:model-value="emit('update:eliminarAntes', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  eliminarAntes: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "update:eliminarAntes"]);
</script>
