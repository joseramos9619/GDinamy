mod commands;
mod error;
mod mongo;
mod sidecar;
mod state;

use commands::conexion::{list_collections, list_databases, test_connection};
use commands::respaldo::run_backup;
use commands::restauracion::run_restore;
use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            test_connection,
            list_databases,
            list_collections,
            run_backup,
            run_restore,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
