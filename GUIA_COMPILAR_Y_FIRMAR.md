# Guía: Compilar, firmar y publicar CEARTEE - Murcia

Esta guía explica cómo compilar el `.exe` firmado, cómo publicar una nueva versión
para el actualizador, y cómo volver a una versión anterior.

> ⚠️ Las contraseñas y claves NO van en este documento. Tu contraseña de la clave
> está en tu archivo personal `Claves contraseñas para las compilaciones exe.txt`.

---

## 0. Archivos y rutas clave (tu configuración actual)

| Cosa | Dónde está |
|---|---|
| Clave privada (firma) | `C:\Users\Young\.tauri\murcia.key` |
| Clave pública (pubkey) | `src-tauri/tauri.conf.json` → `plugins.updater.pubkey` |
| Archivo de versiones online | `latest.json` (en GitHub: `Yolito935/ceartee`) |
| Endpoint del updater | `https://raw.githubusercontent.com/Yolito935/ceartee/main/latest.json` |
| Instalador generado | `src-tauri/target/release/bundle/nsis/Murcia_<version>_x64-setup.exe` |
| Firma generada | el mismo nombre + `.sig` |

---

## 1. Por qué después de `cargo clean` te pide las keys

`cargo clean` borra todo lo compilado (la carpeta `target`). En la siguiente
compilación, Tauri vuelve a compilar **y a firmar** el instalador, por eso necesita
la clave privada y su contraseña.

Esas claves se pasan con **variables de entorno**, y esas variables **solo viven
en la terminal actual**. Si cierras la terminal (o abres una nueva), hay que
volver a ponerlas. Por eso parece que "te las vuelve a pedir".

---

## 2. Compilar el .exe firmado (pasos)

Abre **PowerShell** en la carpeta del proyecto (`C:\Users\Young\Downloads\Murcia`)
y ejecuta, en este orden:

**Paso 1 — Definir la clave privada y la contraseña** (cambia la contraseña por la tuya):

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY="C:\Users\Young\.tauri\murcia.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD="TU_CONTRASEÑA_AQUI"
```

**Paso 2 — Compilar:**

```powershell
npm run build
```

**Paso 3 — Al terminar, busca el resultado en:**

```
src-tauri\target\release\bundle\nsis\
```

Ahí estarán:
- `Murcia_<version>_x64-setup.exe`  → el instalador
- `Murcia_<version>_x64-setup.exe.sig` → la firma

> Si NO defines las variables del Paso 1, el build falla o no genera el `.sig`.
> Si la clave privada no corresponde a la `pubkey` del `tauri.conf.json`, saldrá
> el aviso "secret key does not match public key" y el updater rechazará la
> actualización.

---

## 3. Sacar una NUEVA versión (para que el updater la entregue)

El updater solo actualiza si la versión de `latest.json` es **MAYOR** que la
versión instalada. Así que para publicar una nueva versión:

**Paso 1 — Subir el número de versión en los 4 archivos (deben coincidir):**

| Archivo | Campo |
|---|---|
| `package.json` | `"version"` |
| `src-tauri/tauri.conf.json` | `"version"` |
| `src-tauri/Cargo.toml` | `version` (en `[package]`) |
| `latest.json` | `"version"` |

Ejemplo: si la actual es `1.0.2`, sube todo a `1.0.3`.

**Paso 2 — Compilar firmado** (sección 2 de esta guía):

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY="C:\Users\Young\.tauri\murcia.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD="TU_CONTRASEÑA_AQUI"
npm run build
```

**Paso 3 — Obtener la firma:**
Abre el archivo `Murcia_1.0.3_x64-setup.exe.sig` con el Bloc de notas y **copia
TODO su contenido** (es una línea larga de texto). Esa es la firma.

**Paso 4 — Actualizar `latest.json`:**
Edita el `latest.json` con la versión nueva, la firma nueva y la URL nueva:

```json
{
  "version": "1.0.3",
  "notes": "Descripción de los cambios de esta versión",
  "pub_date": "2026-06-08T00:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "PEGA_AQUI_EL_CONTENIDO_DEL_ARCHIVO_.sig",
      "url": "https://github.com/Yolito935/ceartee/releases/download/v1.0.3/Murcia_1.0.3_x64-setup.exe"
    }
  }
}
```

