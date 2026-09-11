<template>
  <v-sheet
    class="consola"
    rounded="lg"
  >
    <div class="consola__cabecera">
      <span
        class="consola__estado"
        :class="{ 'consola__estado--activo': ejecutando }"
      />
      {{ ejecutando ? "Proceso en ejecución" : "Salida del proceso" }}
    </div>

    <div
      ref="cuerpoRef"
      class="consola__cuerpo"
    >
      <div
        v-for="(linea, indice) in lineas"
        :key="indice"
        class="consola__linea"
        :class="{ 'consola__linea--error': /error/i.test(linea) }"
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
    </div>
  </v-sheet>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";

const props = defineProps({
  lineas: { type: Array, default: () => [] },
  ejecutando: { type: Boolean, default: false },
});

const cuerpoRef = ref(null);

watch(
  () => props.lineas.length,
  async () => {
    await nextTick();
    if (cuerpoRef.value) cuerpoRef.value.scrollTop = cuerpoRef.value.scrollHeight;
  },
);
</script>

<style scoped>
.consola {
  overflow: hidden;
  background: #12191c;
  color: #d7dede;
}

.consola__cabecera {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  color: rgba(215, 222, 222, 0.65);
}

.consola__estado {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(215, 222, 222, 0.35);
}

.consola__estado--activo {
  background: #c0862e;
  box-shadow: 0 0 0 3px rgba(192, 134, 46, 0.2);
}

.consola__cuerpo {
  height: 240px;
  overflow-y: auto;
  padding: 12px 14px;
  font-family: "JetBrains Mono", "Consolas", monospace;
  font-size: 0.75rem;
  line-height: 1.6;
}

.consola__linea {
  white-space: pre-wrap;
  word-break: break-all;
}

.consola__linea--error {
  color: #e08670;
}

.consola__linea--activa {
  display: flex;
  align-items: center;
  color: #8fb8d9;
}
</style>
