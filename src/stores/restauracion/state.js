export default () => ({
  isLoading: false,
  isError: false,
  errorMensaje: "",

  // Wizard
  conexionId: null,
  uri: "",
  origen: "",
  eliminarAntes: false,
  espaciosNombresTexto: "", // una línea por "baseDatos.coleccion"; vacío = restaurar todo

  // Ejecución
  ejecutando: false,
  lineasConsola: [],
  ultimoResultado: null,
});
