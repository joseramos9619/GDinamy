import { load } from "@tauri-apps/plugin-store";

let almacen = null;

const obtenerAlmacen = async () => {
  if (!almacen) {
    almacen = await load("conexiones.json", { autoSave: true });
  }
  return almacen;
};

export const obtenerPerfiles = async () => {
  const store = await obtenerAlmacen();
  return (await store.get("perfiles")) || [];
};

export const guardarPerfil = async (perfil) => {
  const store = await obtenerAlmacen();
  const perfiles = (await store.get("perfiles")) || [];
  const indice = perfiles.findIndex((p) => p.id === perfil.id);

  if (indice >= 0) {
    perfiles[indice] = perfil;
  } else {
    perfiles.push(perfil);
  }

  await store.set("perfiles", perfiles);
  return perfiles;
};

export const eliminarPerfil = async (id) => {
  const store = await obtenerAlmacen();
  const perfiles = ((await store.get("perfiles")) || []).filter((p) => p.id !== id);
  await store.set("perfiles", perfiles);
  return perfiles;
};
