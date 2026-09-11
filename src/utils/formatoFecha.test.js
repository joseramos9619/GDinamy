import { describe, expect, it } from "vitest";

import { formatoDuracion, formatoFecha } from "./formatoFecha";

describe("formatoFecha", () => {
  it("retorna 'N/A' cuando no recibe una fecha", () => {
    expect(formatoFecha(null)).toBe("N/A");
    expect(formatoFecha(undefined)).toBe("N/A");
    expect(formatoFecha("")).toBe("N/A");
  });

  it("retorna 'Fecha inválida' cuando el string no es una fecha ISO válida", () => {
    expect(formatoFecha("no-es-una-fecha")).toBe("Fecha inválida");
  });

  it("formatea una fecha ISO válida usando el locale es-CO", () => {
    const resultado = formatoFecha("2024-03-15T10:30:00Z");
    expect(resultado).not.toBe("Fecha inválida");
    expect(resultado).not.toBe("N/A");
    expect(resultado).toMatch(/^\d{2}\/\d{2}\/\d{2}/);
  });
});

describe("formatoDuracion", () => {
  it("retorna 'N/A' cuando no recibe milisegundos", () => {
    expect(formatoDuracion(null)).toBe("N/A");
    expect(formatoDuracion(undefined)).toBe("N/A");
  });

  it("formatea 0 ms como '0s'", () => {
    expect(formatoDuracion(0)).toBe("0s");
  });

  it("formatea duraciones menores a un minuto en segundos", () => {
    expect(formatoDuracion(5000)).toBe("5s");
    expect(formatoDuracion(59000)).toBe("59s");
  });

  it("formatea duraciones de un minuto o más en minutos y segundos", () => {
    expect(formatoDuracion(60000)).toBe("1m 0s");
    expect(formatoDuracion(65000)).toBe("1m 5s");
  });
});
