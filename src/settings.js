console.log('✅ settings.js OK');

// Helper de traducción para mensajes de esta página
window.tConfig = function(clave) {
  try {
    var cfg = JSON.parse(localStorage.getItem('appConfig') || '{}');
    var idioma = cfg.idioma || 'es';
    if (window.textosI18n && window.textosI18n[idioma] && window.textosI18n[idioma][clave]) {
      return window.textosI18n[idioma][clave];
    }
  } catch (e) {}
  return clave;
};

let hayaCambiosSinGuardar = false;

function goBack() {
  console.log('goBack llamado, cambios:', hayaCambiosSinGuardar);
  if (hayaCambiosSinGuardar) {
    mostrarModal();
  } else {
    irAtras();
  }
}

// Navegación de salida (destino del botón Volver)
function irAtras() {
  var destino = 'Categorias.html';
  try {
    // Volver a la página de origen (Preescolar o Primaria) si se conoce
    if (document.referrer && document.referrer.indexOf('Configuracion') === -1 && document.referrer.indexOf('tauri') !== -1) {
      destino = document.referrer;
    }
  } catch (e) {}
  if (window.cearteeNavigate) {
    cearteeNavigate(destino);
  } else {
    window.location.href = destino;
  }
}

function mostrarModal() {
  const anterior = document.getElementById('modal-conf');
  if (anterior) anterior.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-conf';
  modal.style.cssText = `
    position:fixed; top:0; left:0;
    width:100%; height:100%;
    background:rgba(0,0,0,0.6);
    z-index:999999;
    display:flex;
    align-items:center;
    justify-content:center;
  `;

  const caja = document.createElement('div');
  caja.style.cssText = `
    background:white;
    border-radius:20px;
    padding:32px;
    max-width:380px;
    width:90%;
    text-align:center;
    font-family:'Poppins',sans-serif;
    box-shadow:0 20px 60px rgba(0,0,0,0.4);
  `;

  caja.innerHTML = `
    <div style="font-size:48px">⚠️</div>
    <h3 style="color:#1a1a2e;margin:12px 0 8px">Tienes cambios sin guardar</h3>
    <p style="color:#666;margin:0 0 24px">¿Deseas descartarlos y salir?</p>
    <div style="display:flex;gap:12px;justify-content:center;">
      <button id="btn-quedarme" style="
        padding:12px 24px;
        border-radius:25px;
        border:2px solid #667eea;
        background:transparent;
        color:#667eea;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
      ">✕ Quedarme</button>
      <button id="btn-salir" style="
        padding:12px 24px;
        border-radius:25px;
        border:none;
        background:linear-gradient(135deg,#ff6b6b,#ee5a24);
        color:white;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
      ">Salir sin guardar</button>
    </div>
  `;

  modal.appendChild(caja);
  document.body.appendChild(modal);

  document.getElementById('btn-quedarme').addEventListener('click', () => {
    modal.remove();
    console.log('✅ Usuario se quedó');
  });

  document.getElementById('btn-salir').addEventListener('click', () => {
    modal.remove();
    hayaCambiosSinGuardar = false;
    restaurarConfigGuardada();
    irAtras();
    console.log('✅ Usuario salió sin guardar');
  });
}

