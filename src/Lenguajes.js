function goBack() {
  cearteeNavigate("Categorias.html");
}

// Texto según idioma (lee appConfig; si falta, español)
function tJuego(clave) {
  try {
    var cfg = JSON.parse(localStorage.getItem('appConfig') || '{}');
    var idioma = cfg.idioma || 'es';
    if (window.textosI18n && window.textosI18n[idioma] && window.textosI18n[idioma][clave]) {
      return window.textosI18n[idioma][clave];
    }
    if (window.textosI18n && window.textosI18n.es && window.textosI18n.es[clave]) {
      return window.textosI18n.es[clave];
    }
  } catch (e) {}
  return clave;
}

// Alias por si el HTML usa minúscula
function goback() {
  goBack();
}

function abrirJuego(rutaZip, nombreJuego) {
    const actividad = encodeURIComponent(rutaZip);
    const nombre = encodeURIComponent(nombreJuego);
    cearteeNavigate(`vista.html?actividad=${actividad}&nombre=${nombre}&origen=Lenguajes.html`);
}

function filterGames() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  
  const searchTerm = input.value.toLowerCase();
  const cards = document.querySelectorAll('.game-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const titleEl = card.querySelector('.game-title');
    const title = (titleEl ? titleEl.textContent : '').toLowerCase();
    if (name.includes(searchTerm) || title.includes(searchTerm)) {
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
  console.log('🎮 Juego:', nombre);
  console.log('📁 Archivo:', archivo);
  
  if (!archivo) {
    console.error('❌ No se especificó archivo');
    alert(tJuego('errorSinArchivo'));
    return;
  }
  
  const url = `vista.html?actividad=${encodeURIComponent(archivo)}&nombre=${encodeURIComponent(nombre)}`;
  console.log('🔗 Redirigiendo a:', url);
  cearteeNavigate(url);
}