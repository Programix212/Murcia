# Historial de cambios

Todos los cambios relevantes de CEARTEE - Murcia se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y el proyecto usa versionado [SemVer](https://semver.org/lang/es/).

---

## [Sin publicar]

### Añadido
- Exportar e importar respaldo de perfiles y estadísticas a un archivo JSON (Configuración → Avanzado).
- Migración automática del esquema de datos al abrir la app (`ceartee_schema_version`).
- Contraseña del panel docente guardada como hash SHA-256 en lugar de texto plano, con opción de cambiarla.
- Documentación: README real, guía para añadir juegos y este CHANGELOG.

### Cambiado
- El botón "Volver" de Configuración ahora avisa si hay cambios sin guardar antes de salir.
- El idioma solo se guarda al pulsar "Guardar cambios", no al salir.
- Registrado el plugin `process` y sus permisos para que el reinicio tras actualizar funcione.
- Clave pública del updater (`pubkey`) actualizada para que coincida con la clave privada de firma.

### Corregido
- El botón "Exportar" mostraba el texto "Limpiar" por error de traducción.
- Eliminado `main.js` (código de plantilla que invocaba un comando inexistente).

### Pendiente
- Unificar el número de versión en `package.json`, `tauri.conf.json`, `Cargo.toml` y `latest.json`.
- Decidir destino final de versión para publicar la próxima actualización (`latest.json` debe apuntar a una versión mayor que la instalada).

---

## [1.0.2]

### Cambiado
- Ajustes varios de interfaz y contenido.

---

## [1.0.1]

### Añadido
- Sistema de actualizaciones automáticas (Tauri updater).
- Empaquetado como instalador NSIS para Windows.

---

## [0.1.0]

### Añadido
- Versión inicial: reproductor JClic, perfiles, estadísticas, panel docente, multiidioma y configuración.
