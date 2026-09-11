import { describe, expect, it } from "vitest";

import { formatoBytes } from "./formatoBytes";

describe("formatoBytes", () => {
  it("retorna '0 B' cuando el valor es 0", () => {
    expect(formatoBytes(0)).toBe("0 B");
  });

  it("retorna '0 B' cuando el valor es nulo o indefinido", () => {
    expect(formatoBytes(null)).toBe("0 B");
    expect(formatoBytes(undefined)).toBe("0 B");
  });

  it("formatea bytes sin decimales cuando la unidad es B", () => {
    expect(formatoBytes(500)).toBe("500 B");
    expect(formatoBytes(1023)).toBe("1023 B");
  });

  it("formatea kilobytes con un decimal", () => {
    expect(formatoBytes(1024)).toBe("1.0 KB");
    expect(formatoBytes(1536)).toBe("1.5 KB");
  });

  it("formatea megabytes, gigabytes y terabytes", () => {
    expect(formatoBytes(1024 ** 2)).toBe("1.0 MB");
    expect(formatoBytes(1024 ** 3)).toBe("1.0 GB");
    expect(formatoBytes(1024 ** 4)).toBe("1.0 TB");
  });

  it("no supera la unidad TB aunque el valor sea mayor", () => {
    expect(formatoBytes(1024 ** 5)).toBe("1024.0 TB");
  });
});
