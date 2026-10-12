// ==========================================
// NOTIFICACIONES.JS - Récords, Logros, Toasts
// ==========================================

window.Notificaciones = {
  // Datos guardados
  datos: null,

  // Clave propia (separada de 'stats', que usa registrarEstadistica con otro formato)
  STORAGE_TIPO: 'notif',

  // Forma sana por defecto
  datosPorDefecto: function() {
    return {
      juegosCompletados: 0,
      puntuacionesPerfectas: 0,
      mejorPuntuacion: 0,
      mejorTiempo: null,
      rachaAciertos: 0,
      mejorRacha: 0,
      logrosDesbloqueados: [],
      juegosPorNombre: {}
    };
  },

  // Completa campos faltantes (perfiles con formato viejo)
  normalizar: function(d) {
    var base = this.datosPorDefecto();
    if (!d || typeof d !== 'object') return base;
    for (var k in base) {
      if (d[k] === undefined || d[k] === null) d[k] = base[k];
    }
    if (!Array.isArray(d.logrosDesbloqueados)) d.logrosDesbloqueados = [];
    if (!d.juegosPorNombre || typeof d.juegosPorNombre !== 'object') d.juegosPorNombre = {};
    return d;
  },

  // Textos de toasts ES/EN (sin hardcodear solo español)
  textos: {
    es: {
      primerJuego: '¡Primer juego completado!',
      juegosN: '¡{n} juegos completados!',
      juegos100: '¡100 juegos completados! ¡Eres un maestro!',
      primeraPerfecta: '¡Primera puntuación perfecta!',
      perfectas10: '¡10 puntuaciones perfectas!',
      recordPuntos: '¡Nuevo récord de puntuación: {n}%!',
      recordTiempo: '¡Nuevo récord de tiempo en {juego}!',
      mejorPuntosJuego: '¡Mejor puntuación en {juego}: {n}%!',
      rachaN: '¡Racha de {n} sin error!',
      racha10: '¡Racha de 10 sin error! ¡Increíble!'
    },
    en: {
      primerJuego: 'First game completed!',
      juegosN: '{n} games completed!',
      juegos100: '100 games completed! You are a master!',
      primeraPerfecta: 'First perfect score!',
      perfectas10: '10 perfect scores!',
      recordPuntos: 'New high score: {n}%!',
      recordTiempo: 'New time record in {juego}!',
      mejorPuntosJuego: 'Best score in {juego}: {n}%!',
      rachaN: '{n} streak with no mistakes!',
      racha10: '10 streak with no mistakes! Amazing!'
    }
  },

  tNoti: function(clave, params) {
    try {
      var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      var idioma = config.idioma === 'en' ? 'en' : 'es';
      var txt = (this.textos[idioma] && this.textos[idioma][clave]) || this.textos.es[clave] || clave;
      if (params) {
        Object.keys(params).forEach(function(k) {
          txt = txt.split('{' + k + '}').join(String(params[k]));
        });
      }
      return txt;
    } catch (e) {
      return clave;
    }
  },

  // Inicializar
  init: function() {
    this.datos = this.cargar();
    console.log('✅ Notificaciones init:', this.datos);
  },

  // ==========================================
  // Cargar de la clave propia del perfil ('notif').
  // NUNCA de 'stats' (esa la usa registrarEstadistica con otro formato
  // y mezclarlas reventaba con "Cannot read properties of undefined").
  // ==========================================
  cargar: function() {
  // ✅ Si hay perfil activo, cargar SUS datos
  if (window.PerfilesManager) {
    try {
      var perfil = window.PerfilesManager.obtenerPerfilActivo();
      if (perfil) {
        var datos = window.PerfilesManager.obtenerDatos(perfil.id, this.STORAGE_TIPO, null);
        if (datos) return this.normalizar(datos);
      }
    } catch (e) {}
  }

  // Si no hay perfil, empezar desde CERO
  return this.datosPorDefecto();
},

  // ==========================================
  // ✅ FIX: Guardar en el perfil activo si existe
  // ==========================================
  guardar: function() {
  try {
    // ✅ Solo guardar si hay un perfil activo
    if (window.PerfilesManager) {
      var perfil = window.PerfilesManager.obtenerPerfilActivo();
      if (perfil) {
        window.PerfilesManager.guardarDatos(perfil.id, this.STORAGE_TIPO, this.datos);
        return; // ← IMPORTANTE: si hay perfil, no guardar en el "bolsillo global"
      }
    }
    // Si llega aquí, es que NO hay perfil, entonces NO guardamos nada
  } catch(e) {}
},

  // ==========================================
  // REGISTRAR JUEGO TERMINADO
  // ==========================================
  registrarJuego: function(nombreJuego, puntuacion, tiempo, correctas, total) {
    try {
    if (!this.datos) this.init();
    this.datos = this.normalizar(this.datos);
    var d = this.datos;
    if (!d) return [];
    var notificaciones = [];
    var self = this;

    // 1. Juegos completados
    d.juegosCompletados++;
    var logrosJuegos = [
      { cant: 1,  id: 'primer_juego',  icon: '🎮', clave: 'primerJuego' },
      { cant: 5,  id: '5_juegos',      icon: '🥉', clave: 'juegosN' },
      { cant: 10, id: '10_juegos',     icon: '🥈', clave: 'juegosN' },
      { cant: 25, id: '25_juegos',     icon: '🥇', clave: 'juegosN' },
      { cant: 50, id: '50_juegos',     icon: '🏆', clave: 'juegosN' },
      { cant: 100,id: '100_juegos',    icon: '👑', clave: 'juegos100' }
    ];
    logrosJuegos.forEach(function(logro) {
      if (d.juegosCompletados >= logro.cant && d.logrosDesbloqueados.indexOf(logro.id) === -1) {
        d.logrosDesbloqueados.push(logro.id);
        notificaciones.push({ icon: logro.icon, texto: self.tNoti(logro.clave, { n: logro.cant }), tipo: 'logro' });
      }
    });

    // 2. Puntuación perfecta
    if (puntuacion >= 100) {
      d.puntuacionesPerfectas++;
      if (d.puntuacionesPerfectas === 1) {
        if (d.logrosDesbloqueados.indexOf('primera_perfecta') === -1) {
          d.logrosDesbloqueados.push('primera_perfecta');
          notificaciones.push({ icon: '⭐', texto: self.tNoti('primeraPerfecta'), tipo: 'logro' });
        }
      }
      if (d.puntuacionesPerfectas >= 10 && d.logrosDesbloqueados.indexOf('10_perfectas') === -1) {
        d.logrosDesbloqueados.push('10_perfectas');
        notificaciones.push({ icon: '💎', texto: self.tNoti('perfectas10'), tipo: 'logro' });
      }
    }

    // 3. Mejor puntuación global
    if (puntuacion > d.mejorPuntuacion) {
      d.mejorPuntuacion = puntuacion;
      if (d.juegosCompletados > 1) {
        notificaciones.push({ icon: '📈', texto: self.tNoti('recordPuntos', { n: Number(puntuacion) || 0 }), tipo: 'record' });
      }
    }

    // 4. Mejor tiempo por juego
    if (nombreJuego && tiempo) {
      var nombreSeguro = String(nombreJuego).trim();
      var clave = nombreSeguro.toLowerCase();
      if (!d.juegosPorNombre[clave]) {
        d.juegosPorNombre[clave] = { mejorTiempo: tiempo, mejorPuntuacion: puntuacion, veces: 1 };
      } else {
        var jg = d.juegosPorNombre[clave];
        jg.veces++;
        if (tiempo < jg.mejorTiempo) {
          jg.mejorTiempo = tiempo;
          notificaciones.push({ icon: '⏱️', texto: self.tNoti('recordTiempo', { juego: nombreSeguro }), tipo: 'record' });
        }
        if (puntuacion > jg.mejorPuntuacion) {
          jg.mejorPuntuacion = puntuacion;
          if (jg.veces > 1) {
            notificaciones.push({ icon: '📊', texto: self.tNoti('mejorPuntosJuego', { juego: nombreSeguro, n: Number(puntuacion) || 0 }), tipo: 'record' });
          }
        }
      }
    }

    // 5. Racha de aciertos
    if (correctas && total && correctas === total && total > 0) {
      d.rachaAciertos++;
      if (d.rachaAciertos > d.mejorRacha) {
        d.mejorRacha = d.rachaAciertos;
      }
      var logrosRacha = [
        { cant: 3,  id: 'racha_3',  icon: '🔥', clave: 'rachaN' },
        { cant: 5,  id: 'racha_5',  icon: '🔥', clave: 'rachaN' },
        { cant: 10, id: 'racha_10', icon: '💥', clave: 'racha10' }
      ];
      logrosRacha.forEach(function(logro) {
        if (d.rachaAciertos >= logro.cant && d.logrosDesbloqueados.indexOf(logro.id) === -1) {
          d.logrosDesbloqueados.push(logro.id);
          notificaciones.push({ icon: logro.icon, texto: self.tNoti(logro.clave, { n: logro.cant }), tipo: 'logro' });
        }
      });
    } else {
      d.rachaAciertos = 0;
    }

    this.guardar();

    // Mostrar notificaciones
    notificaciones.forEach(function(n, i) {
      setTimeout(function() {
        try {
          window.Notificaciones.mostrar(n.icon, n.texto, n.tipo);
        } catch (e) {}
      }, i * 1500);
    });

    // Actualizar footer si estamos en la página correcta
    try {
      if (window.actualizarFooterStats) window.actualizarFooterStats();
    } catch (e) {}

    return notificaciones;
    } catch (e) {
      console.error('❌ Error registrando juego:', e);
      return [];
    }
  },

  // ==========================================
  // REGISTRAR ACTIVIDAD CORRECTA
  // ==========================================
  registrarAcierto: function() {
    try {
      if (!this.datos) this.init();
      this.datos = this.normalizar(this.datos);
      if (!this.datos) return;
      this.datos.rachaAciertos = (this.datos.rachaAciertos || 0) + 1;
      if (this.datos.rachaAciertos > (this.datos.mejorRacha || 0)) {
        this.datos.mejorRacha = this.datos.rachaAciertos;
      }
      this.guardar();
    } catch (e) {}
  },

  registrarError: function() {
    try {
      if (!this.datos) this.init();
      this.datos = this.normalizar(this.datos);
      if (!this.datos) return;
      this.datos.rachaAciertos = 0;
      this.guardar();
    } catch (e) {}
  },

  // ==========================================
  // MOSTRAR TOAST
  // ==========================================
  mostrar: function(icon, texto, tipo) {
    try {
    // No mostrar avisos sobre actividades excluidas (ej. verbo.ass en 6°):
    // pertenecen a un reporte anterior y estorban ahí.
    try {
      if (typeof excluidaDelFin === 'function' && window.ultimaActividadDetectada &&
          excluidaDelFin(window.ultimaActividadDetectada)) {
        return;
      }
    } catch (e) {}
    var colores = {
      logro: 'linear-gradient(135deg, #f7971e, #ffd200)',
      record: 'linear-gradient(135deg, #667eea, #764ba2)',
      info: 'linear-gradient(135deg, #11998e, #38ef7d)'
    };

    var toast = document.createElement('div');
    toast.className = 'noti-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText =
      'position: fixed;' +
      'top: -100px;' +
      'right: 20px;' +
      'background: ' + (colores[tipo] || colores.info) + ';' +
      'color: white;' +
      'padding: 16px 24px;' +
      'border-radius: 16px;' +
      "font-family: 'Poppins', sans-serif;" +
      'font-size: 15px;' +
      'font-weight: 600;' +
      'z-index: 2147483647;' +
      'box-shadow: 0 10px 40px rgba(0,0,0,0.3);' +
      'display: flex;' +
      'align-items: center;' +
      'gap: 12px;' +
      'max-width: 350px;' +
      'transition: top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);' +
      'cursor: pointer;';

    // Construir con textContent (evita XSS si el nombre del juego trae HTML)
    var sIcon = document.createElement('span');
    sIcon.style.fontSize = '28px';
    sIcon.textContent = String(icon || '');
    var sTxt = document.createElement('span');
    sTxt.textContent = String(texto || '');
    toast.appendChild(sIcon);
    toast.appendChild(sTxt);

    toast.addEventListener('click', function() {
      try {
        toast.style.top = '-200px';
        setTimeout(function() { try { toast.remove(); } catch (e) {} }, 500);
      } catch (e) {}
    });

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(function() {
      try { toast.style.top = '20px'; } catch (e) {}
    }, 100);

    // Animar salida
    setTimeout(function() {
      try {
        toast.style.top = '-200px';
        setTimeout(function() { try { toast.remove(); } catch (e) {} }, 500);
      } catch (e) {}
    }, 4000);

    // Sonido
    try {
      if (window.sistemaSonido) {
        if (tipo === 'logro') {
          window.sistemaSonido.playVictoria();
        } else {
          window.sistemaSonido.playNotificacion();
        }
      }
    } catch (e) {}
    } catch (e) {
      console.error('❌ Error mostrando notificación:', e);
    }
  },

  // ==========================================
  // OBTENER ESTADÍSTICAS
  // ==========================================
  getStats: function() {
    if (!this.datos) this.init();
    return {
      juegosCompletados: this.datos.juegosCompletados,
      puntuacionesPerfectas: this.datos.puntuacionesPerfectas,
      mejorPuntuacion: this.datos.mejorPuntuacion,
      mejorRacha: this.datos.mejorRacha,
      logrosDesbloqueados: this.datos.logrosDesbloqueados.length
    };
  }
};


// INICIALIZAR DE FORMA SEGURA
// Espera a que perfiles.js esté listo
// ==========================================
function intentarInicializarNotificaciones() {
  if (window.PerfilesManager) {
    window.Notificaciones.init();
    console.log('✅ Notificaciones inicializadas con perfiles disponibles');
  } else {
    setTimeout(intentarInicializarNotificaciones, 50);
  }
}
intentarInicializarNotificaciones();