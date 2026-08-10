import { load } from "@tauri-apps/plugin-store";

let almacen = null;

const obtenerAlmacen = async () => {
  if (!almacen) {
    almacen = await load("historial.json", { autoSave: true });
  }
  return almacen;
};

export const obtenerHistorial = async () => {
  const store = await obtenerAlmacen();
  return (await store.get("entradas")) || [];
};

export const agregarEntrada = async (entrada) => {
  const store = await obtenerAlmacen();
  const entradas = (await store.get("entradas")) || [];
  entradas.unshift(entrada);
  await store.set("entradas", entradas);
  return entradas;
};
