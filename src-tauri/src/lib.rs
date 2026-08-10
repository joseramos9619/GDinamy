mod commands;
mod error;
mod mongo;
mod state;

use commands::conexion::{list_collections, list_databases, test_connection};
use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            test_connection,
            list_databases,
            list_collections,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
