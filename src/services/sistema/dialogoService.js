import { open } from "@tauri-apps/plugin-dialog";

export const seleccionarCarpeta = async (titulo) =>
  open({ directory: true, multiple: false, title: titulo });