function restaurarConfigGuardada() {
  try {
    const guardada = localStorage.getItem('appConfig');
    if (!guardada) return;
    const c = JSON.parse(guardada);

    const set = (id, val, tipo) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (tipo === 'checked') el.checked = val;
      else el.value = String(val);
    };

    set('language',           c.idioma,         'value');
    set('theme',              c.tema,           'value');
    set('high-contrast', c.altoContraste, 'checked');
    set('font-scale',    c.escalaFuente,  'value');
    set('animations',         c.animaciones,    'checked');
    set('volume',             c.volumen,        'value');
    set('game-volume',        c.volumenJuego,   'value');
    set('notification-sound', c.sonidoNoti,     'checked');
    set('completion-sound',   c.sonidoJuego,    'checked');
    set('auto-timer',         c.autoTimer,      'checked');
    set('realtime-stats',     c.realtimeStats,  'checked');
    set('default-difficulty', c.dificultad,     'value');
    set('cloud-sync',         c.cloudSync,      'checked');
    set('developer-mode',     c.developerMode,  'checked');

    // ✅ ACTUALIZAR DISPLAYS DE VOLUMEN
    var elVol1 = document.getElementById('volume-value');
    if (elVol1) elVol1.textContent = (c.volumen != null ? c.volumen : 70) + '%';

    var elVol2 = document.getElementById('game-volume-value');
    if (elVol2) elVol2.textContent = (c.volumenJuego != null ? c.volumenJuego : 70) + '%';

    if (window.aplicarIdiomaGlobal) window.aplicarIdiomaGlobal(c.idioma);
    if (window.aplicarTemaGlobal) window.aplicarTemaGlobal(c.tema);

    console.log('🔄 Config restaurada');
  } catch(e) {
    console.warn('Error restaurando:', e);
  }
}

