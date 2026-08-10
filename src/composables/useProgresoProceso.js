import { listen } from "@tauri-apps/api/event";

/**
 * Escucha un canal de eventos Tauri emitido por un sidecar (mongodump/mongorestore)
 * mientras se ejecuta, línea por línea.
 */
export function useProgresoProceso(canal, onLinea) {
  let dejarDeEscuchar = null;

  const suscribir = async () => {
    dejarDeEscuchar = await listen(canal, (evento) => onLinea(evento.payload));
  };

  const desuscribir = () => {
    if (dejarDeEscuchar) {
      dejarDeEscuchar();
      dejarDeEscuchar = null;
    }
  };

  return { suscribir, desuscribir };
}
