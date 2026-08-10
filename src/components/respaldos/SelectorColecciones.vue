<template>
  <v-list>
    <v-list-item
      v-for="col in colecciones"
      :key="col.nombre"
    >
      <template #prepend>
        <v-checkbox-btn
          :model-value="col.seleccionada"
          @update:model-value="emit('toggle', col.nombre)"
        />
      </template>
      <v-list-item-title>{{ col.nombre }}</v-list-item-title>
      <EditorQueryJson
        v-if="col.seleccionada"
        :model-value="col.query"
        class="mt-2"
        @update:model-value="(valor) => emit('query', col.nombre, valor)"
      />
    </v-list-item>
    <v-list-item v-if="!colecciones.length">
      <v-list-item-title class="text-medium-emphasis">
        Selecciona una base de datos para ver sus colecciones.
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
import EditorQueryJson from "./EditorQueryJson.vue";

defineProps({
  colecciones: { type: Array, default: () => [] },
});

const emit = defineEmits(["toggle", "query"]);
</script>
