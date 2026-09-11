use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Error de MongoDB: {0}")]
    Mongo(#[from] mongodb::error::Error),

    #[error("Error de E/S: {0}")]
    Io(#[from] std::io::Error),

    #[error("Error al ejecutar el proceso: {0}")]
    Shell(#[from] tauri_plugin_shell::Error),

    #[error("{0}")]
    Mensaje(String),
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mensaje_se_serializa_como_string_plano() {
        let err = AppError::Mensaje("algo salió mal".to_string());

        let serializado = serde_json::to_string(&err).expect("debería poder serializarse");

        assert_eq!(serializado, "\"algo salió mal\"");
    }
}
