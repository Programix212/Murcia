// ==========================================
// CEARTEE - Vista de Juego (COMPLETO CON I18N)
// ==========================================

let jclicPlayer    = null;
let currentProjectUrl = null;
let juegoListo     = false;
var saliendo       = false;

// ==========================================
// HELPER DE TRADUCCIÓN
// ==========================================
function tVista(clave) {
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
// CONFIGURACIÓN: Segundos de pantalla de carga
// ==========================================
const DURACION_CARGA_MS = 5000;

// ==========================================
// 🔓 DESBLOQUEO DE AUDIO PARA TAURI
// ==========================================
let audioDesbloqueado = false;

function desbloquearAudioTauri() {
  if (audioDesbloqueado) return;
  if (!window._ctx) window._ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (window._ctx.state === 'suspended') {
    window._ctx.resume().then(() => {
      console.log('✅ AudioContext desbloqueado');
      audioDesbloqueado = true;
      setTimeout(() => reproducirSonidoInicio(), 300);
    });
  } else {
    audioDesbloqueado = true;
    setTimeout(() => reproducirSonidoInicio(), 300);
  }
}
window.addEventListener('click', desbloquearAudioTauri, { once: true });
window.addEventListener('keydown', desbloquearAudioTauri, { once: true });

// ==========================================
// 🔊 SONIDO UI DE FEEDBACK
// ==========================================
function reproducirSonidoUI(tipo) {
  try {
    let ctx = window._ctx || window._audioCtx;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      window._ctx = ctx;
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    let vol = 0.7;
    try {
      const c = JSON.parse(localStorage.getItem('appConfig') || '{}');
      vol = ((c.volumenJuego != null ? c.volumenJuego : 70) / 100);
    } catch(e) {}
    
    if (vol === 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (tipo === 'navegar') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gain.gain.setValueAtTime(0.1 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (tipo === 'accion') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.07);
      gain.gain.setValueAtTime(0.1 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch(e) {}
}

// ==========================================
// DETENER TODOS LOS AUDIOS
// ==========================================
function detenerTodosLosAudios() {
  try {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause(); audio.currentTime = 0; audio.muted = true;
    });
    if (window.JClicObject) {
      const player = window.JClicObject.currentPlayers?.[0];
      if (player?.activeMediaPlayers) {
        player.activeMediaPlayers.forEach(mp => {
          try { if (mp && typeof mp.stop === 'function') mp.stop(); } catch(e){}
          try { if (mp && typeof mp.pause === 'function') mp.pause(); } catch(e){}
        });
      }
    }
    console.log('🔇 Audios detenidos');
  } catch(e) {
    console.warn('⚠️ Error al detener audios:', e);
  }
}

// ==========================================
// ✅ ESTADO DE LOS BOTONES
// ==========================================
function setBotonesHabilitados(habilitados) {
  const btnAnterior  = document.querySelector('.btn-nav1');
  const btnSiguiente = document.querySelector('.btn-nav2');
  const btnReiniciar = document.querySelector('.btn-nav3');
  [btnAnterior, btnSiguiente, btnReiniciar].forEach(btn => {
    if (btn) {
      btn.disabled = !habilitados;
      btn.style.opacity = habilitados ? '1' : '0.4';
      btn.style.pointerEvents = habilitados ? 'auto' : 'none';
    }
  });
}

function asegurarBotonesActivos() {
  document.querySelectorAll('.btn-nav1, .btn-nav2, .btn-nav3').forEach(function(btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
  });
}

// ==========================================
// ✅ FALLBACK: CLIC EN BOTONES NATIVOS DE JCLIC
// ==========================================
function clickBotonNativo(tipo) {
  var selectores = tipo === 'next' 
    ? ['.JClicNavNext','[class*="NavNext"]','[class*="navNext"]','[title*="siguiente"]','[title*="next"]','button[aria-label*="next"]']
    : ['.JClicNavPrev','[class*="NavPrev"]','[class*="navPrev"]','[title*="anterior"]','[title*="prev"]','button[aria-label*="prev"]'];
  for (var i=0; i<selectores.length; i++) {
    var btn = document.querySelector(selectores[i]);
    if (btn) { console.log('🖱️ Fallback: clic nativo', selectores[i]); btn.click(); return true; }
  }
  return false;
}

// ==========================================
// ✅ VALIDAR ESTRUCTURA DEL ZIP
// ==========================================
// Caché de juegos ya validados en esta sesión (evita re-descomprimir al reabrir)
window.__cacheValidacionJuegos = window.__cacheValidacionJuegos || {};

async function validarZipJClic(url) {
  // Si este juego ya se validó correctamente antes, no volver a descomprimirlo
  if (window.__cacheValidacionJuegos[url]) {
    console.log('⚡ Validación servida desde caché:', url);
    return { valido: true, error: null };
  }
  try {
    if (!window.JSZip) return { valido: true, error: null };
    var respuesta = await fetch(url);
    if (!respuesta.ok) return { valido: false, error: tVista('errorNoDescargar') };
    var blob = await respuesta.blob();
    if (blob.size < 1024) return { valido: false, error: tVista('errorZipVacio') };
    var zip;
    try { zip = await window.JSZip.loadAsync(blob); }
    catch(zipErr) { return { valido: false, error: tVista('errorZipDanado') }; }
    var archivos = Object.keys(zip.files);
    var tieneProyecto = archivos.some(function(n){ return n.endsWith('.jclic') || n.endsWith('.xml'); });
    if (!tieneProyecto) return { valido: false, error: tVista('errorNoProyecto') };
    var archivoJclic = archivos.find(function(n){ return n.endsWith('.jclic') || n.endsWith('.xml'); });
    if (archivoJclic) {
      try {
        var contenido = await zip.file(archivoJclic).async('string');
        if (!contenido || contenido.length < 50) return { valido: false, error: tVista('errorProyectoVacio') };
      } catch(readErr) { return { valido: false, error: tVista('errorZipCorrupto') }; }
    }
    // Validación exitosa: guardar en caché para próximas aperturas
    window.__cacheValidacionJuegos[url] = true;
    return { valido: true, error: null };
  } catch(e) { return { valido: true, error: null }; }
}

// ==========================================
// ✅ PANTALLA DE ERROR AMIGABLE (CON I18N)
// ==========================================
function mostrarPantallaError(mensaje, permiteReintentar) {
  const container = document.getElementById('jclic-container');
  if (!container) return;
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:400px;padding:40px;text-align:center;font-family:'Poppins',sans-serif;">
      <div style="font-size:72px;margin-bottom:16px;">😔</div>
      <h2 style="color:#ff6b6b;font-size:26px;margin-bottom:12px;">${tVista('errorTituloCarga')}</h2>
      <p style="color:#e0e0e0;font-size:17px;max-width:420px;margin-bottom:32px;line-height:1.6;">${mensaje}</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;">
        ${permiteReintentar ? `
        <button onclick="window.accionErrorCarga('reintentar')" style="padding:14px 32px;border-radius:30px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:16px;cursor:pointer;font-weight:600;">🔄 ${tVista('btnReintentar')}</button>` : ''}
        <button onclick="window.accionErrorCarga('volver')" style="padding:14px 32px;border-radius:30px;border:2px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);color:white;font-size:16px;cursor:pointer;font-weight:600;">← ${tVista('volverMenu')}</button>
      </div>
    </div>
  `;
}

window.accionErrorCarga = function(tipo) {
  if (tipo === 'reintentar' && window.__ultimaRutaJuego) {
    cargarJuegoJClic(window.__ultimaRutaJuego, window.__ultimoNombreJuego);
  } else {
    exitGame();
  }
};

// ==========================================
// CARGAR JUEGO JCLIC CON BARRA CONTROLADA (CON I18N)
// ==========================================
function cargarJuegoJClic(rutaZip, nombreJuego) {
  console.log('🎮 Cargando:', rutaZip, '| Nombre:', nombreJuego);
  juegoListo = false;
  window.__ultimaRutaJuego = rutaZip;
  window.__ultimoNombreJuego = nombreJuego;
  window.__tiempoInicioCarga = Date.now();

  const container = document.getElementById('jclic-container');

  container.innerHTML = `
    <div id="jclic-stage" style="width:100%; height:100%; position:relative; z-index:1;"></div>
    <div class="ceartee-loader" id="ceartee-loader" style="
      position:absolute; inset:0; z-index:10;
      background:#ffffff;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      gap:12px;
      font-family:'Poppins',sans-serif;
    ">
      <p style="
        font-size:1rem; font-weight:600;
        color:#374151; letter-spacing:0.05em;
        margin:0;
      " id="loader-subtitle">Cargando<span id="loader-dots"></span></p>
      <div style="
        width:220px; height:14px;
        background:#f3f4f6;
        border-radius:999px;
        overflow:hidden;
        border:1px solid #e5e7eb;
      ">
        <div id="loader-bar-fill" style="
          height:100%; width:0%;
          background:#facc15;
          border-radius:999px;
          transition:width 0.25s ease;
        "></div>
      </div>
    </div>
  `;


  const stage = document.getElementById('jclic-stage');
  const barraFill = document.getElementById('loader-bar-fill');
  const subtitleEl = document.getElementById('loader-subtitle');

  sessionStorage.setItem('juego_actividad', rutaZip);
  sessionStorage.setItem('juego_nombre', nombreJuego);
  var paginaOrigen = sessionStorage.getItem('juego_origen') || document.referrer || 'Etapas.html';
  if (paginaOrigen.includes('vista.html') || paginaOrigen === '' || paginaOrigen === window.location.href) paginaOrigen = 'Etapas.html';
  sessionStorage.setItem('juego_origen', paginaOrigen);
  localStorage.setItem('ceartee_ultimo_origen', paginaOrigen);
  currentProjectUrl = rutaZip;

  // ✅ TRADUCIR EL NOMBRE DEL JUEGO AL IDIOMA ACTUAL
  const titleEl = document.getElementById('gameTitle');
  if (titleEl) {
    const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    const idioma = config.idioma || 'es';
    if (window.textosI18n && window.textosI18n[idioma] && window.textosI18n[idioma].nombresJuegos) {
      const nombreTraducido = window.textosI18n[idioma].nombresJuegos[nombreJuego] || nombreJuego;
      titleEl.textContent = nombreTraducido;
    } else {
      titleEl.textContent = nombreJuego;
    }
  }

  let progresoActual = 0;
  let cargaMinimaCompleta = false;
  let jclicListo = false;
  let errorCarga = false;
  let intervaloBarra = null;
  let timeoutError = null;
  let intervaloVerificacion = null;

  const fps = 30;
  const paso = 100 / ((DURACION_CARGA_MS / 1000) * fps);
  intervaloBarra = setInterval(() => {
    progresoActual += paso;
    if (progresoActual >= 100) {
      progresoActual = 100;
      if (barraFill) barraFill.style.width = '100%';
      cargaMinimaCompleta = true;
      clearInterval(intervaloBarra);
     if (subtitleEl) subtitleEl.textContent = '¡Listo!'; 
      verificarFinalizacion();
    } else {
      if (barraFill) barraFill.style.width = progresoActual + '%';
    }
  }, 1000 / fps);

  timeoutError = setTimeout(function() {
    if (!jclicListo && !errorCarga) {
      errorCarga = true;
      clearInterval(intervaloBarra);
      mostrarPantallaError(tVista('errorTimeout'), true);
    }
  }, 12000);

  function detenerVerificacion() {
    if (intervaloVerificacion) { clearInterval(intervaloVerificacion); intervaloVerificacion = null; }
  }

  function onCargaExitosa() {
    if (jclicListo || errorCarga) return;
    jclicListo = true;
    detenerVerificacion();
    clearTimeout(timeoutError);
    console.log('🎮 JClic reportó carga exitosa');
    verificarFinalizacion();
  }

  function verificarFinalizacion() {
    if (cargaMinimaCompleta && jclicListo) {
      finalizarCargaVisual();
    } else if (cargaMinimaCompleta && !jclicListo) {
      if (subtitleEl) subtitleEl.textContent = 'Cargando...';

    }
  }

  function finalizarCargaVisual() {
    if (juegoListo) return;
    juegoListo = true;

    const loader = document.getElementById('ceartee-loader');
    if (loader) {
      loader.style.transition = 'opacity 0.5s ease';
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => {
        if (loader.parentNode) loader.remove();
        limpiarInterfazJClic();
        asegurarBotonesActivos();
        iniciarObservadorJClic();
        // ✅ Arrancar el cronómetro ahora que el juego está visible
        if (typeof window.iniciarRelojJuego === 'function') {
          window.iniciarRelojJuego();
        }
        console.log('🎮 Juego verificado y listo');
      }, 500);
    } else {
      limpiarInterfazJClic();
      asegurarBotonesActivos();
      iniciarObservadorJClic();
      // ✅ Arrancar el cronómetro también por si el loader no estaba
      if (typeof window.iniciarRelojJuego === 'function') {
        window.iniciarRelojJuego();
      }
    }
  }


  let intentosVerif = 0;
  intervaloVerificacion = setInterval(function() {
    intentosVerif++;
    var hayCanvas = !!stage.querySelector('canvas');
    var tieneImagenes = stage.querySelectorAll('img').length > 0;
    var tieneJClicUI = stage.querySelectorAll('.JClicPlayer, .actPanel, [class*="JClic"]').length > 0;

    if (hayCanvas || tieneJClicUI || tieneImagenes) {
      detenerVerificacion();
      onCargaExitosa();
      return;
    }
    if (intentosVerif >= 30) {
      detenerVerificacion();
    }
  }, 800);

  var intentosJClic = 0;
  var maxIntentos = 50;
  function intentarCargar() {
    if (window.JClic) {
      var url = new URL(rutaZip, window.location.href).href;
      console.log('📦 Ruta resuelta:', url);
      validarZipJClic(url).then(function(resultado) {
        if (!resultado.valido) {
          errorCarga = true;
          clearInterval(intervaloBarra);
          clearTimeout(timeoutError);
          detenerVerificacion();
          mostrarPantallaError(resultado.error, false);
          return;
        }
        try {
          jclicPlayer = window.JClic.loadProject(
            stage, url,
            { fade: 0, counters: false, maxWaitTime: 30000, info: false, reportsBtn: false },
            function(player) { onCargaExitosa(); }
          );
        } catch (err) {
          errorCarga = true;
          clearInterval(intervaloBarra);
          clearTimeout(timeoutError);
          detenerVerificacion();
          mostrarPantallaError(tVista('errorMotor'), true);
        }
      });
    } else if (intentosJClic < maxIntentos) {
      intentosJClic++;
      setTimeout(intentarCargar, 200);
    } else {
      errorCarga = true;
      clearInterval(intervaloBarra);
      clearTimeout(timeoutError);
      detenerVerificacion();
      mostrarPantallaError(tVista('errorNoMotor'), false);
    }
  }
  intentarCargar();
}

// ==========================================
// NAVEGACIÓN CON SONIDO (CON I18N)
// ==========================================
function irActividadSiguiente() {
  reproducirSonidoUI('navegar');
  console.log('➡️ Siguiente');
  if (clickBotonNativo('next')) {
    setTimeout(limpiarInterfazJClic, 50);
  } else {
    mostrarMensaje(tVista('noPuedeAvanzar'));
  }
}

function irActividadAnterior() {
  reproducirSonidoUI('navegar');
  console.log('⬅ Anterior');
  if (clickBotonNativo('prev')) {
    setTimeout(limpiarInterfazJClic, 50);
  } else {
    mostrarMensaje(tVista('noPuedeRetroceder'));
  }
}

// ==========================================
// REINICIAR / SALIR / MENSAJES
// ==========================================
function reiniciarActividad() {
  reproducirSonidoUI('accion');
  console.log('🔄 Reiniciando');
  detenerTodosLosAudios();
  window.location.reload();
}

function exitGame() {
  if (saliendo) return;
  saliendo = true;
  reproducirSonidoUI('accion');
  console.log('🏠 Saliendo...');
  detenerTodosLosAudios();
  
  var origen = sessionStorage.getItem('juego_origen') || localStorage.getItem('ceartee_ultimo_origen') || 'Etapas.html';
  if (!origen || origen === 'null' || origen === 'undefined' || origen === '') {
    origen = 'Etapas.html';
  }
  
  sessionStorage.removeItem('juego_actividad');
  sessionStorage.removeItem('juego_nombre');
  sessionStorage.removeItem('juego_origen');
  
  cearteeNavigate(origen);
}

function mostrarMensaje(texto) {
  var msg = document.getElementById('msg-temporal');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'msg-temporal';
    msg.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 30px;border-radius:12px;font-size:16px;z-index:9999;transition:opacity 0.3s;';
    document.body.appendChild(msg);
  }
  msg.textContent = texto;
  msg.style.opacity = '1';
  setTimeout(() => { msg.style.opacity = '0'; }, 2000);
}

// ==========================================
// FULLSCREEN
// ==========================================
function toggleFullscreen() {
  const gameContainer = document.getElementById('jclic-container');
  if (!document.fullscreenElement) {
    (gameContainer.requestFullscreen || gameContainer.webkitRequestFullscreen).call(gameContainer);
    var btn = document.getElementById('btn-fullscreen');
    if (btn) btn.textContent = '✕';
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    var btn = document.getElementById('btn-fullscreen');
    if (btn) btn.textContent = '⛶';
  }
}
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    var btn = document.getElementById('btn-fullscreen');
    if (btn) btn.textContent = '⛶';
  }
});

// ==========================================
// REPRODUCIR SONIDO INICIO
// ==========================================
function reproducirSonidoInicio() {
  try {
    const p = window.JClicObject?.currentPlayers?.[0];
    if (!p?.actPanel?.act) return;
    const eventSounds = p.actPanel.act.eventSounds;
    if (!eventSounds?.elements) return;
    const startSound = eventSounds.elements['start'];
    if (startSound) {
      if (startSound.play) startSound.play();
      if (startSound.audio) { startSound.audio.currentTime = 0; startSound.audio.play(); }
    }
  } catch(e) { console.log('⚠️ Error reproduciendo inicio:', e); }
}

// ==========================================
// INICIALIZAR (CON I18N)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  saliendo = false;
  const params = new URLSearchParams(window.location.search);
  const origenURL = params.get('origen');
  if (origenURL) sessionStorage.setItem('juego_origen', decodeURIComponent(origenURL));
  
  let actividad = sessionStorage.getItem('juego_actividad');
  let nombre    = sessionStorage.getItem('juego_nombre') || 'Juego';
  
  if (!actividad) {
    actividad = params.get('actividad');
    nombre    = params.get('nombre') || nombre;
  }

  if (actividad) {
    cargarJuegoJClic(decodeURIComponent(actividad), nombre);
  } else {
    document.getElementById('jclic-container').innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>❌ ${tVista('errorNoJuego')}</h2>
        <button onclick="cearteeNavigate('Etapas.html')" style="margin-top:20px; padding:10px 30px; border-radius:10px; cursor:pointer;">
          ← ${tVista('volverMenu')}
        </button>
      </div>`;
  }
});

