import { describe, expect, it } from "vitest";

import { esJsonValido } from "./validadorJson";

describe("esJsonValido", () => {
  it("considera válido un texto vacío, nulo o solo espacios", () => {
    expect(esJsonValido("")).toBe(true);
    expect(esJsonValido(null)).toBe(true);
    expect(esJsonValido(undefined)).toBe(true);
    expect(esJsonValido("   ")).toBe(true);
  });

  it("acepta objetos y arreglos JSON válidos", () => {
    expect(esJsonValido('{"nombre": "coleccion"}')).toBe(true);
    expect(esJsonValido("[1, 2, 3]")).toBe(true);
  });

  it("rechaza texto que no es JSON válido", () => {
    expect(esJsonValido("{invalido}")).toBe(false);
    expect(esJsonValido("no es json")).toBe(false);
    expect(esJsonValido("{nombre: 'coleccion'}")).toBe(false);
  });
});
