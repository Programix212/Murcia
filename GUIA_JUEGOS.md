# Guía para añadir un juego JClic

Esta guía explica cómo agregar un nuevo juego a CEARTEE - Murcia. El proceso es manual y consiste en 3 pasos: copiar el archivo del juego, copiar su imagen y registrar una tarjeta en el HTML de la categoría.

---

## Antes de empezar: ¿a qué categoría pertenece?

Cada categoría tiene su propia página HTML y su propia carpeta de juegos e imágenes:

| Categoría | Página HTML | Carpeta del juego | Carpeta de imagen |
|---|---|---|---|
| Lenguajes | `src/Lenguajes.html` | `src/assets/juegos/` | `src/assets/img_lenguajes/` |
| Ética, naturaleza y sociedades | `src/Etica.html` | `src/assets/Etica_naturaleza_y_sociedades/` | `src/assets/img_etica/` |
| De lo humano a comunitario | `src/Delohumanoacomunitario.html` | `src/assets/De_lo_humano_a_comunitario_juegos/` | `src/assets/img_humano/` |
| Saberes y pensamiento científico | `src/Saberesypensamientocientifico.html` | `src/assets/Saberes/` | `src/assets/img_Saberes/` |

> Las páginas de **Primaria** están en `src/Primaria/` y siguen la misma lógica.

---

## Paso 1 — Copiar el archivo del juego

Pon el archivo `.jclic.zip` del juego dentro de la carpeta de juegos de su categoría.

Ejemplo (categoría Lenguajes):

```
src/assets/juegos/MiNuevoJuego.jclic.zip
```

Recomendaciones para el nombre del archivo:
- Sin espacios ni acentos (ej. `MiNuevoJuego.jclic.zip`).
- Debe ser un ZIP válido que contenga un proyecto `.jclic` o `.xml` dentro.

---

## Paso 2 — Copiar la imagen (icono) del juego

Pon una imagen (PNG o JFIF) en la carpeta de imágenes de la categoría:

```
src/assets/img_lenguajes/MiNuevoJuego.png
```

Si no pones imagen, la tarjeta usará automáticamente `./assets/img_logos/default.png` (por el `onerror` de la etiqueta).

---

## Paso 3 — Registrar la tarjeta en el HTML

Abre la página de la categoría (ej. `src/Lenguajes.html`), busca la sección donde están las `game-card` y copia este bloque, ajustando los valores:

```html
<!-- Juego nuevo -->
<div class="game-card" data-name="Mi Nuevo Juego" onclick="abrirJuego('assets/juegos/MiNuevoJuego.jclic.zip', 'Mi Nuevo Juego')">
  <div class="game-icon">
    <img src="./assets/img_lenguajes/MiNuevoJuego.png" style="width: 70px;" onerror="this.src='./assets/img_logos/default.png'">
  </div>
  <div class="game-info">
    <h3 class="game-title">Mi Nuevo Juego</h3>
  </div>
</div>
```

Qué cambiar:
- **`data-name`**: el nombre del juego (lo usa el buscador). Debe coincidir con el título.
- **`abrirJuego('RUTA', 'NOMBRE')`**: la ruta al `.jclic.zip` (relativa a `src`) y el nombre que se mostrará al jugar.
- **`img src`**: la ruta a la imagen del juego.
- **`game-title`**: el título visible en la tarjeta.

> Importante: la ruta dentro de `abrirJuego(...)` **no** lleva `./` al inicio (es `assets/juegos/...`), pero la imagen **sí** usa `./assets/...`. Respeta ese formato tal como aparece en las demás tarjetas.

---

## Paso 4 (opcional) — Traducir el nombre del juego

Si quieres que el nombre del juego se traduzca a catalán/inglés, abre `src/aplicar-config.js` y añade una entrada en `nombresJuegos` dentro de cada idioma (`es`, `ca`, `en`):

```js
nombresJuegos: {
  ...
  'Mi Nuevo Juego': 'Mi Nuevo Juego',   // en es
  ...
}
```

Si no lo añades, el nombre se mostrará igual en todos los idiomas (no es un error).

---

## Paso 5 (opcional) — Marcar la última actividad del juego

CEARTEE muestra el reporte final cuando detecta que el alumno terminó la última actividad. Para que lo detecte bien, abre `src/Estadistica.js` y añade el nombre del último ejercicio del juego (su archivo interno, ej. `final.puz`) al arreglo `ULTIMAS_ACTIVIDADES_DICCIONARIO`, en la sección de su categoría.

Esto es opcional: el juego funciona igual sin ello, pero el reporte final saldrá de forma más precisa.

---

## Probar el juego

1. Ejecuta `npm run dev`.
2. Entra a la categoría donde lo agregaste.
3. Haz clic en la tarjeta del nuevo juego y verifica que carga y se puede jugar.

Si la pantalla queda en blanco o da error de carga, revisa:
- Que el `.jclic.zip` no esté dañado y contenga un `.jclic`/`.xml`.
- Que la ruta en `abrirJuego(...)` coincida exactamente con el nombre del archivo (mayúsculas incluidas).
