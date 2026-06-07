document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('btnEnter');
  
  if (boton) {
    boton.addEventListener('click', () => {
      console.log('🔘 Click detectado, navegando a Etapas.html');
      window.location.href = 'Etapas.html';
    });
  } else {
    console.error('❌ No se encontró el botón btnEnter');
  }
});