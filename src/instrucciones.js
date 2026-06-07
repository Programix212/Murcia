// ==========================================
// INSTRUCCIONES.JS - CON TRADUCCIÓN AUTOMÁTICA
// ==========================================

// ==========================================
// HELPER DE TRADUCCIÓN
// ==========================================
function tInstr(clave) {
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
// OBTENER IDIOMA ACTUAL
// ==========================================
function obtenerIdiomaActual() {
  try {
    const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    return config.idioma || 'es';
  } catch(e) {
    return 'es';
  }
}

// ==========================================
// DICCIONARIO DE TRADUCCIÓN DE INSTRUCCIONES
// ==========================================
const traduccionesInstrucciones = {
  // Instrucciones comunes en JClic
  es: {
    'Arrastra': 'Arrastra',
    'Completa': 'Completa',
    'Encuentra': 'Encuentra',
    'Relaciona': 'Relaciona',
    'Ordena': 'Ordena',
    'Selecciona': 'Selecciona',
    'Haz clic': 'Haz clic',
    'Observa': 'Observa',
    'Escucha': 'Escucha',
    'Lee': 'Lee',
    'Escribe': 'Escribe',
    'Une': 'Une',
    'Identifica': 'Identifica',
    'Colorea': 'Colorea',
    'Descubre': 'Descubre',
    'Resuelve': 'Resuelve',
    'las parejas': 'las parejas',
    'la palabra': 'la palabra',
    'las palabras': 'las palabras',
    'la imagen': 'la imagen',
    'las imágenes': 'las imágenes',
    'el puzzle': 'el puzzle',
    'la respuesta correcta': 'la respuesta correcta',
    'los elementos': 'los elementos',
    'el audio': 'el audio',
    'el sonido': 'el sonido',
    'y relaciona': 'y relaciona',
    'correctamente': 'correctamente',
    'en orden': 'en orden'
  },
  
  ca: {
    'Arrastra': 'Arrossega',
    'Completa': 'Completa',
    'Encuentra': 'Troba',
    'Relaciona': 'Relaciona',
    'Ordena': 'Ordena',
    'Selecciona': 'Selecciona',
    'Haz clic': 'Fes clic',
    'Observa': 'Observa',
    'Escucha': 'Escolta',
    'Lee': 'Llegeix',
    'Escribe': 'Escriu',
    'Une': 'Uneix',
    'Identifica': 'Identifica',
    'Colorea': 'Coloreja',
    'Descubre': 'Descobreix',
    'Resuelve': 'Resol',
    'las parejas': 'les parelles',
    'la palabra': 'la paraula',
    'las palabras': 'les paraules',
    'la imagen': 'la imatge',
    'las imágenes': 'les imatges',
    'el puzzle': 'el trencaclosques',
    'la respuesta correcta': 'la resposta correcta',
    'los elementos': 'els elements',
    'el audio': "l'àudio",
    'el sonido': 'el so',
    'y relaciona': 'i relaciona',
    'correctamente': 'correctament',
    'en orden': 'en ordre'
  },
  
  en: {
    'Arrastra': 'Drag',
    'Completa': 'Complete',
    'Encuentra': 'Find',
    'Relaciona': 'Match',
    'Ordena': 'Sort',
    'Selecciona': 'Select',
    'Haz clic': 'Click',
    'Observa': 'Observe',
    'Escucha': 'Listen',
    'Lee': 'Read',
    'Escribe': 'Write',
    'Une': 'Join',
    'Identifica': 'Identify',
    'Colorea': 'Color',
    'Descubre': 'Discover',
    'Resuelve': 'Solve',
    'las parejas': 'the pairs',
    'la palabra': 'the word',
    'las palabras': 'the words',
    'la imagen': 'the image',
    'las imágenes': 'the images',
    'el puzzle': 'the puzzle',
    'la respuesta correcta': 'the correct answer',
    'los elementos': 'the elements',
    'el audio': 'the audio',
    'el sonido': 'the sound',
    'y relaciona': 'and match',
    'correctamente': 'correctly',
    'en orden': 'in order'
  }
};

// ==========================================
// TRADUCIR INSTRUCCIÓN AUTOMÁTICAMENTE
// ==========================================
function traducirInstruccion(textoOriginal) {
  const idioma = obtenerIdiomaActual();
  
  // Si está en español o el texto está vacío, devolver original
  if (idioma === 'es' || !textoOriginal) {
    return textoOriginal;
  }
  
  let textoTraducido = textoOriginal;
  const diccionario = traduccionesInstrucciones[idioma];
  
  if (diccionario) {
    // Traducir cada palabra/frase del diccionario
    Object.keys(traduccionesInstrucciones.es).forEach(palabraEs => {
      const palabraTraducida = diccionario[palabraEs];
      // Buscar con mayúsculas y minúsculas
      const regex = new RegExp(palabraEs, 'gi');
      textoTraducido = textoTraducido.replace(regex, palabraTraducida);
    });
  }
  
  return textoTraducido;
}

// ==========================================
// DICCIONARIO SOLO DE IMÁGENES
// ==========================================
const mensajesFinalPorActividad = {
  'portasa.ass' : { tipo: 'img', src: 'assets/Imagenes/bienvenida.gif' },
  'g1.puz'      : { tipo: 'img', src: 'assets/Imagenes/estupendo.gif' },
  'g2.puz'      : { tipo: 'img', src: 'assets/Imagenes/muyBien.gif' },
  'g11.ass'     : { tipo: 'img', src: 'assets/Imagenes/excelente.gif' }
};

// ==========================================
// MENSAJES POR DEFECTO TRADUCIDOS
// ==========================================
const mensajesPorDefecto = {
  es: {
    bienvenida: 'Bienvenido al juego',
    instruccionesDefault: 'Instrucciones aparecerán aquí...',
    muyBien: '¡Muy bien! Actividad completada',
    excelente: '¡Excelente trabajo!',
    cargando: 'Cargando...'
  },
  ca: {
    bienvenida: 'Benvingut al joc',
    instruccionesDefault: 'Les instruccions apareixeran aquí...',
    muyBien: 'Molt bé! Activitat completada',
    excelente: 'Excel·lent treball!',
    cargando: 'Carregant...'
  },
  en: {
    bienvenida: 'Welcome to the game',
    instruccionesDefault: 'Instructions will appear here...',
    muyBien: 'Great job! Activity completed',
    excelente: 'Excellent work!',
    cargando: 'Loading...'
  }
};

// ==========================================
// CAMBIAR INSTRUCCIÓN CON ANIMACIÓN
// ==========================================
function cambiarInstruccion(texto) {
  const barra = document.getElementById('barra-instrucciones');
  if (!barra) return;
  
  // Traducir el texto antes de mostrarlo
  const textoTraducido = traducirInstruccion(texto);
  
  if (barra.textContent === textoTraducido) return;

  barra.style.transition = 'opacity 0.3s ease';
  barra.style.opacity    = '0';

  setTimeout(() => {
    barra.textContent   = textoTraducido;
    barra.style.opacity = '1';
  }, 300);
}

// ==========================================
// LLAMADA DESDE ESTADISTICA.JS
// ==========================================
function cambiarInstruccionPorNombre(nombreActividad) {
  console.log('📚 cambiarInstruccionPorNombre:', nombreActividad);
  try {
    const p          = window.JClicObject?.currentPlayers?.[0];
    const messages   = p?.actPanel?.act?.messages;
    const initialTxt = messages?.initial?.text || '';
    cambiarInstruccion(' ' + (initialTxt || nombreActividad));
  } catch(e) {
    console.error('Error:', e);
  }
}

// ==========================================
// MOSTRAR MENSAJE FINAL
// ==========================================
function mostrarMensajeFinal(messages) {
  const barra = document.getElementById('barra-instrucciones');
  if (!barra) return;

  const p               = window.JClicObject?.currentPlayers?.[0];
  const nombreActividad = p?.actPanel?.act?.name || '';
  const idioma          = obtenerIdiomaActual();

  // 1. Buscar en diccionario SOLO si es IMAGEN
  const entrada = mensajesFinalPorActividad[nombreActividad];
  if (entrada && entrada.tipo === 'img') {
    barra.style.transition = 'opacity 0.3s ease';
    barra.style.opacity    = '0';
    setTimeout(() => {
      barra.innerHTML   = '';
      const img         = document.createElement('img');
      img.src           = entrada.src;
      img.style.cssText =
        'max-height:55px;max-width:250px;object-fit:contain;vertical-align:middle;';
      img.onerror = () => {
        barra.textContent = '🎉 ' + mensajesPorDefecto[idioma].muyBien;
      };
      barra.appendChild(img);
      barra.style.opacity = '1';
      console.log('✅ Imagen diccionario:', entrada.src);
    }, 300);
    return;
  }

  // 2. Leer del archivo JClic y traducir
  const finalTxt   = messages?.final?.text               || '';
  const finalAudio = messages?.final?.mediaContent?.file || '';

  if (finalTxt) {
    cambiarInstruccion('🎉 ' + finalTxt);
    return;
  }

  if (finalAudio) {
    cambiarInstruccion('🎉 ' + finalAudio.replace(/\.(wav|mp3|ogg)$/i, ''));
    return;
  }

  // 3. Texto por defecto traducido
  cambiarInstruccion('🎉 ' + mensajesPorDefecto[idioma].muyBien);
}

// ==========================================
// OCULTAR INSTRUCCIONES NATIVAS DE JCLIC
// ==========================================
function ocultarInstruccionesJClic() {
  setInterval(() => {
    try {
      const jclic = document.querySelector('.JClic');
      if (!jclic) return;

      jclic.querySelectorAll('canvas').forEach(canvas => {
        if (canvas.width > canvas.height * 3) {
          canvas.style.setProperty('display', 'none', 'important');
        }
      });

      const coloresVerdes = [
        '0, 128, 0','34, 139, 34','0, 100, 0',
        '46, 125, 50','76, 175, 80','56, 142, 60'
      ];

      jclic.querySelectorAll('div').forEach(div => {
        const bg = window.getComputedStyle(div).backgroundColor;
        const h  = div.offsetHeight;
        const w  = div.offsetWidth;
        if (h > 0 && h < 60 && w > 200 &&
            coloresVerdes.some(c => bg.includes(c))) {
          div.style.setProperty('display', 'none', 'important');
        }
      });
    } catch(e) {}
  }, 300);
}

// ==========================================
// SINCRONIZAR CON JCLIC
// ==========================================
function sincronizarInstrucciones() {
  let ultimaActividad = '';
  let ultimoSolved    = false;
  let jclicListo      = false;

  setInterval(() => {
    try {
      const p = window.JClicObject?.currentPlayers?.[0];
      if (!p?.actPanel) return;

      const nombreActividad = p.actPanel?.act?.name || '';
      const solved          = p.actPanel.solved      || false;
      const messages        = p.actPanel.act?.messages;
      const initialTxt      = messages?.initial?.text || '';

      // Primera vez que JClic está listo
      if (!jclicListo && nombreActividad) {
        jclicListo      = true;
        ultimaActividad = nombreActividad;
        ultimoSolved    = false;
        console.log('✅ JClic listo. Actividad:', nombreActividad);
        cambiarInstruccion(' ' + (initialTxt || nombreActividad));
        return;
      }

      // CAMBIO DE ACTIVIDAD
      if (nombreActividad && nombreActividad !== ultimaActividad) {
        ultimaActividad = nombreActividad;
        ultimoSolved    = false;
        console.log('🎯 Nueva actividad:', nombreActividad);
        cambiarInstruccion(' ' + (initialTxt || nombreActividad));
        return;
      }

      // ACTIVIDAD COMPLETADA
      if (solved && !ultimoSolved) {
        ultimoSolved = true;
        console.log('🏆 Completada:', nombreActividad);
        mostrarMensajeFinal(messages);
        return;
      }

      // ACTIVIDAD RESETEADA
      if (!solved && ultimoSolved) {
        ultimoSolved = false;
        console.log('🔄 Reseteada:', nombreActividad);
        cambiarInstruccion(' ' + (initialTxt || nombreActividad));
      }

    } catch(e) {}
  }, 500);
}

// ==========================================
// ACTUALIZAR INSTRUCCIONES AL CAMBIAR IDIOMA
// ==========================================
window.addEventListener('storage', (e) => {
  if (e.key === 'appConfig') {
    console.log('🌍 Idioma cambiado, actualizando instrucciones...');
    // Re-traducir la instrucción actual
    try {
      const p = window.JClicObject?.currentPlayers?.[0];
      if (p?.actPanel?.act) {
        const messages   = p.actPanel.act.messages;
        const initialTxt = messages?.initial?.text || '';
        cambiarInstruccion(' ' + initialTxt);
      }
    } catch(e) {}
  }
});

// ==========================================
// INICIALIZAR
// ==========================================
window.addEventListener('load', () => {
  const barra = document.getElementById('barra-instrucciones');
  const idioma = obtenerIdiomaActual();
  
  if (barra) {
    barra.textContent = ' ' + mensajesPorDefecto[idioma].cargando;
  }

  ocultarInstruccionesJClic();
  sincronizarInstrucciones();
});
