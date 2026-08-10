export const esJsonValido = (texto) => {
  if (!texto || !texto.trim()) return true;
  try {
    JSON.parse(texto);
    return true;
  } catch {
    return false;
  }
};