function saveSettings() {
  var idioma         = document.getElementById('language')?.value             || 'es';
  var tema           = document.getElementById('theme')?.value                || 'dark';
  var animaciones    = document.getElementById('animations')?.checked;
  if (animaciones === null || animaciones === undefined) animaciones = true;
  var volumen      = parseInt(document.getElementById('volume')?.value);
  var volumenJuego = parseInt(document.getElementById('game-volume')?.value);
  if (isNaN(volumen))      volumen = 70;
  if (isNaN(volumenJuego)) volumenJuego = 70;
  var sonidoNoti     = document.getElementById('notification-sound')?.checked;
  if (sonidoNoti === null || sonidoNoti === undefined) sonidoNoti = true;
  var sonidoJuego    = document.getElementById('completion-sound')?.checked;
  if (sonidoJuego === null || sonidoJuego === undefined) sonidoJuego = true;
  var autoTimer      = document.getElementById('auto-timer')?.checked;
  if (autoTimer === null || autoTimer === undefined) autoTimer = true;
  var realtimeStats  = document.getElementById('realtime-stats')?.checked;
  if (realtimeStats === null || realtimeStats === undefined) realtimeStats = true;
  var dificultad     = document.getElementById('default-difficulty')?.value   || 'todas';
  var cloudSync      = document.getElementById('cloud-sync')?.checked;
  if (cloudSync === null || cloudSync === undefined) cloudSync = false;
  var developerMode  = document.getElementById('developer-mode')?.checked;
  if (developerMode === null || developerMode === undefined) developerMode = false;
  var altoContraste = document.getElementById('high-contrast')?.checked;
  if (altoContraste === null || altoContraste === undefined) altoContraste = false;
  var escalaFuente = parseInt(document.getElementById('font-scale')?.value);
  if (isNaN(escalaFuente)) escalaFuente = 100;

  var configGuardar = {
    idioma: idioma,
    tema: tema,
    animaciones: animaciones,
    altoContraste: altoContraste,
    escalaFuente: escalaFuente,
    volumen: volumen,
    volumenJuego: volumenJuego,
    sonidoNoti: sonidoNoti,
    sonidoJuego: sonidoJuego,
    autoTimer: autoTimer,
    realtimeStats: realtimeStats,
    dificultad: dificultad,
    cloudSync: cloudSync,
    developerMode: developerMode
  };

  localStorage.setItem('appConfig', JSON.stringify(configGuardar));
  localStorage.setItem('appIdioma', idioma);
  localStorage.setItem('appTema', tema);

  hayaCambiosSinGuardar = false;

  var btn = document.querySelector('.btn-save');
  if (btn) {
    var original = btn.innerHTML;
    btn.innerHTML = '✅ ¡Guardado!';
    btn.style.background = 'linear-gradient(135deg,#6bcb77,#4d9e5a)';
    btn.disabled = true;
    setTimeout(function() {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 1500);
  }

  var notif = document.createElement('div');
  notif.textContent = (window.tConfig ? window.tConfig('confGuardadoOk') : '✅ Configuración guardada correctamente');
  notif.style.cssText = `
    position:fixed; bottom:100px; left:50%;
    transform:translateX(-50%);
    background:#6bcb77; color:white;
    padding:14px 28px; border-radius:25px;
    font-size:15px; font-weight:700;
    z-index:99999; font-family:'Poppins',sans-serif;
  `;
  document.body.appendChild(notif);
  setTimeout(function() { notif.remove(); }, 2000);

  console.log('💾 Guardado:', configGuardar);
}

function resetSettings() {
  localStorage.removeItem('appConfig');
  localStorage.removeItem('appIdioma');
  localStorage.removeItem('appTema');
  hayaCambiosSinGuardar = false;
  window.location.reload();
}

function clearCache() {
  var btn = document.querySelector('.btn-clean');
  if (btn) { btn.textContent = '⏳ Limpiando...'; btn.disabled = true; }
  
  setTimeout(function() {
    // ✅ GUARDAR CONFIGURACIÓN ACTUAL (NO BORRAR)
    var configActual = localStorage.getItem('appConfig');
    var idiomaActual = localStorage.getItem('appIdioma');
    var temaActual = localStorage.getItem('appTema');
    
    // ✅ GUARDAR PERFILES (NO BORRAR)
    var perfilesActuales = localStorage.getItem('ceartee_perfiles');
    var perfilActivo = localStorage.getItem('ceartee_perfil_activo');
    
    // ✅ BORRAR SOLO PROGRESO DE JUEGOS (stats)
    for (var i = localStorage.length - 1; i >= 0; i--) {
      var key = localStorage.key(i);
      if (key && key.includes('ceartee_perfil_') && key.includes('_stats')) {
        console.log('🗑️ Borrando progreso:', key);
        localStorage.removeItem(key);
      }
    }
    
    // ✅ BORRAR DATOS TEMPORALES Y CACHÉ
    var clavesTemporales = [
      'notificacionesDatos',
      'ceartee_ultimo_origen',
      'ceartee_autosave',
      'ceartee_sesion_activa',
      'ceartee_recuperar_indice',
      'ceartee_firebase_idToken',
      'ceartee_firebase_refreshToken',
      'ceartee_firebase_uid',
      'ceartee_firebase_email',
      'ultimaSincronizacion'
    ];
    
    clavesTemporales.forEach(function(clave) {
      localStorage.removeItem(clave);
    });
    
    // ✅ LIMPIAR SESSION STORAGE
    sessionStorage.clear();
    
    // ✅ RESTAURAR CONFIGURACIÓN (idioma, tema, etc.)
    if (configActual) localStorage.setItem('appConfig', configActual);
    if (idiomaActual) localStorage.setItem('appIdioma', idiomaActual);
    if (temaActual) localStorage.setItem('appTema', temaActual);
    
    // ✅ RESTAURAR PERFILES
    if (perfilesActuales) localStorage.setItem('ceartee_perfiles', perfilesActuales);
    if (perfilActivo) localStorage.setItem('ceartee_perfil_activo', perfilActivo);
    
    // ✅ REINICIALIZAR STATS DE CADA PERFIL A 0
    if (window.PerfilesManager && perfilesActuales) {
      try {
        var perfiles = JSON.parse(perfilesActuales);
        perfiles.forEach(function(perfil) {
          window.PerfilesManager.guardarDatos(perfil.id, 'stats', {
            juegosCompletados: 0,
            totalAciertos: 0,
            totalErrores: 0,
            mejorPuntuacion: 0,
            mejorRacha: 0,
            tiempoTotal: 0,
            ultimaActividad: null,
            juegos: {}
          });
          console.log('✅ Stats reiniciadas para:', perfil.nombre);
        });
      } catch(e) {
        console.error('Error reiniciando stats:', e);
      }
    }
    
    console.log('🧹 Caché limpiado (progreso borrado, perfiles y config conservados)');
    
    // Mostrar notificación de éxito
    var notif = document.createElement('div');
    notif.textContent = '✅ Progreso borrado. Perfiles y configuración conservados.';
    notif.style.cssText = `
      position:fixed; bottom:100px; left:50%;
      transform:translateX(-50%);
      background:#6bcb77; color:white;
      padding:14px 28px; border-radius:25px;
      font-size:15px; font-weight:700;
      z-index:99999; font-family:'Poppins',sans-serif;
      max-width: 80%;
      text-align: center;
    `;
    document.body.appendChild(notif);
    
    if (btn) { 
      btn.textContent = '✅ Limpiado'; 
      btn.disabled = false;
    }
    
    setTimeout(function() { 
      notif.remove();
      // Recargar para actualizar estrellas
      window.location.reload();
    }, 2000);
    
  }, 800);
}


// ==========================================
// DETECTAR CAMBIOS Y APLICAR VISUALMENTE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  var ids = [
    'language','theme','high-contrast','font-scale','animations','volume','game-volume',
    'notification-sound','completion-sound',
    'auto-timer','realtime-stats','default-difficulty',
    'cloud-sync','developer-mode'
  ];

  setTimeout(function() {
    ids.forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;

      el.addEventListener('change', function() {
        hayaCambiosSinGuardar = true;
        console.log('🔄 Cambio en:', id);

         if (id === 'high-contrast' && window.aplicarAltoContrasteGlobal) {
          window.aplicarAltoContrasteGlobal(el.checked);
        }

        if (id === 'language' && window.aplicarIdiomaGlobal) {
          window.aplicarIdiomaGlobal(el.value);
        }
        if (id === 'theme' && window.aplicarTemaGlobal) {
          window.aplicarTemaGlobal(el.value);
        }
        if (id === 'animations') {
          if (window.aplicarAnimacionesGlobal) {
            window.aplicarAnimacionesGlobal(el.checked);
          }
        }
        if (id === 'developer-mode') {
          if (el.checked) {
            document.body.classList.add('modo-dev');
          } else {
            document.body.classList.remove('modo-dev');
          }
        }

        if (id === 'notification-sound' && el.checked && window.sistemaSonido) {
          window.sistemaSonido.playNotificacion();
        }
        if (id === 'completion-sound' && el.checked && window.sistemaSonido) {
          window.sistemaSonido.playVictoria();
        }
      });

      // ✅ SLIDERS DE VOLUMEN - CORREGIDO
      if (el.type === 'range') {
        el.addEventListener('input', function() {
          hayaCambiosSinGuardar = true;

          if (id === 'font-scale') {
            var valSpanF = document.getElementById('font-scale-value');
            if (valSpanF) valSpanF.textContent = el.value + '%';
            if (window.aplicarEscalaFuenteGlobal) window.aplicarEscalaFuenteGlobal(el.value);
          }
          
          // ✅ Actualizar display del volumen principal
          if (id === 'volume') {
            var valSpan1 = document.getElementById('volume-value');
            if (valSpan1) {
              valSpan1.textContent = el.value + '%';
              console.log('🔊 Volumen principal:', el.value + '%');
            }
            window.__volumenGlobal = parseInt(el.value) / 100;
          }
          
          // ✅ Actualizar display del volumen del juego
          if (id === 'game-volume') {
            var valSpan2 = document.getElementById('game-volume-value');
            if (valSpan2) {
              valSpan2.textContent = el.value + '%';
              console.log('🎮 Volumen del juego:', el.value + '%');
            }
            window.__gameVolume = parseInt(el.value) / 100;
          }
        });

        el.addEventListener('change', function() {
          if (window.sistemaSonido) window.sistemaSonido.playNotificacion();
        });
      }
    });
    console.log('✅ Detector de cambios activo');
  }, 500);

  // Cargar config guardada
  try {
    var guardada = localStorage.getItem('appConfig');
    if (guardada) {
      var c = JSON.parse(guardada);

      var set = function(id, val, tipo) {
        var el = document.getElementById(id);
        if (!el) return;
        if (tipo === 'checked') el.checked = val;
        else el.value = String(val);
      };

      set('language',           c.idioma,         'value');
      set('theme',              c.tema,           'value');
      set('animations',         c.animaciones,    'checked');
      set('volume',             c.volumen,        'value');
      set('game-volume',        c.volumenJuego,   'value');
      set('notification-sound', c.sonidoNoti,     'checked');
      set('completion-sound',   c.sonidoJuego,    'checked');
      set('auto-timer',         c.autoTimer,      'checked');
      set('realtime-stats',     c.realtimeStats,  'checked');
      set('default-difficulty', c.dificultad,     'value');
      set('cloud-sync',         c.cloudSync,      'checked');
      set('developer-mode',     c.developerMode,  'checked');

      // ✅ ACTUALIZAR DISPLAYS AL CARGAR
      var elVol1 = document.getElementById('volume-value');
      if (elVol1) elVol1.textContent = (c.volumen != null ? c.volumen : 70) + '%';

      var elVol2 = document.getElementById('game-volume-value');
      if (elVol2) elVol2.textContent = (c.volumenJuego != null ? c.volumenJuego : 70) + '%';

      console.log('✅ Config cargada en UI');
    }
  } catch(e) {
    console.warn('Error cargando config:', e);
  }
});

