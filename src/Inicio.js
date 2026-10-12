document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('btnEnter');

  function irEtapas() {
    try {
      if (typeof window.cearteeNavigate === 'function') {
        window.cearteeNavigate('Etapas.html');
      } else {
        window.location.href = 'Etapas.html';
      }
    } catch (e) {
      window.location.href = 'Etapas.html';
    }
  }

  if (boton) {
    boton.addEventListener('click', irEtapas);
  }
});
