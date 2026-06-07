// ==========================================
// CEARTEE - TRANSICIONES CON FADE (FIX)
// ==========================================

(function() {
  function initFade() {
    var overlay = document.getElementById('ceartee-fade');
    if (!overlay) {
      console.warn('⚠️ No se encontró #ceartee-fade');
      return;
    }

    // Fuerza un pequeño delay para que el WebView pinte el frame oscuro primero
    // y luego haga el fade-in suave
    setTimeout(function() {
      overlay.classList.add('hidden');
      console.log('✅ Fade-in completado');
    }, 80);
  }

  // Esperar al DOM sin importar dónde esté el script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFade);
  } else {
    initFade();
  }

  // Fallback de emergencia: si después de 2 segundos sigue visible, ocultarlo
  setTimeout(function() {
    var ov = document.getElementById('ceartee-fade');
    if (ov && !ov.classList.contains('hidden')) {
      ov.classList.add('hidden');
      console.log('🛡️ Fallback: overlay ocultado por seguridad');
    }
  }, 2000);

  // Navegación global
  window.cearteeNavigate = function(url) {
    var ov = document.getElementById('ceartee-fade');
    if (!ov) {
      window.location.href = url;
      return;
    }
    ov.classList.remove('hidden');
    setTimeout(function() {
      window.location.href = url;
    }, 300);
  };
})();