import { defineStore } from "pinia";

import { probarConexion } from "@/services/mongo/conexionService";
import {
  eliminarPerfil,
  guardarPerfil,
  obtenerPerfiles,
} from "@/services/almacenamiento/perfilesService";

export const useConexionesStore = defineStore("conexionesStore", {
  state: () => ({
    isLoading: false,
    isError: false,
    errorMensaje: "",
    perfiles: [],
    probando: {},
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

    async cargarPerfiles() {
      this.isLoading = true;
      this._resetError();
      try {
        this.perfiles = await obtenerPerfiles();
        return { success: true, data: this.perfiles };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      } finally {
        this.isLoading = false;
      }
    },

    async crearPerfil({ nombre, uri }) {
      this._resetError();
      try {
        const perfil = { id: crypto.randomUUID(), nombre, uri };
        this.perfiles = await guardarPerfil(perfil);
        return { success: true, data: perfil };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      }
    },

    async actualizarPerfil(perfil) {
      this._resetError();
      try {
        this.perfiles = await guardarPerfil(perfil);
        return { success: true, data: perfil };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      }
    },

    async quitarPerfil(id) {
      this._resetError();
      try {
        this.perfiles = await eliminarPerfil(id);
        return { success: true };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      }
    },

    async probarPerfil(id, uri) {
      this.probando = { ...this.probando, [id]: true };
      this._resetError();
      try {
        await probarConexion(uri);
        return { success: true };
      } catch (err) {
        this._setError(err);
        return { success: false, error: this.errorMensaje };
      } finally {
        this.probando = { ...this.probando, [id]: false };
      }
    },
  },
});