// ==========================================
// FIREBASE AUTH + FIRESTORE - API REST
// ==========================================

const FIREBASE_API_KEY = 'AIzaSyDkQgcjq-3OfgkhHk5RALoX4gXIJbnxsTM';
const FIREBASE_PROJECT_ID = 'ceartee-fa0f8';

window.FirebaseAuthREST = {
  registrar: function(email, password, callback) {
    var self = this;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FIREBASE_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        callback(false, traducirErrorFirebase(data.error.message));
        return;
      }
      localStorage.setItem('ceartee_firebase_idToken', data.idToken);
      localStorage.setItem('ceartee_firebase_refreshToken', data.refreshToken);
      localStorage.setItem('ceartee_firebase_uid', data.localId);
      localStorage.setItem('ceartee_firebase_email', data.email);
      
      self.crearUsuarioEnFirestore(data.localId, data.idToken, {
        email: email,
        nombre: email.split('@')[0],
        creado: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString()
      }, function(okFirestore) {
        callback(true, okFirestore ? 'Cuenta creada y guardada' : 'Cuenta creada');
      });
    })
    .catch(function(err) {
      callback(false, 'Error de conexión: ' + err.message);
    });
  },

  login: function(email, password, callback) {
    var self = this;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FIREBASE_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        callback(false, traducirErrorFirebase(data.error.message));
        return;
      }
      localStorage.setItem('ceartee_firebase_idToken', data.idToken);
      localStorage.setItem('ceartee_firebase_refreshToken', data.refreshToken);
      localStorage.setItem('ceartee_firebase_uid', data.localId);
      localStorage.setItem('ceartee_firebase_email', data.email);
      
      self.actualizarUsuarioEnFirestore(data.localId, data.idToken, {
        ultimoAcceso: new Date().toISOString()
      });
      
      callback(true, 'Sesión iniciada');
    })
    .catch(function(err) {
      callback(false, 'Error de conexión: ' + err.message);
    });
  },

  logout: function(callback) {
    localStorage.removeItem('ceartee_firebase_idToken');
    localStorage.removeItem('ceartee_firebase_refreshToken');
    localStorage.removeItem('ceartee_firebase_uid');
    localStorage.removeItem('ceartee_firebase_email');
    if (callback) callback(true);
  },

  getUsuario: function() {
    var email = localStorage.getItem('ceartee_firebase_email');
    var uid   = localStorage.getItem('ceartee_firebase_uid');
    var token = localStorage.getItem('ceartee_firebase_idToken');
    if (!email || !uid || !token) return null;
    return { email: email, uid: uid, token: token };
  },

  getIdToken: function() {
    return localStorage.getItem('ceartee_firebase_idToken');
  },

  crearUsuarioEnFirestore: function(uid, idToken, datos, callback) {
    var url = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/usuarios/' + uid;
    var fields = {};
    for (var key in datos) {
      if (typeof datos[key] === 'string') fields[key] = { stringValue: datos[key] };
      else if (typeof datos[key] === 'number') fields[key] = { integerValue: String(datos[key]) };
      else if (typeof datos[key] === 'boolean') fields[key] = { booleanValue: datos[key] };
    }

    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken },
      body: JSON.stringify({ fields: fields })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) { console.error('❌ Firestore error:', data.error); callback(false); }
      else { console.log('✅ Usuario en Firestore'); callback(true); }
    })
    .catch(function(err) { console.error('❌ Firestore conn error:', err); callback(false); });
  },

  actualizarUsuarioEnFirestore: function(uid, idToken, datos) {
    this.crearUsuarioEnFirestore(uid, idToken, datos, function(){});
  },

  subirDatosLocales: function(callback) {
    var user = this.getUsuario();
    if (!user) { callback(false, 'No hay sesión activa'); return; }
    
    var config = localStorage.getItem('appConfig') || '{}';
    var stats  = localStorage.getItem('notificacionesDatos') || '{}';
    var perfiles = localStorage.getItem('ceartee_perfiles') || '[]';
    
    var url = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/usuarios/' + user.uid + '/datos/sync';
    
    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
      body: JSON.stringify({
        fields: {
          config: { stringValue: config },
          stats: { stringValue: stats },
          perfiles: { stringValue: perfiles },
          fecha: { stringValue: new Date().toISOString() }
        }
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) { callback(false, 'Error al subir: ' + JSON.stringify(data.error)); }
      else {
        localStorage.setItem('ultimaSincronizacion', new Date().toLocaleString());
        callback(true, 'Datos subidos correctamente');
      }
    })
    .catch(function(err) { callback(false, 'Error de conexión: ' + err.message); });
  },

  bajarDatosLocales: function(callback) {
    var user = this.getUsuario();
    if (!user) { callback(false, 'No hay sesión activa'); return; }
    
    var url = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/usuarios/' + user.uid + '/datos/sync';
    
    fetch(url, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + user.token }
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        if (data.error.code === 404) { callback(false, 'No hay datos en la nube aún'); }
        else { callback(false, 'Error al bajar: ' + JSON.stringify(data.error)); }
        return;
      }
      
      try {
        var fields = data.fields || {};
        if (fields.config && fields.config.stringValue) localStorage.setItem('appConfig', fields.config.stringValue);
        if (fields.stats && fields.stats.stringValue) localStorage.setItem('notificacionesDatos', fields.stats.stringValue);
        if (fields.perfiles && fields.perfiles.stringValue) localStorage.setItem('ceartee_perfiles', fields.perfiles.stringValue);
        callback(true, 'Datos descargados correctamente');
      } catch(e) {
        callback(false, 'Error procesando datos: ' + e.message);
      }
    })
    .catch(function(err) { callback(false, 'Error de conexión: ' + err.message); });
  }
};

