import { useProgresoProceso } from "@/composables/useProgresoProceso";
import { agregarEntrada } from "@/services/almacenamiento/historialService";
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
    const espaciosNombres = this.espaciosNombresTexto
      .split("\n")
      .map((linea) => linea.trim())
      .filter(Boolean);

    try {
      await suscribir();

      const parametros = {
        uri: this.uri,
        origen: this.origen,
        espaciosNombres: espaciosNombres.length ? espaciosNombres : null,
        eliminarAntes: this.eliminarAntes,
        baseDatosOrigen: this.baseDatosOrigen?.trim() || null,
        restaurarComo: this.restaurarComo?.trim() || null,
        canalProgreso: canal,
      };

      await ejecutarRestauracion(parametros);

      this.ultimoResultado = { success: true, duracionMs: Date.now() - inicio };
      await this._registrarHistorial(this.ultimoResultado, espaciosNombres);
      return this.ultimoResultado;
    } catch (err) {
      this._setError(err);
      this.ultimoResultado = {
        success: false,
        error: this.errorMensaje,
        duracionMs: Date.now() - inicio,
      };
      await this._registrarHistorial(this.ultimoResultado, espaciosNombres);
      return this.ultimoResultado;
    } finally {
      desuscribir();
      this.ejecutando = false;
    }
  },

  async _registrarHistorial(resultado, espaciosNombres) {
    await agregarEntrada({
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      operacion: "restauracion",
      tipo: espaciosNombres.length ? "parcial" : "completo",
      baseDatos: espaciosNombres.length ? espaciosNombres.join(", ") : "Todas",
      ruta: this.origen,
      duracionMs: resultado.duracionMs,
      estado: resultado.success ? "exito" : "error",
      error: resultado.error || null,
    });
  },
};
