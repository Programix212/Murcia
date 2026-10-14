// ==========================================
// SABERES.JS - Primaria
// ==========================================

// Botón "Volver" del header
function goBack() {
  if (window.cearteeNavigate) cearteeNavigate('Categorias2.html');
  else window.location.href = 'Categorias2.html';
}

// Alias por si el HTML usa minúscula
function goback() {
  goBack();
}

function abrirJuego(rutaZip, nombreJuego) {
  const actividad = encodeURIComponent(rutaZip);
  const nombre = encodeURIComponent(nombreJuego);
  const url = '../vista.html?actividad=' + actividad + '&nombre=' + nombre + '&origen=Primaria/Saberes.html';
  if (window.cearteeNavigate) cearteeNavigate(url);
  else window.location.href = url;
}

function filterGames() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const searchTerm = input.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.game-card');
  let visibleCount = 0;

  cards.forEach(card => {
    // Las pendientes (sin juego) siempre ocultas, aunque coincidan con la búsqueda
    if (card.hasAttribute('data-pendiente')) { card.style.display = 'none'; return; }
    const name = (card.dataset.name || '').toLowerCase();
    const titleEl = card.querySelector('.game-title');
    const title = (titleEl ? titleEl.textContent : '').toLowerCase();
    if (name.startsWith(searchTerm) || title.startsWith(searchTerm)) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
  }

  const gameCount = document.getElementById('gameCount');
  if (gameCount) {
    gameCount.textContent = visibleCount;
  }
}

function playGame(nombre, archivo) {
  if (!archivo) {
    console.error('❌ No se especificó archivo');
    return;
  }
  abrirJuego(archivo, nombre);
}
