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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escribir_config_uri_incluye_la_uri_como_linea_yaml() {
        let uri = "mongodb://user:pass@localhost:27017";

        let archivo = escribir_config_uri(uri).expect("debería poder crear el archivo temporal");
        let contenido =
            std::fs::read_to_string(archivo.path()).expect("debería poder leer el archivo temporal");

        assert_eq!(contenido, "uri: \"mongodb://user:pass@localhost:27017\"\n");
    }

    #[test]
    fn escribir_config_uri_escapa_comillas_dobles() {
        let uri = "mongodb://localhost:27017/?authMechanism=\"PLAIN\"";

        let archivo = escribir_config_uri(uri).expect("debería poder crear el archivo temporal");
        let contenido =
            std::fs::read_to_string(archivo.path()).expect("debería poder leer el archivo temporal");

        assert_eq!(
            contenido,
            "uri: \"mongodb://localhost:27017/?authMechanism=\\\"PLAIN\\\"\"\n"
        );
    }

    #[test]
    fn escribir_query_file_preserva_el_json_original() {
        let query = serde_json::json!({
            "estado": "activo",
            "edad": { "$gte": 18 },
            "etiquetas": ["a", "b", "c"]
        });

        let archivo =
            escribir_query_file(&query).expect("debería poder crear el archivo temporal");
        let contenido =
            std::fs::read_to_string(archivo.path()).expect("debería poder leer el archivo temporal");
        let query_leida: serde_json::Value =
            serde_json::from_str(&contenido).expect("el contenido debería ser JSON válido");

        assert_eq!(query_leida, query);
    }
}
