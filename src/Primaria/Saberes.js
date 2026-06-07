// El botón "volver" del header va a Categorias.html
function goback() {
  window.location.href = 'Categorias2.html';
}

const puzzle = document.querySelector('.header')


puzzle.addEventListener('click',() => { 


    window.location.href="../Primaria/Categorias2.html";



})


function abrirJuego(rutaZip, nombreJuego) {
    const actividad = encodeURIComponent(rutaZip);
    const nombre = encodeURIComponent(nombreJuego);
    // ✅ Pasa origen=Delohumanoacomunitario.html en la URL
    window.location.href = `vista.html?actividad=${actividad}&nombre=${nombre}&origen=Saberes.html`;
}




function filterGames() {
  // 1. Obtenemos el texto del buscador y lo pasamos a minúsculas
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  
  // 2. Obtenemos todas las tarjetas de juego
  const cards = document.getElementsByClassName('game-card');
  const noResults = document.getElementById('noResults');
  let hasResults = false;

  // 3. Recorremos cada tarjeta
  for (let i = 0; i < cards.length; i++) {
    // Usamos el atributo 'data-name' que ya tienes en tu HTML para buscar
    const gameName = cards[i].getAttribute('data-name').toLowerCase();

    if (gameName.includes(filter)) {
      cards[i].style.display = ""; // Muestra la tarjeta
      hasResults = true;
    } else {
      cards[i].style.display = "none"; // Oculta la tarjeta
    }
  }

  // 4. Mostrar o ocultar el mensaje de "No se encontraron juegos"
  if (hasResults) {
    noResults.style.display = "none";
  } else {
    noResults.style.display = "block";
  }
}

function playGame(nombre, archivo) {
  console.log('🎮 Juego:', nombre);
  console.log('📁 Archivo:', archivo);
  
  // Verifica que el archivo no esté vacío
  if (!archivo) {
    console.error('❌ No se especificó archivo');
    alert('Error: No se especificó el archivo del juego');
    return;
  }
  
  // Construye la URL con parámetros
  const url = `vista.html?actividad=${encodeURIComponent(archivo)}&nombre=${encodeURIComponent(nombre)}`;
  
  console.log('🔗 Redirigiendo a:', url);
  
  // Redirige
  window.location.href = url;
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