function traducirErrorFirebase(codigo) {
  var errores = {
    'EMAIL_EXISTS': 'Este correo ya está registrado',
    'INVALID_EMAIL': 'Correo electrónico inválido',
    'INVALID_PASSWORD': 'Contraseña incorrecta',
    'EMAIL_NOT_FOUND': 'No existe cuenta con este correo',
    'WEAK_PASSWORD': 'La contraseña debe tener al menos 6 caracteres',
    'INVALID_LOGIN_CREDENTIALS': 'Correo o contraseña incorrectos'
  };
  return errores[codigo] || 'Error: ' + codigo;
}

// ==========================================
// UI SINCRONIZACIÓN
// ==========================================
function syncRegistrar() {
  var email = document.getElementById('sync-email').value.trim();
  var password = document.getElementById('sync-password').value;
  var msg = document.getElementById('sync-message');

  if (!email || !password) { msg.textContent = '⚠️ Escribe email y contraseña'; msg.style.color = '#f39c12'; return; }
  if (password.length < 6) { msg.textContent = '⚠️ Mínimo 6 caracteres'; msg.style.color = '#f39c12'; return; }

  msg.textContent = '⏳ Registrando...'; msg.style.color = '#667eea';
  window.FirebaseAuthREST.registrar(email, password, function(ok, texto) {
    msg.textContent = (ok ? '✅ ' : '❌ ') + texto;
    msg.style.color = ok ? '#38ef7d' : '#e74c3c';
    if (ok) syncActualizarUI();
  });
}

