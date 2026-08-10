import estadoInicial from "../state";

export default {
  _setError(err) {
    this.isError = true;
    this.errorMensaje = err?.message || "Error inesperado";
  },

  _resetError() {
    this.isError = false;
    this.errorMensaje = "";
  },

  reiniciarWizard() {
    Object.assign(this, estadoInicial());
  },

  seleccionarConexion(perfil) {
    this.reiniciarWizard();
    this.conexionId = perfil.id;
    this.uri = perfil.uri;
  },
};
