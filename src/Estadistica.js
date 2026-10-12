// ==========================================
// ESTADISTICA.JS - VERSIÓN FINAL CON TODOS LOS FIXES
// Rojo + Blanco - Estilo humano
// ==========================================

// 👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇
window.ULTIMAS_ACTIVIDADES_DICCIONARIO = [

  //Lenguajes
  "bp6.puz", "kas1.ass", "n_3.puz", "macepuz.puz", "6peresc.ass",
  "56.ass", "sop1.sop", "epeix.ass", "l.sop", "seca1md.puz",
  "compren7.sop", "personaj.ass", "anim09/24ani203.ass", "manolo12.ass", "series4.ass",
  "triptong.txa", "trompeta.puz", "fruita.sop",

  //Saberes
  "valores1.ass", "familia.puz", "8dir2.ass", "bloc_mc5.ass", "blofcm21.ass",
  "pc_nosw3.ass", "porta.ass", "formes21.ass", "num7_9_9.ass", "pm5plou.puz",
  "pvee0.ass", "6789tris.ass", "comp23.ass", "desco104.ass",
  "nens.puz", "num0g.puz", "parejas.puz", "55.ass", "54.ass",
  "despues.ass", "9joc.ass", "pnu5.puz", "trenca4.puz", "l5.puz",
  "acnina6.puz", "txiki30.puz", "gnoms2.ass", "Secuen79.pac",
  "59.ass", "p5q18.txa", "ass025.ass",

  //Etica
  "Contenedor.ass", "hipulls.ass", "dreta3.ass", "frase20.ass", "tran15.ass",
  "relacio/h.ass", "tele.sop", "boda2.puz", "tucan4.puz", "soni10.ass",

  //Humano
  "orde2.puz", "p312e.puz"
];
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// ==========================================
// VARIABLES GLOBALES
// ==========================================
window.tiempoSegundos           = 0;
window.relojInterval            = null;
window.syncInterval             = null;
window.acumuladorInterval       = null;
window.ultimoScore              = -1;
window.ultimoActions            = -1;
window.prevIdx                  = -1;
window.prevName                 = '';
window.registroActividades      = [];
window.tiempoInicioActividad    = null;
window.ultimaActividadDetectada = '';
window.reporteMostrado          = false;
window.juegoTerminado           = false;
window.datosActividadActual     = { score: 0, actions: 0, maxScore: 0, maxActions: 0, solved: false };
window.totalActividades         = 0;
window.yaIniciado               = false;
window.__escHandlerReporte      = null;

// ==========================================
// HELPER DE TRADUCCIÓN
// ==========================================
function tEst(clave) {
  try {
    const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    const idioma = config.idioma || 'es';
    if (window.textosI18n && window.textosI18n[idioma] && window.textosI18n[idioma][clave]) {
      return window.textosI18n[idioma][clave];
    }
  } catch(e) {}
  return clave;
}

// ==========================================
// ✅ REGISTRAR ESTADÍSTICA (DEFINIDA AL INICIO - FIX)
// ==========================================
function registrarEstadistica(juego, acierto, error, tiempoSegundos) {
  console.log('🎯 registrarEstadistica LLAMADA:', { juego, acierto, error, tiempoSegundos });
  
  try {
    const perfil = window.PerfilesManager?.obtenerPerfilActivo();
    if (!perfil) {
      console.warn('⚠️ No hay perfil activo');
      return;
    }

    const stats = window.PerfilesManager.obtenerDatos(perfil.id, 'stats', {
      juegosCompletados: 0,
      totalAciertos: 0,
      totalErrores: 0,
      mejorPuntuacion: 0,
      mejorRacha: 0,
      tiempoTotal: 0,
      ultimaActividad: null,
      juegos: {}
    });

    // Actualizar contadores generales
    stats.juegosCompletados = (stats.juegosCompletados || 0) + 1;
    stats.totalAciertos = (stats.totalAciertos || 0) + acierto;
    stats.totalErrores = (stats.totalErrores || 0) + error;
    stats.tiempoTotal = (stats.tiempoTotal || 0) + tiempoSegundos;
    stats.ultimaActividad = new Date().toISOString();

    // Calcular puntuación
    const totalIntentos = acierto + error;
    const puntuacion = totalIntentos > 0 ? Math.round((acierto / totalIntentos) * 100) : 0;
    
    if (puntuacion > (stats.mejorPuntuacion || 0)) {
      stats.mejorPuntuacion = puntuacion;
    }

    // ✅ FIX: Inicializar stats.juegos si es undefined
    if (!stats.juegos || typeof stats.juegos !== 'object') {
      stats.juegos = {};
    }

    // Actualizar stats del juego específico
    if (!stats.juegos[juego]) {
      stats.juegos[juego] = {
        vecesJugado: 0,
        mejorPuntuacion: 0,
        totalAciertos: 0,
        totalErrores: 0,
        mejorTiempo: null,
        ultimaVez: null
      };
    }

    const juegoStats = stats.juegos[juego];
    juegoStats.vecesJugado = (juegoStats.vecesJugado || 0) + 1;
    juegoStats.totalAciertos = (juegoStats.totalAciertos || 0) + acierto;
    juegoStats.totalErrores = (juegoStats.totalErrores || 0) + error;
    juegoStats.ultimaVez = new Date().toISOString();
    
    if (puntuacion > juegoStats.mejorPuntuacion) {
      juegoStats.mejorPuntuacion = puntuacion;
    }
    
    if (!juegoStats.mejorTiempo || tiempoSegundos < juegoStats.mejorTiempo) {
      juegoStats.mejorTiempo = tiempoSegundos;
    }

    // Guardar stats
    window.PerfilesManager.guardarDatos(perfil.id, 'stats', stats);
    console.log('💾 Stats guardadas. Total juegos:', stats.juegosCompletados);

    // ✅ ACTUALIZAR ESTRELLAS
    if (window.EstrellasManager && window.EstrellasManager.actualizarDOM) {
      setTimeout(function() {
        window.EstrellasManager.actualizarDOM();
        console.log('⭐ Estrellas actualizadas');
      }, 100);
    }

    // ✅ ACTUALIZAR FOOTER DE ESTADÍSTICAS
    if (typeof window.actualizarFooterStats === 'function') {
      setTimeout(function() {
        window.actualizarFooterStats();
        console.log('📊 Footer actualizado');
      }, 150);
    }

    console.log('✅ Estadística registrada:', juego, `${puntuacion}%`);
  } catch(e) {
    console.error('❌ Error registrando estadística:', e);
  }
}

// ✅ EXPONER GLOBALMENTE AL INICIO
window.registrarEstadistica = registrarEstadistica;
console.log('✅ registrarEstadistica disponible globalmente');

// ==========================================
// BUSCAR JCLIC
// ==========================================
function getJClic() {
  if (window.JClicObject) return window.JClicObject;
  try {
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow && iframes[i].contentWindow.JClicObject) {
        return iframes[i].contentWindow.JClicObject;
      }
    }
  } catch(e) {}
  try {
    for (let i = 0; i < window.frames.length; i++) {
      if (window.frames[i] && window.frames[i].JClicObject) {
        return window.frames[i].JClicObject;
      }
    }
  } catch(e) {}
  return null;
}

// ==========================================
// VERIFICAR DICCIONARIO
// ==========================================
function esActividadFinal(nombreActividad) {
  if (!nombreActividad) return false;
  if (nombreActividad.length < 3) return false;

  const nombreLower = nombreActividad.toLowerCase().trim();

  return window.ULTIMAS_ACTIVIDADES_DICCIONARIO.some(entrada => {
    const entradaLower = entrada.toLowerCase().trim();
    if (nombreLower === entradaLower) return true;
    if (nombreLower.endsWith('/' + entradaLower)) return true;
    if (entradaLower.includes('/') && nombreLower === entradaLower) return true;
    return false;
  });
}