function syncLogin() {
  var email = document.getElementById('sync-email').value.trim();
  var password = document.getElementById('sync-password').value;
  var msg = document.getElementById('sync-message');

  if (!email || !password) { msg.textContent = '⚠️ Escribe email y contraseña'; msg.style.color = '#f39c12'; return; }

  msg.textContent = '⏳ Iniciando sesión...'; msg.style.color = '#667eea';
  window.FirebaseAuthREST.login(email, password, function(ok, texto) {
    msg.textContent = (ok ? '✅ ' : '❌ ') + texto;
    msg.style.color = ok ? '#38ef7d' : '#e74c3c';
    if (ok) syncActualizarUI();
  });
}

function syncLogout() {
  window.FirebaseAuthREST.logout(function(ok) { syncActualizarUI(); });
}

function syncSubir() {
  var status = document.getElementById('sync-status');
  status.textContent = '⏳ Subiendo...'; status.style.color = '#667eea';
  
  window.FirebaseAuthREST.subirDatosLocales(function(ok, texto) {
    status.textContent = (ok ? '✅ ' : '❌ ') + texto;
    status.style.color = ok ? '#38ef7d' : '#e74c3c';
    if (ok) syncActualizarUI();
  });
}

function syncBajar() {
  var status = document.getElementById('sync-status');
  status.textContent = '⏳ Bajando...'; status.style.color = '#667eea';
  
  window.FirebaseAuthREST.bajarDatosLocales(function(ok, texto) {
    status.textContent = (ok ? '✅ ' : '❌ ') + texto;
    status.style.color = ok ? '#38ef7d' : '#e74c3c';
    if (ok) {
      syncActualizarUI();
      setTimeout(function() { window.location.reload(); }, 1500);
    }
  });
}

