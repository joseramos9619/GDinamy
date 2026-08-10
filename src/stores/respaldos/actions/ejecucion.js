import { useProgresoProceso } from "@/composables/useProgresoProceso";
import { ejecutarRespaldo } from "@/services/mongo/respaldoService";

export default {
  async iniciarRespaldo() {
    this.ejecutando = true;
    this.lineasConsola = [];
    this.ultimoResultado = null;
    this._resetError();

    const canal = `respaldo://progreso/${Date.now()}`;
    const { suscribir, desuscribir } = useProgresoProceso(canal, (payload) => {
      this.lineasConsola.push(payload.linea);
    });

    const inicio = Date.now();

    try {
      await suscribir();

      const seleccionadas = this.seleccionColecciones.filter((c) => c.seleccionada);
      const parametros = {
        uri: this.uri,
        destino: this.destino,
        baseDatos: this.baseDatos || null,
        colecciones:
          this.tipo === "parcial"
            ? seleccionadas.map((c) => ({
                nombre: c.nombre,
                query: c.query?.trim() ? JSON.parse(c.query) : null,
              }))
            : null,
        canalProgreso: canal,
      };

      await ejecutarRespaldo(parametros);

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
