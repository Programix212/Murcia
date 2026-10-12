console.log('✅ settings.js OK');

// Helper de traducción para mensajes de esta página
window.tConfig = function(clave) {
  try {
    var cfg = JSON.parse(localStorage.getItem('appConfig') || '{}');
    var idioma = normIdiomaLocal(cfg.idioma);
    if (window.textosI18n && window.textosI18n[idioma] && window.textosI18n[idioma][clave]) {
      return window.textosI18n[idioma][clave];
    }
  } catch (e) {}
  return clave;
};

let hayaCambiosSinGuardar = false;

// ==========================================
// VALIDACIÓN DE CONFIG (antibug idioma/dificultad en otras PCs)
// Usa window.CearteeConfig si existe (aplicar-config.js), si no,
// réplica local mínima. Nunca deja 'undefined'/'ca'/tildes en la UI.
// ==========================================
function normIdiomaLocal(v) {
  if (window.CearteeConfig && window.CearteeConfig.normalizarIdioma) {
    return window.CearteeConfig.normalizarIdioma(v);
  }
  var s = String(v == null ? '' : v).trim().toLowerCase();
  return (s === 'en' || s === 'english') ? 'en' : 'es';
}
function normDificultadLocal(v) {
  if (window.CearteeConfig && window.CearteeConfig.normalizarDificultad) {
    return window.CearteeConfig.normalizarDificultad(v);
  }
  var s = String(v == null ? '' : v).trim().toLowerCase();
  if (s === 'easy' || s === 'medium' || s === 'hard') return s;
  return 'todas';
}
function normTemaLocal(v) {
  var s = String(v == null ? '' : v).trim().toLowerCase();
  if (s === 'light' || s === 'auto') return s;
  return 'dark';
}
// Asigna un <select> solo si el valor es válido; si no, usa el fallback.
// Evita el bug del select mostrando literalmente "undefined".
function setSelectValidado(id, val, permitidos, fallback) {
  var el = document.getElementById(id);
  if (!el) return;
  var v = String(val == null ? '' : val).trim();
  if (permitidos.indexOf(v) === -1) v = fallback;
  // Si el <option> no existe en el DOM (ej. dificultad comentada), no forzar
  var existe = false;
  try {
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].value === v) { existe = true; break; }
    }
  } catch (e) { existe = true; }
  el.value = existe ? v : fallback;
}

// ==========================================
// PREVIEW DE SONIDOS (ignora lo guardado, usa el slider actual)
// Para que el usuario escuche cómo suenan al activar el toggle
// ==========================================
function obtenerVolumenPreview() {
  var slider = document.getElementById('game-volume');
  var v = slider ? parseInt(slider.value) : 70;
  if (isNaN(v)) v = 70;
  return v / 100;
}

function previsualizarNotificacion() {
  var vol = obtenerVolumenPreview();
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

function previsualizarVictoria() {
  var vol = obtenerVolumenPreview();
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    var notas = [523, 659, 784, 1047];
    var duracion = 0.15;
    notas.forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      var inicio = ctx.currentTime + (i * duracion);
      gain.gain.setValueAtTime(vol * 0.5, inicio);
      gain.gain.linearRampToValueAtTime(0, inicio + duracion);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + duracion);
    });
  } catch (e) {}
}

function goBack() {
  console.log('goBack llamado, cambios:', hayaCambiosSinGuardar);
  if (hayaCambiosSinGuardar) {
    mostrarModal();
  } else {
    irAtras();
  }
}

