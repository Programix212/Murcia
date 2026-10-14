// ==========================================
// CATEGORIAS2.JS - Primaria
// ==========================================

// Botón volver → Etapas
const boton2 = document.querySelector('.btn-back');
if (boton2) {
  boton2.addEventListener('click', () => {
    if (window.cearteeNavigate) cearteeNavigate('../Etapas.html');
    else window.location.href = '../Etapas.html';
  });
}

// Función para abrir juegos JClic
function playGame(nombre, rutaZip) {
  const url = '../vista.html?actividad=' + encodeURIComponent(rutaZip) + '&nombre=' + encodeURIComponent(nombre);
  console.log('🎮 Abriendo juego:', url);
  if (window.cearteeNavigate) cearteeNavigate(url);
  else window.location.href = url;
}

// ==========================================
// CONTADOR DE COMPLETADOS (SOLO PRIMARIA)
// Cada nivel cuenta únicamente sus juegos para no mezclar etapas.
// ==========================================
function actualizarContadorCompletados() {
  if (!window.PerfilesManager) return;

  const perfil = window.PerfilesManager.obtenerPerfilActivo();
  if (!perfil) return;

  var total = 0;
  var calculado = false;

  // Vía EstrellasManager (mapa de Primaria en esta página)
  try {
    if (window.EstrellasManager && window.EstrellasManager.obtenerEstrellas) {
      total = 0;
      ['lenguajes', 'saberes', 'etica', 'humano'].forEach(function(cat) {
        try {
          total += (window.EstrellasManager.obtenerEstrellas(perfil.id, cat) || {}).completados || 0;
        } catch (e) {}
      });
      calculado = true;
    }
  } catch (e) {}

  // Respaldo: todos los únicos (comportamiento anterior)
  if (!calculado) {
    try {
      const stats = window.PerfilesManager.obtenerDatos(perfil.id, 'stats', { juegos: {} });
      total = Object.keys(stats.juegosTerminados || {}).length;
    } catch (e) {}
  }

  const contador = document.getElementById('contador-completados');
  if (contador) {
    contador.textContent = total;
  }

  console.log('🎮 Juegos completados (Primaria):', total);
}

// Actualizar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(actualizarContadorCompletados, 1000);
});

// Actualizar cada 2 segundos (por si completa un juego y vuelve)
setInterval(actualizarContadorCompletados, 2000);
