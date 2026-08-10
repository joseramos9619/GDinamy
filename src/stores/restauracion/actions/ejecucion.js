import { useProgresoProceso } from "@/composables/useProgresoProceso";
import { ejecutarRestauracion } from "@/services/mongo/restauracionService";

export default {
  async iniciarRestauracion() {
    this.ejecutando = true;
    this.lineasConsola = [];
    this.ultimoResultado = null;
    this._resetError();

    const canal = `restauracion://progreso/${Date.now()}`;
    const { suscribir, desuscribir } = useProgresoProceso(canal, (payload) => {
      this.lineasConsola.push(payload.linea);
    });

    const inicio = Date.now();

    try {
      await suscribir();

      const espaciosNombres = this.espaciosNombresTexto
        .split("\n")
        .map((linea) => linea.trim())
        .filter(Boolean);

      const parametros = {
        uri: this.uri,
        origen: this.origen,
        espaciosNombres: espaciosNombres.length ? espaciosNombres : null,
        eliminarAntes: this.eliminarAntes,
        canalProgreso: canal,
      };

      await ejecutarRestauracion(parametros);

      this.ultimoResultado = { success: true, duracionMs: Date.now() - inicio };
      return this.ultimoResultado;
    } catch (err) {
      this._setError(err);
      this.ultimoResultado = {
        success: false,
        error: this.errorMensaje,
        duracionMs: Date.now() - inicio,
      };
      return this.ultimoResultado;
    } finally {
      desuscribir();
      this.ejecutando = false;
    }
  },
};
