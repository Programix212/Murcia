const boton3 = document.querySelector('.btn-back');
if (boton3) {
  boton3.addEventListener('click', () => {
    cearteeNavigate("index.html");
  });
}

const Preescolar = document.querySelector('.Btn-button');
if (Preescolar) {
  Preescolar.addEventListener('click', () => {
    cearteeNavigate("Categorias.html");
  });
}

const Primaria = document.querySelector('.Btn-button2');
if (Primaria) {
  Primaria.addEventListener('click', () => {
    cearteeNavigate("./Primaria/Categorias2.html");
  });
}