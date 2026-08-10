<template>
  <v-data-table
    :items="entradas"
    :headers="headers"
    item-value="id"
  >
    <template #item.tipo="{ item }">
      {{ item.tipo === "completo" ? "Completo" : "Parcial" }}
    </template>
    <template #item.fecha="{ item }">
      {{ formatoFecha(item.fecha) }}
    </template>
    <template #item.duracionMs="{ item }">
      {{ formatoDuracion(item.duracionMs) }}
    </template>
    <template #item.estado="{ item }">
      <EstadoChip
        :estado="item.estado === 'exito' ? 'exito' : 'error'"
        :texto="item.estado === 'exito' ? 'Éxito' : 'Error'"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import EstadoChip from "@/components/comunes/EstadoChip.vue";
import { formatoDuracion, formatoFecha } from "@/utils/formatoFecha";

defineProps({
  entradas: { type: Array, default: () => [] },
});

const headers = [
  { title: "Fecha", key: "fecha" },
  { title: "Operación", key: "operacion" },
  { title: "Tipo", key: "tipo" },
  { title: "Base de datos", key: "baseDatos" },
  { title: "Ruta", key: "ruta" },
  { title: "Duración", key: "duracionMs" },
  { title: "Estado", key: "estado" },
];
</script>
