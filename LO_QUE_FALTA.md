# CEARTEE - Murcia — Estado del proyecto y pendientes

Documento de seguimiento: qué ya está resuelto y qué falta por hacer.
Actualizado tras fixes de resolución 1366×768, rendimiento, idioma/dificultad,
Primaria, reproductor JClic y optimización del instalador (versión 1.0.3).

---

## ✅ YA RESUELTO (auditoría completa)

**Publicación / seguridad**
- Versión unificada en `1.0.1` (`package.json`, `package-lock.json`, `tauri.conf.json`, `Cargo.toml`, `Cargo.lock`, `aplicar-config.js`).
- Updater activado (`active: true`) y `latest.json` corregido, todo apuntando al repo `Programix212/Murcia`.
- CSP flexible recuperada en `tauri.conf.json` (permite `onclick` locales, bloquea remotos). Dominios de Firebase (`identitytoolkit`, `firestore`, `securetoken`) eliminados del `connect-src`: ya no se usan.
- Secretos fuera del repo: eliminado el `.txt` de contraseñas, Sentry DSN vaciado, Firebase API key a placeholder. `.gitignore` blindado (claves, `target/`, `.exe`).
- Historial purgado con BFG: el `.txt` de contraseñas y la API key de Firebase ya no existen en ningún commit ni tag (`v1.0.1`/`v1.0.2` re-emitidos limpios). API key eliminada también en la consola de Firebase.
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
- Tests: 25/25 verdes (13 anteriores + 12 nuevas antibug de idioma/dificultad en `tests/config.test.js`).
- Docs coherentes: README, CHANGELOG, guía (repo Murcia) y este archivo.
- Repo conectado solo a `Programix212/Murcia` (rama `main`, historial unido); repo viejo `Yolito935/Ceartee2026` eliminado.
- `LICENSE.txt` reescrita: el código es de CEARTEE, los 216 juegos son de sus autores bajo CC BY-NC-SA 4.0 (verificado dentro de los `.jclic`).

**Resolución 1366×768 (bugs de otras PCs)**
- Ventana Tauri a `1280×720` (16:9) + `minWidth: 800` (`tauri.conf.json`).
- Compactado global en `transiciones.css` (se carga en todas las páginas): header `180px → 110px` en pantallas bajas, grids y tarjetas compactas.
- Corregido selector inválido en `Ventana.css` (faltaba una coma, el bloque nunca se aplicaba) + regla para 1366px.

**Rendimiento (bugs de otras PCs)**
- Burbujas: 8 → 4 visibles + respeto a `prefers-reduced-motion` y a Animaciones desactivadas (`transiciones.css`, `burbujas.js`).
- `backdrop-filter` global `*` reemplazado por selectores dirigidos (menos recálculo).
- Carga de juegos: barra falsa `5s → 1.2s` y descarga en paralelo; `MutationObserver` sin bucle; volumen cada 2s solo en el juego (`vista.js`).
- Instalador: `src/assets` de 854 MB → 502 MB (fuera `_pendientes` ~113 MB, 5 zips huérfanos, 210 imágenes a 256 px: 258 → 27 MB).

**Idioma / dificultad (bugs de otras PCs)**
- Normalizadores en `aplicar-config.js` (`window.CearteeConfig`): `ca` → `es`, `medio/fácil/difícil` → canónico, corruptos → `es`/`todas`. `settings.js` valida selects (nunca muestra `"undefined"`). Cubierto por 12 tests nuevos.

**Primaria completada**
- `Lenguajes2.html`: 84 juegos · `Saberes.html`: 62 · `Etica2.html`: 6 (todo lo que hay en assets) · `Humano.html`: 2 (reutilizados de Preescolar; los `.pcc` pendientes no están empaquetados). Total **154** (antes 0). `Frases`/`Poesía` excluidos: congelaban la app.
- `Categorias2.html` (84/62/6/2, footer 154) y `Estrellas.js` actualizados.

**Reproductor JClic**
- Juegos encogidos/descolocados (ej. "Conceptos básicos", "Cálculo mental 2"): marco con altura explícita centrada, sin forzar layout interno de JClic, auto-escala con `transform` (`vista.css`, `vista.js`). Ya no requiere re-exportar.

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
- Idioma por defecto en Español y dificultad por defecto en "Todas" (más normalizadores antibug, ver arriba).
- Panel docente de acceso abierto, sin contraseña (decisión de diseño).

**Traducciones (ES / EN)**
- Título de Ética, contador "Juegos", dificultad, edad y tiempo de tarjetas.
- Etiquetas y botones de Exportar/Importar respaldo + mensaje de guardado.
- Descripciones de los juegos de Lenguajes (solo EN; ES vacío).
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
- **Descripciones de juegos** vacías en Preescolar (59/59) y Primaria (154/154); solo hay 15 en inglés para Lenguajes (`aplicar-config.js`).
- **Ética de Primaria** con 6 juegos: es todo lo que hay en `assets/Primaria_Etica/`.
- **Humano de Primaria** usa 2 juegos reutilizados de Preescolar; los proyectos de `Primaria_Humano_pendientes/` eran `.pcc` sin empaquetar (carpeta eliminada al optimizar; hay que empaquetarlos a `.jclic.zip` con JClic Author para contenido propio).
- **Pantalla de "Créditos"**: `LICENSE.txt` ya la menciona, pero no existe. Crearla listando cada juego con autor y licencia CC BY-NC-SA 4.0.

### 🔵 Opcional / a futuro
- **Firma de código (Authenticode):** evita el aviso de "Editor desconocido" (de pago).
- **Verificar en instalación limpia** en una PC distinta.
- **Reducir duplicación** de código entre Preescolar y Primaria.
- **Lazy loading** de imágenes (prioridad baja).

---

## Orden sugerido para terminar
1. `devtools: false` al compilar la versión final.
2. Controles de accesibilidad (alto contraste + tamaño de letra).
3. Pantalla de Créditos + descripciones de los juegos que faltan.
4. Verificar en instalación limpia y publicar (con la firma `.sig` real en `latest.json`).
