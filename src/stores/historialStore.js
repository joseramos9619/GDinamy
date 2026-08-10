import { defineStore } from "pinia";

import { agregarEntrada, obtenerHistorial } from "@/services/almacenamiento/historialService";

export const useHistorialStore = defineStore("historialStore", {
  state: () => ({
    isLoading: false,
    isError: false,
    errorMensaje: "",
    entradas: [],
  }),

  actions: {
    _setError(err) {
      this.isError = true;
      this.errorMensaje = err?.message || "Error inesperado";
    },

    _resetError() {
      this.isError = false;
      this.errorMensaje = "";
    },

    async cargarHistorial() {
      this.isLoading = true;
      this._resetError();
      try {
        this.entradas = await obtenerHistorial();
        return { success: true, data: this.entradas };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      } finally {
        this.isLoading = false;
      }
    },

    async registrarEntrada(entrada) {
      try {
        this.entradas = await agregarEntrada(entrada);
        return { success: true };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      }
    },
  },
});
