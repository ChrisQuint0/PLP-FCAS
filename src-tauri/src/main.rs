// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // 1. Start the PHP built-in server pointing to your local 'api' folder
    // This assumes XAMPP is installed in the default C:\xampp directory
    let mut php_server = Command::new("C:\\xampp\\php\\php.exe")
        .args([
            "-S", "localhost:8000", 
            "-t", "../api" // Points to the api folder in your repo
        ])
        .spawn()
        .expect("Failed to start PHP server. Is XAMPP installed at C:\\xampp?");

    // 2. Run the Tauri application
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // 3. Kill the PHP server when the user closes the Tauri app
    let _ = php_server.kill();
}