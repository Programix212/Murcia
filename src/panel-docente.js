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

  // Panel abierto sin contraseña (por decisión de diseño: sin login docente).
  // NOTA: no guardar contraseñas ni hashes en cliente.

  // Escapa texto para insertar de forma segura en HTML (evita XSS por nombres de perfil)
  function escapeHtml(texto) {
    var div = document.createElement('div');
    div.textContent = (texto === null || texto === undefined) ? '' : String(texto);
    return div.innerHTML;
  }


  // ==========================================
  // CARGAR Y RENDERIZAR ALUMNOS
  // ==========================================
  function cargarAlumnos() {
    try {
      if (!window.PerfilesManager) return;
      
      var perfiles = window.PerfilesManager.obtenerPerfiles() || [];
      var totalAlumnos = document.getElementById('totalAlumnos');
      
      if (totalAlumnos) {
        totalAlumnos.textContent = perfiles.length + ' ' + t('alumnos');
      }

      var vacio = document.getElementById('panelVacio');
      var tabla = document.getElementById('tablaAlumnos');
      if (perfiles.length === 0) {
        if (vacio) vacio.style.display = 'block';
        if (tabla) tabla.style.display = 'none';
      } else {
        if (vacio) vacio.style.display = 'none';
        if (tabla) tabla.style.display = 'table';
        renderizarPanel();
      }
    } catch (e) {
      console.error('Error cargando alumnos:', e);
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
      return String(p && p.nombre || '').toLowerCase().includes(filtro);
    });

    // Ordenar
    perfilesFiltrados.sort(function(a, b) {
      if (criterio === 'nombre') {
        return String(a && a.nombre || '').localeCompare(String(b && b.nombre || ''));
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
            '<span class="alumno-avatar">' + (window.avatarHTML ? window.avatarHTML(perfil.avatar, perfil.nombre) : escapeHtml(perfil.avatar)) + '</span>' +
            '<div class="alumno-datos">' +
              '<span class="alumno-nombre">' + escapeHtml(perfil.nombre) + '</span>' +
              '<span class="alumno-id">' + escapeHtml(perfil.id) + '</span>' +
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
      logros.map(function(l) { return '<span class="logro-badge"><img src="img_logos/notificaciones/02_milestone.svg" alt="" style="width:18px;height:18px;vertical-align:-3px;" onerror="this.style.display=\'none\'"> ' + escapeHtml(l) + '</span>'; }).join('') +
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

  // Mostrar el panel directamente (sin contraseña) y cargar alumnos
  document.addEventListener('DOMContentLoaded', function() {
    try {
      var panel = document.getElementById('panelContainer');
      if (panel) panel.style.display = 'block';
      cargarAlumnos();
    } catch (e) {
      console.error('Error inicializando panel docente:', e);
    }
  });


})();