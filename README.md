# CEARTEE - Murcia

Aplicación de escritorio educativa construida con **Tauri 2** y JavaScript vanilla, que ofrece juegos interactivos en formato **JClic** para educación especial (preescolar y primaria).

> CEARTEE: Centro Experimental de Adecuación y Recursos Telemáticos de Educación Especial.

---

## Características

- Juegos educativos JClic organizados por categorías (Lenguajes, Ética/naturaleza/sociedades, De lo humano a comunitario, Saberes y pensamiento científico).
- Perfiles de alumno con avatar y estadísticas independientes.
- Panel docente protegido con contraseña (guardada como hash SHA-256).
- Estadísticas y reportes por juego (aciertos, intentos, tiempo) con opción de imprimir/PDF.
- Multiidioma: Español, Català, English.
- Respaldo: exportar e importar perfiles y estadísticas a un archivo JSON.
- Actualizaciones automáticas firmadas (Tauri updater).
- Funciona 100% sin conexión a internet.

---

## Requisitos

- **Node.js** 18 o superior
- **Rust** (estable) y Cargo — https://rustup.rs
- **Tauri CLI** (se instala con las dependencias del proyecto)
- En Windows: las herramientas de compilación de Visual Studio (C++ Build Tools) y WebView2 (suele venir con Windows 10/11).

---

## Instalación

```
npm install
```

Esto descarga las dependencias de Node. La primera compilación de Rust se hará al ejecutar `dev` o `build`.

---

## Desarrollo

```
npm run dev
```

Abre la aplicación en una ventana de escritorio con recarga. El frontend se sirve directamente desde la carpeta `src` (no se usa Vite).

---

## Compilar para distribución

```
npm run build
```

Genera el instalador en:

```
src-tauri/target/release/bundle/nsis/Murcia_<version>_x64-setup.exe
```

### Firma del updater (necesaria para que funcionen las actualizaciones)

Antes de compilar, define las variables de entorno con tu clave privada (PowerShell):

```
$env:TAURI_SIGNING_PRIVATE_KEY="C:\Users\<usuario>\.tauri\murcia.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD="<contraseña de la clave>"
```

La clave **pública** correspondiente debe estar en `src-tauri/tauri.conf.json` → `plugins.updater.pubkey`. La clave privada y la pública deben ser pareja, de lo contrario la app rechazará la actualización.

Para generar un par de claves nuevo (gratis):

```
npm run tauri signer generate -- -w "%USERPROFILE%\.tauri\murcia.key"
```

---

## Estructura del proyecto

```
Murcia/
├── src/                      Frontend (HTML, CSS, JS) — se sirve tal cual
│   ├── index.html            Inicio / selector de perfiles
│   ├── Etapas.html           Preescolar / Primaria
│   ├── Categorias.html       Categorías de preescolar
│   ├── Lenguajes.html        Listado de juegos (una página por categoría)
│   ├── Etica.html
│   ├── Delohumanoacomunitario.html
│   ├── Saberesypensamientocientifico.html
│   ├── vista.html            Reproductor de juegos JClic
│   ├── Configuracion.html    Ajustes
│   ├── panel-docente.html    Panel del profesor
│   ├── Primaria/             Versiones de primaria
│   ├── assets/               Juegos .jclic.zip e imágenes
│   ├── perfiles.js           Gestión de perfiles + export/import + migración
│   ├── Estadistica.js        Seguimiento de estadísticas y reportes
│   ├── aplicar-config.js     Configuración global e idiomas (i18n)
│   ├── settings.js           Lógica de la pantalla de configuración
│   ├── vista.js              Carga y control del reproductor JClic
│   └── updater.bundle.js     Sistema de actualizaciones (UI)
└── src-tauri/                Backend Rust + configuración Tauri
    ├── src/lib.rs            Plugins y comandos
    ├── tauri.conf.json       Configuración de la app, bundle y updater
    └── capabilities/         Permisos
```

---

## Datos guardados (localStorage)

| Clave | Contenido |
|---|---|
| `appConfig` | Configuración global (idioma, volumen, etc.) |
| `ceartee_perfiles` | Lista de perfiles |
| `ceartee_perfil_activo` | ID del perfil activo |
| `ceartee_perfil_<id>_stats` | Estadísticas por perfil |
| `ceartee_docente_hash` | Hash de la contraseña del panel docente |
| `ceartee_schema_version` | Versión del esquema de datos (para migración) |

---

## Documentación adicional

- [Guía para añadir juegos](GUIA_JUEGOS.md)
- [Historial de cambios](CHANGELOG.md)

---

## Contacto

CEARTEE Sinaloa — https://cearteesinaloa.blogspot.mx
