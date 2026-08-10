import { obtenerBasesDatos, obtenerColecciones } from "@/services/mongo/conexionService";
import { seleccionarCarpeta } from "@/services/sistema/dialogoService";

export default {
  async cargarBasesDatos() {
    this.isLoading = true;
    this._resetError();
    try {
      this.basesDatos = await obtenerBasesDatos(this.uri);
      return { success: true, data: this.basesDatos };
    } catch (err) {
      this._setError(err);
      return { success: false, error: this.errorMensaje };
    } finally {
      this.isLoading = false;
    }
  },

  async seleccionarBaseDatos(nombreBase) {
    this.baseDatos = nombreBase;
    this.isLoading = true;
    this._resetError();
    try {
      const nombres = await obtenerColecciones(this.uri, nombreBase);
      this.colecciones = nombres;
      this.seleccionColecciones = nombres.map((nombre) => ({
        nombre,
        seleccionada: false,
        query: "",
      }));
      return { success: true, data: nombres };
    } catch (err) {
      this._setError(err);
      return { success: false, error: this.errorMensaje };
    } finally {
      this.isLoading = false;
    }
  },

  toggleColeccion(nombre) {
    const item = this.seleccionColecciones.find((c) => c.nombre === nombre);
    if (item) item.seleccionada = !item.seleccionada;
  },

  setQueryColeccion(nombre, query) {
    const item = this.seleccionColecciones.find((c) => c.nombre === nombre);
    if (item) item.query = query;
  },

  async elegirDestino() {
    const carpeta = await seleccionarCarpeta("Selecciona la carpeta destino del respaldo");
    if (carpeta) this.destino = carpeta;
    return carpeta;
  },
};
