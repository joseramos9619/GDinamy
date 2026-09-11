<template>
  <v-list>
    <v-list-item
      v-for="perfil in perfiles"
      :key="perfil.id"
      :title="perfil.nombre"
    >
      <template #subtitle>
        <span class="fuente-datos text-caption">{{ perfil.uri }}</span>
      </template>

      <template #append>
        <v-btn
          icon="mdi-connection"
          variant="text"
          :loading="probando[perfil.id]"
          @click="emit('probar', perfil)"
        />
        <v-btn
          icon="mdi-pencil"
          variant="text"
          @click="emit('editar', perfil)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          @click="emit('eliminar', perfil.id)"
        />
      </template>
    </v-list-item>
    <v-list-item v-if="!perfiles.length">
      <v-list-item-title class="text-medium-emphasis">
        No hay conexiones guardadas todavía.
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
defineProps({
  perfiles: { type: Array, default: () => [] },
  probando: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["editar", "eliminar", "probar"]);
</script>
