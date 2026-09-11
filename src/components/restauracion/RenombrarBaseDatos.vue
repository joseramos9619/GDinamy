<template>
  <div>
    <v-text-field
      :model-value="baseDatosOrigen"
      label="Base de datos en el backup (opcional)"
      class="fuente-datos"
      :error-messages="errorBaseDatosOrigen"
      @update:model-value="emit('update:baseDatosOrigen', $event)"
    />

    <v-text-field
      :model-value="restaurarComo"
      label="Restaurar como (opcional)"
      class="fuente-datos"
      :error-messages="errorRestaurarComo"
      @update:model-value="emit('update:restaurarComo', $event)"
    />

    <p class="text-caption text-medium-emphasis">
      {{ textoAyuda }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  baseDatosOrigen: { type: String, default: "" },
  restaurarComo: { type: String, default: "" },
});

const emit = defineEmits(["update:baseDatosOrigen", "update:restaurarComo"]);

const tieneBaseDatosOrigen = computed(() => !!props.baseDatosOrigen?.trim());
const tieneRestaurarComo = computed(() => !!props.restaurarComo?.trim());
const ambosCompletos = computed(() => tieneBaseDatosOrigen.value && tieneRestaurarComo.value);
const soloUnoCompleto = computed(
  () => tieneBaseDatosOrigen.value !== tieneRestaurarComo.value,
);

const textoAyuda = computed(() =>
  ambosCompletos.value
    ? `Se restaurará la base '${props.baseDatosOrigen.trim()}' del backup como '${props.restaurarComo.trim()}' — funciona incluso si esa base no existe todavía en el servidor destino.`
    : "Dejá ambos campos vacíos para restaurar con el nombre original. Completá los dos para restaurar la base del backup con otro nombre — funciona incluso si esa base no existe todavía en el servidor destino.",
);

const errorBaseDatosOrigen = computed(() =>
  soloUnoCompleto.value && !tieneBaseDatosOrigen.value
    ? "Completá también este campo para renombrar, o dejá los dos vacíos"
    : "",
);

const errorRestaurarComo = computed(() =>
  soloUnoCompleto.value && !tieneRestaurarComo.value
    ? "Completá también este campo para renombrar, o dejá los dos vacíos"
    : "",
);
</script>
