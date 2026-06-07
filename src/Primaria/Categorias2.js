// Botón volver
const boton2 = document.querySelector('.btn-back');
if (boton2) {
  boton2.addEventListener('click', () => {
    window.location.href = '../Etapas.html';
  });
}

// Categoría puzzle
const puzzle = document.querySelector('.category-card');
if (puzzle) {
  puzzle.addEventListener('click', () => {
    window.location.href = 'Lenguajes2.html';
  });
}



// Función para abrir juegos JClic
function playGame(nombre, rutaZip) {
  const url = 'vista.html?actividad=' + encodeURIComponent(rutaZip) + '&nombre=' + encodeURIComponent(nombre);
  console.log('🎮 Abriendo juego:', url);
  window.location.href = url;
}