use std::time::Duration;

use mongodb::options::ClientOptions;
use mongodb::Client;

use crate::error::AppError;
use crate::state::AppState;

/// Reutiliza un `Client` cacheado por URI (el driver ya mantiene su propio pool
/// de conexiones internamente); solo evitamos repetir el parseo/handshake inicial.
pub async fn get_or_create_client(state: &AppState, uri: &str) -> Result<Client, AppError> {
    if let Some(client) = state.clientes.lock().unwrap().get(uri) {
        return Ok(client.clone());
    }

    let mut options = ClientOptions::parse(uri).await?;
    options.server_selection_timeout = Some(Duration::from_secs(5));
    options.connect_timeout = Some(Duration::from_secs(5));

    let client = Client::with_options(options)?;

    state
        .clientes
        .lock()
        .unwrap()
        .insert(uri.to_string(), client.clone());

    Ok(client)
}
