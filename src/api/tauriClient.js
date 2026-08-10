import { invoke } from "@tauri-apps/api/core";

// Normaliza el error de invoke() a un Error con mensaje legible, para que las
// stores apliquen el mismo patrón try/catch que usarían con axios.
export const invocar = async (comando, args) => {
  try {
    return await invoke(comando, args);
  } catch (err) {
    const mensaje = typeof err === "string" ? err : err?.message || "Error inesperado";
    throw new Error(mensaje, { cause: err });
  }
};
