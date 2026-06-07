function goBack() {
  cearteeNavigate("Categorias.html");
}

// Alias por si el HTML usa minúscula
function goback() {
  goBack();
}

function abrirJuego(rutaZip, nombreJuego) {
    const actividad = encodeURIComponent(rutaZip);
    const nombre = encodeURIComponent(nombreJuego);
    cearteeNavigate(`vista.html?actividad=${actividad}&nombre=${nombre}&origen=Delohumanoacomunitario.html`);
}

function filterGames() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  
  const searchTerm = input.value.toLowerCase();
  const cards = document.querySelectorAll('.game-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const name = card.dataset.name || '';
    if (name.toLowerCase().includes(searchTerm)) {
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
}

function playGame(nombre, archivo) {
  console.log('🎮 Juego:', nombre);
  console.log('📁 Archivo:', archivo);
  
  if (!archivo) {
    console.error('❌ No se especificó archivo');
    alert('Error: No se especificó el archivo del juego');
    return;
  }
  
  const url = `vista.html?actividad=${encodeURIComponent(archivo)}&nombre=${encodeURIComponent(nombre)}`;
  console.log('🔗 Redirigiendo a:', url);
  cearteeNavigate(url);
}