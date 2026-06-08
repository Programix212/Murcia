// ==========================================
// PERFILES.JS - VERSIÓN FINAL CORREGIDA CON I18N
// ==========================================

(function() {

  // ==========================================
  // CONFIGURACIÓN
  // ==========================================
  const STORAGE_KEY = 'ceartee_perfiles';
  const ACTIVE_KEY = 'ceartee_perfil_activo';

    // ==========================================
  // VERSIÓN DE ESQUEMA Y MIGRACIÓN
  // ==========================================
  const CEARTEE_SCHEMA_VERSION = 2;
  const SCHEMA_KEY = 'ceartee_schema_version';

  // Forma estándar de stats (esquema actual)
  function statsPorDefecto() {
    return {
      juegosCompletados: 0,
      totalAciertos: 0,
      totalErrores: 0,
      mejorPuntuacion: 0,
      mejorRacha: 0,
      tiempoTotal: 0,
      ultimaActividad: null,
      juegos: {}
    };
  }

  // Asegura que un objeto stats tenga TODOS los campos del esquema actual
  function normalizarStats(stats) {
    var base = statsPorDefecto();
    if (!stats || typeof stats !== 'object') return base;
    for (var k in base) {
      if (stats[k] === undefined || stats[k] === null) stats[k] = base[k];
    }
    if (!stats.juegos || typeof stats.juegos !== 'object') stats.juegos = {};
    return stats;
  }

  // Ejecuta migraciones según la versión guardada
  function migrarEsquema() {
    var versionActual = parseInt(localStorage.getItem(SCHEMA_KEY)) || 1;
    if (versionActual >= CEARTEE_SCHEMA_VERSION) return;

    console.log('🔧 Migrando esquema de v' + versionActual + ' a v' + CEARTEE_SCHEMA_VERSION);

    var perfiles = [];
    try { perfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) {}

    // --- Migración v1 -> v2: normalizar stats y campos de perfil ---
    if (versionActual < 2) {
      perfiles.forEach(function(p) {
        // Campos que faltaban en perfiles viejos
        if (!p.fechaCreacion) p.fechaCreacion = new Date().toISOString();
        if (!p.ultimaActividad) p.ultimaActividad = p.fechaCreacion;

        // Normalizar stats del perfil
        var key = 'ceartee_perfil_' + p.id + '_stats';
        var stats = null;
        try { stats = JSON.parse(localStorage.getItem(key)); } catch(e) {}
        localStorage.setItem(key, JSON.stringify(normalizarStats(stats)));
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(perfiles));
    }

    // (Futuras migraciones: if (versionActual < 3) { ... } )

    localStorage.setItem(SCHEMA_KEY, String(CEARTEE_SCHEMA_VERSION));
    console.log('✅ Esquema migrado a v' + CEARTEE_SCHEMA_VERSION);
  }

  // Ejecutar migración al cargar (antes de usar los datos)
  migrarEsquema();

  // Exponer la migración para poder probarla con Vitest (inofensivo en producción)
  window.cearteeMigrarEsquema = migrarEsquema;

  
  // Avatares disponibles
  const AVATARES = ['👶', '👧', '👦', '👨', '👩', '🧒', '👴', '👵', '🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🦄', '🐸', '🐵', '🐔', '🦆', '🦉', '🐺', '🐗', '🦒', '🦘'];

  // ==========================================
  // HELPER DE TRADUCCIÓN
  // ==========================================
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
  // GESTIÓN DE PERFILES
  // ==========================================
  const PerfilesManager = {
    
    obtenerPerfiles: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch(e) {
        return [];
      }
    },

    guardarPerfiles: function(perfiles) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(perfiles));
        return true;
      } catch(e) {
        console.error('Error guardando perfiles:', e);
        return false;
      }
    },

    obtenerPerfilActivo: function() {
      try {
        const id = localStorage.getItem(ACTIVE_KEY);
        if (!id) return null;
        const perfiles = this.obtenerPerfiles();
        return perfiles.find(p => p.id === id) || null;
      } catch(e) {
        return null;
      }
    },

    crearPerfil: function(nombre, avatar) {
      const perfiles = this.obtenerPerfiles();
      const nuevoPerfil = {
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        nombre: nombre.trim(),
        avatar: avatar || AVATARES[0],
        fechaCreacion: new Date().toISOString(),
        ultimaActividad: new Date().toISOString()
      };
      perfiles.push(nuevoPerfil);
      this.guardarPerfiles(perfiles);
      
      // ✅ INICIALIZAR STATS EN 0
      this.guardarDatos(nuevoPerfil.id, 'stats', {
        juegosCompletados: 0,
        totalAciertos: 0,
        totalErrores: 0,
        mejorPuntuacion: 0,
        mejorRacha: 0,
        tiempoTotal: 0,
        ultimaActividad: null,
        juegos: {}
      });
      
      console.log('✅ Perfil creado con stats en 0:', nuevoPerfil.nombre);
      return nuevoPerfil;
    },

    eliminarPerfil: function(perfilId) {
      let perfiles = this.obtenerPerfiles();
      perfiles = perfiles.filter(p => p.id !== perfilId);
      this.guardarPerfiles(perfiles);
      if (localStorage.getItem(ACTIVE_KEY) === perfilId) {
        localStorage.removeItem(ACTIVE_KEY);
      }
      this.eliminarDatosPerfil(perfilId);
    },

    editarPerfil: function(perfilId, nombre, avatar) {
      const perfiles = this.obtenerPerfiles();
      const perfil = perfiles.find(p => p.id === perfilId);
      if (perfil) {
        if (nombre) perfil.nombre = nombre.trim();
        if (avatar) perfil.avatar = avatar;
        this.guardarPerfiles(perfiles);
        return true;
      }
      return false;
    },

    seleccionarPerfil: function(perfilId) {
      try {
        const perfiles = this.obtenerPerfiles();
        const perfil = perfiles.find(p => p.id === perfilId);
        if (perfil) {
          localStorage.setItem(ACTIVE_KEY, perfilId);
          perfil.ultimaActividad = new Date().toISOString();
          this.guardarPerfiles(perfiles);
          console.log('✅ Perfil seleccionado:', perfil.nombre);
          return true;
        }
        console.error('❌ Perfil no encontrado:', perfilId);
        return false;
      } catch(e) {
        console.error('❌ Error seleccionando perfil:', e);
        return false;
      }
    },

    logout: function() {
      localStorage.removeItem(ACTIVE_KEY);
    },

    obtenerDatos: function(perfilId, tipo, defaultValue) {
      try {
        const key = `ceartee_perfil_${perfilId}_${tipo}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch(e) {
        return defaultValue;
      }
    },

    guardarDatos: function(perfilId, tipo, datos) {
      try {
        const key = `ceartee_perfil_${perfilId}_${tipo}`;
        localStorage.setItem(key, JSON.stringify(datos));
        return true;
      } catch(e) {
        return false;
      }
    },

    // ===== EXPORTAR TODO A UN OBJETO =====
    exportarTodo: function() {
      var perfiles = this.obtenerPerfiles();
      var datosPerfiles = {};

      perfiles.forEach(function(p) {
        var datos = {};
        var prefix = 'ceartee_perfil_' + p.id + '_';
        Object.keys(localStorage).forEach(function(key) {
          if (key.indexOf(prefix) === 0) {
            var tipo = key.substring(prefix.length);
            try { datos[tipo] = JSON.parse(localStorage.getItem(key)); }
            catch(e) { datos[tipo] = localStorage.getItem(key); }
          }
        });
        datosPerfiles[p.id] = datos;
      });

      var appConfig = {};
      try { appConfig = JSON.parse(localStorage.getItem('appConfig') || '{}'); } catch(e) {}

      return {
        app: 'CEARTEE',
        tipo: 'backup',
        schemaVersion: CEARTEE_SCHEMA_VERSION,
        fecha: new Date().toISOString(),
        appConfig: appConfig,
        perfiles: perfiles,
        datosPerfiles: datosPerfiles
      };
    },

    // ===== IMPORTAR DESDE UN OBJETO =====
    // modo: 'reemplazar' (borra todo lo actual) o 'combinar' (añade/actualiza)
    importarTodo: function(backup, modo) {
      if (!backup || backup.app !== 'CEARTEE' || !Array.isArray(backup.perfiles)) {
        throw new Error('El archivo no es un respaldo válido de CEARTEE');
      }
      modo = modo || 'combinar';

      // Si es un respaldo viejo, normalizamos sus stats al esquema actual
      var versionBackup = parseInt(backup.schemaVersion) || 1;

      if (modo === 'reemplazar') {
        // Borrar perfiles y datos actuales
        this.obtenerPerfiles().forEach(function(p) {
          var prefix = 'ceartee_perfil_' + p.id + '_';
          Object.keys(localStorage).forEach(function(key) {
            if (key.indexOf(prefix) === 0) localStorage.removeItem(key);
          });
        });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVE_KEY);
      }

      var perfilesActuales = this.obtenerPerfiles();

      backup.perfiles.forEach(function(p) {
        // Evitar duplicados por id al combinar
        var existe = perfilesActuales.find(function(x) { return x.id === p.id; });
        if (!existe) {
          perfilesActuales.push(p);
        } else {
          existe.nombre = p.nombre;
          existe.avatar = p.avatar;
        }

        // Restaurar datos del perfil
        var datos = (backup.datosPerfiles && backup.datosPerfiles[p.id]) || {};
        Object.keys(datos).forEach(function(tipo) {
          var valor = datos[tipo];
          // Normalizar stats si el respaldo es de un esquema viejo
          if (tipo === 'stats' && versionBackup < CEARTEE_SCHEMA_VERSION) {
            valor = normalizarStats(valor);
          }
          localStorage.setItem('ceartee_perfil_' + p.id + '_' + tipo, JSON.stringify(valor));
        });
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(perfilesActuales));

      // Restaurar configuración (opcional)
      if (backup.appConfig && Object.keys(backup.appConfig).length) {
        localStorage.setItem('appConfig', JSON.stringify(backup.appConfig));
      }

      // Marcar esquema actualizado
      localStorage.setItem(SCHEMA_KEY, String(CEARTEE_SCHEMA_VERSION));
      return perfilesActuales.length;
    },


    eliminarDatosPerfil: function(perfilId) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`ceartee_perfil_${perfilId}_`)) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  // ✅ EXPONER GLOBALMENTE
  window.PerfilesManager = PerfilesManager;

  // ==========================================
  // ✅ RENDERIZAR SELECTOR DE PERFILES
  // ==========================================
  window.renderPantallaPerfiles = function(containerId, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ No se encontró el contenedor:', containerId);
      return;
    }

    const perfiles = PerfilesManager.obtenerPerfiles();
    
    // ✅ Guardar callback globalmente
    window._perfilesCallback = onSelect;
    
    let html = '<div class="selector-perfiles-wrapper">';
    html += '<h2 class="selector-titulo">' + t('quienJuega') + '</h2>';
    html += '<p class="selector-subtitulo">' + t('tocaCarita') + '</p>';
    
    html += '<div class="perfiles-lista">';
    
    // Perfiles existentes
    perfiles.forEach(function(perfil) {
      html += '<div class="perfil-card" data-perfil-id="' + perfil.id + '">';
      html += '<button class="btn-eliminar-perfil" data-perfil-id="' + perfil.id + '" title="' + t('eliminar') + '">🗑️</button>';
      html += '<div class="perfil-avatar-grande">' + perfil.avatar + '</div>';
      html += '<div class="perfil-nombre">' + escapeHtml(perfil.nombre) + '</div>';
      html += '</div>';
    });
    
    // Botón de nuevo perfil
    html += '<div class="perfil-card perfil-nuevo" id="btnNuevoPerfil">';
    html += '<div class="perfil-avatar-grande">➕</div>';
    html += '<div class="perfil-nombre">' + t('nuevo') + '</div>';
    html += '</div>';
    
    html += '</div>'; // .perfiles-lista
    html += '</div>'; // .selector-perfiles-wrapper
    
    container.innerHTML = html;
    
    // ✅ Event listeners - Seleccionar perfil
    container.querySelectorAll('.perfil-card[data-perfil-id]').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar-perfil')) return;
        
        const perfilId = this.getAttribute('data-perfil-id');
        PerfilesManager.seleccionarPerfil(perfilId);
        if (onSelect && typeof onSelect === 'function') {
          onSelect();
        } else {
          window.location.reload();
        }
      });
    });
    
    // ✅ Event listener - Nuevo perfil
    var btnNuevo = container.querySelector('#btnNuevoPerfil');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('➕ Click en Nuevo Perfil');
        mostrarModalCrearPerfil(containerId, onSelect);
      });
    }
    
    // Event listener - Eliminar perfil
    container.querySelectorAll('.btn-eliminar-perfil').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const perfilId = this.getAttribute('data-perfil-id');
        const perfil = perfiles.find(p => p.id === perfilId);
        const nombre = perfil ? perfil.nombre : '';
        
        if (confirm(t('eliminar') + ' "' + nombre + '"?')) {
          PerfilesManager.eliminarPerfil(perfilId);
          window.renderPantallaPerfiles(containerId, onSelect);
        }
      });
    });
  };

  // ==========================================
  // ✅ MODAL CREAR PERFIL
  // ==========================================
  function mostrarModalCrearPerfil(containerId, onSelect) {
    console.log('🎨 Mostrando modal crear perfil');
    
    var existingModal = document.getElementById('modal-crear-perfil');
    if (existingModal) {
      existingModal.remove();
    }
    
    const div = document.createElement('div');
    div.id = 'modal-crear-perfil';
    div.className = 'modal-overlay';
    div.innerHTML = 
      '<div class="modal-content">' +
        '<h3>' + t('nombre') + '</h3>' +
        '<input type="text" id="input-nombre-perfil" placeholder="' + t('tuNombre') + '" maxlength="20" autocomplete="off">' +
        '<h3>' + t('eligeAvatar') + '</h3>' +
        '<div class="avatar-selector" id="avatar-selector"></div>' +
        '<div class="modal-buttons">' +
          '<button class="btn-cancelar-modal">' + t('cancelar') + '</button>' +
          '<button class="btn-crear-modal">' + t('jugar') + '</button>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(div);
    
    // Generar selector de avatares
    var avatarContainer = div.querySelector('#avatar-selector');
    if (avatarContainer) {
      AVATARES.forEach(function(avatar, i) {
        var span = document.createElement('span');
        span.className = 'avatar-option' + (i === 0 ? ' selected' : '');
        span.textContent = avatar;
        span.setAttribute('data-avatar', avatar);
        span.addEventListener('click', function() {
          div.querySelectorAll('.avatar-option').forEach(function(s) { 
            s.classList.remove('selected'); 
          });
          this.classList.add('selected');
        });
        avatarContainer.appendChild(span);
      });
    }
    
    // ✅ Event listener - Cancelar
    var btnCancelar = div.querySelector('.btn-cancelar-modal');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', function() {
        div.remove();
      });
    }
    
    // ✅ Event listener - Crear
    var btnCrear = div.querySelector('.btn-crear-modal');
    if (btnCrear) {
      btnCrear.addEventListener('click', function() {
        var nombreInput = document.getElementById('input-nombre-perfil');
        var nombre = nombreInput ? nombreInput.value.trim() : '';
        var avatarSeleccionado = div.querySelector('.avatar-option.selected');
        
        if (!nombre) {
          if (nombreInput) {
            nombreInput.focus();
            nombreInput.style.borderColor = '#ff5252';
            setTimeout(function() {
              nombreInput.style.borderColor = '';
            }, 2000);
          }
          return;
        }
        
        var avatar = avatarSeleccionado ? avatarSeleccionado.getAttribute('data-avatar') : AVATARES[0];
        
        // ✅ Crear perfil y seleccionar
        var nuevoPerfil = PerfilesManager.crearPerfil(nombre, avatar);
        PerfilesManager.seleccionarPerfil(nuevoPerfil.id);
        
        div.remove();
        
        // ✅ Llamar callback o recargar
        if (onSelect && typeof onSelect === 'function') {
          onSelect();
        } else {
          window.location.reload();
        }
      });
    }
    
    // Enter en el input
    var inputNombre = div.querySelector('#input-nombre-perfil');
    if (inputNombre) {
      inputNombre.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          if (btnCrear) btnCrear.click();
        }
      });
    }
    
    // Click fuera del modal para cerrar
    div.addEventListener('click', function(e) {
      if (e.target === div) {
        div.remove();
      }
    });
    
    // Mostrar modal con animación
    setTimeout(function() { 
      div.classList.add('active');
      if (inputNombre) inputNombre.focus();
    }, 10);
  }

  // ✅ EXPONER GLOBALMENTE
  window.mostrarModalCrearPerfil = mostrarModalCrearPerfil;

  // ==========================================
  // MODAL EDITAR PERFIL
  // ==========================================
  window.mostrarModalEditarPerfil = function(perfilId) {
    var perfil = PerfilesManager.obtenerPerfiles().find(p => p.id === perfilId);
    if (!perfil) return;
    
    var existingModal = document.getElementById('modal-editar-perfil');
    if (existingModal) existingModal.remove();
    
    var div = document.createElement('div');
    div.id = 'modal-editar-perfil';
    div.className = 'modal-overlay';
    div.innerHTML = 
      '<div class="modal-content">' +
        '<h3>' + t('editar') + '</h3>' +
        '<input type="text" id="input-editar-nombre" value="' + escapeHtml(perfil.nombre) + '" maxlength="20">' +
        '<h3>' + t('eligeAvatar') + '</h3>' +
        '<div class="avatar-selector" id="avatar-selector-editar"></div>' +
        '<div class="modal-buttons">' +
          '<button class="btn-cancelar-modal">' + t('cancelar') + '</button>' +
          '<button class="btn-guardar-modal">' + t('confirmar') + '</button>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(div);
    
    var avatarContainer = div.querySelector('#avatar-selector-editar');
    AVATARES.forEach(function(avatar) {
      var span = document.createElement('span');
      span.className = 'avatar-option' + (avatar === perfil.avatar ? ' selected' : '');
      span.textContent = avatar;
      span.setAttribute('data-avatar', avatar);
      span.addEventListener('click', function() {
        div.querySelectorAll('.avatar-option').forEach(function(s) { 
          s.classList.remove('selected'); 
        });
        this.classList.add('selected');
      });
      avatarContainer.appendChild(span);
    });
    
    div.querySelector('.btn-cancelar-modal').addEventListener('click', function() {
      div.remove();
    });
    
    div.querySelector('.btn-guardar-modal').addEventListener('click', function() {
      var nuevoNombre = div.querySelector('#input-editar-nombre').value.trim();
      var nuevoAvatar = div.querySelector('.avatar-option.selected');
      
      if (nuevoNombre) {
        PerfilesManager.editarPerfil(perfilId, nuevoNombre, nuevoAvatar ? nuevoAvatar.getAttribute('data-avatar') : null);
        div.remove();
        window.location.reload();
      }
    });
    
    setTimeout(function() { div.classList.add('active'); }, 10);
  };

  // ==========================================
  // MODAL CAMBIAR JUGADOR (LOGOUT)
  // ==========================================
  window.mostrarModalCambiarJugador = function() {
    var perfil = PerfilesManager.obtenerPerfilActivo();
    if (!perfil) return;
    
    var existingModal = document.getElementById('modal-cambiar-jugador');
    if (existingModal) existingModal.remove();
    
    var div = document.createElement('div');
    div.id = 'modal-cambiar-jugador';
    div.className = 'modal-overlay';
    div.innerHTML = 
      '<div class="modal-content modal-pequeno">' +
        '<div class="perfil-actual-preview">' +
          '<div class="perfil-avatar-grande">' + perfil.avatar + '</div>' +
          '<div class="perfil-nombre">' + escapeHtml(perfil.nombre) + '</div>' +
        '</div>' +
        '<p>' + t('cambiarJugador') + '?</p>' +
        '<div class="modal-buttons">' +
          '<button class="btn-cancelar-modal">' + t('cancelar') + '</button>' +
          '<button class="btn-cambiar-modal">' + t('confirmar') + '</button>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(div);
    
    div.querySelector('.btn-cancelar-modal').addEventListener('click', function() {
      div.remove();
    });
    
    div.querySelector('.btn-cambiar-modal').addEventListener('click', function() {
      PerfilesManager.logout();
      div.remove();
      window.location.reload();
    });
    
    setTimeout(function() { div.classList.add('active'); }, 10);
  };

  // ==========================================
  // UTILIDADES
  // ==========================================
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================
  // ACTUALIZAR TEXTOS DINÁMICOS
  // ==========================================
  window.actualizarTextosPerfiles = function() {
    var container = document.getElementById('selector-perfiles-container');
    if (container && window._perfilesCallback) {
      window.renderPantallaPerfiles('selector-perfiles-container', window._perfilesCallback);
    }
  };

  // ==========================================
  // CSS DINÁMICO
  // ==========================================
  function inyectarCSS() {
    if (document.getElementById('perfiles-css')) return;
    
    var style = document.createElement('style');
    style.id = 'perfiles-css';
    style.textContent = `
      .selector-perfiles-wrapper {
        text-align: center;
        padding: 20px;
      }
      .selector-titulo {
        font-size: 2em;
        margin-bottom: 10px;
        color: #fff;
      }
      .selector-subtitulo {
        color: rgba(255,255,255,0.8);
        margin-bottom: 30px;
      }
      .perfiles-lista {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        max-width: 600px;
        margin: 0 auto;
      }
      .perfil-card {
        background: rgba(255,255,255,0.1);
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 15px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        min-width: 120px;
        text-align: center;
      }
      .perfil-card:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,0.15);
        border-color: rgba(255,255,255,0.4);
      }
      .perfil-nuevo {
        background: rgba(100,150,255,0.2);
        border-color: rgba(100,150,255,0.4);
      }
      .perfil-avatar-grande {
        font-size: 4em;
        margin-bottom: 10px;
      }
      .perfil-nombre {
        font-weight: 600;
        color: #fff;
      }
      .btn-eliminar-perfil {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(255,0,0,0.3);
        border: none;
        color: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        z-index: 10;
      }
      .btn-eliminar-perfil:hover {
        background: rgba(255,0,0,0.6);
        transform: scale(1.1);
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .modal-overlay.active {
        display: flex;
        opacity: 1;
      }
      .modal-content {
        background: linear-gradient(135deg, #c1272d, #8b1a1f);
        padding: 30px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        color: #fff;
        transform: scale(0.8);
        transition: transform 0.3s;
        max-height: 90vh;
        overflow-y: auto;
      }
      .modal-overlay.active .modal-content {
        transform: scale(1);
      }
      .modal-content.modal-pequeno {
        max-width: 350px;
      }
      .modal-content h3 {
        margin: 15px 0 10px;
        font-size: 1.3em;
      }
      .modal-content input[type="text"] {
        width: 100%;
        padding: 12px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 10px;
        background: rgba(255,255,255,0.1);
        color: #fff;
        font-size: 16px;
        margin-bottom: 15px;
        transition: all 0.2s;
        box-sizing: border-box;
      }
      .modal-content input[type="text"]:focus {
        outline: none;
        border-color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.15);
      }
      .modal-content input::placeholder {
        color: rgba(255,255,255,0.6);
      }
      .avatar-selector {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 8px;
        max-height: 200px;
        overflow-y: auto;
        margin: 15px 0;
        padding: 10px;
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
      }
      .avatar-option {
        font-size: 2em;
        padding: 8px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        background: rgba(255,255,255,0.1);
        text-align: center;
        user-select: none;
      }
      .avatar-option:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      .avatar-option.selected {
        background: rgba(100,200,255,0.4);
        border: 2px solid #64c8ff;
        transform: scale(1.15);
      }
      .modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
      }
      .modal-buttons button {
        padding: 12px 25px;
        border: none;
        border-radius: 10px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-cancelar-modal {
        background: rgba(255,255,255,0.2);
        color: #fff;
      }
      .btn-cancelar-modal:hover {
        background: rgba(255,255,255,0.3);
      }
      .btn-crear-modal,
      .btn-guardar-modal,
      .btn-cambiar-modal {
        background: #fff;
        color: #c1272d;
      }
      .btn-crear-modal:hover,
      .btn-guardar-modal:hover,
      .btn-cambiar-modal:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
      }
      .perfil-actual-preview {
        margin: 20px 0;
      }
      .perfil-actual-preview .perfil-avatar-grande {
        font-size: 5em;
      }
    `;
    document.head.appendChild(style);
  }

  // Inyectar CSS al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inyectarCSS);
  } else {
    inyectarCSS();
  }

  // ==========================================
  // ESCUCHAR CAMBIOS DE IDIOMA
  // ==========================================
  setInterval(function() {
    var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    if (config.idioma !== window._ultimoIdioma) {
      window._ultimoIdioma = config.idioma;
      if (typeof window.actualizarTextosPerfiles === 'function') {
        window.actualizarTextosPerfiles();
      }
    }
  }, 500);

  window._ultimoIdioma = (JSON.parse(localStorage.getItem('appConfig') || '{}')).idioma || 'es';

})();