**Paso 5 — Subir a GitHub:**
1. Crea un **Release** nuevo en GitHub con la etiqueta `v1.0.3`.
2. Sube el archivo `Murcia_1.0.3_x64-setup.exe` a ese release.
3. Sube/actualiza el `latest.json` en la rama `main` del repo (que es lo que lee el endpoint).

**Paso 6 — Probar:**
Abre una instalación con la versión anterior (ej. 1.0.2). A los pocos segundos debe
aparecer el aviso de actualización a 1.0.3.

> Importante: la firma (`.sig`) es única para CADA `.exe`. Si recompilas, cambia.
> Siempre copia la firma del build que vas a subir.

---

## 4. Cómo se hacen las firmas (resumen)

- **No se escriben a mano.** Las genera Tauri al compilar, SIEMPRE que hayas
  definido `TAURI_SIGNING_PRIVATE_KEY` y `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
- La firma queda en el archivo `....exe.sig` junto al instalador.
- Esa firma es la que pegas en `latest.json` → `signature`.
- La app verifica esa firma con la `pubkey` que lleva dentro. Si coinciden, acepta
  la actualización; si no, la rechaza.

### Si necesitas generar un par de claves nuevo (solo si pierdes la actual)

```powershell
npm run tauri signer generate -- -w "$env:USERPROFILE\.tauri\murcia.key"
```

Esto crea `murcia.key` (privada) y `murcia.key.pub` (pública). Si generas claves
nuevas, DEBES reemplazar la `pubkey` en `tauri.conf.json` por la nueva, y las
firmas viejas dejan de servir.

---

## 5. Volver a una versión ANTERIOR (rollback / desactualizar)

El updater **solo avanza** (instala versiones más nuevas). No baja de versión solo.
Tienes dos formas de volver atrás:

### Opción A — Manual (en una computadora)
La más simple si es en pocas máquinas:
1. Desinstala la versión actual (Panel de control → Desinstalar, o el desinstalador).
2. Vuelve a instalar el `.exe` de la versión anterior que tengas guardada
   (por ejemplo `Murcia_1.0.2_x64-setup.exe`).

> Por eso conviene **guardar una copia de cada `.exe`** que publiques.

### Opción B — Forzar el rollback a todos por el updater (truco de versión)
Como el updater solo avanza, no puedes poner `latest.json` en una versión menor y
esperar que baje. El truco es **volver a publicar el código viejo con un número
de versión MÁS ALTO**:

Ejemplo: la versión `1.0.3` salió con un problema y quieres volver al código de `1.0.2`.
1. Toma el **código de la 1.0.2** (el bueno).
2. Súbele la versión a **`1.0.4`** en los 4 archivos.
3. Compílalo firmado (sección 2).
4. Publica `1.0.4` normal (sección 3): release en GitHub + `latest.json` apuntando a 1.0.4.

Resultado: las máquinas en 1.0.3 verán la "1.0.4" (que en realidad es el código
bueno de la 1.0.2) y se actualizarán a ella. Así todos vuelven al código que sirve,
pero "hacia adelante".

> Recomendación: guarda siempre el código fuente de cada versión (por ejemplo con
> Git, una etiqueta/tag por versión) para poder recompilar el código bueno cuando
> necesites hacer este truco.

---

## 6. Checklist rápido para publicar una versión

- [ ] Subí la versión en `package.json`, `tauri.conf.json`, `Cargo.toml` y `latest.json` (todas iguales).
- [ ] Definí `TAURI_SIGNING_PRIVATE_KEY` y `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` en la terminal.
- [ ] Ejecuté `npm run build` sin errores.
- [ ] Copié la firma del archivo `.exe.sig` al `latest.json`.
- [ ] Actualicé la `url` del `latest.json` a la versión nueva.
- [ ] Creé el Release en GitHub con la etiqueta correcta y subí el `.exe`.
- [ ] Actualicé `latest.json` en la rama `main`.
- [ ] Probé que una versión anterior detecta y aplica la actualización.
- [ ] Guardé una copia del `.exe` por si necesito rollback.
```
