// ==========================================
// CEARTEE - BURBUJAS CONTINUAS ENTRE PÁGINAS
// ==========================================
// Guarda el momento en que el usuario abrió
// la app por primera vez y calcula el delay
// exacto para que las burbujas nunca se paren.

(function () {
  // Duración de cada burbuja (debe coincidir con animation-duration en CSS)
  var duraciones = [9, 7, 11, 6, 10, 8, 12, 7]; // segundos por burbuja

  // Guardar el timestamp de inicio solo una vez
  if (!localStorage.getItem('burbuja_inicio')) {
    localStorage.setItem('burbuja_inicio', Date.now().toString());
  }

  function aplicarDelays() {
    var spans = document.querySelectorAll('.bg-animation span');
    if (!spans.length) return;

    var inicio = parseInt(localStorage.getItem('burbuja_inicio'), 10);
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
