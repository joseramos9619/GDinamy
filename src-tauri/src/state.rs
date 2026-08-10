use std::collections::HashMap;
use std::sync::Mutex;

use mongodb::Client;

#[derive(Default)]
pub struct AppState {
    pub clientes: Mutex<HashMap<String, Client>>,
}
