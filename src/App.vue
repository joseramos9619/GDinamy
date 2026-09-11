<template>
  <v-app>
    <v-navigation-drawer
      permanent
      theme="gdinamy-lateral"
      width="240"
      class="barra-lateral"
    >
      <div class="barra-lateral__marca">
        <span class="barra-lateral__punto" />
        <div>
          <div class="barra-lateral__nombre">
            GDinamy
          </div>
          <div class="barra-lateral__subtitulo">
            Operación MongoDB
          </div>
        </div>
      </div>

      <v-list
        nav
        class="barra-lateral__nav"
      >
        <v-list-item
          v-for="item in navegacion"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icono"
          :title="item.titulo"
          rounded="lg"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
const navegacion = [
  { to: "/respaldos", titulo: "Respaldos", icono: "mdi-database-export" },
  { to: "/restauracion", titulo: "Restauración", icono: "mdi-database-import" },
  { to: "/conexiones", titulo: "Conexiones", icono: "mdi-server-network" },
  { to: "/historial", titulo: "Historial", icono: "mdi-history" },
];
</script>

<style scoped>
.barra-lateral__marca {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px 18px;
}

.barra-lateral__punto {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #c0862e;
}

.barra-lateral__nombre {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}

.barra-lateral__subtitulo {
  font-size: 0.75rem;
  color: rgba(231, 236, 234, 0.6);
}

.barra-lateral__nav {
  padding: 4px 12px;
}

.barra-lateral__nav :deep(.v-list-item) {
  margin-block: 2px;
}
</style>
