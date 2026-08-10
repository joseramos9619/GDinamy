export const formatoBytes = (bytes) => {
  if (!bytes) return "0 B";

  const unidades = ["B", "KB", "MB", "GB", "TB"];
  const exponente = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    unidades.length - 1,
  );
  const valor = bytes / 1024 ** exponente;

  return `${valor.toFixed(exponente === 0 ? 0 : 1)} ${unidades[exponente]}`;
};