// ==========================================
// FINALES POR JUEGO (nombres genéricos que se repetirían en otros juegos,
// ej. "1.txa"). Aquí van por título exacto del juego.
// ==========================================
window.FINALES_POR_JUEGO = {
  '4 Cuentos': ['bp6.puz'],
  'Actividad 5 años infantil': ['kas1.ass'],
  'Aprende a leer con l,m,s,p,t,n': ['n_3.puz'],
  'Aprendiendo a reciclar': ['contenedor.ass'],
  'Actividades para 6°': ['8.txa'],
  'Caperucita Roja 2': ['sig01c.txa'],
  'Dichos': ['mesos.sop'],
  'El caballo del rey (cuento y lectoescritura)': ['memori.puz'],
  'El cuento de los duendes': ['rompedu.crw'],
  'Gusiletras': ['todic.ass'],
  'La casa que pedro va hacer': ['conte9.txa'],
  'Lee y diviertete letras g,j, rr y r': ['pagrr18.ass'],
  'Lengua castellana 5°': ['15le10.txa', '15le09.txa'],
  'Lengua castellana 6°': ['labriego.txa'],
  'Lengua 5° tema 10-15': ['5hontas1.puz'],
  'Lengua 5° tema 6-10': ['5cafe10.puz'],
  'Lengua 6° tema 1-5': ['6meni5.puz'],
  'Lengua 6° tema 11-15': ['6toyst15.puz'],
  'Lengua 6° tema 6-10': ['6mar10.puz'],
  'Navidad': ['nav_o1.ass'],
  'Orden alfabético': ['puzle9.puz'],
  'Ortografia 3er ciclo': ['simpsons.puz'],
  '0opera': ['d89.ass'],
  'Comprando chucherías': ['chuche23.ass'],
  'Diferentes objetos': ['56.ass'],
  'Dividir 3ro': ['u.txa'],
  'Las operaciones': ['d89.ass'],
  'Múltiplos, divisores y fracciones': ['frac20.puz'],
  'Números y operaciones 5°': ['d8.txa'],
  'Oca Matemática': ['tirade17.ass'],
  'Los medios de transporte 2': ['tran15.ass'],
  'Losmediosdetransporte2': ['tran15.ass'],
  'Observa y relaciona': ['relacio/h.ass'],
  'Once upon a time': ['tele.sop'],
  'Otros niños del mundo': ['boda2.puz'],
  'Contar del 1 al 9': ['comp23.ass'],
  'Descomposición de números 0-10': ['desco104.ass'],
  'El verano': ['parejas.puz'],
  'Formas y más formas': ['55.ass'],
  'Los 3 osos': ['l5.puz'],
  'Nina la gallina': ['acnina6.puz'],
  'Ordenar tamaños': ['txiki30.puz'],
  'Producto cartesiano': ['gnoms2.ass'],
  'Series': ['lluna.puz'],
  'Sombras': ['59.ass'],
  'Tiempo espacio y Cantidad': ['p5q18.txa'],
  'Acentuar 2': ['rompe3.puz'],
  'Act. con letras v, b, mp y mb': ['fin.puz'],
  'Actividades de comprensión lectora': ['trompeta.puz'],
  'Actividades de lengua castellana': ['2alhambr.puz'],
  'Actividades en ingles 1': ['fruita.sop'],
  'Adivina adivinanza 2': ['adis05.sop'],
  'Aniclic': ['a508.puz'],
  'Caperucita Roja 2': ['sig01c.txa'],
  'Compujuega con verbos': ['irconimp.txa'],
  'Grupo consonántico palabras trabadas 1': ['talleres/frutchil.txa'],
  'Grupo consonántico palabras trabadas 2': ['acti7l.puz'],
  'Gusiletras': ['todic.ass'],
  'La calesita del bosque': ['calesita.puz'],
  'Lengua castellana 1-2': ['1ar204.puz'],
  'Lengua castellana 2do. ciclo I': ['2ninping.puz'],
  'Lengua castellana 2do. ciclo II': ['patio.puz'],
  'Lengua para 3er. ciclo': ['conobvi6.ass'],
  'Letras y sílabas': ['elefant.puz'],
  'Los oficios': ['oficis.sop'],
  'Silabita': ['rompe2.puz'],
  'Ven a leer 3-letras h, b, v y ñ': ['ordenadofin.puz'],
  'Ven a leer 4-letras ca,co,cu,que,qui,ga,go,gu': ['texqfin.ass'],
  'Cálculo mental': ['div1a.ass'],
  'Cálculo mental 2°': ['calc08.ass'],
  'Cálculo mental para primaria': ['mcs14fr.ass'],
  'Geometría': ['cuerpos1.crw'],
  'Geometría elemental': ['texto.txa'],
  'Matemáticas 1 ciclo': ['tximele.ass'],
  'Matemáticas de 4to': ['nidopuz.puz'],
  'Matemáticas para 5to': ['po8a.ass'],
  'Numeritos 2': ['hula.puz'],
  'Operaciones con decimales': ['euros.ass'],
  'Pasatiempos matemáticos 1er. ciclo': ['p8.ass'],
  'Potencia': ['mayymen.txa'],
  'Series numéricas': ['se100r9.ass'],
  'Ortografía II': ['pantasi.ass'],
  'Ortografia II': ['pantasi.ass'],
  'Ortografía 2': ['pantasi.ass'],
  'Ortografia 2': ['pantasi.ass'],
  'Partes inversas de la oración': ['esclocuc.ass'],
  'Problemas 2do. ciclo': ['euro36.txa'],
  'Problemas para 3er. ciclo': ['pro20.txa'],
  'Simetrías': ['simc3.ass'],
  'Sistema métrico decimal': ['l120.puz'],
  'Tablas de multiplicar 3°': ['t9c.ass'],
  'Tablas de multiplicar JT': ['tabl14_1.ass'],
  'Vocabulario aritmético básico': ['opera2.txa'],
  'Alimentos, nacemos, y los animales': ['5_12.puz'],
  'El planeta herido': ['pangea2u.ass'],
  'La tierra, el agua, la materia': ['10_8.puz'],
  'Pedro y el lobo': ['cuerda1.sop'],
  'Ricitos de oro': ['rinxols2.sop'],
  'Sílabas': ['2n12.ass'],
  'Sinónimos y antónimos': ['anto5.txa'],
  'Transportes': ['acolumna.txa'],
  'Ven a leer 2-letras t, n, d y l': ['t6fin.ass'],
  'Ven a leer 3-letras h, b, v y ñ': ['ordenadofin.puz'],
  'Ven a leer 4-letras ca,co,cu,que,qui,ga,go,gu': ['texqfin.ass'],
  'Verbos': ['irfin.sop'],
  'Actividades numeración 1er. ciclo': ['3cen21.puz'],
  'Cálculo mental 2°': ['calc08.ass'],
  'Cálculo mental para primaria': ['mcs14fr.ass'],
  'Geometría elemental': ['texto.txa'],
  'Las operaciones II 4°': ['d8.ass'],
  'Las tablas de multiplicar II': ['oper4.ass'],
  'Numeración': ['n56.txa'],
  'Numeración romana': ['r410.ass'],
  'Números y operaciones 5°': ['d8.txa'],
  'Matemáticas de 6to': ['org21.ass'],
  'Cuadrados y triángulos de 10 y 15': ['2tr1510.ass'],
};

// Actividades que NUNCA disparan estadística aunque parezcan finales
// (ej. menús/pantallas intermedias donde el reporte estorba).
window.EXCLUIR_FIN_POR_JUEGO = {
  'Lengua castellana 6°': ['vocabver.ass', 'verbo.ass'],
  'Ortografía II': ['0panta.ass'],
  'Ortografia II': ['0panta.ass'],
  'Ortografía 2': ['0panta.ass'],
  'Ortografia 2': ['0panta.ass'],
  'Pedro y el lobo': ['trenca4.puz'],
  'Ricitos de oro': ['trenca5b.puz', 'trenca4.puz'],
  'Transportes': ['ttierra.ass'],
  'Ven a leer 4-letras ca,co,cu,que,qui,ga,go,gu': ['fra1.puz', 'sop1.sop'],
  'Cuadrados y triángulos de 10 y 15': ['tri1510.ass'],
  'Matemáticas de 6to': ['frac69b.ass', 'inf6.ass'],
  'Matemáticas para 5to': ['menu.ass'],
};

// Actividades donde NO se finaliza al resolverlas (el reporte saldría
// encima de la misma pantalla); solo al SALIR de ellas con Siguiente.
window.SIN_REPORTE_AL_RESOLVER = {
  'Verbos': ['irfin.sop'],
};

function sinReporteAlResolver(nombreActividad) {
  try {
    var titulo = '';
    var h1 = document.getElementById('gameTitle');
    if (h1) titulo = (h1.textContent || '').trim();
    if (!titulo || !nombreActividad) return false;
    var n = String(nombreActividad).toLowerCase().trim();
    for (var juego in window.SIN_REPORTE_AL_RESOLVER) {
      if (tituloCoincide(titulo, juego)) {
        var lista = window.SIN_REPORTE_AL_RESOLVER[juego] || [];
        for (var i = 0; i < lista.length; i++) {
          if (n === String(lista[i]).toLowerCase().trim()) return true;
        }
      }
    }
  } catch (e) {}
  return false;
}

// ==========================================
// FINAL SOLO EN ACTIVIDAD (el reporte solo salta aquí; puede haber VARIAS
// por juego: cada una dispara una vez, con lo acumulado hasta ese punto).
// - 'Lengua castellana 6°': solo tras labriego.txa.
// - 'Lengua castellana 5°': tras 15le10.txa y 15le09.txa.
// - 'Navidad': solo tras nav_o1.ass.
// - 'Ortografía II': solo tras pantasi.ass (0panta.ass nunca es final).
// La barra (aciertos/intentos/tiempo) SIEMPRE se muestra y cuenta TODAS
// las actividades para no mover la interfaz ni perder conteo.
// En estos juegos se ignora el "último por índice": solo el nombre
// permitido dispara el final, así las intermedias nunca lo disparan.
// ==========================================
window.STATS_SOLO_EN_ACTIVIDAD = {
  'Lengua castellana 5°': ['15le10.txa', '15le09.txa'],
  'Lengua castellana 6°': ['labriego.txa'],
  'Lengua 5° tema 10-15': ['5hontas1.puz'],
  'Lengua 5° tema 6-10': ['5cafe10.puz'],
  'Lengua 6° tema 1-5': ['6meni5.puz'],
  'Lengua 6° tema 11-15': ['6toyst15.puz'],
  'Lengua 6° tema 6-10': ['6mar10.puz'],
  'Navidad': ['nav_o1.ass'],
  'Ortografia 3er ciclo': ['simpsons.puz'],
  '0opera': ['d89.ass'],
  'Comprando chucherías': ['chuche23.ass'],
  'Diferentes objetos': ['56.ass'],
  'Dividir 3ro': ['u.txa'],
  'Las operaciones': ['d89.ass'],
  'Múltiplos, divisores y fracciones': ['frac20.puz'],
  'Números y operaciones 5°': ['d8.txa'],
  'Oca Matemática': ['tirade17.ass'],
  'Numeritos 2': ['hula.puz'],
  'Operaciones con decimales': ['euros.ass'],
  'Pasatiempos matemáticos 1er. ciclo': ['p8.ass'],
  'Potencia': ['mayymen.txa'],
  'Problemas 2do. ciclo': ['euro36.txa'],
  'Problemas para 3er. ciclo': ['pro20.txa'],
  'Series numéricas': ['se100r9.ass'],
  'Observa y relaciona': ['relacio/h.ass'],
  'Once upon a time': ['tele.sop'],
  'Otros niños del mundo': ['boda2.puz'],
  'Contar del 1 al 9': ['comp23.ass'],
  'Descomposición de números 0-10': ['desco104.ass'],
  'El verano': ['parejas.puz'],
  'Formas y más formas': ['55.ass'],
  'Los 3 osos': ['l5.puz'],
  'Nina la gallina': ['acnina6.puz'],
  'Ordenar tamaños': ['txiki30.puz'],
  'Producto cartesiano': ['gnoms2.ass'],
  'Series': ['lluna.puz'],
  'Sombras': ['59.ass'],
  'Tiempo espacio y Cantidad': ['p5q18.txa'],
  'Acentuar 2': ['rompe3.puz'],
  'Act. con letras v, b, mp y mb': ['fin.puz'],
  'Actividades de comprensión lectora': ['trompeta.puz'],
  'Actividades de lengua castellana': ['2alhambr.puz'],
  'Actividades en ingles 1': ['fruita.sop'],
  'Adivina adivinanza 2': ['adis05.sop'],
  'Aniclic': ['a508.puz'],
  'Caperucita Roja 2': ['sig01c.txa'],
  'Compujuega con verbos': ['irconimp.txa'],
  'Grupo consonántico palabras trabadas 1': ['talleres/frutchil.txa'],
  'Grupo consonántico palabras trabadas 2': ['acti7l.puz'],
  'Gusiletras': ['todic.ass'],
  'La calesita del bosque': ['calesita.puz'],
  'Lengua castellana 1-2': ['1ar204.puz'],
  'Lengua castellana 2do. ciclo I': ['2ninping.puz'],
  'Lengua castellana 2do. ciclo II': ['patio.puz'],
  'Lengua para 3er. ciclo': ['conobvi6.ass'],
  'Letras y sílabas': ['elefant.puz'],
  'Los oficios': ['oficis.sop'],
  'Silabita': ['rompe2.puz'],
  'Ven a leer 3-letras h, b, v y ñ': ['ordenadofin.puz'],
  'Ven a leer 4-letras ca,co,cu,que,qui,ga,go,gu': ['texqfin.ass'],
  'Cálculo mental': ['div1a.ass'],
  'Cálculo mental 2°': ['calc08.ass'],
  'Cálculo mental para primaria': ['mcs14fr.ass'],
  'Geometría': ['cuerpos1.crw'],
  'Geometría elemental': ['texto.txa'],
  'Matemáticas 1 ciclo': ['tximele.ass'],
  'Matemáticas de 4to': ['nidopuz.puz'],
  'Matemáticas para 5to': ['coorden.txa'],
  'Matemáticas de 5to': ['po8a.ass'],
  'Simetrías': ['simc3.ass'],
  'Tablas de multiplicar JT': ['tabl14_1.ass'],
  'Vocabulario aritmético básico': ['opera2.txa'],
  'La tierra, el agua, la materia': ['10_8.puz'],
  '4 Cuentos': ['bp6.puz'],
  'Actividad 5 años infantil': ['kas1.ass'],
  'Aprende a leer con l,m,s,p,t,n': ['n_3.puz'],
  'Los medios de transporte 2': ['tran15.ass'],
  'Losmediosdetransporte2': ['tran15.ass'],
  'Ortografía II': ['pantasi.ass'],
  'Ortografia II': ['pantasi.ass'],
  'Ortografía 2': ['pantasi.ass'],
  'Ortografia 2': ['pantasi.ass'],
};

