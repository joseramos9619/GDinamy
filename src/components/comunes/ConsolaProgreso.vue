<template>
  <v-sheet
    ref="contenedorRef"
    class="consola"
    color="black"
    rounded
  >
    <div
      v-for="(linea, indice) in lineas"
      :key="indice"
      class="consola__linea"
    >
      {{ linea }}
    </div>
    <div
      v-if="ejecutando"
      class="consola__linea consola__linea--activa"
    >
      <v-progress-circular
        indeterminate
        size="14"
        width="2"
        class="mr-2"
      />
      Ejecutando...
    </div>
  </v-sheet>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";

const props = defineProps({
  lineas: { type: Array, default: () => [] },
  ejecutando: { type: Boolean, default: false },
});

const contenedorRef = ref(null);

watch(
  () => props.lineas.length,
  async () => {
    await nextTick();
    const el = contenedorRef.value?.$el;
    if (el) el.scrollTop = el.scrollHeight;
  },
);
</script>

<style scoped>
.consola {
  height: 260px;
  overflow-y: auto;
  padding: 12px;
  font-family: "Consolas", "Menlo", monospace;
  font-size: 12px;
  color: #d4d4d4;
}

.consola__linea {
  white-space: pre-wrap;
  word-break: break-all;
}

.consola__linea--activa {
  display: flex;
  align-items: center;
  color: #9cdcfe;
}
</style>
