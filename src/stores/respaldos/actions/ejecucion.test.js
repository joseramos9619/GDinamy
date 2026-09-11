import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/composables/useProgresoProceso", () => ({
  useProgresoProceso: vi.fn(() => ({
    suscribir: vi.fn(async () => {}),
    desuscribir: vi.fn(),
  })),
}));

vi.mock("@/services/almacenamiento/historialService", () => ({
  agregarEntrada: vi.fn(async () => []),
}));

vi.mock("@/services/mongo/respaldoService", () => ({
  ejecutarRespaldo: vi.fn(),
}));

import { agregarEntrada } from "@/services/almacenamiento/historialService";
import { ejecutarRespaldo } from "@/services/mongo/respaldoService";

import { useRespaldosStore } from "@/stores/respaldos";

describe("useRespaldosStore - iniciarRespaldo", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("registra un resultado exitoso y lo guarda en el historial", async () => {
    ejecutarRespaldo.mockResolvedValue(undefined);

    const store = useRespaldosStore();
    store.uri = "mongodb://localhost:27017";
    store.baseDatos = "gdinamy_test";
    store.destino = "/tmp/respaldos/gdinamy_test.gz";
    store.tipo = "completo";

    const resultado = await store.iniciarRespaldo();

    expect(resultado.success).toBe(true);
    expect(store.ultimoResultado.success).toBe(true);
    expect(store.isError).toBe(false);
    expect(store.ejecutando).toBe(false);

    expect(ejecutarRespaldo).toHaveBeenCalledTimes(1);
    expect(agregarEntrada).toHaveBeenCalledTimes(1);
    expect(agregarEntrada).toHaveBeenCalledWith(
      expect.objectContaining({
        operacion: "respaldo",
        estado: "exito",
        error: null,
      }),
    );
  });

  it("registra un resultado con error cuando el servicio de respaldo falla", async () => {
    ejecutarRespaldo.mockRejectedValue(new Error("Fallo la conexión a Mongo"));

    const store = useRespaldosStore();
    store.uri = "mongodb://localhost:27017";
    store.baseDatos = "gdinamy_test";
    store.destino = "/tmp/respaldos/gdinamy_test.gz";
    store.tipo = "completo";

    const resultado = await store.iniciarRespaldo();

    expect(resultado.success).toBe(false);
    expect(store.isError).toBe(true);
    expect(store.errorMensaje).toBe("Fallo la conexión a Mongo");
    expect(store.ejecutando).toBe(false);

    expect(agregarEntrada).toHaveBeenCalledTimes(1);
    expect(agregarEntrada).toHaveBeenCalledWith(
      expect.objectContaining({
        operacion: "respaldo",
        estado: "error",
        error: "Fallo la conexión a Mongo",
      }),
    );
  });
});
