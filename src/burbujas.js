// ==========================================
// CEARTEE - BURBUJAS CONTINUAS ENTRE PÁGINAS
// ==========================================
// Guarda el momento en que el usuario abrió
// la app por primera vez y calcula el delay
// exacto para que las burbujas nunca se paren.

(function () {
  // Si el usuario desactivó animaciones o el SO pide movimiento reducido,
  // no hacer ningún trabajo: ocultar el contenedor y salir.
  // Esto evita 8 animaciones infinitas en PCs viejas.
  try {
    var cfg = JSON.parse(localStorage.getItem('appConfig') || '{}');
    if (cfg.animaciones === false) {
      var cont = document.querySelector('.bg-animation');
      if (cont) cont.style.display = 'none';
      return;
    }
  } catch (e) {}
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var cont2 = document.querySelector('.bg-animation');
      if (cont2) cont2.style.display = 'none';
      return;
    }
  } catch (e) {}

  // Duración de cada burbuja (debe coincidir con animation-duration en CSS)
  // Solo importan las 4 primeras: el CSS oculta de la 5ª en adelante.
  var duraciones = [9, 7, 11, 6]; // segundos por burbuja

  // Guardar el timestamp de inicio solo una vez
  try {
    if (!localStorage.getItem('burbuja_inicio')) {
      localStorage.setItem('burbuja_inicio', Date.now().toString());
    }
  } catch (e) { return; }

  function aplicarDelays() {
    var spans = document.querySelectorAll('.bg-animation span');
    if (!spans.length) return;

    var inicio;
    try {
      inicio = parseInt(localStorage.getItem('burbuja_inicio'), 10);
    } catch (e) { return; }
    if (!inicio) return;
    var ahora  = Date.now();
    var transcurrido = (ahora - inicio) / 1000; // segundos transcurridos

    spans.forEach(function (span, i) {
      var duracion = duraciones[i] || 8;
      // Calcular en qué punto del ciclo debería estar ahora
      var progreso = transcurrido % duracion;
      // Asignar delay negativo para que arranque desde ese punto
      span.style.animationDelay    = '-' + progreso.toFixed(2) + 's';
      span.style.animationDuration = duracion + 's';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicarDelays);
  } else {
    aplicarDelays();
  }
})();
