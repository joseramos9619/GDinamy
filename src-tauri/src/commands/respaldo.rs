use serde::Deserialize;
use tauri::AppHandle;

use crate::error::AppError;
use crate::sidecar::config_file::{escribir_config_uri, escribir_query_file};
use crate::sidecar::events::ejecutar_sidecar;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SeleccionColeccion {
    pub nombre: String,
    pub query: Option<serde_json::Value>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParametrosRespaldo {
    pub uri: String,
    pub destino: String,
    /// `None` solo es válido para un respaldo completo de TODAS las bases.
    pub base_datos: Option<String>,
    /// `None` = respaldo completo (de `base_datos`, o de todas si también es `None`).
    /// `Some` = respaldo parcial, una invocación de `mongodump` por colección.
    pub colecciones: Option<Vec<SeleccionColeccion>>,
    pub canal_progreso: String,
}

#[tauri::command]
pub async fn run_backup(app: AppHandle, parametros: ParametrosRespaldo) -> Result<(), AppError> {
    let config = escribir_config_uri(&parametros.uri)?;
    let config_path = config.path().to_string_lossy().to_string();

    match parametros.colecciones {
        None => {
            let mut args = vec![
                format!("--config={config_path}"),
                format!("--out={}", parametros.destino),
            ];
            if let Some(base) = &parametros.base_datos {
                args.push(format!("--db={base}"));
            }

            ejecutar_sidecar(&app, "mongodump", args, &parametros.canal_progreso).await?;
        }
        Some(colecciones) => {
            let base = parametros.base_datos.ok_or_else(|| {
                AppError::Mensaje("Se requiere base_datos para un respaldo parcial".into())
            })?;

            for seleccion in colecciones {
                let mut args = vec![
                    format!("--config={config_path}"),
                    format!("--out={}", parametros.destino),
                    format!("--db={base}"),
                    format!("--collection={}", seleccion.nombre),
                ];

                // Mantener el archivo temporal vivo hasta después de ejecutar el sidecar.
                let _archivo_query = match &seleccion.query {
                    Some(query) => {
                        let archivo = escribir_query_file(query)?;
                        args.push(format!("--queryFile={}", archivo.path().to_string_lossy()));
                        Some(archivo)
                    }
                    None => None,
                };

                ejecutar_sidecar(&app, "mongodump", args, &parametros.canal_progreso).await?;
            }
        }
    }

    Ok(())
}
