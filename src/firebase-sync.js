// ==========================================
// FIREBASE SYNC - CEARTEE
// ==========================================

// Configuración de Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDkQgcjq-3OfgkhHk5RALoX4gXIJbnxsTM",
  authDomain: "ceartee-fa0f8.firebaseapp.com",
  projectId: "ceartee-fa0f8",
  storageBucket: "ceartee-fa0f8.firebasestorage.app",
  messagingSenderId: "659161151624",
  appId: "1:659161151624:web:943adf6b3ba7f8bf6e473d"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();

window.FirebaseSync = {
  usuario: null,

  // ==========================================
  // REGISTRAR CON EMAIL
  // ==========================================
    registrar: function(email, password, callback) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        window.FirebaseSync.usuario = userCredential.user;
        console.log('✅ Registro exitoso:', userCredential.user.email);
        
        // Crear datos limpios para la cuenta nueva
        var datosLimpios = {
          juegosCompletados: 0,
          puntuacionesPerfectas: 0,
          mejorPuntuacion: 0,
          mejorTiempo: null,
          rachaAciertos: 0,
          mejorRacha: 0,
          logrosDesbloqueados: [],
          juegosPorNombre: {}
        };
        localStorage.setItem('notificacionesDatos', JSON.stringify(datosLimpios));
        
        // Subir datos limpios a la nube (NO los datos de la otra cuenta)
        var uid = userCredential.user.uid;
        db.collection('usuarios').doc(uid).set({
          appConfig: JSON.parse(localStorage.getItem('appConfig') || '{}'),
          notificacionesDatos: datosLimpios,
          ultimaSincronizacion: new Date().toISOString()
        }).then(function() {
          console.log('☁️ Datos limpios subidos para cuenta nueva');
        });
        
        if (callback) callback(true, 'Registro exitoso');
      })
      .catch(function(error) {
        console.error('❌ Error registro:', error.message);
        if (callback) callback(false, error.message);
      });
  },

  // ==========================================
  // LOGIN CON EMAIL
  // ==========================================
  login: function(email, password, callback) {
    auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        window.FirebaseSync.usuario = userCredential.user;
        console.log('✅ Login exitoso:', userCredential.user.email);
        window.FirebaseSync.bajarDatos();
        if (callback) callback(true, 'Inicio de sesión exitoso');
      })
      .catch(function(error) {
        console.error('❌ Error login:', error.message);
        if (callback) callback(false, error.message);
      });
  },

  // ==========================================
  // LOGOUT
  // ==========================================
    logout: function(callback) {
    auth.signOut().then(function() {
      window.FirebaseSync.usuario = null;
      console.log('✅ Sesión cerrada');
      
      // Limpiar datos de logros y estadísticas
      var datosLimpios = {
        juegosCompletados: 0,
        puntuacionesPerfectas: 0,
        mejorPuntuacion: 0,
        mejorTiempo: null,
        rachaAciertos: 0,
        mejorRacha: 0,
        logrosDesbloqueados: [],
        juegosPorNombre: {}
      };
      localStorage.setItem('notificacionesDatos', JSON.stringify(datosLimpios));
      
      if (callback) callback(true);
    }).catch(function(error) {
      console.error('❌ Error logout:', error);
      if (callback) callback(false, error.message);
    });
  },
  // ==========================================
  // VERIFICAR SESIÓN ACTIVA
  // ==========================================
  verificarSesion: function(callback) {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        window.FirebaseSync.usuario = user;
        console.log('✅ Sesión activa:', user.email);
        if (callback) callback(user);
      } else {
        window.FirebaseSync.usuario = null;
        console.log('⚠️ Sin sesión');
        if (callback) callback(null);
      }
    });
  },

  // ==========================================
  // SUBIR DATOS A LA NUBE
  // ==========================================
  subirDatos: function(callback) {
    if (!window.FirebaseSync.usuario) {
      console.warn('⚠️ No hay usuario para subir datos');
      if (callback) callback(false, 'No hay sesión');
      return;
    }

    var uid = window.FirebaseSync.usuario.uid;
    var datos = {};

    // Recopilar todos los datos locales
    try { datos.appConfig = JSON.parse(localStorage.getItem('appConfig') || '{}'); } catch(e) {}
    try { datos.notificacionesDatos = JSON.parse(localStorage.getItem('notificacionesDatos') || '{}'); } catch(e) {}
    datos.ultimaSincronizacion = new Date().toISOString();

    db.collection('usuarios').doc(uid).set(datos, { merge: true })
      .then(function() {
        console.log('☁️ Datos subidos a la nube');
        if (callback) callback(true, 'Datos subidos');
      })
      .catch(function(error) {
        console.error('❌ Error subiendo datos:', error);
        // ✅ NUEVO: Detectar si es error de red
        if (!navigator.onLine || (error.message && (error.message.includes('network') || error.message.includes('unavailable') || error.message.includes('offline')))) {
          mostrarToastOffline();
        }
        if (callback) callback(false, error.message);
      });
  },

  // ==========================================
  // BAJAR DATOS DE LA NUBE
  // ==========================================
  bajarDatos: function(callback) {
    if (!window.FirebaseSync.usuario) {
      console.warn('⚠️ No hay usuario para bajar datos');
      if (callback) callback(false, 'No hay sesión');
      return;
    }

    var uid = window.FirebaseSync.usuario.uid;

    db.collection('usuarios').doc(uid).get()
      .then(function(doc) {
        if (doc.exists) {
          var datos = doc.data();
          console.log('☁️ Datos bajados de la nube:', datos);

          // Aplicar datos locales
          if (datos.appConfig) {
            localStorage.setItem('appConfig', JSON.stringify(datos.appConfig));
            localStorage.setItem('appIdioma', datos.appConfig.idioma || 'es');
            localStorage.setItem('appTema', datos.appConfig.tema || 'dark');
          }
          if (datos.notificacionesDatos) {
            localStorage.setItem('notificacionesDatos', JSON.stringify(datos.notificacionesDatos));
          }

          if (callback) callback(true, 'Datos descargados');
        } else {
          console.log('☁️ No hay datos en la nube aún');
          if (callback) callback(false, 'Sin datos en la nube');
        }
      })
      .catch(function(error) {
        console.error('❌ Error bajando datos:', error);
        // ✅ NUEVO: Detectar si es error de red
        if (!navigator.onLine || (error.message && (error.message.includes('network') || error.message.includes('unavailable') || error.message.includes('offline')))) {
          mostrarToastOffline();
        }
        if (callback) callback(false, error.message);
      });
  },

  // ==========================================
  // OBTENER INFO DEL USUARIO
  // ==========================================
  getInfo: function() {
    if (!window.FirebaseSync.usuario) return null;
    return {
      email: window.FirebaseSync.usuario.email,
      uid: window.FirebaseSync.usuario.uid
    };
  }
};

console.log('✅ Firebase Sync listo');