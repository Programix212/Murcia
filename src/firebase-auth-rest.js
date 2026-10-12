// ==========================================
// FIREBASE AUTH - API REST (funciona en Tauri .exe)
// ==========================================

const FIREBASE_API_KEY = 'TU_API_KEY_AQUI'; // ← PEGA AQUÍ TU API KEY

window.FirebaseAuthREST = {
  
  // REGISTRO
  registrar: function(email, password, callback) {
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FIREBASE_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        callback(false, traducirErrorFirebase(data.error.message));
      } else {
        // Guardar sesión
        localStorage.setItem('ceartee_firebase_idToken', data.idToken);
        localStorage.setItem('ceartee_firebase_refreshToken', data.refreshToken);
        localStorage.setItem('ceartee_firebase_uid', data.localId);
        localStorage.setItem('ceartee_firebase_email', data.email);
        callback(true, 'Cuenta creada correctamente');
      }
    })
    .catch(function(err) {
      callback(false, 'Error de conexión: ' + err.message);
    });
  },

  // LOGIN
  login: function(email, password, callback) {
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FIREBASE_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        callback(false, traducirErrorFirebase(data.error.message));
      } else {
        localStorage.setItem('ceartee_firebase_idToken', data.idToken);
        localStorage.setItem('ceartee_firebase_refreshToken', data.refreshToken);
        localStorage.setItem('ceartee_firebase_uid', data.localId);
        localStorage.setItem('ceartee_firebase_email', data.email);
        callback(true, 'Sesión iniciada');
      }
    })
    .catch(function(err) {
      callback(false, 'Error de conexión: ' + err.message);
    });
  },

  // LOGOUT
  logout: function(callback) {
    localStorage.removeItem('ceartee_firebase_idToken');
    localStorage.removeItem('ceartee_firebase_refreshToken');
    localStorage.removeItem('ceartee_firebase_uid');
    localStorage.removeItem('ceartee_firebase_email');
    if (callback) callback(true);
  },

  // VERIFICAR SI HAY SESIÓN
  getUsuario: function() {
    var email = localStorage.getItem('ceartee_firebase_email');
    var uid   = localStorage.getItem('ceartee_firebase_uid');
    if (!email || !uid) return null;
    return { email: email, uid: uid };
  },

  // OBTENER TOKEN PARA FIRESTORE
  getIdToken: function() {
    return localStorage.getItem('ceartee_firebase_idToken');
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