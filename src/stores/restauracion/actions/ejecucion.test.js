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

vi.mock("@/services/mongo/restauracionService", () => ({
  ejecutarRestauracion: vi.fn(),
}));

import { agregarEntrada } from "@/services/almacenamiento/historialService";
import { ejecutarRestauracion } from "@/services/mongo/restauracionService";

import { useRestauracionStore } from "@/stores/restauracion";

describe("useRestauracionStore - iniciarRestauracion", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("registra un resultado exitoso y lo guarda en el historial", async () => {
    ejecutarRestauracion.mockResolvedValue(undefined);

    const store = useRestauracionStore();
    store.uri = "mongodb://localhost:27017";
    store.origen = "/tmp/respaldos/gdinamy_test.gz";
    store.espaciosNombresTexto = "";

    const resultado = await store.iniciarRestauracion();

    expect(resultado.success).toBe(true);
    expect(store.ultimoResultado.success).toBe(true);
    expect(store.isError).toBe(false);
    expect(store.ejecutando).toBe(false);

    expect(ejecutarRestauracion).toHaveBeenCalledTimes(1);
    expect(agregarEntrada).toHaveBeenCalledTimes(1);
    expect(agregarEntrada).toHaveBeenCalledWith(
      expect.objectContaining({
        operacion: "restauracion",
        estado: "exito",
        error: null,
      }),
    );
  });

  it("registra un resultado con error cuando el servicio de restauración falla", async () => {
    ejecutarRestauracion.mockRejectedValue(new Error("Archivo de respaldo corrupto"));

    const store = useRestauracionStore();
    store.uri = "mongodb://localhost:27017";
    store.origen = "/tmp/respaldos/gdinamy_test.gz";
    store.espaciosNombresTexto = "";

    const resultado = await store.iniciarRestauracion();

    expect(resultado.success).toBe(false);
    expect(store.isError).toBe(true);
    expect(store.errorMensaje).toBe("Archivo de respaldo corrupto");
    expect(store.ejecutando).toBe(false);

    expect(agregarEntrada).toHaveBeenCalledTimes(1);
    expect(agregarEntrada).toHaveBeenCalledWith(
      expect.objectContaining({
        operacion: "restauracion",
        estado: "error",
        error: "Archivo de respaldo corrupto",
      }),
    );
  });
});
