use serde::Deserialize;
use tauri::AppHandle;

use crate::error::AppError;
use crate::sidecar::config_file::escribir_config_uri;
use crate::sidecar::events::ejecutar_sidecar;

#[derive(Deserialize)]
pub struct ParametrosRestauracion {
    pub uri: String,
    pub origen: String,
    /// Formato `"baseDatos.coleccion"`. `None` restaura todo el contenido de `origen`.
    pub espacios_nombres: Option<Vec<String>>,
    pub eliminar_antes: bool,
    pub canal_progreso: String,
}

#[tauri::command]
pub async fn run_restore(
    app: AppHandle,
    parametros: ParametrosRestauracion,
) -> Result<(), AppError> {
    let config = escribir_config_uri(&parametros.uri)?;
    let config_path = config.path().to_string_lossy().to_string();

    let mut args = vec![
        format!("--config={config_path}"),
        format!("--dir={}", parametros.origen),
    ];

    if parametros.eliminar_antes {
        args.push("--drop".to_string());
    }

    if let Some(espacios) = &parametros.espacios_nombres {
        for espacio_nombre in espacios {
            args.push(format!("--nsInclude={espacio_nombre}"));
        }
    }

    ejecutar_sidecar(&app, "mongorestore", args, &parametros.canal_progreso).await
}
