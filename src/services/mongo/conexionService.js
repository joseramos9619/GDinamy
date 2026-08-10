import { invocar } from "@/api/tauriClient";

export const probarConexion = async (uri) => invocar("test_connection", { uri });

export const obtenerBasesDatos = async (uri) => invocar("list_databases", { uri });

export const obtenerColecciones = async (uri, baseDatos) =>
  invocar("list_collections", { uri, baseDatos });
