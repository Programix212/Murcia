// ==========================================
// PANEL-DOCENTE.JS - Con soporte i18n completo
// ==========================================

(function() {

  // ✅ Función helper para obtener texto traducido
  function t(clave) {
    try {
      var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      var idioma = config.idioma || 'es';
      if (window.textosI18n && window.textosI18n[idioma] && window.textosI18n[idioma][clave]) {
        return window.textosI18n[idioma][clave];
      }
    } catch(e) {}
    return clave;
  }

  // ==========================================
  // CONTRASEÑA DE ACCESO
  // ==========================================
  var PASSWORD = 'ceartee2024'; // ⚠️ Cambia esto por seguridad

  // ✅ Exponer función de verificación global
  window.verificarAcceso = function() {
    var input = document.getElementById('passwordInput');
    var error = document.getElementById('loginError');
    if (!input) return;

    if (input.value === PASSWORD) {
      document.getElementById('loginOverlay').style.display = 'none';
      document.getElementById('panelContainer').style.display = 'block';
      if (error) error.style.display = 'none';
      cargarAlumnos();
    } else {
      if (error) error.style.display = 'block';
      input.value = '';
    }
  };

  // ==========================================
  // CARGAR Y RENDERIZAR ALUMNOS
  // ==========================================
  function cargarAlumnos() {
    if (!window.PerfilesManager) return;
    
    var perfiles = window.PerfilesManager.obtenerPerfiles();
    var totalAlumnos = document.getElementById('totalAlumnos');
    
    if (totalAlumnos) {
      totalAlumnos.textContent = perfiles.length + ' ' + t('alumnos');
    }

    if (perfiles.length === 0) {
      document.getElementById('panelVacio').style.display = 'block';
      document.getElementById('tablaAlumnos').style.display = 'none';
    } else {
      document.getElementById('panelVacio').style.display = 'none';
      document.getElementById('tablaAlumnos').style.display = 'table';
      renderizarPanel();
    }
  }

  // ==========================================
  // RENDERIZAR PANEL (FILTRADO Y ORDENADO)
  // ==========================================
  window.renderizarPanel = function() {
    if (!window.PerfilesManager) return;

    var perfiles = window.PerfilesManager.obtenerPerfiles();
    var tbody = document.getElementById('tbodyAlumnos');
    if (!tbody) return;

    var buscador = document.getElementById('buscadorAlumnos');
    var filtro = buscador ? buscador.value.toLowerCase().trim() : '';
    var ordenar = document.getElementById('ordenarPor');
    var criterio = ordenar ? ordenar.value : 'nombre';

    // Filtrar
    var perfilesFiltrados = perfiles.filter(function(p) {
      if (!filtro) return true;
      return p.nombre.toLowerCase().includes(filtro);
    });

    // Ordenar
    perfilesFiltrados.sort(function(a, b) {
      if (criterio === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      }
      
      var statsA = window.PerfilesManager.obtenerDatos(a.id, 'stats', {});
      var statsB = window.PerfilesManager.obtenerDatos(b.id, 'stats', {});

      if (criterio === 'juegos') {
        return (statsB.juegosCompletados || 0) - (statsA.juegosCompletados || 0);
      }
      if (criterio === 'puntuacion') {
        return (statsB.mejorPuntuacion || 0) - (statsA.mejorPuntuacion || 0);
      }
      if (criterio === 'reciente') {
        var fechaA = new Date(statsA.ultimaActividad || 0);
        var fechaB = new Date(statsB.ultimaActividad || 0);
        return fechaB - fechaA;
      }
      return 0;
    });

    // Renderizar filas
    tbody.innerHTML = '';
    perfilesFiltrados.forEach(function(perfil) {
      var stats = window.PerfilesManager.obtenerDatos(perfil.id, 'stats', {});
      var fila = document.createElement('tr');
      
      fila.innerHTML = 
        '<td>' +
          '<div class="alumno-info">' +
            '<span class="alumno-avatar">' + perfil.avatar + '</span>' +
            '<div class="alumno-datos">' +
              '<span class="alumno-nombre">' + perfil.nombre + '</span>' +
              '<span class="alumno-id">' + perfil.id + '</span>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td><span class="stat-num">' + (stats.juegosCompletados || 0) + '</span> <span class="stat-txt">' + t('completados') + '</span></td>' +
        '<td><span class="stat-num">' + (stats.mejorPuntuacion || 0) + '%</span> <span class="stat-txt">' + t('mejorTxt') + '</span></td>' +
        '<td><span class="stat-num">' + (stats.mejorRacha || 0) + '</span> <span class="stat-txt">' + t('rachaTxt') + '</span></td>' +
        '<td>' + formatearLogros(stats.logros || []) + '</td>' +
        '<td>' + formatearUltimaActividad(stats.ultimaActividad) + '</td>';
      
      tbody.appendChild(fila);
    });
  };

  // ==========================================
  // FORMATEAR LOGROS
  // ==========================================
  function formatearLogros(logros) {
    if (!logros || logros.length === 0) {
      return '<span class="sin-logros">' + t('sinLogros') + '</span>';
    }
    return '<div class="logros-lista">' + 
      logros.map(function(l) { return '<span class="logro-badge">🏆 ' + l + '</span>'; }).join('') +
      '</div>';
  }

  // ==========================================
  // FORMATEAR ÚLTIMA ACTIVIDAD (CON I18N)
  // ==========================================
  function formatearUltimaActividad(fecha) {
    if (!fecha) return '<span class="nunca">' + t('nunca') + '</span>';

    var ahora = new Date();
    var ultima = new Date(fecha);
    var diff = ahora - ultima;
    var minutos = Math.floor(diff / 60000);
    var horas = Math.floor(diff / 3600000);
    var dias = Math.floor(diff / 86400000);

    if (minutos < 1) return t('soloHaceMomento');
    if (minutos < 60) return t('haceMinutos') + ' ' + minutos + ' ' + t('minutosTxt');
    if (horas < 24) return t('haceHoras') + ' ' + horas + ' ' + t('horasTxt');
    return t('haceDias') + ' ' + dias + ' ' + t('diasTxt');
  }

  // ==========================================
  // FILTRAR ALUMNOS (RE-RENDERIZAR)
  // ==========================================
  window.filtrarAlumnos = function() {
    if (typeof window.renderizarPanel === 'function') {
      window.renderizarPanel();
    }
  };

  // ==========================================
  // AUTO-LOGIN SI YA ESTÁ AUTENTICADO
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    var sesionActiva = sessionStorage.getItem('panel_docente_autenticado');
    if (sesionActiva === 'true') {
      var overlay = document.getElementById('loginOverlay');
      var panel = document.getElementById('panelContainer');
      if (overlay) overlay.style.display = 'none';
      if (panel) panel.style.display = 'block';
      cargarAlumnos();
    }
  });

})();