// Navegación de salida (destino del botón Volver)
// Vuelve a la ventana anterior con fundido; solo si no hay historial cae a Categorias.html
function irAtras() {
  try {
    if (typeof window.cearteeBack === 'function') {
      window.cearteeBack('Categorias.html');
      return;
    }
    if (window.history && window.history.length > 1) {
      window.history.back();
      return;
    }
  } catch (e) {}
  var destino = 'Categorias.html';
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
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
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
    background: #c0392b;
    border-radius: 24px;
    padding: 40px 36px;
    max-width: 380px;
    width: 90%;
    text-align: center;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  `;

  var txtCambios = window.tConfig ? window.tConfig('cambiosSinGuardar') : 'Tienes cambios sin guardar';
  var txtDescartar = window.tConfig ? window.tConfig('descartarSalir') : '¿Deseas descartarlos y salir?';
  var txtQuedarme = window.tConfig ? window.tConfig('quedarme') : '✕ Quedarme';
  var txtSalir = window.tConfig ? window.tConfig('salirSinGuardar') : 'Salir sin guardar';

  caja.innerHTML = `
    <div style="margin-bottom:12px; font-size:48px">⚠️</div>
    <h3 style="color:#ffffff; font-size:1.2rem; font-weight:700; margin:0 0 8px">${txtCambios}</h3>
    <p style="color:rgba(255,255,255,0.8); font-size:0.95rem; margin:0 0 28px">${txtDescartar}</p>
    <div style="display:flex; gap:14px; justify-content:center;">
      <button id="btn-quedarme" style="
        padding: 12px 20px;
        border-radius: 50px;
        border: 2px solid rgba(255,255,255,0.5);
        background: transparent;
        color: #ffffff;
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
      ">${txtQuedarme}</button>
      <button id="btn-salir" style="
        padding: 12px 20px;
        border-radius: 50px;
        border: none;
        background: #ffffff;
        color: #ef4444;
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
      ">${txtSalir}</button>
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
    if (!c || typeof c !== 'object') return;

    const set = (id, val, tipo) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (tipo === 'checked') { el.checked = (val === true); return; }
      else el.value = String(val);
    };

    // Selects validados: nunca muestran "undefined"/"ca"/valores viejos
    setSelectValidado('language', normIdiomaLocal(c.idioma), ['es', 'en'], 'es');
    setSelectValidado('theme', normTemaLocal(c.tema), ['dark', 'light', 'auto'], 'dark');
    setSelectValidado('default-difficulty', normDificultadLocal(c.dificultad), ['todas', 'easy', 'medium', 'hard'], 'todas');
    set('high-contrast', c.altoContraste, 'checked');
    set('font-scale',    c.escalaFuente,  'value');
    set('animations',         c.animaciones,    'checked');
    set('volume',             c.volumen,        'value');
    set('game-volume',        c.volumenJuego,   'value');
    set('notification-sound', c.sonidoNoti,     'checked');
    set('completion-sound',   c.sonidoJuego,    'checked');
    set('auto-timer',         c.autoTimer,      'checked');
    set('realtime-stats',     c.realtimeStats,  'checked');
    set('cloud-sync',         c.cloudSync,      'checked');
    set('developer-mode',     c.developerMode,  'checked');

    // ✅ ACTUALIZAR DISPLAYS DE VOLUMEN
    var elVol1 = document.getElementById('volume-value');
    if (elVol1) elVol1.textContent = (c.volumen != null ? c.volumen : 70) + '%';

    var elVol2 = document.getElementById('game-volume-value');
    if (elVol2) elVol2.textContent = (c.volumenJuego != null ? c.volumenJuego : 70) + '%';

    if (window.aplicarIdiomaGlobal) window.aplicarIdiomaGlobal(normIdiomaLocal(c.idioma));
    if (window.aplicarTemaGlobal) window.aplicarTemaGlobal(normTemaLocal(c.tema));

    console.log('🔄 Config restaurada');
  } catch(e) {
    console.warn('Error restaurando:', e);
  }
}

