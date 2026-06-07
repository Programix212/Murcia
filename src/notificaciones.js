// ==========================================
// NOTIFICACIONES.JS - Récords, Logros, Toasts
// ==========================================

window.Notificaciones = {
  // Datos guardados
  datos: null,

  // Inicializar
  init: function() {
    this.datos = this.cargar();
    console.log('✅ Notificaciones init:', this.datos);
  },

  // ==========================================
  // ✅ FIX: Cargar del perfil activo si existe
  // ==========================================
  cargar: function() {
  // ✅ Si hay perfil activo, cargar SUS datos
  if (window.PerfilesManager) {
    var perfil = window.PerfilesManager.obtenerPerfilActivo();
    if (perfil) {
      var datos = window.PerfilesManager.obtenerDatos(perfil.id, 'stats', null);
      if (datos) return datos;
    }
  }
  
  // Si no hay perfil, empezar desde CERO
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

  // ==========================================
  // ✅ FIX: Guardar en el perfil activo si existe
  // ==========================================
  guardar: function() {
  try {
    // ✅ Solo guardar si hay un perfil activo
    if (window.PerfilesManager) {
      var perfil = window.PerfilesManager.obtenerPerfilActivo();
      if (perfil) {
        window.PerfilesManager.guardarDatos(perfil.id, 'stats', this.datos);
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
    if (!this.datos) this.init();
    var d = this.datos;
    var notificaciones = [];

    // ✅ FIX: Evitar contar el mismo juego dos veces si se llama doble
    var claveJuego = (nombreJuego || 'juego').toLowerCase().trim() + '_' + Date.now();
    if (!this._ultimosJuegos) this._ultimosJuegos = {};
    if (this._ultimosJuegos[claveJuego]) return; // Ya se contó
    this._ultimosJuegos[claveJuego] = true;
    
    var d = this.datos;
    var notificaciones = [];

    // 1. Juegos completados
    d.juegosCompletados++;
    var logrosJuegos = [
      { cant: 1,  id: 'primer_juego',  icon: '🎮', texto: '¡Primer juego completado!' },
      { cant: 5,  id: '5_juegos',      icon: '🥉', texto: '¡5 juegos completados!' },
      { cant: 10, id: '10_juegos',     icon: '🥈', texto: '¡10 juegos completados!' },
      { cant: 25, id: '25_juegos',     icon: '🥇', texto: '¡25 juegos completados!' },
      { cant: 50, id: '50_juegos',     icon: '🏆', texto: '¡50 juegos completados!' },
      { cant: 100,id: '100_juegos',    icon: '👑', texto: '¡100 juegos completados! ¡Eres un maestro!' }
    ];
    logrosJuegos.forEach(function(logro) {
      if (d.juegosCompletados >= logro.cant && d.logrosDesbloqueados.indexOf(logro.id) === -1) {
        d.logrosDesbloqueados.push(logro.id);
        notificaciones.push({ icon: logro.icon, texto: logro.texto, tipo: 'logro' });
      }
    });

    // 2. Puntuación perfecta
    if (puntuacion >= 100) {
      d.puntuacionesPerfectas++;
      if (d.puntuacionesPerfectas === 1) {
        if (d.logrosDesbloqueados.indexOf('primera_perfecta') === -1) {
          d.logrosDesbloqueados.push('primera_perfecta');
          notificaciones.push({ icon: '⭐', texto: '¡Primera puntuación perfecta!', tipo: 'logro' });
        }
      }
      if (d.puntuacionesPerfectas >= 10 && d.logrosDesbloqueados.indexOf('10_perfectas') === -1) {
        d.logrosDesbloqueados.push('10_perfectas');
        notificaciones.push({ icon: '💎', texto: '¡10 puntuaciones perfectas!', tipo: 'logro' });
      }
    }

    // 3. Mejor puntuación global
    if (puntuacion > d.mejorPuntuacion) {
      d.mejorPuntuacion = puntuacion;
      if (d.juegosCompletados > 1) {
        notificaciones.push({ icon: '📈', texto: '¡Nuevo récord de puntuación: ' + puntuacion + '%!', tipo: 'record' });
      }
    }

    // 4. Mejor tiempo por juego
    if (nombreJuego && tiempo) {
      var clave = nombreJuego.toLowerCase().trim();
      if (!d.juegosPorNombre[clave]) {
        d.juegosPorNombre[clave] = { mejorTiempo: tiempo, mejorPuntuacion: puntuacion, veces: 1 };
      } else {
        var jg = d.juegosPorNombre[clave];
        jg.veces++;
        if (tiempo < jg.mejorTiempo) {
          jg.mejorTiempo = tiempo;
          notificaciones.push({ icon: '⏱️', texto: '¡Nuevo récord de tiempo en ' + nombreJuego + '!', tipo: 'record' });
        }
        if (puntuacion > jg.mejorPuntuacion) {
          jg.mejorPuntuacion = puntuacion;
          if (jg.veces > 1) {
            notificaciones.push({ icon: '📊', texto: '¡Mejor puntuación en ' + nombreJuego + ': ' + puntuacion + '%!', tipo: 'record' });
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
        { cant: 3,  id: 'racha_3',  icon: '🔥', texto: '¡Racha de 3 sin error!' },
        { cant: 5,  id: 'racha_5',  icon: '🔥', texto: '¡Racha de 5 sin error!' },
        { cant: 10, id: 'racha_10', icon: '💥', texto: '¡Racha de 10 sin error! ¡Increíble!' }
      ];
      logrosRacha.forEach(function(logro) {
        if (d.rachaAciertos >= logro.cant && d.logrosDesbloqueados.indexOf(logro.id) === -1) {
          d.logrosDesbloqueados.push(logro.id);
          notificaciones.push({ icon: logro.icon, texto: logro.texto, tipo: 'logro' });
        }
      });
    } else {
      d.rachaAciertos = 0;
    }

    this.guardar();

    // Mostrar notificaciones
    notificaciones.forEach(function(n, i) {
      setTimeout(function() {
        window.Notificaciones.mostrar(n.icon, n.texto, n.tipo);
      }, i * 1500);
    });

    // Actualizar footer si estamos en la página correcta
    if (window.actualizarFooterStats) window.actualizarFooterStats();

    return notificaciones;
  },

  // ==========================================
  // REGISTRAR ACTIVIDAD CORRECTA
  // ==========================================
  registrarAcierto: function() {
    if (!this.datos) this.init();
    this.datos.rachaAciertos++;
    if (this.datos.rachaAciertos > this.datos.mejorRacha) {
      this.datos.mejorRacha = this.datos.rachaAciertos;
    }
    this.guardar();
  },

  registrarError: function() {
    if (!this.datos) this.init();
    this.datos.rachaAciertos = 0;
    this.guardar();
  },

  // ==========================================
  // MOSTRAR TOAST
  // ==========================================
  mostrar: function(icon, texto, tipo) {
    var colores = {
      logro: 'linear-gradient(135deg, #f7971e, #ffd200)',
      record: 'linear-gradient(135deg, #667eea, #764ba2)',
      info: 'linear-gradient(135deg, #11998e, #38ef7d)'
    };

    var toast = document.createElement('div');
    toast.className = 'noti-toast';
    toast.style.cssText = `
      position: fixed;
      top: -100px;
      right: 20px;
      background: ${colores[tipo] || colores.info};
      color: white;
      padding: 16px 24px;
      border-radius: 16px;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-weight: 600;
      z-index: 2147483647;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 350px;
      transition: top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      cursor: pointer;
    `;

    toast.innerHTML = '<span style="font-size:28px">' + icon + '</span><span>' + texto + '</span>';

    toast.addEventListener('click', function() {
      toast.style.top = '-200px';
      setTimeout(function() { toast.remove(); }, 500);
    });

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(function() {
      toast.style.top = '20px';
    }, 100);

    // Animar salida
    setTimeout(function() {
      toast.style.top = '-200px';
      setTimeout(function() { toast.remove(); }, 500);
    }, 4000);

    // Sonido
    if (window.sistemaSonido) {
      if (tipo === 'logro') {
        window.sistemaSonido.playVictoria();
      } else {
        window.sistemaSonido.playNotificacion();
      }
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