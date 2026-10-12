# CEARTEE - Murcia — Estado del proyecto y pendientes

Documento de seguimiento: qué ya está resuelto y qué falta por hacer.
Actualizado tras la auditoría completa y limpieza (versión 1.0.1).

---

## ✅ YA RESUELTO (auditoría completa)

**Publicación / seguridad**
- Versión unificada en `1.0.1` (`package.json`, `package-lock.json`, `tauri.conf.json`, `Cargo.toml`, `Cargo.lock`, `aplicar-config.js`).
- Updater activado (`active: true`) y `latest.json` corregido, todo apuntando al repo `Programix212/Murcia`.
- CSP flexible recuperada en `tauri.conf.json` (permite `onclick` locales, bloquea remotos).
- Secretos fuera del repo: eliminado el `.txt` de contraseñas, Sentry DSN vaciado, Firebase API key a placeholder. `.gitignore` blindado (claves, `target/`, `.exe`).
- Barra roja de debug silenciada (solo visible con `localStorage.ceartee_debug = '1'`).

**Código muerto eliminado**
- Cloud Sync: `firebase-sync.js`, `firebase-auth-rest.js` y bloque Firebase + `sync*` en `settings.js` (~280 líneas).
- Secundaria: claves i18n y detectores.
- Login docente: sistema de contraseña completo + claves i18n huérfanas (panel abierto por decisión de diseño).
- Catalán: detectores y restos eliminados (solo ES/EN).

**Interfaz / UX**
- Fundido negro-azul en todas las navegaciones (`cearteeNavigate` + `cearteeBack`).
- Volver de Configuración regresa a la ventana anterior.
- `confirm()` de importar reemplazado por modal bilingüe; toasts y alerts de juegos en ES/EN.
- Imágenes: `onerror` en las 179 tarjetas, `alt` en las 264 imágenes, rutas `data-file` corregidas.
- Foco visible con teclado (`:focus-visible` global) y roles ARIA en modales/avisos.
- Detalles: `gameList` → `gamesList`, título `CEARTEE - Juego`.

**Pruebas y docs**
- Tests: 13/13 verdes (export/import async corregidos + prueba de respaldo manipulado).
- Docs coherentes: README, CHANGELOG, guía (repo Murcia) y este archivo.

---

## ✅ YA RESUELTO

**Funcionamiento / bugs**
- Botones que no respondían en el `.exe` (era la CSP que bloqueaba los `onclick`).
- `Categorias.js` se cargaba dos veces (SyntaxError) → corregido.
- `settings.js` reventaba en Etapas (`syncActualizarUI`) → protegido.
- `FIREBASE_API_KEY` declarado dos veces → quitado el duplicado.
- Navegación Saberes/Humano de Primaria apuntaba a archivos inexistentes → corregido.
- Botón "Volver" de Configuración regresa al origen (Preescolar/Primaria), no al index.
- Botón "Cancelar" de Configuración ya no manda siempre al index.
- Código muerto eliminado: `main.js`, comandos Rust sin uso, `rutaZip` en vista.

**Actualizaciones (updater)**
- Plugin `process` registrado + permisos (reinicio tras actualizar).
- Clave pública (pubkey) alineada con la clave privada de firma.
- Guía de compilar/firmar/publicar/rollback creada (`GUIA_COMPILAR_Y_FIRMAR.md`).

**Datos / configuración**
- Exportar e importar perfiles y estadísticas.
- Migración automática del esquema de datos.
- Idioma por defecto en Español y dificultad por defecto en "Todas".
- Contraseña del panel docente con hash SHA-256.

**Traducciones (ES / CA / EN)**
- Título de Ética, contador "Juegos", dificultad, edad y tiempo de tarjetas.
- Etiquetas y botones de Exportar/Importar respaldo + mensaje de guardado.
- Descripciones de los juegos de Lenguajes.
- "0 juegos" de las estrellas según idioma.

**Rendimiento / pantalla**
- Quitado el `backdrop-filter: blur` (mucho más rápido en PCs viejas).
- Transiciones más cortas (180 ms).
- Imágenes de iconos optimizadas (84 MB → 3.7 MB).
- Caché de validación de juegos (no re-descomprime al reabrir).
- Reglas para pantallas bajas (1366×768) en index y categorías.
- Footer de Primaria ya no cuenta los juegos de Preescolar.

**Limpieza / pruebas**
- Borrados 25 archivos `.tmp` + reglas en `.gitignore`.
- Pruebas automáticas con Vitest (perfiles, estadísticas, migración).
- Documentación: README, guía de juegos, CHANGELOG, guía de compilación.

---
 v - SI    F - NO  D - En duda 
## ⏳ PENDIENTE (solo lo que sigue abierto)

### 🔴 Prioridad alta (seguridad, gratis)
- **Desactivar DevTools en la versión final.** En `src-tauri/tauri.conf.json` sigue
  `"devtools": true`. Ponerlo en `false` al compilar para distribuir.

### 🟡 Accesibilidad (importante para educación especial)
- **Controles de alto contraste y tamaño de letra** en Configuración (la lógica existe,
  falta la UI). Los controles están comentados en `Configuracion.html`.

### 🟢 Contenido
- **Descripciones de juegos** en Saberes, Ética y Humano (vacías; solo Lenguajes tiene).
- **Juegos de Primaria:** las 4 páginas están vacías (0 tarjetas). Al agregarlos, mantener
  lista separada para estrellas/footer por etapa.
- **Juego "Conceptos básicos":** sale encogido (defecto del `.jclic.zip`, re-exportar con JClic Author).

### 🔵 Opcional / a futuro
- **Firma de código (Authenticode):** evita el aviso de "Editor desconocido" (de pago).
- **Verificar en instalación limpia** en una PC distinta.
- **Reducir duplicación** de código entre Preescolar y Primaria.
- **Lazy loading** de imágenes (prioridad baja).

---

## Orden sugerido para terminar
1. `devtools: false` al compilar la versión final.
2. Controles de accesibilidad (alto contraste + tamaño de letra).
3. Descripciones de los juegos que faltan + juegos de Primaria.
4. Verificar en instalación limpia y publicar (con la firma `.sig` real en `latest.json`).
