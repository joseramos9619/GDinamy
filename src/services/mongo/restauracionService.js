import { invocar } from "@/api/tauriClient";

export const ejecutarRestauracion = async (parametros) => invocar("run_restore", { parametros });