// ==========================================
// VOLVER REPORTA (el reporte sale al REGRESAR a un menú/tablero)
// Ej. 'Bingo matemático': tiene 6 bingos (Serie1/2/3/TODOS) y el botón
// azul "volver" regresa a un menú. Cada vez que se vuelve desde una
// actividad jugable a un menú/tablero, sale el reporte con lo acumulado.
// Volver de menú a menú no dispara (un solo reporte por jugada).
// ==========================================
window.VOLVER_REPORTA_POR_JUEGO = {
  'Bingo matemático': [
    'bingomat.ass', 'triabing.ass',
    'bincap.ass', 'tricarca.ass', 'bindec.ass', 'tricarde.ass',
    'binfrac.ass', 'tricarfr.ass', 'binlon.ass', 'tricarlo.ass',
    'binpes.ass', 'tricarpe.ass', 'bintem.ass', 'tricarte.ass'
  ],
  // menu2.ass es el menú central: al volver a él desde una tabla jugada
  // sale el reporte con lo acumulado (port2.ass es la portada inicial).
  'Las tablas de multiplicar I': ['port2.ass', 'menu2.ass'],
  // menumat.ass es el menú central (sale 3 veces): reporte cada vez que se
  // vuelve a él (o a un submenú de sección) desde una actividad jugada.
  // pantmat.ass es la portada inicial.
  'Matemáticas 6°': ['pantmat.ass', 'menumat.ass'],
  // menu.ass es el menú central (se vuelve a él tras cada sección):
  // reporte cada vez que se vuelve desde una actividad jugada.
  'Pasatiempos matemáticos 2 y 3 ciclo': ['portada.ass', 'menu.ass'],
};

function listaVolverMenus() {
  try {
    var titulo = obtenerTituloJuegoActual();
    if (!titulo) return null;
    for (var juego in window.VOLVER_REPORTA_POR_JUEGO) {
      if (tituloCoincide(titulo, juego)) {
        return window.VOLVER_REPORTA_POR_JUEGO[juego] || [];
      }
    }
    try {
      var orig = (sessionStorage.getItem('juego_nombre') || window.__ultimoNombreJuego || '').trim();
      if (orig) {
        for (var juego2 in window.VOLVER_REPORTA_POR_JUEGO) {
          if (tituloCoincide(orig, juego2)) {
            return window.VOLVER_REPORTA_POR_JUEGO[juego2] || [];
          }
        }
      }
    } catch (e) {}
  } catch (e) {}
  return null;
}

function esMenuVolver(nombreActividad) {
  var menus = null;
  try { menus = listaVolverMenus(); } catch (e) {}
  if (!menus || !nombreActividad) return false;
  var n = String(nombreActividad).toLowerCase().trim();
  for (var i = 0; i < menus.length; i++) {
    var m = String(menus[i]).toLowerCase().trim();
    if (n === m || n.endsWith('/' + m)) return true;
  }
  return false;
}

// ==========================================
// SALIR REPORTA (el reporte sale al SALIR de la actividad, en cada visita)
// A diferencia de los finales por nombre (una sola vez), aquí SÍ se repite:
// la actividad se repite en el juego (ej. present.ass abre cada tabla) y
// el reporte sale tras cada una con lo acumulado.
// ==========================================
window.SALIR_REPORTA_POR_JUEGO = {
};

function listaSalirReporta() {
  try {
    var titulo = obtenerTituloJuegoActual();
    if (!titulo) return null;
    for (var juego in window.SALIR_REPORTA_POR_JUEGO) {
      if (tituloCoincide(titulo, juego)) {
        return window.SALIR_REPORTA_POR_JUEGO[juego] || [];
      }
    }
    try {
      var orig = (sessionStorage.getItem('juego_nombre') || window.__ultimoNombreJuego || '').trim();
      if (orig) {
        for (var juego2 in window.SALIR_REPORTA_POR_JUEGO) {
          if (tituloCoincide(orig, juego2)) {
            return window.SALIR_REPORTA_POR_JUEGO[juego2] || [];
          }
        }
      }
    } catch (e) {}
  } catch (e) {}
  return null;
}

function enListaSalir(nombreActividad) {
  var lista = null;
  try { lista = listaSalirReporta(); } catch (e) {}
  if (!lista || !nombreActividad) return false;
  var n = String(nombreActividad).toLowerCase().trim();
  for (var i = 0; i < lista.length; i++) {
    var m = String(lista[i]).toLowerCase().trim();
    if (n === m || n.endsWith('/' + m)) return true;
  }
  return false;
}

