# Historial de cambios

Todos los cambios relevantes de CEARTEE - Murcia se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y el proyecto usa versionado [SemVer](https://semver.org/lang/es/).

---

## [Sin publicar]

### Añadido
- Exportar e importar respaldo de perfiles y estadísticas a un archivo JSON (Configuración → Avanzado).
- Migración automática del esquema de datos al abrir la app (`ceartee_schema_version`).
- Documentación: README real, guía para añadir juegos y este CHANGELOG.

### Eliminado
- Contraseña del panel docente: el panel ahora es de acceso abierto (decisión de diseño).
- Cloud Sync con Firebase: código muerto sin UI (`firebase-sync.js`, `firebase-auth-rest.js` y funciones `sync*`).
- Claves i18n muertas: Secundaria, textos del login docente y restos de catalán.

### Cambiado
- El botón "Volver" de Configuración ahora avisa si hay cambios sin guardar antes de salir.
- El idioma solo se guarda al pulsar "Guardar cambios", no al salir.
- Registrado el plugin `process` y sus permisos para que el reinicio tras actualizar funcione.
- Clave pública del updater (`pubkey`) actualizada para que coincida con la clave privada de firma.

### Corregido
- El botón "Exportar" mostraba el texto "Limpiar" por error de traducción.
- Eliminado `main.js` (código de plantilla que invocaba un comando inexistente).
- Versión unificada en `1.0.1` (`package.json`, `tauri.conf.json`, `Cargo.toml`, `Cargo.lock`, `package-lock.json` y `aplicar-config.js`).
- Activado el actualizador (`updater.active: true`) y corregido `latest.json` (versión + URL del repo `Programix212/Murcia`).

### Pendiente
- Decidir destino final de versión para publicar la próxima actualización (`latest.json` debe apuntar a una versión mayor que la instalada, con su firma `.sig` real).

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
