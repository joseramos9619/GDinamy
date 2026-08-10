use mongodb::bson::doc;
use serde::Serialize;
use tauri::State;

use crate::error::AppError;
use crate::mongo::client::get_or_create_client;
use crate::state::AppState;

#[derive(Serialize)]
pub struct InfoBaseDatos {
    pub nombre: String,
    pub tamano_bytes: i64,
}

#[tauri::command]
pub async fn test_connection(state: State<'_, AppState>, uri: String) -> Result<bool, AppError> {
    let client = get_or_create_client(&state, &uri).await?;
    client
        .database("admin")
        .run_command(doc! { "ping": 1 })
        .await?;
    Ok(true)
}

#[tauri::command]
pub async fn list_databases(
    state: State<'_, AppState>,
    uri: String,
) -> Result<Vec<InfoBaseDatos>, AppError> {
    let client = get_or_create_client(&state, &uri).await?;
    let bases = client.list_databases().await?;
    Ok(bases
        .into_iter()
        .map(|base| InfoBaseDatos {
            nombre: base.name,
            tamano_bytes: base.size_on_disk,
        })
        .collect())
}

#[tauri::command]
pub async fn list_collections(
    state: State<'_, AppState>,
    uri: String,
    base_datos: String,
) -> Result<Vec<String>, AppError> {
    let client = get_or_create_client(&state, &uri).await?;
    let nombres = client.database(&base_datos).list_collection_names().await?;
    Ok(nombres)
}