function normalizarTitulo(s) {
  try {
    return String(s || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    return String(s || '').trim().toLowerCase();
  }
}

function tituloCoincide(titulo, clave) {
  if (!titulo || !clave) return false;
  if (titulo === clave) return true;
  if (titulo.indexOf(clave) !== -1) return true;
  // Comparación sin acentos ni mayúsculas (Ortografía II = Ortografia II)
  try {
    var nt = normalizarTitulo(titulo);
    var nc = normalizarTitulo(clave);
    if (nt === nc || nt.indexOf(nc) !== -1) return true;
  } catch (e) {}
  return false;
}

function obtenerTituloJuegoActual() {
  try {
    var h1 = document.getElementById('gameTitle');
    if (h1 && (h1.textContent || '').trim()) return (h1.textContent || '').trim();
  } catch (e) {}
  try {
    var s = sessionStorage.getItem('juego_nombre');
    if (s && s.trim()) return s.trim();
  } catch (e) {}
  try {
    if (window.__ultimoNombreJuego) return String(window.__ultimoNombreJuego).trim();
  } catch (e) {}
  return '';
}

function listaStatsPermitida() {
  try {
    var titulo = obtenerTituloJuegoActual();
    if (!titulo) return null;
    for (var juego in window.STATS_SOLO_EN_ACTIVIDAD) {
      if (tituloCoincide(titulo, juego)) {
        return window.STATS_SOLO_EN_ACTIVIDAD[juego] || [];
      }
    }
    // También comparar con el nombre original guardado (por si el título está traducido)
    try {
      var orig = (sessionStorage.getItem('juego_nombre') || window.__ultimoNombreJuego || '').trim();
      if (orig && orig !== titulo) {
        for (var juego2 in window.STATS_SOLO_EN_ACTIVIDAD) {
          if (tituloCoincide(orig, juego2)) {
            return window.STATS_SOLO_EN_ACTIVIDAD[juego2] || [];
          }
        }
      }
    } catch (e) {}
  } catch (e) {}
  return null;
}

function actividadPermiteStats(nombreActividad) {
  var lista = listaStatsPermitida();
  if (!lista) return true; // juego sin restricción: todo permite stats
  if (!nombreActividad) return false;
  var n = String(nombreActividad).toLowerCase().trim();
  for (var i = 0; i < lista.length; i++) {
    var permitido = String(lista[i]).toLowerCase().trim();
    if (n === permitido || n.endsWith('/' + permitido)) return true;
  }
  return false;
}

function aplicarVisibilidadStats(nombreActividad) {
  // La barra SIEMPRE visible para no mover la interfaz (layout shift).
  // Antes se ocultaba con display:none en menú/verbo.ass y eso desplazaba
  // el juego. Ahora se fuerza visible y se cuentan todas las actividades.
  try {
    var panel = document.querySelector('.stats-panel');
    if (!panel) return;
    panel.style.display = '';
    panel.style.visibility = 'visible';
  } catch (e) {}
}

function excluidaDelFin(nombreActividad) {
  try {
    var titulo = '';
    var h1 = document.getElementById('gameTitle');
    if (h1) titulo = (h1.textContent || '').trim();
    if (!titulo || !nombreActividad) return false;
    var n = String(nombreActividad).toLowerCase().trim();
    for (var juego in window.EXCLUIR_FIN_POR_JUEGO) {
      if (tituloCoincide(titulo, juego)) {
        var lista = window.EXCLUIR_FIN_POR_JUEGO[juego] || [];
        for (var i = 0; i < lista.length; i++) {
          if (n === String(lista[i]).toLowerCase().trim()) return true;
        }
      }
    }
  } catch (e) {}
  return false;
}
try {
  var nF = Object.keys(window.FINALES_POR_JUEGO).length;
  var exc6 = (window.EXCLUIR_FIN_POR_JUEGO && window.EXCLUIR_FIN_POR_JUEGO['Lengua castellana 6°']) || [];
  console.log('📋 Finales por juego activos:', nF, Object.keys(window.FINALES_POR_JUEGO).join(' | '), '| excluidas 6°:', exc6.join(','));
} catch (e) {}

// Finales ya reportados en esta sesión (permite varios reportes por juego:
// cada actividad final dispara una sola vez, sin repetirse al cerrar).
function yaReportado(nombreActividad) {
  try {
    var lista = window.__finalesReportados || [];
    var n = String(nombreActividad || '').toLowerCase().trim();
    for (var i = 0; i < lista.length; i++) {
      if (String(lista[i]).toLowerCase().trim() === n) return true;
    }
  } catch (e) {}
  return false;
}
function marcarReportado(nombreActividad) {
  try {
    if (!window.__finalesReportados) window.__finalesReportados = [];
    if (nombreActividad && !yaReportado(nombreActividad)) {
      window.__finalesReportados.push(nombreActividad);
    }
  } catch (e) {}
}

function esFinalDelJuego(nombreActividad) {
  if (excluidaDelFin(nombreActividad)) return false;
  if (esActividadFinal(nombreActividad)) return true;
  try {
    var titulo = '';
    var h1 = document.getElementById('gameTitle');
    if (h1) titulo = (h1.textContent || '').trim();
    if (!titulo || !nombreActividad) return false;
    var n = String(nombreActividad).toLowerCase().trim();
    for (var juego in window.FINALES_POR_JUEGO) {
      if (tituloCoincide(titulo, juego)) {
        var lista = window.FINALES_POR_JUEGO[juego] || [];
        for (var i = 0; i < lista.length; i++) {
          if (n === String(lista[i]).toLowerCase().trim()) return true;
        }
      }
    }
  } catch (e) {}
  return false;
}

// ==========================================
// ACTUALIZAR PANEL
// ==========================================
function actualizarPanel(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;
  const txt = String(valor);
  if (el.textContent !== txt) {
    el.textContent = txt;
    el.classList.remove('aumento');
    void el.offsetWidth;
    el.classList.add('aumento');
  }
}

// ==========================================
// RELOJ
// ==========================================
function iniciarReloj() {
  try {
    var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    if (config.autoTimer === false) {
      console.log('⏱️ Temporizador desactivado');
      actualizarPanel('tiempo', '--:--');
      return;
    }
  } catch(e) {}

  if (window.relojInterval) clearInterval(window.relojInterval);
  window.tiempoSegundos = 0;
  window.relojInterval = setInterval(() => {
    window.tiempoSegundos++;
    const m  = String(Math.floor(window.tiempoSegundos / 60)).padStart(2, '0');
    const s  = String(window.tiempoSegundos % 60).padStart(2, '0');
    actualizarPanel('tiempo', `${m}:${s}`);
  }, 1000);
}

// ==========================================
// OBTENER DATOS
// ==========================================
function obtenerNombreActividad(JClic) {
  try {
    const p   = JClic.currentPlayers?.[0];
    const seq = p?.project?.activitySequence;
    const idx = seq?.currentAct ?? -1;
    if (idx >= 0 && seq?.elements?.[idx]) {
      const e = seq.elements[idx];
      const nombre = (e?.activity || e?.activityName || e?.name || '').trim();
      if (nombre) return nombre;
    }
    return (p?.actPanel?.act?.name || '').trim();
  } catch(e) { return ''; }
}

function obtenerSecuencia(JClic) {
  try { return JClic?.currentPlayers?.[0]?.project?.name || 'Juego'; } 
  catch(e) { return 'Juego'; }
}

// ==========================================
// ACUMULADOR
// ==========================================
function iniciarAcumulador() {
  if (window.acumuladorInterval) clearInterval(window.acumuladorInterval);
  window.acumuladorInterval = setInterval(() => {
    const JClic = getJClic();
    if (!JClic) return;
    try {
      const p = JClic.currentPlayers?.[0];
      if (!p) return;
      const cv = p.counterVal;
      const scoreAhora = parseInt(cv?.score ?? p.score ?? 0) || 0;
      const actionsAhora = parseInt(cv?.actions ?? p.actions ?? 0) || 0;
      if (scoreAhora > window.datosActividadActual.maxScore) window.datosActividadActual.maxScore = scoreAhora;
      if (actionsAhora > window.datosActividadActual.maxActions) window.datosActividadActual.maxActions = actionsAhora;
      if (p?.actPanel?.solved || p?.actPanel?.act?.solved) window.datosActividadActual.solved = true;
    } catch(e) {}
  }, 300);
}

// ==========================================
// REGISTRAR ACTIVIDAD
// ==========================================
function registrarActividad(nombre, datos, tiempoActividad) {
  if (!nombre) return;
  // Portadas/menús ignorados por juego (ej. Matemáticas 6°): no aparecen
  // en el reporte ni cuentan en los totales.
  try {
    if (typeof ignoradaEnReporte === 'function' && ignoradaEnReporte(nombre)) return;
  } catch (e) {}
  // Se registran TODAS las demás actividades para que la estadística
  // cuente el juego completo. El filtro solo aplica al disparo del
  // reporte final, no al registro.
  if (window.registroActividades.find(r => r.actividad === nombre)) return;

  const score  = datos?.maxScore || 0;
  const solved = datos?.solved   || false;
  let puntuacion = solved ? 100 : [0, 50, 60, 70, 80, 90][score] || 100;
  if (!solved && score <= 5) puntuacion = [0, 50, 60, 70, 80, 90][score];

  const t    = tiempoActividad || 0;
  const minR = String(Math.floor(t / 60)).padStart(2, '0');
  const secR = String(t % 60).padStart(2, '0');

  const JClic = getJClic();
  window.registroActividades.push({
    secuencia  : obtenerSecuencia(JClic),
    actividad  : nombre,
    correcta   : (solved || score > 0) ? 'Sí' : 'No',
    acciones   : score,
    puntuacion : puntuacion,
    tiempo     : t,
    tiempoFmt  : `${minR}:${secR}`
  });
  
  console.log('📋 Registrada:', nombre);
}

// Actividades que NO se cuentan en el reporte (portadas/menús que saldrían
// con 0% y ensucian la estadística). Solo aplica al juego indicado.
// Ej. 'Matemáticas 6°': pantmat/menumat/aritmenu/medimenu/geomenu no aparecen.
window.IGNORAR_EN_REPORTE_POR_JUEGO = {
  'Circunferencia y cuerpos geométricos': ['por_clic.ass', 'becosos.puz'],
  'Comprando chucherías': ['menu.ass'],
  'Tetravex (Tetrav.)': ['porta.ass', 'porta1.ass', 'porta2.ass', 'porta3.ass', 'porta4.ass'],
  'Tablas de multiplicar 3°': ['titulo.ass', 'autor.ass', 'indice.ass'],
  'Superdomino': ['superdom.ass', 'domino1.ass'],
  'Sumas y restas': ['indice.ass'],
  'Crucigramas de cálculo': ['inici00.ass', 'iniciar.ass'],
  'Cuadrados mágicos': ['presenta.ass', 'triarqua.ass'],
  'Cuadrados y triángulos de 10 y 15': ['quatria.ass', 'triaqua.ass'],
  'Dividir 3ro': ['x1.ass', 'x2.ass', 'x6.ass'],
  'Divisibilidad, divisiones': ['pres.ass', 'myd.ass', 'criini.ass', 'cri2.ass', 'cri4.ass', 'cri3.ass', 'cri9.ass', 'cri5.ass', 'cri25.ass', 'cri10.ass', 'cri100.ass', 'cri11.ass', 'primos.ass', 'erat1.ass', 'erat2.ass', 'erat3.ass', 'erat4.ass', 'erat5.ass', 'erat6.ass', 'erat7.ass', 'compues.ass', 'cricomp.ass', 'cri6.ass', 'mcm.ass', 'mcd.ass'],
  'El algoritmo de la división': ['presdiv1.ass', 'presdiv2.ass'],
  'El reloj': ['port1.ass', 'menu1.ass', 'rellocat.ass', 'rellana.ass', 'relldig.ass', 'relojcas.ass', 'rellang.ass'],
  'Operaciones con decimales': ['presen.ass', 'menuoper.ass', 'fin.ass'],
  'Pasatiempos matemáticos 1er. ciclo': ['pplu.ass', 'fin.ass'],
  'Potencia': ['tapa.ass', 'fin.ass'],
  'Problemas 2do. ciclo': ['portada.ass', 'contra.ass'],
  'Problemas para 3er. ciclo': ['titolpl.txa', 'iniciaci.ass'],
  'Regletas Cuisenaire': ['regla0.ass'],
  'Rejilla matemática': ['presenta.ass', 'graelles/triapac.ass'],
  'Fichas escondidas': ['fitxes.ass', 'triarcol/triarfit.ass'],
  'Fracciones': ['presenta.ass', 'fracc1.ass', 'equiv0.ass', 'orden0.ass', 'reduc0.ass', 'produc0.ass'],
  'Fracciones I': ['entrada.ass'],
  'Fracciones II': ['entrada.ass', 'fracci00.ass', 'fracci03.ass', 'fracci06.ass', 'fracci08.ass'],
  'Geometría': ['geometri.ass', 'menu.ass', 'salida.ass'],
  'Geometría elemental': ['portada.txa', 'fin.txa'],
  'Las operaciones': ['titulo.ass', 'autor.ass', 'indice.ass'],
  'Las operaciones II 4°': ['titulo.ass', 'autor.ass', 'indice.ass'],
  'Las tablas de multiplicar I': ['port2.ass', 'menu2.ass'],
  'Las tablas de multiplicar II': ['presen.ass', 'menu.ass'],
  'Los dinosaurios': ['presenta.ass', 'intro.ass', 'acabo.ass'],
  'Midiendo el tiempo días, semanas y meses': ['portal.ass'],
  'Numeración': ['num.ass', 'autor.ass', 'indice.ass'],
  'Numeración 2do ciclo': ['mnum.ass', 'opciones.ass', 'num20/m21pres.ass', 'num2cif/presen.ass', 'num3cif/presen2.ass', 'num4cif/m3cpres.ass', 'num6cif/m21pres.ass', 'numsexto/m21pres.ass'],
  'Numeración del 1 al 100': ['prin_num.ass', 'menu_nu.ass'],
  'Numeración romana': ['menu.ass'],
  'Matemáticas Interface': ['interfac.ass', 'mates.ass'],
  'Matemáticas de 6to': ['inf6.ass', 'inf6a.', 'inf6n.ass', 'inf62.ass', 'inf63.ass', 'inf64.ass', 'inf65.', 'inf66.ass', 'inf67.ass', 'inf68.ass', 'inf69.ass', 'inf610.ass', 'inf611.ass', 'inf612.ass', 'inf613.ass', 'inf614.ass', 'inf615.ass', 'inf616.ass', 'final.ass'],
  'Matemáticas para 5to': ['pormatq.ass', 'aclar1.ass', 'interfac.ass', 'menu.ass', 'divinf1.ass', 'pesinf.ass', 'longif.ass', 'tsmd13.ass', 'suppant.ass', 'rectinfo.ass', 'poliedin.ass', 'fracmenu.ass', 'graftem.txa'],
  'Matemáticas de 4to': ['portmat4.ass', 'cantidad.txa', '4finmat2.ass'],
  'Matemáticas 1 ciclo': ['aurke1.ass', 'aurke.ass'],
  'Los números racionales': ['present2.ass', 'justiq3.ass', 'justifq2.ass'],
  'Matemáticas 6°': ['pantmat.ass', 'menumat.ass', 'aritmenu.ass', 'medimenu.ass', 'geomenu.ass'],
  'Pasatiempos matemáticos 2 y 3 ciclo': ['portada.ass', 'menu.ass'],
  'Simetrías': ['portada.ass', 'menu.ass'],
  'Tablas de multiplicar JT': ['present.ass', 'present1.ass'],
  'Vocabulario aritmético básico': ['portada.ass', 'menu.ass'],
  'La tierra, el agua, la materia': ['pmun5b.ass', 'autor.ass', 'indice.ass'],
  '0opera': ['indice.ass', 'titulo.ass', 'autor.ass'],
  '4 Cuentos': ['portasa.ass', 'porgra.ass', 'finn.ass'],
  'Cálculo mental 2°': ['fin.ass', 'menu.ass'],
  'Cálculo mental': ['portada.ass', 'menu.ass'],
  'Cálculo mental para primaria': ['portada.ass', 'grupx.ass', 'fip72.ass', 'adeu.ass'],
  'Actividades numeración 1er. ciclo': ['portada.ass', 'menu.ass'],
  'Bingo matemático': ['bingomat.ass', 'triabing.ass', 'tricarde.ass', 'bindec.ass', 'binfrac.ass', 'tricarfr.ass', 'bintem.ass', 'tricarte.ass', 'binlon.ass', 'tricarlo.ass', 'binpes.ass', 'tricarpe.ass', 'bincap.ass', 'tricarca.ass'],
  'Actividad 5 años infantil': ['presein.ass', 'libros.txa', 'fini.ass'],
  'Actividades en ingles 1': ['pantall0.ass', 'choose1.ass'],
  'Actividades para 6°': ['presen.txa', '19a.ass', 'ppoe.ass'],
  'Adivina adivinanza 1': ['adivina.ass'],
  'Adivina adivinanza 2': ['porta.ass', 'fin.ass'],
  'Aniclic': ['porta.txa', 'porta1.txa', 'porta2.txa', 'porta3.txa', 'porta4.txa'],
  'Caperucita Roja 2': ['menu0.ass', 'ppl.ass'],
  'Compujuega con verbos': ['index.ass', 'cierre.puz', 'bibli.puz'],
  'Conjuga': ['portada3.ass', 'autor.ass', 'indice.ass'],
  'Dichos': ['portada.ass'],
  'Dos poetas chilenos': ['inicio.ass', 'info2.ass', 'present.ass'],
  'El caballo del rey (cuento y lectoescritura)': ['treball.ass', 'menu.ass'],
  'El cuento de los duendes': ['duen01.ass', 'duend01.ass', 'duendes1.txa', 'duendes2.txa', 'duendes3.txa', 'duendes4.txa', 'duendes5.txa', 'duendes6.txa', 'duendes7.txa', 'menudu.ass'],
  'El gallo y el carámbano': ['portada.ass'],
  'El otoño': ['presen.txa'],
  'El viento y el sol': ['inicia.ass', 'viento1.ass'],
  'Erase una vez 1': ['portada.ass'],
  'Estimulación del lenguaje': ['presenta.ass', 'menu.ass'],
  'Ga-go-gu': ['1.ass'],
  'Gentilicios': ['portada.ass', '16len01.ass'],
  'Grupo consonántico palabras trabadas 1': ['comienzo.ass', 'termino.ass'],
  'Grupo consonántico palabras trabadas 2': ['portadal.ass', 'fi.ass'],
  'Grupo de palabas con cl': ['presenta.ass', 'present.ass'],
  'Gusiletras': ['inicio.ass'],
  'Inversas': ['inicio.ass', 'menuas.ass'],
  'La calesita del bosque': ['presenta.ass', 'sueno1.ass', 'sueno2.ass', 'sueno3.ass', 'findonso.ass', 'finde.ass'],
  'La casa que pedro va hacer': ['portada.ass', 'portada1.ass'],
  'La tortuga presumida': ['inicio.ass', 'poema.ass'],
  'La tortuga taruga': ['comienzo.ass', 'cuento.ass', 'cuento2.ass', 'cuento3.ass', 'fin.ass'],
  'Las herramientas': ['logo.ass', 'menu.ass'],
  'Las sílabas inversa': ['presen.ass'],
  'Lee y diviertete letras g,j, rr y r': ['pr.ass', 'pa2.ass'],
  'Lengua 1': ['primera.ass', 'segunda.ass'],
  'Lengua 2': ['maite.ass'],
  'Lengua 5° tema 1-5': ['5menu1.ass'],
  'Lengua castellana 5°': ['lengua.ass', 'menu.ass', 'tema15.ass', '15jugad.ass'],
  'Lengua 5° tema 10-15': ['5menu3.ass', '5tapa11.ass', '5tapa12.ass', '5tapa13.ass', '5tapa14.ass', '5tapa15.ass'],
  'Lengua 5° tema 6-10': ['5menu2.ass', '5tapa6.ass', '5tapa7.ass', '5tapa8.ass', '5tapa9.ass', '5tapa10.ass'],
  'Lengua 6° tema 1-5': ['6tapa1.ass', '6tapa2.ass', '6tapa3.ass', '6tapa4.ass', '6tapa5.ass'],
  'Lengua 6° tema 11-15': ['6menu3.ass', '6tapa11.ass', '6tapa12.ass', '6tapa13.ass', '6tapa14.ass', '6tema15.ass'],
  'Lengua 6° tema 6-10': ['6menu2.ass', '6tapa6.ass', '6tapa7.ass', '6tapa8.ass', '6tapa9.ass', '6tapa10.ass'],
  'Lengua bl y fr': ['presenta.ass'],
  'Lengua castellana 1-1': ['prese1.ass', '1menu1.ass'],
  'Lengua castellana 1-2': ['prese1.ass', '1menu2.ass', 'fini.ass'],
  'Lengua castellana 2do. ciclo I': ['2ciclo1.ass', 'presec1.ass', 'fini1.ass'],
  'Lengua castellana 2do. ciclo II': ['fini2.ass', 'presec2.ass', '2ciclo.ass'],
  'Lengua castellana 5-II': ['port.ass', 'menul5.ass'],
  'Lengua castellana 6°': ['port2.ass', 'smillan.ass', 'menulen6.ass'],
  'Lengua para 3er. ciclo': ['prese3.ass', 'presenta.ass', 'fini3.ass'],
  'Letras y sílabas': ['inicio.ass', 'primera.ass', 'fin.ass'],
  'Los oficios': ['portada.ass', 'inici.ass', 'fi.ass'],
  'Navidad': ['praerre.ass', 'presnav.ass'],
  'Nombre de los números': ['nombres.ass'],
  'Orden alfabético': ['portada.ass', 'inicio.ass'],
  'Ortografia 3er ciclo': ['tapa.ass'],
  'Ortografía II': ['0panta.ass', 'iniciar0.ass', 'iniciar.ass'],
  'Ortografia II': ['0panta.ass', 'iniciar0.ass', 'iniciar.ass'],
  'Ortografía 2': ['0panta.ass', 'iniciar0.ass', 'iniciar.ass'],
  'Ortografia 2': ['0panta.ass', 'iniciar0.ass', 'iniciar.ass'],
  'Palabras 4': ['palabras.ass', 'autor.ass'],
  'Palabras con d,l,m,n,p,s y t': ['portada.ass', 'menu.ass'],
  'Papá perritos Motas': ['portada.ass', 'menu.ass'],
  'Partes inversas de la oración': ['iniciar.ass', 'activid.puz'],
  'Pedro y el lobo': ['lloper00.ass', 'llope000.ass'],
  'Pulgarcito': ['portada.ass', 'menupatu.ass'],
  'Ricitos de oro': ['portada.ass', 'porta2.ass'],
  'Sílabas': ['inici.ass', 'tria.ass'],
  'Silabita': ['presenta.ass', 'fin.ass'],
  'Sinónimos y antónimos': ['portada.ass', 'menu.ass'],
  'Sustantivos y adjetivos': ['caratu2.ass', 'cartu2.ass', 'caratula.ass'],
  'Tildes agudas, graves y esdrújulas': ['portada.ass'],
  'Transportes': ['portada.ass', 'menu0.ass', 'taire.ass', 'tmar.ass', 'ttierra.ass'],
  'Vamos a leer I': ['pre.ass', '17fin.ass'],
  'Ven a leer 1-letras l,m,s y p': ['inicio.ass', 'menu.ass'],
  'Ven a leer 2-letras b,d,h,ll,n,ñ,t y v': ['leer2.ass', 'menu2.ass'],
  'Ven a leer 2-letras t, n, d y l': ['portada.ass', 'arranque.ass', 'fin.ass'],
  'Ven a leer 3-letras ch,f,g,j,k,c,q,r,rr,x,y,z': ['incio.ass', 'inicio.ass', 'menu.ass'],
  'Ven a leer 3-letras h, b, v y ñ': ['portada.ass', 'arranque.ass', 'fin.ass'],
  'Ven a leer 4-letras ca,co,cu,que,qui,ga,go,gu': ['fin.ass', 'portada.ass', 'arranque.ass'],
  'Verbos': ['verbos.ass'],
  'Aprende a leer con l,m,s,p,t,n': ['menu.ass'],
  'Aprendo jugando': ['portadaa.ass', 'informac.ass'],
  'Caperucita Roja': ['portclic.ass', 'menucapu.ass'],
  'Diferentes objetos': ['portadab.ass', 'menua.ass'],
  'El pollito Chiqui': ['portada.ass', 'presen.ass'],
  'El Soldadito de plomo': ['eportaca.ass'],
  'Iniciación a la lectura': ['tapa.ass', 'tapa2.ass'],
  'Jack y las habichuelas mágicas': ['sejackco.ass', 'seinijac.ass', 'setrenca.ass', 'seogtren.ass', 'seapar.ass'],
  'La gaviota de la Coviña': ['portada1.ass', 'encruci.ass'],
  'Los cuentos del lobo': ['present.ass'],
  'Nombre de los animales': ['entrada.ass', 'entrada2.ass'],
  'Números y letras': ['proyecto.ass', 'menu.ass'],
  'Las Vocales': ['inicio.ass', 'clima.ass', 'animo.ass', 'saludo.ass', 'menu.ass'],
  'Aprendiendo a reciclar': ['portada.ass', 'final.ass'],
  'Elefante y otros grandes': ['begin1s.ass', 'begins.ass'],
  'La ratita presumida': ['portada.ass', 'index.ass'],
  'Laratitapresumida': ['portada.ass', 'index.ass'],
  'Los musicos de bremen': ['musics0.ass'],
  'Los músicos de Bremen': ['musics0.ass'],
  'Los medios de transporte 2': ['portada.ass', 'fin.ass'],
  'Losmediosdetransporte2': ['portada.ass', 'fin.ass'],
  'Observa y relaciona': ['portada.ass', 'inifig.ass', 'infig.ass', 'inipar.ass', 'iniqf.ass', 'inicanv.ass', 'inidif.ass', 'inirel.ass', 'relacio/adeu.ass'],
  'Once upon a time': ['portada.ass', 'fin.puz'],
  'Otros niños del mundo': ['presin1.ass', 'fini1.ass', 'final.ass'],
  'Puzzle de animales': ['portada1.ass'],
  'Reconocimiento de sonidos': ['portada.ass'],
  'Reconocimientodesonidos': ['portada.ass'],
  'Cuento para la tolerancia': ['aut.ass', 'fin.ass', 'pres.ass'],
  'Los rincones de la clase': ['begin.ass'],
  'Alimentos, nacemos, y los animales': ['p_tie_4a.ass', 'autor.ass', 'indice.ass'],
  'El planeta herido': ['menum3.ass', 'menuma.ass'],
  'Los oficios': ['portada.ass', 'inici.ass', 'fi.ass'],
  'Profesiones, casas y maquinas': ['inicio.ass', 'menu.ass', 'salida.ass'],
  'Seres vivos, naturaleza y plantas': ['pmun5a.ass', 'autor.ass', 'indice.ass'],
  'Abecedario': ['portada.ass'],
  'Acentuar 1': ['portfin.ass'],
  'Acentuar 2': ['portada.ass', 'fin.ass'],
  'Act. con letras v, b, mp y mb': ['portada.ass', 'portv.ass'],
  'Actividades de comprensión lectora': ['comes0.ass', 'comes00.ass'],
  'Actividades de lengua castellana': ['presec2.ass', '2ciclo.ass', 'fini2.ass'],
  'Actinfantil 3 años': ['presein.ass', 'libros3.txa', 'imenu3.ass', 'finii3.ass'],
  'Actinfantil 4 años': ['presein.ass', 'libros4.txa', 'imenu4.ass', 'fini.ass'],
  'Actividades de orientacion especial': ['titol.ass', 'menu.ass'],
  'Actividades de lógica 1': ['present1.ass', 'bloc_1.ass'],
  'Actividades de lógica 2': ['present2.ass', 'bloc_2.ass'],
  'Actividades de lógica 3': ['presenta.ass', 'pcartesi.ass', 'pcarte2.ass'],
  'Animales salvajes': ['portada0.ass', 'portada1.ass', 'portada2.ass', 'portada3.ass', 'portada4.ass', 'portada5.ass', 'portada6.ass', 'portada7.ass', 'portada8.ass'],
  'Bloques lógicos': ['forma0.ass'],
  'Cálculo y Números del 1 al 9': ['portada1.ass', 'paquets.ass', 'pac_p5.ass', 'port_fi9.ass'],
  'Clic de las medidas': ['portmid.ass', 'midess.ass'],
  'Clic de las posiciones': ['portpos.ass', 'posicio0.ass', 'aprene0.ass'],
  'Conceptos básicos': ['presencb.ass', 'menucb.ass'],
  'Contar del 1 al 9': ['titol.ass', 'subtit.ass'],
  'Descomposición de números 0-10': ['descompo.ass', 'descomp2.ass'],
  'Direccionalidad colores y formas': ['portada.ass', 'pacs.ass'],
  'El cuento de los números 0-9': ['numtitol.ass', 'nombres.ass'],
  'El verano': ['portada.ass', 'adios.ass'],
  'Formas y más formas': ['portada.ass', 'menu.ass'],
  'Iguales': ['portada.ass', 'menu.ass', 'final.ass'],
  'Jugando con números': ['portada.ass', 'creditos.ass'],
  'Jugando con números 2': ['jocport.ass'],
  'Las regletas': ['port.ass', 'menurg.ass'],
  'Lógica numeración y lateralidad': ['portada.ass', 'escollir.ass', 'nivell2.ass'],
  'Lógica, numeración y lateralidad': ['portada.ass', 'escollir.ass', 'nivell2.ass'],
  'Los 3 osos': ['portada.ass', 'titol.ass'],
  'Nina la gallina': ['presnina.ass', 'Nina_gallina.panel_info', 'Nina_gallina.panel_info_2', 'Nina_gallina.panel_info_3', 'Nina_gallina.panel_info_4', 'Nina_gallina.panel_info_5', 'Nina_gallina.panel_info_6', 'Nina_gallina.panel_info_7'],
  'Ordenar tamaños': ['portada.ass', 'menu.ass', 'agur.ass'],
  'Producto cartesiano': ['portada.ass'],
  'Secuencias': ['portada.ass', 'secuen.ass', 'secuen78/secuen78.ass'],
  'Series': ['inici.ass', 'fi.ass'],
  'Sombras': ['portada.ass', 'menu.ass'],
  'Tiempo espacio y Cantidad': ['presenta.ass', 'menucu.ass', 'mp5teq.ass', 'fi.ass'],
  'Uno dos tres o ninguno': ['ass001.ass'],
  'Uno, dos, tres o ninguno': ['ass001.ass'],
  'Numeritos 2': ['pantnume.ass', 'nom3.ass', 'findenum.ass'],
  'Números y operaciones 5°': ['autor.ass', 'indice.ass'],
  'Sistema métrico decimal': ['menu.ass', 'portada2.ass', 'menu1.ass', 'menu2.ass', 'menu3.ass']
};

function ignoradaEnReporte(nombreActividad) {
  try {
    if (!nombreActividad) return false;
    var titulo = obtenerTituloJuegoActual();
    if (!titulo) return false;
    var n = String(nombreActividad).toLowerCase().trim();
    for (var juego in window.IGNORAR_EN_REPORTE_POR_JUEGO) {
      if (tituloCoincide(titulo, juego)) {
        var lista = window.IGNORAR_EN_REPORTE_POR_JUEGO[juego] || [];
        for (var i = 0; i < lista.length; i++) {
          var e = String(lista[i]).toLowerCase().trim();
          if (n === e || n.endsWith('/' + e)) return true;
        }
      }
    }
  } catch (e) {}
  return false;
}

// Juegos donde NUNCA aparece estadística (ni reporte, ni avisos, ni conteo).
window.JUEGOS_SIN_STATS = [
];

function juegoSinStats() {
  try {
    var titulo = '';
    var h1 = document.getElementById('gameTitle');
    if (h1) titulo = (h1.textContent || '').trim();
    if (!titulo) {
      try { titulo = (sessionStorage.getItem('juego_nombre') || '').trim(); } catch (e) {}
    }
    if (!titulo) return false;
    for (var i = 0; i < window.JUEGOS_SIN_STATS.length; i++) {
      if (tituloCoincide(titulo, window.JUEGOS_SIN_STATS[i])) return true;
    }
  } catch (e) {}
  return false;
}

// ==========================================
// FINALIZAR JUEGO
// ==========================================
function finalizarJuego() {
  if (window.juegoTerminado) return;

  // Sin nada jugado no hay reporte: se omite sin marcar terminado para no
  // bloquear los reportes de cuando sí juegue.
  if (!window.registroActividades || window.registroActividades.length === 0) {
    console.log('⏭️ Sin actividades registradas, no hay reporte.');
    return;
  }
  window.juegoTerminado = true;

  // Juegos vetados: no registrar nada ni mostrar nada.
  try {
    if (juegoSinStats()) {
      console.log('⏭️ Juego sin estadísticas, se omite el final.');
      return;
    }
  } catch (e) {}

  console.log('🏁 Finalizando juego...');
  
  // ✅ ACTUALIZAR ESTRELLAS
  if (window.EstrellasManager) {
    window.EstrellasManager.actualizarDOM();
  }
  
  // ✅ REGISTRAR ESTADÍSTICA
  try {
    const nombreJuego = document.getElementById('gameTitle')?.textContent || 'Juego';
    const totalActs = window.registroActividades.length;
    const correctas = window.registroActividades.filter(r => r.correcta === 'Sí').length;
    const totalAcciones = window.registroActividades.reduce((s, r) => s + r.acciones, 0);
    // Si hay varios reportes por juego, solo se suma el tiempo NUEVO desde
    // el reporte anterior (evita contar la sesión completa dos veces).
    const totalTiempo = Math.max(0, (window.tiempoSegundos || 0) - (window.__tiempoYaReportado || 0));
    window.__tiempoYaReportado = window.tiempoSegundos || 0;
    
    if (window.PerfilesManager?.obtenerPerfilActivo()) {
      window.registrarEstadistica(
        nombreJuego,
        correctas,
        totalAcciones - correctas,
        totalTiempo
      );
      console.log('📊 Estadística final registrada');
    }
  } catch(e) {
    console.warn('Error registrando estadística final:', e);
  }
  
  // Notificaciones
  try {
    var totalActs = window.registroActividades.length;
    var correctas = window.registroActividades.filter(function(r) { return r.correcta === 'Sí'; }).length;
    var puntMedia = totalActs > 0 ? Math.round(window.registroActividades.reduce(function(s, r) { return s + r.puntuacion; }, 0) / totalActs) : 0;
    var nombreJuego = document.getElementById('gameTitle')?.textContent || '';
    
    if (window.Notificaciones) {
      window.Notificaciones.registrarJuego(nombreJuego, puntMedia, window.tiempoSegundos, correctas, totalActs);
    }
  } catch(e) {
    console.warn('Error notificaciones:', e);
  }

  setTimeout(mostrarReporteFinal, 10);
}

function mostrarPuntuacionTiempoReal() {
  try {
    var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    if (config.realtimeStats === false) return false;
  } catch(e) {}
  return true;
}

// ==========================================
// SINCRONIZACIÓN
// ==========================================
function iniciarSync() {
  if (window.syncInterval) clearInterval(window.syncInterval);

  window.syncInterval = setInterval(() => {
    const JClic = getJClic();
    if (!JClic) return;

    try {
      const p = JClic.currentPlayers?.[0];
      if (!p) return;

      const seq = p.project?.activitySequence;
      if (!seq?.elements?.length) return;

      if (window.totalActividades === 0) {
        window.totalActividades = seq.elements.length;
        console.log('✅ Total de actividades:', window.totalActividades);
      } else if (seq.elements.length > window.totalActividades) {
        // La secuencia puede crecer al resolver paquetes: tomar el máximo
        // para no confundir una actividad intermedia con la última.
        window.totalActividades = seq.elements.length;
        console.log('✅ Total de actividades actualizado:', window.totalActividades);
      }

      // El índice solo es confiable si la secuencia dejó de crecer
      // (5 lecturas iguales = 1 segundo estable). Si el reproductor la
      // arma por partes, un total parcial haría pasar una intermedia por última.
      var nSeq = seq.elements.length;
      if (window.__seqLen !== nSeq) {
        window.__seqLen = nSeq;
        window.__seqEstable = 1;
      } else {
        window.__seqEstable = (window.__seqEstable || 1) + 1;
      }
      var indiceConfiable = (window.__seqEstable >= 5);

      const currentIdx  = seq.currentAct ?? -1;
      const currentName = obtenerNombreActividad(JClic);

      if (!currentName || currentName.length < 2) return;

      // La barra siempre visible y contando (no se oculta para no mover la UI).
      try { if (typeof aplicarVisibilidadStats === 'function') aplicarVisibilidadStats(currentName); } catch (e) {}

      // ¿Este juego tiene final restringido? (ej. Lengua 6° solo labriego.txa)
      var juegoRestringido = false;
      var permiteActual = true;
      try {
        juegoRestringido = (typeof listaStatsPermitida === 'function' && listaStatsPermitida() !== null);
        permiteActual = (typeof actividadPermiteStats === 'function') ? actividadPermiteStats(currentName) : true;
      } catch (e) {}

      const cv      = p.counterVal;
      const score   = parseInt(cv?.score   ?? p.score   ?? 0) || 0;
      const actions = parseInt(cv?.actions ?? p.actions ?? 0) || 0;
      const errores = Math.max(0, actions - score);

      // Contar SIEMPRE todas las actividades
      if (score   !== window.ultimoScore)   { window.ultimoScore   = score;   if (mostrarPuntuacionTiempoReal()) actualizarPanel('aciertos', score); }
      if (errores !== window.ultimoActions) { window.ultimoActions = errores; if (mostrarPuntuacionTiempoReal()) actualizarPanel('intentos', errores); }

      if (window.Notificaciones) {
        if (score > window.ultimoScore && score > 0) window.Notificaciones.registrarAcierto();
        if (errores > window.ultimoActions && errores > 0) window.Notificaciones.registrarError();
      }

      // FIN EN LA ÚLTIMA ACTIVIDAD: algunos juegos terminan con STOP
      // (ej. "fin.ass") y nunca se "sale" de ella, así que el reporte no
      // saldría. Si estoy parado en la última y ya se resolvió, finalizar.
      if (!window.juegoTerminado && window.totalActividades > 1 && currentIdx > 0) {
        var estoyEnUltimaPorIndice = indiceConfiable && (currentIdx === window.totalActividades - 1);
        var estoyEnUltimaPorNombre = esFinalDelJuego(currentName);
        // En juegos restringidos el índice NO vale: solo el nombre permitido
        // (labriego.txa) puede disparar el final. Así verbo.ass nunca finaliza.
        if (juegoRestringido) {
          estoyEnUltimaPorIndice = false;
          if (!permiteActual) estoyEnUltimaPorNombre = false;
        }
        // Una actividad excluida NUNCA finaliza, ni siquiera por índice
        // (ej. ttierra.ass es la última de su secuencia pero no debe disparar).
        if (excluidaDelFin(currentName)) {
          estoyEnUltimaPorIndice = false;
          estoyEnUltimaPorNombre = false;
        }
        const resuelta = !!(window.datosActividadActual && window.datosActividadActual.solved);
        // En estas actividades el reporte NO sale al resolver (saldría encima
        // de la misma pantalla): solo al SALIR con Siguiente.
        var soloAlSalir = false;
        try {
          soloAlSalir = (typeof sinReporteAlResolver === 'function') && sinReporteAlResolver(currentName);
        } catch (e) {}
        if ((estoyEnUltimaPorIndice || estoyEnUltimaPorNombre) && resuelta && !soloAlSalir && !yaReportado(currentName)) {
          try {
            const tAct = window.tiempoInicioActividad
              ? Math.floor((Date.now() - window.tiempoInicioActividad) / 1000)
              : 0;
            registrarActividad(currentName, window.datosActividadActual, tAct);
          } catch (e) {}
          console.log('🏁 FIN DEL JUEGO (última actividad resuelta):', currentName);
          marcarReportado(currentName);
          finalizarJuego();
          return;
        }
      }

      if (!window.yaIniciado && currentName) {
        window.yaIniciado               = true;
        window.prevName                 = currentName;
        window.prevIdx                  = currentIdx;
        window.ultimaActividadDetectada = currentName;
        window.tiempoInicioActividad    = Date.now();
        console.log('🎮 Juego iniciado en:', currentName);
        return;
      }

      const cambioPantalla = (currentIdx !== window.prevIdx) || (currentName !== window.prevName);

      if (cambioPantalla && window.yaIniciado && window.prevName) {
        if (window.sistemaSonido) window.sistemaSonido.playNotificacion();
      }
      if (cambioPantalla) {
        if (window.prevName && window.yaIniciado) {
          const t = window.tiempoInicioActividad
            ? Math.floor((Date.now() - window.tiempoInicioActividad) / 1000)
            : 0;
          registrarActividad(window.ultimaActividadDetectada, window.datosActividadActual, t);

          var anteriorEraUltimaPorIndice = indiceConfiable && (window.prevIdx === window.totalActividades - 1);
          var anteriorEraUltimaPorDiccionario = esFinalDelJuego(window.prevName);
          // En juegos restringidos el índice NO vale y las actividades no
          // permitidas (verbo.ass, menú...) nunca son final.
          if (juegoRestringido) {
            anteriorEraUltimaPorIndice = false;
            try {
              if (typeof actividadPermiteStats === 'function' && !actividadPermiteStats(window.prevName)) {
                anteriorEraUltimaPorDiccionario = false;
              }
            } catch (e) {}
          }
          // Al salir de la primera actividad el juego apenas empieza (ej. portadas
          // "porta.ass" que coinciden con el diccionario): nunca es final.
          const salioDelInicio = (window.prevIdx <= 0) || (window.totalActividades <= 1);
          // Una actividad excluida NUNCA finaliza, ni siquiera por índice.
          var salioDeExcluida = false;
          try {
            salioDeExcluida = excluidaDelFin(window.prevName);
          } catch (e) {}
          // Regla "botón Volver" (ej. Bingo matemático): al REGRESAR a un
          // menú/tablero desde una actividad jugable sale el reporte con lo
          // acumulado. De menú a menú no dispara.
          var volvioAMenu = false;
          try {
            if (typeof esMenuVolver === 'function' && esMenuVolver(currentName) && !esMenuVolver(window.prevName)) {
              // Solo si ya hay algo jugado que reportar: si solo paseó por
              // menús (registro vacío), no hay reporte que mostrar.
              if (window.registroActividades && window.registroActividades.length > 0) {
                volvioAMenu = true;
              }
            }
          } catch (e) {}

          // Regla "salir reporta" (ej. Tablas JT: present.ass abre cada tabla):
          // al SALIR de ella sale el reporte, en cada visita (sin marcar).
          var salioDeReporta = false;
          try {
            if (typeof enListaSalir === 'function' && enListaSalir(window.prevName)) {
              salioDeReporta = true;
            }
          } catch (e) {}

          if (((anteriorEraUltimaPorIndice || anteriorEraUltimaPorDiccionario) && !yaReportado(window.prevName)) || volvioAMenu || salioDeReporta) {
            if (!salioDelInicio && !salioDeExcluida && !window.juegoTerminado) {
              console.log('🏁 FIN DEL JUEGO:', window.prevName + (volvioAMenu ? ' (volver a menú)' : (salioDeReporta ? ' (salir)' : '')));
              if (!volvioAMenu && !salioDeReporta) marcarReportado(window.prevName);
              // Actualizar el seguimiento ANTES de finalizar para no
              // redisparar el reporte al cerrarlo y seguir en el menú.
              window.datosActividadActual     = { score:0, actions:0, maxScore:0, maxActions:0, solved:false };
              window.ultimaActividadDetectada = currentName;
              window.prevIdx                  = currentIdx;
              window.prevName                 = currentName;
              window.tiempoInicioActividad    = Date.now();
              window.ultimoScore              = -1;
              window.ultimoActions            = -1;
              try {
                if (typeof cambiarInstruccionPorNombre === 'function') {
                  cambiarInstruccionPorNombre(currentName);
                }
              } catch (e2) {}
              finalizarJuego();
              return;
            }
          }
        }

        window.datosActividadActual     = { score:0, actions:0, maxScore:0, maxActions:0, solved:false };
        window.ultimaActividadDetectada = currentName;
        window.prevIdx                  = currentIdx;
        window.prevName                 = currentName;
        window.tiempoInicioActividad    = Date.now();
        window.ultimoScore              = -1;
        window.ultimoActions            = -1;

        if (typeof cambiarInstruccionPorNombre === 'function') {
          cambiarInstruccionPorNombre(currentName);
        }
      }

    } catch(e) {
      console.error('❌ Error en sync:', e);
    }
  }, 200);
}

// ==========================================
// REPORTE FINAL
// ==========================================
function mostrarReporteFinal() {
  const anterior = document.getElementById('modal-reporte');
  if (anterior) anterior.remove();

  if (window.registroActividades.length === 0) return;
  console.log('📋 Mostrando reporte final con', window.registroActividades.length, 'actividades');

  const totalActs        = window.registroActividades.length;
  const totalCorrectas   = window.registroActividades.filter(r => r.correcta === 'Sí').length;
  const totalAcciones    = window.registroActividades.reduce((s, r) => s + r.acciones, 0);
  const totalTiempo      = window.registroActividades.reduce((s, r) => s + r.tiempo, 0);
  const puntMedia        = Math.round(window.registroActividades.reduce((s, r) => s + r.puntuacion, 0) / totalActs);
  const porcentCorrectas = Math.round((totalCorrectas / totalActs) * 100);
  const minT             = String(Math.floor(totalTiempo / 60)).padStart(2, '0');
  const secT             = String(totalTiempo % 60).padStart(2, '0');
  const nombreJuego      = document.getElementById('gameTitle')?.textContent || tEst('juego');
  const fechaHoy         = new Date().toLocaleDateString();
  const perfil           = window.PerfilesManager?.obtenerPerfilActivo();
  const nombrePerfil     = perfil ? perfil.nombre : '';

  const filas = window.registroActividades.map(r => {
    const bgFila    = r.correcta === 'Sí' ? '#f0f9f0' : '#fef0f0';
    const icono     = r.correcta === 'Sí' ? '✅' : '❌';
    const textoSiNo = r.correcta === 'Sí' ? tEst('si') : tEst('no');
    return `
      <tr style="background:${bgFila};">
        <td style="padding:10px 12px;border-bottom:1px solid #e0e0e0;color:#1a1a2e;">${r.secuencia}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e0e0e0;color:#1a1a2e;font-weight:600;">${r.actividad}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e0e0e0;color:#1a1a2e;">${icono} ${textoSiNo}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e0e0e0;color:#1a1a2e;">${r.acciones}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e0e0e0;color:#c1272d;font-weight:700;">${r.puntuacion}%</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e0e0e0;color:#1a1a2e;">${r.tiempoFmt}</td>
      </tr>`;
  }).join('');

  const reporteHTML = `
    <div style="font-family:Arial,sans-serif;color:#1a1a2e;padding:20px;background:#ffffff;">
      <div style="text-align:center;margin-bottom:25px;padding-bottom:15px;border-bottom:3px solid #c1272d;">
        <h1 style="margin:0;font-size:24px;color:#c1272d;"><img src="./img_logos/logo_estadisticas.png" style="height:28px;vertical-align:middle;margin-right:6px;"> ${tEst('reporteActividades')}</h1>
        <p style="margin:6px 0 0;color:#666;font-size:14px;font-weight:600;">${nombreJuego}</p>
        ${nombrePerfil ? `<p style="margin:2px 0 0;color:#666;font-size:13px;">${(typeof window.avatarHTML === 'function' ? window.avatarHTML(perfil.avatar, nombrePerfil, 22) : perfil.avatar)} ${nombrePerfil}</p>` : ''}
        <p style="margin:2px 0 0;color:#999;font-size:12px;">${fechaHoy}</p>
      </div>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fafafa;border:2px solid #c1272d;border-radius:8px;overflow:hidden;">
        <tr style="background:#c1272d;color:white;">
          <td style="padding:12px 16px;font-weight:bold;font-size:14px;">📋 ${tEst('totales')}</td>
          <td style="padding:12px 16px;text-align:center;font-size:14px;"><strong>${totalCorrectas}</strong> / ${totalActs} (${porcentCorrectas}%)</td>
          <td style="padding:12px 16px;text-align:center;font-size:14px;">${totalAcciones} ${tEst('acciones')}</td>
          <td style="padding:12px 16px;text-align:center;font-size:14px;"><strong>${puntMedia}%</strong></td>
          <td style="padding:12px 16px;text-align:center;font-size:14px;">⏱ ${minT}:${secT}</td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:13px;background:#ffffff;">
        <thead>
          <tr style="background:#c1272d;color:white;">
            <th style="padding:12px;text-align:left;font-weight:700;">${tEst('secuencia')}</th>
            <th style="padding:12px;text-align:left;font-weight:700;">${tEst('actividad')}</th>
            <th style="padding:12px;text-align:center;font-weight:700;">${tEst('correcta')}</th>
            <th style="padding:12px;text-align:center;font-weight:700;">${tEst('acciones')}</th>
            <th style="padding:12px;text-align:center;font-weight:700;">${tEst('puntuacion')}</th>
            <th style="padding:12px;text-align:center;font-weight:700;">${tEst('tiempo')}</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;

  const modalHTML = `
    <div id="modal-reporte" class="reporte-overlay">
      <div class="reporte-contenedor">
        <div class="reporte-header">
          <h2><img src="./img_logos/logo_estadisticas.png" style="height:24px;vertical-align:middle;margin-right:6px;"> ${tEst('reporteActividades')}</h2>
          <button id="btn-cerrar-reporte" class="reporte-cerrar">✕</button>
        </div>
        <div class="reporte-cuerpo">
          ${reporteHTML}
        </div>
        <div class="reporte-footer">
          <button id="btn-imprimir-reporte" class="reporte-btn reporte-btn-blanco">${tEst('imprimirPDF')}</button>
          <button id="btn-reiniciar-reporte" class="reporte-btn reporte-btn-blanco">${tEst('jugarDeNuevo')}</button>
          <button id="btn-cerrar-reporte-2" class="reporte-btn reporte-btn-blanco">${tEst('cerrar')}</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  setTimeout(function() {
    const overlay = document.getElementById('modal-reporte');
    if (!overlay) return;

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) cerrarReporte();
    });

    const btnCerrar = document.getElementById('btn-cerrar-reporte');
    if (btnCerrar) btnCerrar.addEventListener('click', function(e) { e.stopPropagation(); cerrarReporte(); });

    const btnImprimir = document.getElementById('btn-imprimir-reporte');
    if (btnImprimir) btnImprimir.addEventListener('click', function(e) { e.stopPropagation(); imprimirReporte(); });

    const btnReiniciar = document.getElementById('btn-reiniciar-reporte');
    if (btnReiniciar) btnReiniciar.addEventListener('click', function(e) { e.stopPropagation(); reiniciarDesdeReporte(); });

    const btnCerrar2 = document.getElementById('btn-cerrar-reporte-2');
    if (btnCerrar2) btnCerrar2.addEventListener('click', function(e) { e.stopPropagation(); cerrarReporte(); });

    if (window.__escHandlerReporte) document.removeEventListener('keydown', window.__escHandlerReporte);
    window.__escHandlerReporte = function(e) { if (e.key === 'Escape') cerrarReporte(); };
    document.addEventListener('keydown', window.__escHandlerReporte);
  }, 50);

  window.__reporteParaImprimir = reporteHTML;
}

