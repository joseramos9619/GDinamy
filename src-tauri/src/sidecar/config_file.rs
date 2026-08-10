use std::io::Write;

use tempfile::NamedTempFile;

use crate::error::AppError;

/// Escribe un YAML temporal con la URI de conexión para pasarlo a los binarios de
/// Database Tools vía `--config`. Evita que la cadena de conexión (con credenciales)
/// quede visible como argumento de línea de comandos en `ps`/Task Manager.
/// El archivo se autodestruye al salir de scope (`Drop` de `NamedTempFile`), incluso
/// si la ejecución falla.
pub fn escribir_config_uri(uri: &str) -> Result<NamedTempFile, AppError> {
    let mut archivo = NamedTempFile::new()?;
    writeln!(archivo, "uri: \"{}\"", uri.replace('"', "\\\""))?;
    archivo.flush()?;
    Ok(archivo)
}

/// Escribe un JSON temporal con un filtro de consulta para `--queryFile` de mongodump.
pub fn escribir_query_file(query: &serde_json::Value) -> Result<NamedTempFile, AppError> {
    let mut archivo = NamedTempFile::new()?;
    serde_json::to_writer(&mut archivo, query).map_err(|err| AppError::Mensaje(err.to_string()))?;
    archivo.flush()?;
    Ok(archivo)
}
