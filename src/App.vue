<template>
  <v-app>
    <v-navigation-drawer permanent>
      <v-list nav>
        <v-list-item
          v-for="item in navegacion"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icono"
          :title="item.titulo"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="1">
      <v-app-bar-title>GDinamy</v-app-bar-title>
    </v-app-bar>

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