function syncActualizarUI() {
  var info = window.FirebaseAuthREST ? window.FirebaseAuthREST.getUsuario() : null;
  var loginSection = document.getElementById('sync-login-section');
  var loggedSection = document.getElementById('sync-logged-section');
  var emailDisplay = document.getElementById('sync-email-display');

  // Si no estamos en la página de Configuración, salir sin hacer nada
  if (!loginSection || !loggedSection || !emailDisplay) return;

  if (info) {
    loginSection.style.display = 'none';
    loggedSection.style.display = 'block';
    emailDisplay.textContent = info.email;
  } else {
    loginSection.style.display = 'block';
    loggedSection.style.display = 'none';
  }

  var lastTime = localStorage.getItem('ultimaSincronizacion');
  var lastEl = document.getElementById('sync-last-time');
  if (lastEl) lastEl.textContent = lastTime ? '🕐 Última sincronización: ' + lastTime : '';
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() { syncActualizarUI(); }, 500);
});

// ==========================================
// CEARTEE - AUTO-UPDATER
// ==========================================
async function iniciarUpdater() {
  if (!window.__TAURI__) return;
  const { invoke, Channel } = window.__TAURI__.core;

  try {
    const update = await invoke('plugin:updater|check');
    if (!update) return;

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; display:flex; align-items:center; justify-content:center; font-family:"Poppins",sans-serif;';
    
    modal.innerHTML = `
      <div style="background:#1a1025; padding:30px; border-radius:20px; text-align:center; color:white; width:400px; box-shadow:0 20px 60px rgba(0,0,0,0.6); border: 1px solid #5b4fcf;">
        <div style="font-size:40px; margin-bottom:10px;">🚀</div>
        <h2 style="margin-top:0; color:#ffffff;">Nueva versión disponible</h2>
        <p style="color:#9589b0; margin-bottom:25px;">La versión ${update.version} de Murcia está lista para descargar.</p>
        
        <div id="update-progress-container" style="display:none; margin:20px 0;">
          <p id="update-status" style="margin-bottom:10px; font-size:14px; color:#ffffff;">Descargando... <strong id="update-percent">0%</strong></p>
          <div style="width:100%; background:#333; border-radius:10px; height:15px; overflow:hidden;">
            <div id="update-bar" style="width:0%; height:100%; background:linear-gradient(90deg, #5b4fcf, #6bcb77); transition: width 0.2s;"></div>
          </div>
        </div>

        <div id="update-buttons" style="display:flex; justify-content:center; gap:15px;">
          <button id="btn-update-no" style="padding:10px 20px; border-radius:25px; border:2px solid #5b4fcf; background:transparent; color:#5b4fcf; cursor:pointer; font-weight:bold;">Más tarde</button>
          <button id="btn-update-yes" style="padding:10px 25px; border-radius:25px; border:none; background:linear-gradient(135deg, #5b4fcf, #4d9e5a); color:white; cursor:pointer; font-weight:bold;">Actualizar ahora</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btn-update-no').onclick = () => modal.remove();
    
    document.getElementById('btn-update-yes').onclick = async () => {
      document.getElementById('update-buttons').style.display = 'none';
      document.getElementById('update-progress-container').style.display = 'block';
      
      const onEvent = new Channel();
      let downloaded = 0;
      let total = 0;

      onEvent.onmessage = (msg) => {
        if (msg.event === 'Started') {
          total = msg.data.contentLength || 0;
        } else if (msg.event === 'Progress') {
          downloaded += msg.data.chunkLength;
          if (total > 0) {
            const percent = Math.round((downloaded / total) * 100);
            document.getElementById('update-bar').style.width = percent + '%';
            document.getElementById('update-percent').innerText = percent + '%';
          }
        } else if (msg.event === 'Finished') {
          document.getElementById('update-status').innerText = 'Instalando... ¡Casi listo!';
          document.getElementById('update-bar').style.width = '100%';
          document.getElementById('update-percent').innerText = '100%';
        }
      };

      try {
        await invoke('plugin:updater|download_and_install', { onEvent: onEvent });
        document.getElementById('update-status').innerText = '¡Actualización completada! Reiniciando...';
        setTimeout(async () => {
          await invoke('plugin:process|restart');
        }, 1500);
      } catch (err) {
        alert('Error al actualizar: ' + err);
        modal.remove();
      }
    };

  } catch (err) {
    console.log("No hay actualizaciones o falló la verificación");
  }
}

// ==========================================
// EXPORTAR / IMPORTAR RESPALDO
// ==========================================
function exportarRespaldo() {
  try {
    var data = window.PerfilesManager.exportarTodo();
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var fecha = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'ceartee_respaldo_' + fecha + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);

    mostrarNotifConfig('✅ Respaldo exportado correctamente');
  } catch (e) {
    mostrarNotifConfig('❌ Error al exportar: ' + e.message, true);
  }
}

function importarRespaldo(event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var backup = JSON.parse(e.target.result);

      // Preguntar modo: combinar o reemplazar
      var reemplazar = confirm(
        'IMPORTAR RESPALDO\n\n' +
        'Aceptar = REEMPLAZAR todo (borra los perfiles actuales)\n' +
        'Cancelar = COMBINAR (conserva los actuales y añade los del archivo)'
      );
      var modo = reemplazar ? 'reemplazar' : 'combinar';

      var total = window.PerfilesManager.importarTodo(backup, modo);
      mostrarNotifConfig('✅ Importado correctamente (' + total + ' perfiles)');
      setTimeout(function() { window.location.reload(); }, 1500);
    } catch (err) {
      mostrarNotifConfig('❌ Archivo inválido: ' + err.message, true);
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // permite reimportar el mismo archivo
}

// Notificación reutilizable
function mostrarNotifConfig(texto, esError) {
  var notif = document.createElement('div');
  notif.textContent = texto;
  notif.style.cssText =
    'position:fixed; bottom:100px; left:50%; transform:translateX(-50%);' +
    'background:' + (esError ? '#e74c3c' : '#6bcb77') + '; color:white;' +
    'padding:14px 28px; border-radius:25px; font-size:15px; font-weight:700;' +
    'z-index:99999; font-family:"Poppins",sans-serif; max-width:80%; text-align:center;';
  document.body.appendChild(notif);
  setTimeout(function() { notif.remove(); }, 2500);
}


window.checkForUpdates = iniciarUpdater;
setTimeout(iniciarUpdater, 5000);