use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

use crate::error::AppError;

#[derive(Clone, Serialize)]
pub struct LineaProceso {
    pub canal: String,
    pub linea: String,
}

/// Ejecuta un binario embebido como sidecar, emite cada línea de stdout/stderr como
/// evento Tauri en `canal`, y espera a que el proceso termine. Devuelve error si el
/// código de salida no es 0.
pub async fn ejecutar_sidecar(
    app: &AppHandle,
    nombre_binario: &str,
    args: Vec<String>,
    canal: &str,
) -> Result<(), AppError> {
    let comando = app.shell().sidecar(nombre_binario)?;
    let (mut receptor, _hijo) = comando.args(args).spawn()?;

    let mut codigo_salida: Option<i32> = None;

    while let Some(evento) = receptor.recv().await {
        match evento {
            CommandEvent::Stdout(bytes) | CommandEvent::Stderr(bytes) => {
                let linea = String::from_utf8_lossy(&bytes).trim_end().to_string();
                let _ = app.emit(
                    canal,
                    LineaProceso {
                        canal: canal.to_string(),
                        linea,
                    },
                );
            }
            CommandEvent::Terminated(payload) => {
                codigo_salida = payload.code;
            }
            CommandEvent::Error(mensaje) => {
                return Err(AppError::Mensaje(mensaje));
            }
            _ => {}
        }
    }

    match codigo_salida {
        Some(0) => Ok(()),
        Some(codigo) => Err(AppError::Mensaje(format!(
            "{nombre_binario} terminó con código de salida {codigo}"
        ))),
        None => Err(AppError::Mensaje(format!(
            "{nombre_binario} no reportó código de salida"
        ))),
    }
}
