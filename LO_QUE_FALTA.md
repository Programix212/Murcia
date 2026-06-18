# CEARTEE - Murcia — Estado del proyecto y pendientes

Documento de seguimiento: qué ya está resuelto y qué falta por hacer.
Actualizado tras las últimas mejoras.

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
## ⏳ PENDIENTE

### 🔴 Prioridad alta (seguridad, gratis)
- **Desactivar DevTools en la versión final.** En `src-tauri/tauri.conf.json` está
  `"devtools": true`. Con eso cualquiera puede inspeccionar el `.exe` y manipular       f
  datos. Ponerlo en `false` para distribuir (dejarlo en `true` solo al desarrollar).

### 🟠 Prioridad media
- **Quitar el recuadro rojo de diagnóstico** de `transiciones.js` (era temporal para
  cazar errores). Si ya no aparece, confirmar que se eliminó.                           D
- **Versionado:** dejar igual el número en `package.json`, `tauri.conf.json`,
  `Cargo.toml` y `latest.json` cuando se publique (hoy `Cargo.toml` puede ir desfasado).   V  
- **Recuperar una CSP** (se desactivó para arreglar los botones). Opcional, como
  defensa extra, usando la opción que no rompe los `onclick`.                           F
- **Decidir contraseña del panel docente:** mantenerla (privacidad) o quitarla
  (acceso directo). Ya está lista con hash si se mantiene.

### 🟡 Accesibilidad (importante para educación especial)
- **Modo alto contraste** (pasos listos, falta aplicar).
- **Escalado de tamaño de letra** (pasos listos, falta aplicar).                                   F
- **Textos `alt` e indicaciones ARIA** en imágenes/iconos y navegación por teclado.

### 🟡 Experiencia de uso (UX)
- **Confirmaciones** al borrar un perfil o resetear estadísticas.           F
- **Estados vacíos** (sin perfiles, o categoría sin juegos).                 V
- **Foco visible** para navegar con teclado.                                D

### 🟢 Contenido
- **Descripciones de juegos** en Saberes, Ética y Humano (hoy están vacías; solo
  Lenguajes tiene descripción). Hay que escribirlas en español y luego traducirlas.        F
- **Juegos de Primaria:** cuando se agreguen, crear una **lista de juegos de Primaria**
  separada para que las estrellas y el footer cuenten por etapa correctamente.             V

### 🟢 Casos puntuales
- **Juego "Conceptos básicos":** la primera actividad sale encogida hasta que se
  navega. Es del archivo `.jclic.zip` (no del programa). Pendiente de re-exportar          V
  ese juego con JClic Author o reemplazarlo.
- **Estrellas de las tarjetas de Primaria:** todavía cuentan con la lista de
  Preescolar (igual que pasaba con el footer). Pendiente si se quiere en 0.                F

### 🔵 Opcional / a futuro
- **Firma de código (Authenticode):** evita el aviso de "Editor desconocido" de
  Windows. Es de pago. (Descartado por ahora.)                                            F
- **Verificar en instalación limpia** en una PC distinta que todas las categorías         V
  cargan y las imágenes se ven.                                                           
- **Reducir duplicación** de código entre Preescolar y Primaria.                          D
- **Lazy loading** de imágenes (prioridad baja tras optimizarlas).                        V
- **Botón para cambiar contraseña** del panel docente desde la interfaz (la función       F    
  ya existe: `cambiarPasswordDocente`).

---

## Orden sugerido para terminar
1. `devtools: false` (seguridad, gratis, 1 línea).
2. Quitar el recuadro rojo de diagnóstico.
3. Accesibilidad (alto contraste + tamaño de letra).
4. Confirmaciones de UX (borrar perfil / reset).
5. Descripciones de los juegos que faltan.
6. Verificar en instalación limpia y publicar versión final (con versionado unificado).