function cerrarReporte() {
  const modal = document.getElementById('modal-reporte');
  if (modal) modal.remove();
  const iframe = document.getElementById('iframe-imprimir-reporte');
  if (iframe) iframe.remove();
  if (window.__escHandlerReporte) {
    document.removeEventListener('keydown', window.__escHandlerReporte);
    window.__escHandlerReporte = null;
  }
  window.__reporteParaImprimir = null;
  window.juegoTerminado = false;
  window.reporteMostrado = false;
}

function imprimirReporte() {
  if (!window.__reporteParaImprimir) return;
  var iframeId = 'iframe-imprimir-reporte';
  var iframeAnterior = document.getElementById(iframeId);
  if (iframeAnterior) iframeAnterior.remove();

  var iframe = document.createElement('iframe');
  iframe.id = iframeId;
  iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0;pointer-events:none;';
  document.body.appendChild(iframe);

  var doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><title>Reporte</title><style>@page{size:auto;margin:15mm;}body{font-family:Arial;padding:20px;color:#1a1a2e;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}h1{color:#c1272d;}</style></head><body>${window.__reporteParaImprimir}</body></html>`);
  doc.close();

  setTimeout(function() {
    try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch(e) {}
    setTimeout(function() { var el = document.getElementById(iframeId); if (el) el.remove(); }, 60000);
  }, 500);
}

function reiniciarDesdeReporte() {
  cerrarReporte();
  setTimeout(() => window.location.reload(), 100);
}

// ==========================================
// INICIALIZADOR
// ==========================================
function arrancarEstadisticas() {
  if (window.relojInterval) clearInterval(window.relojInterval);
  if (window.syncInterval) clearInterval(window.syncInterval);
  if (window.acumuladorInterval) clearInterval(window.acumuladorInterval);

  window.registroActividades      = [];
  window.tiempoInicioActividad    = null;
  window.ultimaActividadDetectada = '';
  window.prevIdx                  = -1;
  window.prevName                 = '';
  window.reporteMostrado          = false;
  window.juegoTerminado           = false;
  window.yaIniciado               = false;
  window.totalActividades         = 0;
  window.datosActividadActual     = { score:0, actions:0, maxScore:0, maxActions:0, solved:false };
  window.tiempoSegundos           = 0;
  window.ultimoScore              = -1;
  window.ultimoActions            = -1;
  window.__finalesReportados      = [];
  window.__tiempoYaReportado      = 0;

  if (mostrarPuntuacionTiempoReal()) {
    actualizarPanel('aciertos', 0);
    actualizarPanel('intentos', 0);
  } else {
    actualizarPanel('aciertos', '-');
    actualizarPanel('intentos', '-');
  }
  actualizarPanel('tiempo', '00:00');

  // La barra siempre visible para no mover la interfaz.
  try {
    var panel0 = document.querySelector('.stats-panel');
    if (panel0) { panel0.style.display = ''; panel0.style.visibility = 'visible'; }
  } catch (e) {}

  iniciarReloj();
  iniciarSync();
  iniciarAcumulador();
}

// ==========================================
// CSS
// ==========================================
function inyectarCSSReporte() {
  if (document.getElementById('reporte-css')) return;
  const style = document.createElement('style');
  style.id = 'reporte-css';
  style.textContent = `
    .reporte-overlay { position:fixed!important; top:0!important; left:0!important; width:100vw!important; height:100vh!important; background:rgba(0,0,0,0.8)!important; z-index:2147483647!important; display:flex!important; align-items:center!important; justify-content:center!important; font-family:Arial,sans-serif!important; padding:20px; box-sizing:border-box; animation:reporteFadeIn 0.3s ease; }
    @keyframes reporteFadeIn { from{opacity:0;} to{opacity:1;} }
    .reporte-contenedor { background:#fff; border-radius:10px; max-width:900px; width:100%; max-height:90vh; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 5px 25px rgba(0,0,0,0.4); border:3px solid #c1272d; }
    .reporte-header { background:#c1272d; color:#fff; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
    .reporte-header h2 { margin:0; font-size:20px; font-weight:700; }
    .reporte-cerrar { background:#fff; color:#c1272d; border:none; width:34px; height:34px; border-radius:50%; font-size:18px; font-weight:bold; cursor:pointer; flex-shrink:0; }
    .reporte-cerrar:hover { background:#c1272d; color:#fff; transform:scale(1.1); }
    .reporte-cuerpo { overflow-y:auto; flex:1; background:#fafafa; }
    .reporte-footer { padding:18px 24px; display:flex; gap:12px; justify-content:center; background:#f5f5f5; border-top:3px solid #c1272d; flex-shrink:0; flex-wrap:wrap; }
    .reporte-btn { padding:11px 24px; border:2px solid #c1272d; border-radius:6px; font-size:14px; font-weight:700; cursor:pointer; text-transform:uppercase; }
    .reporte-btn-blanco { background:#fff; color:#c1272d; }
    .reporte-btn-blanco:hover { background:#c1272d; color:#fff; }
  `;
  document.head.appendChild(style);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inyectarCSSReporte);
} else {
  inyectarCSSReporte();
}

