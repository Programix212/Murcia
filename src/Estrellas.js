// ==========================================
// ESTRELLAS.JS - VERSIÓN CORREGIDA CON RETRY
// ==========================================

(function() {
  console.log('⭐ Estrellas.js cargado');

  // ==========================================
  // CALCULAR ESTRELLAS
  // ==========================================
  function calcularEstrellas(juegosCompletados) {
    if (juegosCompletados >= 15) return 5;
    if (juegosCompletados >= 10) return 4;
    if (juegosCompletados >= 6)  return 3;
    if (juegosCompletados >= 3)  return 2;
    if (juegosCompletados >= 1)  return 1;
    return 0;
  }

  // ==========================================
  // GENERAR HTML
  // ==========================================
  function generarHTMLEstrellas(cantidad, tamaño) {
    tamaño = tamaño || 22;
    let html = '<span class="estrellas-container">';
    
    for (let i = 0; i < 5; i++) {
      if (i < cantidad) {
        html += '<span class="estrella-activa">★</span>';
      } else {
        html += '<span class="estrella-vacia">★</span>';
      }
    }
    
    html += '</span>';
    return html;
  }

  // Idioma guardado de forma segura (appConfig puede estar corrupto)
  function obtenerIdioma() {
    try {
      var c = JSON.parse(localStorage.getItem('appConfig') || '{}');
      return (c && c.idioma) || 'es';
    } catch (e) {
      return 'es';
    }
  }

  // ==========================================
  // MAPEO DE JUEGOS POR CATEGORÍA
  // ==========================================
  const juegosPorCategoria = {
    'lenguajes': [
      '4 Cuentos',
      'Actividad 5 años infantil',
      'Aprende a leer con l,m,s,p,t,n',
      'Aprendo jugando',
      'Caperucita Roja',
      'Diferentes objetos',
      'El pollito Chiqui',
      'El Soldadito de plomo',
      'Iniciación a la lectura',
      'Jack y las habichuelas mágicas',
      'La gaviota de la Coviña',
      'Los cuentos del lobo',
      'Nombre de los animales',
      'Números y letras',
      'Las Vocales'
    ],
    'saberes': [
      'Actinfantil 3 años',
      'Act infantil 4 años',
      'Actividades de orientacion especial',
      'Actividades de lógica 1',
      'Actividades de lógica 2',
      'Actividades de lógica 3',
      'Animales salvajes',
      'Bloques lógicos',
      'Cálculo y Números del 1 al 9',
      'Clic de las medidas',
      'Clic de las posiciones',
      'Conceptos básicos',
      'Contar del 1 al 9',
      'Descomposición de números 0-10',
      'Direccionalidad, colores y formas',
      'El cuento de los números 0-9',
      'El verano',
      'Formas y más formas',
      'Iguales',
      'Jugando con números',
      'Jugando con números 2',
      'Las regletas',
      'Lógica, numeración y lateralidad',
      'Los 3 osos',
      'Nina la gallina',
      'Ordenar tamaños',
      'Producto cartesiano',
      'Secuencias',
      'Series',
      'Sombras',
      'Tiempo, espacio y Cantidad',
      'Uno, dos, tres o ninguno'
    ],
    'etica': [
      'Aprendiendo a reciclar',
      'El elefante y otros grandes',
      'La ratita presumida',
      'Los musicos de bremen',
      'Los medios de transporte',
      'Observa y relaciona',
      'Once upon a time',
      'Otros niños del mundo',
      'Puzzles de animales',
      'Reconocimientos de sonidos'
    ],
    'humano': [
      'Cuento para la tolerancia',
      'Los rincones de la clase'
    ]
  };

  // ==========================================
  // MAPEO DE JUEGOS POR CATEGORÍA — PRIMARIA
  // (Listas reales: cada nivel cuenta SOLO sus juegos.)
  // ==========================================
  const juegosPorCategoriaPrimaria = {
    'lenguajes': [
      "Abecedario",
      "Acentuar 1",
      "Acentuar 2",
      "Act. con letras v, b, mp y mb",
      "Actividades de comprensión lectora",
      "Actividades de lengua castellana",
      "Actividades en ingles 1",
      "Actividades para 6°",
      "Adivina adivinanza 1",
      "Adivina adivinanza 2",
      "Aniclic",
      "Aprendiendo inglés",
      "Caperucita Roja 2",
      "Compujuega con verbos",
      "Conjuga",
      "Dichos",
      "Dos poetas chilenos",
      "El caballo del rey (cuento y lectoescritura)",
      "El cuento de los duendes",
      "El gallo y el carámbano",
      "El otoño",
      "El viento y el sol",
      "Erase una vez 1",
      "Estimulación del lenguaje",
      "Ga-go-gu",
      "Gentilicios",
      "Grupo consonántico palabras trabadas 1",
      "Grupo consonántico palabras trabadas 2",
      "Grupo de palabas con cl",
      "Gusiletras",
      "Inversas",
      "La calesita del bosque",
      "La casa que pedro va hacer",
      "La tortuga presumida",
      "La tortuga taruga",
      "Las herramientas",
      "Las sílabas inversa",
      "Lee y diviertete letras g,j, rr y r",
      "Lengua 1",
      "Lengua 2",
      "Lengua 5° tema 1-5",
      "Lengua 5° tema 10-15",
      "Lengua 5° tema 6-10",
      "Lengua 6° tema 1-5",
      "Lengua 6° tema 11-15",
      "Lengua 6° tema 6-10",
      "Lengua bl y fr",
      "Lengua castellana 1-1",
      "Lengua castellana 1-2",
      "Lengua castellana 2do. ciclo I",
      "Lengua castellana 2do. ciclo II",
      "Lengua castellana 5-II",
      "Lengua castellana 5°",
      "Lengua castellana 6°",
      "Lengua para 3er. ciclo",
      "Letras y sílabas",
      "Los oficios",
      "Navidad",
      "Nombre de los números",
      "Orden alfabético",
      "Ortografia 3er ciclo",
      "Ortografía II",
      "Palabras 4°",
      "Palabras con d,l,m,n,p,s y t",
      "Papá perritos Motas",
      "Partes inversas de la oración",
      "Pedro y el lobo",
      "Pulgarcito",
      "Ricitos de oro",
      "Sílabas",
      "Silabita",
      "Sinónimos y antónimos",
      "Sustantivos y adjetivos",
      "Textos argentinos",
      "Tildes agudas,graves y esdrújulas",
      "Transportes",
      "Vamos a leer I",
      "Ven a leer 1-letras l,m,s y p",
      "Ven a leer 2-letras b,d,h,ll,n,ñ,t y v",
      "Ven a leer 2-letras t, n, d y l",
      "Ven a leer 3-letras ch,f,g,j,k,c,q,r,rr,x,y,z",
      "Ven a leer 3-letras h, b, v y ñ",
      "Ven a leer 4-letras ca,co,cu,que,qui,ga,go,gu",
      "Verbos"
    ],
    'saberes': [
      "0opera",
      "Actividades numeración 1er. ciclo",
      "Bingo matemático",
      "Cálculo mental",
      "Cálculo mental 2°",
      "Cálculo mental para primaria",
      "Circunferencia y cuerpos geométricos",
      "Comprando chucherías",
      "Crucigramas de cálculo",
      "Cuadrados mágicos",
      "Cuadrados y triángulos de 10 y 15",
      "Dividir 3ro",
      "Divisibilidad, divisiones",
      "El algoritmo de la división",
      "El reloj",
      "Fichas escondidas",
      "Fracciones",
      "Fracciones I",
      "Fracciones II",
      "Geometría",
      "Geometría elemental",
      "Las operaciones",
      "Las operaciones II 4°",
      "Las tablas de multiplicar I",
      "Las tablas de multiplicar II",
      "Los dinosaurios",
      "Los numeros racionales",
      "Matemáticas 1 ciclo",
      "Matemáticas 6°",
      "Matemáticas de 4to",
      "Matemáticas de 5to",
      "Matemáticas de 6to",
      "Matemáticas Interface",
      "Matemáticas para 5to",
      "Midiendo el tiempo días, semanas y meses",
      "Múltiplos, divisores y fracciones",
      "Numeración",
      "Numeración 2do. ciclo",
      "Numeración del 1 al 100",
      "Numeración romana",
      "Numeritos 2",
      "Números romanos",
      "Números y operaciones 5°",
      "Oca Matemática",
      "Operaciones con decimales",
      "Pasatiempos matemáticos 1er. ciclo",
      "Pasatiempos matemáticos 2 y 3 ciclo",
      "Potencia",
      "Problemas 2do. ciclo",
      "Problemas para 3er. ciclo",
      "Producto cartesiano",
      "Regletas Cuisenaire",
      "Rejilla matemática",
      "Series numéricas",
      "Simetrías",
      "Sistema métrico decimal",
      "Sumas y restas",
      "Superdominó",
      "Tablas de multiplicar 3°",
      "Tablas de multiplicar JT",
      "Tetravex (Tetrav.)",
      "Vocabulario aritmético básico"
    ],
    'etica': [
      "Alimentos, nacemos, y los animales",
      "El planeta herido",
      "La tierra, el agua, la materia",
      "Los oficios",
      "Profesiones, casas y maquinas",
      "Seres vivos, naturaleza y plantas"
    ],
    'humano': [
      'Cuento para la tolerancia',
      'Los rincones de la clase'
    ]
  };

  // ==========================================
  // DETECTAR SI ESTAMOS EN PRIMARIA
  // ==========================================
  function esPrimaria() {
    try {
      var ruta = (window.location.pathname || '').toLowerCase();
      var href = (window.location.href || '').toLowerCase();
      return ruta.indexOf('/primaria/') !== -1 ||
             href.indexOf('/primaria/') !== -1 ||
             ruta.indexOf('categorias2') !== -1 ||
             href.indexOf('categorias2') !== -1;
    } catch(e) {
      return false;
    }
  }

  // Devuelve el mapeo correcto según el nivel actual
  function obtenerMapeoCategorias() {
    return esPrimaria() ? juegosPorCategoriaPrimaria : juegosPorCategoria;
  }

  // ==========================================
  // CONTAR JUEGOS POR CATEGORÍA
  // ==========================================
  function contarJuegosPorCategoria(perfilId, categoria) {
    try {
      if (!window.PerfilesManager) {
        console.warn('⚠️ PerfilesManager no disponible');
        return 0;
      }

      const stats = window.PerfilesManager.obtenerDatos(perfilId, 'stats', {
        juegos: {}
      });

      const mapeo = obtenerMapeoCategorias();
      const juegosCategoria = mapeo[categoria] || [];
      let completados = 0;

      if (stats.juegos) {
        juegosCategoria.forEach(nombreJuego => {
          if (stats.juegos[nombreJuego]) {
            completados++;
          }
        });
      }

      console.log(`📊 ${categoria}: ${completados}/${juegosCategoria.length} juegos`);
      return completados;
    } catch(e) {
      console.error('❌ Error contando juegos:', e);
      return 0;
    }
  }

  // ==========================================
  // OBTENER ESTRELLAS
  // ==========================================
  function obtenerEstrellasCategoria(perfilId, categoria) {
    const completados = contarJuegosPorCategoria(perfilId, categoria);
    return {
      completados: completados,
      estrellas: calcularEstrellas(completados)
    };
  }

  // ==========================================
  // ACTUALIZAR DOM
  // ==========================================
  function actualizarEstrellasEnDOM() {
    try {
    if (!window.PerfilesManager) {
      setTimeout(actualizarEstrellasEnDOM, 1000);
      return;
    }

    let perfil = null;
    try {
      perfil = window.PerfilesManager.obtenerPerfilActivo();
    } catch (e) {
      perfil = null;
    }

    // ✅ Respaldo: si no hay perfil activo (ej. tras importar), usar el primero
    if (!perfil) {
      try {
        const todos = window.PerfilesManager.obtenerPerfiles();
        if (todos && todos.length > 0) {
          perfil = todos[0];
          if (window.PerfilesManager.seleccionarPerfil) {
            window.PerfilesManager.seleccionarPerfil(perfil.id);
          }
        }
      } catch (e) {}
    }

    if (!perfil) {
      return;
    }
    
    const categorias = ['lenguajes', 'saberes', 'etica', 'humano'];
    
    categorias.forEach(cat => {
      let data;
      try {
        data = obtenerEstrellasCategoria(perfil.id, cat);
      } catch (e) {
        return;
      }
      const elementos = document.querySelectorAll('.categoria-estrellas[data-categoria="' + cat + '"]');
      
      if (elementos.length === 0) {
        return;
      }
      
      elementos.forEach(el => {
        try {
          // Generar estrellas (HTML seguro: solo ★, sin datos de usuario)
          el.innerHTML = generarHTMLEstrellas(data.estrellas, 22);
          el.setAttribute('data-juegos-completados', data.completados);
          el.setAttribute('data-estrellas', data.estrellas);
          
          // Agregar contador
          const contador = document.createElement('small');
          contador.className = 'estrellas-contador';
          var idiomaEst = obtenerIdioma();
          var palabraJuego;
          if (idiomaEst === 'en') palabraJuego = data.completados === 1 ? ' game' : ' games';
          else palabraJuego = data.completados === 1 ? ' juego' : ' juegos';
          contador.textContent = data.completados + palabraJuego;
          el.appendChild(contador);
        } catch (e) {}
      });
    });
    } catch (e) {}
  }

  // ==========================================
  // EXPONER
  // ==========================================
  window.EstrellasManager = {
    calcular: calcularEstrellas,
    generarHTML: generarHTMLEstrellas,
    contarJuegos: contarJuegosPorCategoria,
    obtenerEstrellas: obtenerEstrellasCategoria,
    actualizarDOM: actualizarEstrellasEnDOM
  };

  console.log('✅ EstrellasManager disponible');

  // ==========================================
  // AUTO-ACTUALIZAR CON RETRY
  // ==========================================
  function intentarActualizar(intentos) {
    intentos = intentos || 0;
    
    if (intentos > 10) {
      console.error('❌ No se pudo inicializar estrellas después de 10 intentos');
      return;
    }
    
    if (!window.PerfilesManager) {
      console.log('⏳ Esperando PerfilesManager... (intento ' + (intentos + 1) + ')');
      setTimeout(function() { intentarActualizar(intentos + 1); }, 500);
      return;
    }
    
    actualizarEstrellasEnDOM();
  }

  // Iniciar después de que cargue el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(intentarActualizar, 500);
    });
  } else {
    setTimeout(intentarActualizar, 500);
  }

  // Actualizar cuando cambia el perfil
  let ultimoPerfilId = null;
  setInterval(function() {
    try {
      if (!window.PerfilesManager) return;
      
      const perfil = window.PerfilesManager.obtenerPerfilActivo();
      if (perfil && perfil.id !== ultimoPerfilId) {
        ultimoPerfilId = perfil.id;
        actualizarEstrellasEnDOM();
      }
    } catch (e) {}
  }, 2000);

})();
