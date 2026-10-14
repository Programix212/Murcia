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
  var duraciones = [9, 7, 11, 6, 10, 8, 12, 7, 9, 8, 11, 6]; // segundos por burbuja
  var TOTAL_BURBUJAS = 12;

  // Completar hasta 12 burbujas (el HTML trae 8). Las extra usan posiciones
  // fijas repartidas para un layout estable entre recargas.
  function completarBurbujas() {
    try {
      var cont = document.querySelector('.bg-animation');
      if (!cont) return;
      var actuales = cont.querySelectorAll('span').length;
      if (actuales >= TOTAL_BURBUJAS) return;
      var extras = [
        { w: 70,  left: '30%', top: '60%' },
        { w: 45,  left: '65%', top: '25%' },
        { w: 100, left: '45%', top: '85%' },
        { w: 35,  left: '92%', top: '50%' }
      ];
      for (var i = actuales; i < TOTAL_BURBUJAS; i++) {
        var cfg = extras[(i - 8) % extras.length] || { w: 50, left: '50%', top: '50%' };
        var s = document.createElement('span');
        s.style.width = cfg.w + 'px';
        s.style.height = cfg.w + 'px';
        s.style.left = cfg.left;
        s.style.top = cfg.top;
        cont.appendChild(s);
      }
    } catch (e) {}
  }

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
    document.addEventListener('DOMContentLoaded', function() {
      completarBurbujas();
      aplicarDelays();
    });
  } else {
    completarBurbujas();
    aplicarDelays();
  }
})();