// ==========================================
// 🧹 LIMPIAR INTERFAZ INTERNA DE JCLIC
// ==========================================
function limpiarInterfazJClic() {
  var container = document.getElementById('jclic-container');
  if (!container) return;
  var selectoresOcultar = [
    '.JClicNavNext', '.JClicNavPrev', '.JClicNavBtn',
    '[class*="NavNext"]', '[class*="NavPrev"]', '[class*="navNext"]', '[class*="navPrev"]',
    '.JClicCounter', '[class*="Counter"]',
    '.JClicMsgBox', '.JClicMessage', '[class*="MsgBox"]',
    '.JClicReportsBtn', '[class*="Report"]'
  ];
  selectoresOcultar.forEach(function(sel) {
    try {
      container.querySelectorAll(sel).forEach(function(el) { el.style.display = 'none'; });
    } catch(e){}
  });
  container.querySelectorAll('.actPanel, [class*="actPanel"], .JClicPlayer, .JClicContainer').forEach(function(panel) {
    panel.style.width = '100%'; panel.style.height = '100%';
  });
}

// ==========================================
// 👁️ OBSERVADOR
// ==========================================
var observadorJClic = null;
function iniciarObservadorJClic() {
  var container = document.getElementById('jclic-container');
  if (!container || observadorJClic) return;
  observadorJClic = new MutationObserver(function() { limpiarInterfazJClic(); });
  observadorJClic.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style'] });
}

