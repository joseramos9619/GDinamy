export const formatoFecha = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return "Fecha inválida";
  }
};

export const formatoDuracion = (ms) => {
  if (!ms && ms !== 0) return "N/A";
  const segundos = Math.round(ms / 1000);
  if (segundos < 60) return `${segundos}s`;
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${minutos}m ${resto}s`;
};