window.addEventListener('load', () => {
  // No arrancar automáticamente. Vista.js avisará cuando el juego esté listo.
  // Iniciar todo EXCEPTO el reloj
  setTimeout(function() {
    arrancarEstadisticasSinReloj();
  }, 2000);
});

function arrancarEstadisticasSinReloj() {
  if (window.relojInterval) clearInterval(window.relojInterval);
  if (window.syncInterval) clearInterval(window.syncInterval);
  if (window.acumuladorInterval) clearInterval(window.acumuladorInterval);

  window.registroActividades      = [];
  window.tiempoInicioActividad    = null;
  window.ultimaActividadDetectada = '';
  window.prevIdx                  = -1;
  window.prevName                 = '';
  window.reporteMostrado          = false;
  window.juegoTerminado           = false;
  window.yaIniciado               = false;
  window.totalActividades         = 0;
  window.datosActividadActual     = { score:0, actions:0, maxScore:0, maxActions:0, solved:false };
  window.tiempoSegundos           = 0;
  window.ultimoScore              = -1;
  window.ultimoActions            = -1;
  window.__finalesReportados      = [];
  window.__tiempoYaReportado      = 0;

  if (mostrarPuntuacionTiempoReal()) {
    actualizarPanel('aciertos', 0);
    actualizarPanel('intentos', 0);
  } else {
    actualizarPanel('aciertos', '-');
    actualizarPanel('intentos', '-');
  }
  actualizarPanel('tiempo', '00:00');

  // La barra siempre visible para no mover la interfaz.
  try {
    var panel1 = document.querySelector('.stats-panel');
    if (panel1) { panel1.style.display = ''; panel1.style.visibility = 'visible'; }
  } catch (e) {}

  // El reloj NO arranca aquí. Vista.js llama a window.iniciarRelojJuego() cuando el loader termina.
  iniciarSync();
  iniciarAcumulador();
}

// Función que vista.js llama cuando el loader termina
window.iniciarRelojJuego = function() {
  console.log('⏱️ Cronómetro arrancando tras carga completa');
  iniciarReloj();
};
