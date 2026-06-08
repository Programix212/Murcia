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

      const juegosCategoria = juegosPorCategoria[categoria] || [];
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
    console.log('🔄 Actualizando estrellas...');
    
    if (!window.PerfilesManager) {
      console.warn('⚠️ PerfilesManager no disponible, reintentando en 1s...');
      setTimeout(actualizarEstrellasEnDOM, 1000);
      return;
    }

    const perfil = window.PerfilesManager.obtenerPerfilActivo();
    
    if (!perfil) {
      console.warn('⚠️ No hay perfil activo');
      return;
    }

    console.log('👤 Perfil activo:', perfil.nombre);
    
    const categorias = ['lenguajes', 'saberes', 'etica', 'humano'];
    
    categorias.forEach(cat => {
      const data = obtenerEstrellasCategoria(perfil.id, cat);
      const elementos = document.querySelectorAll('.categoria-estrellas[data-categoria="' + cat + '"]');
      
      if (elementos.length === 0) {
        console.warn('⚠️ No se encontró contenedor para:', cat);
        return;
      }
      
      elementos.forEach(el => {
        // Generar estrellas
        el.innerHTML = generarHTMLEstrellas(data.estrellas, 22);
        el.setAttribute('data-juegos-completados', data.completados);
        el.setAttribute('data-estrellas', data.estrellas);
        
        // Agregar contador
        const contador = document.createElement('small');
        contador.className = 'estrellas-contador';
        var idiomaEst = (JSON.parse(localStorage.getItem('appConfig') || '{}').idioma) || 'es';
        var palabraJuego;
        if (idiomaEst === 'en') palabraJuego = data.completados === 1 ? ' game' : ' games';
        else if (idiomaEst === 'ca') palabraJuego = data.completados === 1 ? ' joc' : ' jocs';
        else palabraJuego = data.completados === 1 ? ' juego' : ' juegos';
        contador.textContent = data.completados + palabraJuego;
        el.appendChild(contador);
        
        console.log(`✅ ${cat}: ${data.estrellas}★ (${data.completados} juegos)`);
      });
    });
    
    console.log('⭐ Estrellas actualizadas correctamente');
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
    if (!window.PerfilesManager) return;
    
    const perfil = window.PerfilesManager.obtenerPerfilActivo();
    if (perfil && perfil.id !== ultimoPerfilId) {
      ultimoPerfilId = perfil.id;
      console.log('👤 Cambio de perfil detectado');
      actualizarEstrellasEnDOM();
    }
  }, 2000);

})();