function saveSettings() {
  // ✅ Leer la config actual para NO pisar las opciones cuyos controles
  // están ocultos/comentados en el HTML (tema, volumen principal, etc.)
  var configActual = {};
  try { configActual = JSON.parse(localStorage.getItem('appConfig') || '{}'); } catch(e) {}

  var idioma         = normIdiomaLocal(document.getElementById('language')?.value);
  var animaciones    = document.getElementById('animations')?.checked;
  if (animaciones === null || animaciones === undefined) animaciones = true;
  var volumenJuego = parseInt(document.getElementById('game-volume')?.value);
  if (isNaN(volumenJuego)) volumenJuego = 70;
  if (volumenJuego < 0) volumenJuego = 0;
  if (volumenJuego > 100) volumenJuego = 100;
  var sonidoNoti     = document.getElementById('notification-sound')?.checked;
  if (sonidoNoti === null || sonidoNoti === undefined) sonidoNoti = true;
  var sonidoJuego    = document.getElementById('completion-sound')?.checked;
  if (sonidoJuego === null || sonidoJuego === undefined) sonidoJuego = true;
  var autoTimer      = document.getElementById('auto-timer')?.checked;
  if (autoTimer === null || autoTimer === undefined) autoTimer = true;
  var realtimeStats  = document.getElementById('realtime-stats')?.checked;
  if (realtimeStats === null || realtimeStats === undefined) realtimeStats = true;
  var dificultad     = normDificultadLocal(document.getElementById('default-difficulty')?.value);
  var developerMode  = document.getElementById('developer-mode')?.checked;
  if (developerMode === null || developerMode === undefined) developerMode = false;

  var configGuardar = {
    idioma: idioma,
    // Opciones sin control visible: conservar lo guardado (validado)
    tema: normTemaLocal(configActual.tema),
    altoContraste: configActual.altoContraste === true,
    escalaFuente: configActual.escalaFuente || 100,
    volumen: (configActual.volumen != null ? configActual.volumen : 70),
    backupInterval: configActual.backupInterval || '15',
    cloudSync: configActual.cloudSync === true,
    // Opciones con control visible
    animaciones: animaciones,
    volumenJuego: volumenJuego,
    sonidoNoti: sonidoNoti,
    sonidoJuego: sonidoJuego,
    autoTimer: autoTimer,
    realtimeStats: realtimeStats,
    dificultad: dificultad,
    developerMode: developerMode
  };

  localStorage.setItem('appConfig', JSON.stringify(configGuardar));
  localStorage.setItem('appIdioma', idioma);
  localStorage.setItem('appTema', configGuardar.tema);

  hayaCambiosSinGuardar = false;

  var btn = document.querySelector('.btn-save');
  if (btn) {
    var original = btn.innerHTML;
    btn.innerHTML = (window.tConfig ? window.tConfig('guardado') : '¡Guardado!');
    btn.style.background = 'linear-gradient(135deg,#6bcb77,#4d9e5a)';
    btn.disabled = true;
    setTimeout(function() {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 1500);
  }

  var notif = document.createElement('div');
  notif.textContent = (window.tConfig ? window.tConfig('confGuardadoOk') : 'Configuración guardada correctamente');
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

// ==========================================
// MODAL DE CONFIRMACIÓN PARA ACCIONES DESTRUCTIVAS
// Mismo estilo que el resto de modales de la app
// ==========================================
function mostrarConfirmacionDestructiva(titulo, mensaje, textoAceptar, onAceptar) {
  var anterior = document.getElementById('modal-confirm-destructiva');
  if (anterior) anterior.remove();

  var modal = document.createElement('div');
  modal.id = 'modal-confirm-destructiva';
  modal.style.cssText = [
    'position:fixed; top:0; left:0;',
    'width:100%; height:100%;',
    'background:rgba(0,0,0,0.6);',
    'z-index:999999;',
    'display:flex;',
    'align-items:center;',
    'justify-content:center;'
  ].join('');

  var caja = document.createElement('div');
  caja.style.cssText = [
    'background:#c0392b;',
    'border-radius:24px;',
    'padding:40px 36px;',
    'max-width:380px;',
    'width:90%;',
    'text-align:center;',
    "font-family:'Poppins',sans-serif;",
    'box-shadow:0 24px 60px rgba(0,0,0,0.6);'
  ].join('');

  var txtCancelar = window.tConfig ? ('✕ ' + window.tConfig('cancelar')) : '✕ Cancelar';

  caja.innerHTML =
    '<div style="margin-bottom:12px; font-size:48px">⚠️</div>' +
    '<h3 style="color:#ffffff; font-size:1.2rem; font-weight:700; margin:0 0 8px">' + titulo + '</h3>' +
    '<p style="color:rgba(255,255,255,0.8); font-size:0.95rem; margin:0 0 28px">' + mensaje + '</p>' +
    '<div style="display:flex; gap:14px; justify-content:center;">' +
      '<button id="btn-destr-cancelar" style="' +
        'padding:12px 20px; border-radius:50px;' +
        'border:2px solid rgba(255,255,255,0.5);' +
        'background:transparent; color:#ffffff;' +
        "font-family:'Poppins',sans-serif;" +
        'font-size:0.85rem; font-weight:600; cursor:pointer;' +
      '">' + txtCancelar + '</button>' +
      '<button id="btn-destr-aceptar" style="' +
        'padding:12px 20px; border-radius:50px; border:none;' +
        'background:#ffffff; color:#ef4444;' +
        "font-family:'Poppins',sans-serif;" +
        'font-size:0.85rem; font-weight:700; cursor:pointer;' +
      '">' + textoAceptar + '</button>' +
    '</div>';

  modal.appendChild(caja);
  document.body.appendChild(modal);

  document.getElementById('btn-destr-cancelar').addEventListener('click', function() {
    modal.remove();
  });

  document.getElementById('btn-destr-aceptar').addEventListener('click', function() {
    modal.remove();
    if (typeof onAceptar === 'function') onAceptar();
  });
}

function resetSettings() {
  mostrarConfirmacionDestructiva(
    window.tConfig ? window.tConfig('restablecerTitulo') : 'Restablecer configuración',
    window.tConfig ? window.tConfig('restablecerMsg') : 'Se volverán los ajustes a sus valores por defecto. ¿Deseas continuar?',
    window.tConfig ? window.tConfig('confRestablecer') : 'Restablecer',
    function() {
      localStorage.removeItem('appConfig');
      localStorage.removeItem('appIdioma');
      localStorage.removeItem('appTema');
      hayaCambiosSinGuardar = false;
      window.location.reload();
    }
  );
}

function clearCache() {
  mostrarConfirmacionDestructiva(
    window.tConfig ? window.tConfig('borrarProgresoTitulo') : 'Borrar progreso',
    window.tConfig ? window.tConfig('borrarProgresoMsg') : 'Se eliminará el progreso de todos los perfiles. Los perfiles y ajustes se conservan. ¿Deseas continuar?',
    window.tConfig ? window.tConfig('borrarProgresoTitulo') : 'Borrar progreso',
    function() {
      ejecutarLimpiezaCache();
    }
  );
}

function ejecutarLimpiezaCache() {
  var btn = document.querySelector('.btn-clean');
  if (btn) { btn.textContent = (window.tConfig ? window.tConfig('limpiando') : '⏳ Limpiando...'); btn.disabled = true; }

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
    notif.textContent = (window.tConfig ? window.tConfig('progresoBorradoOk') : '✅ Progreso borrado. Perfiles y configuración conservados.');
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
      btn.textContent = (window.tConfig ? window.tConfig('limpiado') : '✅ Limpiado'); 
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

        if (id === 'notification-sound' && el.checked) {
          previsualizarNotificacion();
        }
        if (id === 'completion-sound' && el.checked) {
          previsualizarVictoria();
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
          if (id === 'game-volume') {
            var toggleNoti = document.getElementById('notification-sound');
            if (!toggleNoti || toggleNoti.checked) previsualizarNotificacion();
          }
        });
      }
    });
    console.log('✅ Detector de cambios activo');
  }, 500);

  // Cargar config guardada (validada: nunca "undefined"/"ca" en la UI)
  try {
    var guardada = localStorage.getItem('appConfig');
    if (guardada) {
      var c = JSON.parse(guardada);
      if (!c || typeof c !== 'object') throw new Error('config corrupta');

      var set = function(id, val, tipo) {
        var el = document.getElementById(id);
        if (!el) return;
        if (tipo === 'checked') { el.checked = (val === true); return; }
        else el.value = String(val);
      };

      setSelectValidado('language', normIdiomaLocal(c.idioma), ['es', 'en'], 'es');
      setSelectValidado('theme', normTemaLocal(c.tema), ['dark', 'light', 'auto'], 'dark');
      set('animations',         c.animaciones,    'checked');
      set('volume',             c.volumen,        'value');
      set('game-volume',        c.volumenJuego,   'value');
      set('notification-sound', c.sonidoNoti,     'checked');
      set('completion-sound',   c.sonidoJuego,    'checked');
      set('auto-timer',         c.autoTimer,      'checked');
      set('realtime-stats',     c.realtimeStats,  'checked');
      setSelectValidado('default-difficulty', normDificultadLocal(c.dificultad), ['todas', 'easy', 'medium', 'hard'], 'todas');
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
// NOTA: El auto-updater vive en updater.bundle.js (se carga en index.html).
// Aquí no va para no duplicar modales de actualización.
// ==========================================

// ==========================================
// EXPORTAR / IMPORTAR RESPALDO
// ==========================================
async function exportarRespaldo() {
  try {
    var data = await window.PerfilesManager.exportarTodo();

    var json = JSON.stringify(data, null, 2);
    var fecha = new Date().toISOString().slice(0, 10);
    var nombreArchivo = 'ceartee_respaldo_' + fecha + '.json';

    // ✅ Si el navegador soporta el selector de archivos, abrir explorador
    if (window.showSaveFilePicker) {
      try {
        var handle = await window.showSaveFilePicker({
          suggestedName: nombreArchivo,
          types: [{
            description: 'Archivo JSON',
            accept: { 'application/json': ['.json'] }
          }]
        });
        var writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        mostrarNotifConfig(' ' + (window.tConfig ? window.tConfig('respaldoGuardado') : 'Respaldo guardado correctamente'));
        return;
      } catch (err) {
        // Si el usuario cancela el diálogo, no hacer nada
        if (err && err.name === 'AbortError') return;
        // Si falla por otra razón, caer al método clásico
        console.warn('showSaveFilePicker falló, usando descarga directa:', err);
      }
    }

    // Respaldo: descarga directa a la carpeta de descargas
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);

    mostrarNotifConfig(' ' + (window.tConfig ? window.tConfig('respaldoExportado') : 'Respaldo exportado correctamente'));
  } catch (e) {
    mostrarNotifConfig(' ' + (window.tConfig ? window.tConfig('errorExportar') : 'Error al exportar') + ': ' + e.message, true);
  }
}

function importarRespaldo(event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = async function(e) {
    try {
      var backup = JSON.parse(e.target.result);
      mostrarModalImportar(backup);
    } catch (err) {
      mostrarNotifConfig(' ' + (window.tConfig ? window.tConfig('archivoInvalido') : 'Archivo inválido') + ': ' + err.message, true);
    }
  };

  reader.readAsText(file);
  event.target.value = ''; // permite reimportar el mismo archivo
}

// Modal bilingüe: Reemplazar vs Combinar (reemplaza al confirm nativo)
function mostrarModalImportar(backup) {
  try {
    var anterior = document.getElementById('modal-importar');
    if (anterior) anterior.remove();

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = (s === null || s === undefined) ? '' : String(s);
      return d.innerHTML;
    }
    var T = function(c, fb) {
      var v = window.tConfig ? window.tConfig(c) : fb;
      return (v === c && fb) ? fb : v;
    };

    var modal = document.createElement('div');
    modal.id = 'modal-importar';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText =
      'position:fixed; top:0; left:0; width:100%; height:100%;' +
      'background:rgba(0,0,0,0.6); z-index:999999;' +
      'display:flex; align-items:center; justify-content:center;';

    var caja = document.createElement('div');
    caja.style.cssText =
      'background:#c0392b; border-radius:24px; padding:40px 36px;' +
      'max-width:380px; width:90%; text-align:center;' +
      "font-family:'Poppins',sans-serif;" +
      'box-shadow:0 24px 60px rgba(0,0,0,0.6);';

    caja.innerHTML =
      '<div style="margin-bottom:12px; font-size:48px;">📥</div>' +
      '<h3 style="color:#ffffff; font-size:1.2rem; font-weight:700; margin:0 0 8px;">' + esc(T('importarTitulo', 'Importar respaldo')) + '</h3>' +
      '<p style="color:rgba(255,255,255,0.8); font-size:0.95rem; margin:0 0 20px;">' + esc(T('importarPregunta', '¿Cómo quieres importar?')) + '</p>' +
      '<div style="display:flex; flex-direction:column; gap:12px;">' +
        '<button id="btn-imp-reemplazar" style="padding:12px 20px; border-radius:50px; border:none; background:#ffffff; color:#c0392b; font-family:inherit; font-size:0.9rem; font-weight:700; cursor:pointer;">' +
          esc(T('importarReemplazar', 'Reemplazar todo')) +
          '<span style="display:block; font-weight:400; font-size:0.8rem; color:#c0392b; opacity:0.7;">' + esc(T('importarReemplazarDesc', 'Borra los perfiles actuales')) + '</span>' +
        '</button>' +
        '<button id="btn-imp-combinar" style="padding:12px 20px; border-radius:50px; border:2px solid rgba(255,255,255,0.5); background:transparent; color:#ffffff; font-family:inherit; font-size:0.9rem; font-weight:600; cursor:pointer;">' +
          esc(T('importarCombinar', 'Combinar')) +
          '<span style="display:block; font-weight:400; font-size:0.8rem; opacity:0.7;">' + esc(T('importarCombinarDesc', 'Conserva los actuales y añade los del archivo')) + '</span>' +
        '</button>' +
      '</div>';

    modal.appendChild(caja);
    document.body.appendChild(modal);

    function cerrar() { try { modal.remove(); } catch (e) {} }

    async function continuar(modo) {
      cerrar();
      try {
        var total = await window.PerfilesManager.importarTodo(backup, modo);
        mostrarNotifConfig(' ' + T('importadoOk', 'Importado correctamente') + ' (' + total + ' ' + T('perfilesTxt', 'perfiles') + ')');
        setTimeout(function() { window.location.reload(); }, 1500);
      } catch (err) {
        mostrarNotifConfig(' ' + T('archivoInvalido', 'Archivo inválido') + ': ' + err.message, true);
      }
    }

    var btnR = document.getElementById('btn-imp-reemplazar');
    if (btnR) btnR.addEventListener('click', function() { continuar('reemplazar'); });
    var btnC = document.getElementById('btn-imp-combinar');
    if (btnC) btnC.addEventListener('click', function() { continuar('combinar'); });
    modal.addEventListener('click', function(e) { if (e.target === modal) cerrar(); });
  } catch (e) {
    console.error('Error mostrando modal importar:', e);
  }
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