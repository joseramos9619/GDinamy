export default () => ({
  isLoading: false,
  isError: false,
  errorMensaje: "",

  // Wizard
  conexionId: null,
  uri: "",
  tipo: "completo", // "completo" | "parcial"
  basesDatos: [],
  baseDatos: null,
  colecciones: [],
  seleccionColecciones: [], // [{ nombre, seleccionada, query }]
  destino: "",

  // Ejecución
  ejecutando: false,
  lineasConsola: [],
  ultimoResultado: null,
});
