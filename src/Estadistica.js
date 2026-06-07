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

  //Saberes
  "valores1.ass", "familia.puz", "8dir2.ass", "bloc_mc5.ass", "blofcm21.ass",
  "pc_nosw3.ass", "porta.ass", "formes21.ass", "num7_9_9.ass", "pm5plou.puz",
  "pvee0.ass", "aliment.ass", "6789tris.ass", "comp23.ass", "desco104.ass",
  "nens.puz", "num0g.puz", "parejas.puz", "55.ass", "54.ass",
  "despues.ass", "9joc.ass", "pnu5.puz", "trenca4.puz", "l5.puz",
  "acnina6.puz", "txiki30.puz", "gnoms2.ass", "Secuen79.pac", "lluna.puz",
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
  }, 100);
}

// ==========================================
// REGISTRAR ACTIVIDAD
// ==========================================
function registrarActividad(nombre, datos, tiempoActividad) {
  if (!nombre) return;
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

// ==========================================
// FINALIZAR JUEGO
// ==========================================
function finalizarJuego() {
  if (window.juegoTerminado) return;
  window.juegoTerminado = true;

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
    const totalTiempo = window.tiempoSegundos || 0;
    
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
      }

      const cv      = p.counterVal;
      const score   = parseInt(cv?.score   ?? p.score   ?? 0) || 0;
      const actions = parseInt(cv?.actions ?? p.actions ?? 0) || 0;
      const errores = Math.max(0, actions - score);

      if (score   !== window.ultimoScore)   { window.ultimoScore   = score;   if (mostrarPuntuacionTiempoReal()) actualizarPanel('aciertos', score); }
      if (errores !== window.ultimoActions) { window.ultimoActions = errores; if (mostrarPuntuacionTiempoReal()) actualizarPanel('intentos', errores); }

      if (window.Notificaciones) {
        if (score > window.ultimoScore && score > 0) window.Notificaciones.registrarAcierto();
        if (errores > window.ultimoActions && errores > 0) window.Notificaciones.registrarError();
      }

      const currentIdx  = seq.currentAct ?? -1;
      const currentName = obtenerNombreActividad(JClic);

      if (!currentName || currentName.length < 2) return;

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

          const anteriorEraUltimaPorIndice = (window.prevIdx === window.totalActividades - 1);
          const anteriorEraUltimaPorDiccionario = esActividadFinal(window.prevName);

          if ((anteriorEraUltimaPorIndice || anteriorEraUltimaPorDiccionario) && !window.juegoTerminado) {
            console.log('🏁 FIN DEL JUEGO:', window.prevName);
            finalizarJuego();
            return;
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
        <h1 style="margin:0;font-size:24px;color:#c1272d;">📊 ${tEst('reporteActividades')}</h1>
        <p style="margin:6px 0 0;color:#666;font-size:14px;font-weight:600;">${nombreJuego}</p>
        ${nombrePerfil ? `<p style="margin:2px 0 0;color:#666;font-size:13px;">${perfil.avatar} ${nombrePerfil}</p>` : ''}
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
          <h2>📊 ${tEst('reporteActividades')}</h2>
          <button id="btn-cerrar-reporte" class="reporte-cerrar">✕</button>
        </div>
        <div class="reporte-cuerpo">
          ${reporteHTML}
        </div>
        <div class="reporte-footer">
          <button id="btn-imprimir-reporte" class="reporte-btn reporte-btn-blanco">📄 ${tEst('imprimirPDF')}</button>
          <button id="btn-reiniciar-reporte" class="reporte-btn reporte-btn-blanco">🔄 ${tEst('jugarDeNuevo')}</button>
          <button id="btn-cerrar-reporte-2" class="reporte-btn reporte-btn-blanco">✅ ${tEst('cerrar')}</button>
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

  if (mostrarPuntuacionTiempoReal()) {
    actualizarPanel('aciertos', 0);
    actualizarPanel('intentos', 0);
  } else {
    actualizarPanel('aciertos', '-');
    actualizarPanel('intentos', '-');
  }
  actualizarPanel('tiempo', '00:00');
  
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

// ✅ LISTENER DE LOAD (SOLO LLAMA A arrancarEstadisticas)
window.addEventListener('load', () => {
  setTimeout(arrancarEstadisticas, 2000);
});