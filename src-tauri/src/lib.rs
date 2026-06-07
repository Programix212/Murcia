use tauri::Manager;

/// Lee un archivo de juego y devuelve sus bytes en base64
#[tauri::command]
fn get_juego_base64(ruta_relativa: String, app: tauri::AppHandle) -> Result<String, String> {
    // 1. Buscar en resource_dir (producción)
    let resource_dir = app.path()
        .resource_dir()
        .map_err(|e| format!("Error resource_dir: {}", e))?;
    
    let juego_path = resource_dir.join(&ruta_relativa);
    
    // 2. Fallback para desarrollo
    let ruta = if juego_path.exists() {
        juego_path
    } else {
        let dev_path = std::path::PathBuf::from("../src").join(&ruta_relativa);
        if dev_path.exists() {
            dev_path
        } else {
            return Err(format!("Juego no encontrado: {}", ruta_relativa));
        }
    };
    
    // Leer archivo y convertir a base64
    let bytes = std::fs::read(&ruta)
        .map_err(|e| format!("Error leyendo archivo {:?}: {}", ruta, e))?;
    
    use base64::Engine;
    let b64 = base64::engine::general_purpose::STANDARD.encode(&bytes);
    Ok(b64)
}

/// Lista los juegos disponibles
#[tauri::command]
fn get_lista_juegos(carpeta: String, app: tauri::AppHandle) -> Result<Vec<String>, String> {
    let resource_dir = app.path()
        .resource_dir()
        .map_err(|e| format!("Error: {}", e))?;
    
    let mut juegos_dir = resource_dir.join("assets").join("juegos").join(&carpeta);
    
    if !juegos_dir.exists() {
        juegos_dir = std::path::PathBuf::from("../src/assets/juegos").join(&carpeta);
    }
    
    let mut juegos = Vec::new();
    
    if let Ok(entries) = std::fs::read_dir(&juegos_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if let Some(name) = path.file_name() {
                let name_str = name.to_string_lossy().to_string();
                if name_str.ends_with(".jclic") || name_str.ends_with(".jclic.zip") {
                    juegos.push(name_str);
                }
            }
        }
    }
    
    juegos.sort();
    Ok(juegos)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build()) // ← NUEVO: Plugin updater
        .setup(|_app| {
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_juego_base64,
            get_lista_juegos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}