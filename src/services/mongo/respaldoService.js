import { invocar } from "@/api/tauriClient";

export const ejecutarRespaldo = async (parametros) => invocar("run_backup", { parametros });
