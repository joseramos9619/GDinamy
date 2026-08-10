import { seleccionarCarpeta } from "@/services/sistema/dialogoService";

export default {
  async elegirOrigen() {
    const carpeta = await seleccionarCarpeta("Selecciona la carpeta del respaldo a restaurar");
    if (carpeta) this.origen = carpeta;
    return carpeta;
  },
};
