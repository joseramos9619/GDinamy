use serde::Deserialize;
use tauri::AppHandle;

use crate::error::AppError;
use crate::sidecar::config_file::escribir_config_uri;
use crate::sidecar::events::ejecutar_sidecar;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParametrosRestauracion {
    pub uri: String,
    pub origen: String,
    /// Formato `"baseDatos.coleccion"`. `None` restaura todo el contenido de `origen`.
    pub espacios_nombres: Option<Vec<String>>,
    pub eliminar_antes: bool,
    pub canal_progreso: String,
    /// Nombre de la base de datos tal cual figura en el backup. Junto con
    /// `restaurar_como`, habilita `--nsFrom`/`--nsTo` para renombrar la base
    /// durante la restauración.
    pub base_datos_origen: Option<String>,
    /// Nombre con el que se debe crear/restaurar la base de datos destino.
    pub restaurar_como: Option<String>,
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

    if let (Some(base_datos_origen), Some(restaurar_como)) =
        (&parametros.base_datos_origen, &parametros.restaurar_como)
    {
        if !base_datos_origen.is_empty() && !restaurar_como.is_empty() {
            args.push(format!("--nsFrom={base_datos_origen}.*"));
            args.push(format!("--nsTo={restaurar_como}.*"));
        }
    }

    ejecutar_sidecar(&app, "mongorestore", args, &parametros.canal_progreso).await
}