// ==========================================
// 🔊 VOLUMEN
// ==========================================
function aplicarVolumenJClic() {
  try {
    var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    var vol = (config.volumen != null ? config.volumen : 70) / 100;
    document.querySelectorAll('audio, video').forEach(function(el) { el.volume = vol; });
    var container = document.getElementById('jclic-container');
    if (container) container.querySelectorAll('audio, video').forEach(function(el) { el.volume = vol; });
  } catch(e){}
}
setInterval(aplicarVolumenJClic, 1000);
window.addEventListener('load', function() { setTimeout(aplicarVolumenJClic, 3000); });

var audioOriginal = window.Audio;
window.Audio = function(src) {
  var audio = new audioOriginal(src);
  try {
    var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    audio.volume = (config.volumen != null ? config.volumen : 70) / 100;
  } catch(e){}
  return audio;
};

// ==========================================
// 🛡️ MODO KIOSCO (CON I18N)
// ==========================================
(function iniciarModoKiosco() {
  var teclasBloqueadas = [116, 123];
  window.addEventListener('keydown', function(e) {
    if (teclasBloqueadas.indexOf(e.keyCode) !== -1) { e.preventDefault(); e.stopPropagation(); return false; }
    var combos = [
      {ctrl:true, key:'r'}, {ctrl:true, key:'w'}, {ctrl:true, key:'n'},
      {alt:true, key:'F4'}, {ctrl:true, shift:true, key:'I'},
      {ctrl:true, shift:true, key:'J'}, {ctrl:true, shift:true, key:'C'}
    ];
    for (var i=0; i<combos.length; i++) {
      var c = combos[i], match = true;
      if (c.ctrl && !e.ctrlKey) match = false;
      if (c.alt && !e.altKey) match = false;
      if (c.shift && !e.shiftKey) match = false;
      if (e.key.toLowerCase() !== c.key.toLowerCase()) match = false;
      if (match) { e.preventDefault(); e.stopPropagation(); return false; }
    }
  }, true);
  window.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });
  var escCount = 0, escTimer = null;
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      escCount++;
      if (escCount === 1) { mostrarMensaje(tVista('kioscoPresionaEsc')); escTimer = setTimeout(function(){ escCount = 0; }, 2000); }
      if (escCount >= 2) { clearTimeout(escTimer); escCount = 0; exitGame(); }
    }
  });
  // Cuando termine el juego, actualizar estrellas
if (window.EstrellasManager) {
  window.EstrellasManager.actualizarDOM();
  console.log('⭐ Estrellas actualizadas tras terminar juego');
}
  console.log('🛡️ Modo Kiosco activado');

})();