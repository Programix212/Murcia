// ==========================================
// APLICAR-CONFIG.JS - VERSIÓN FINAL CON I18N COMPLETO + MUTATION OBSERVER
// Se carga en TODOS los HTML
// ==========================================

(function() {

  // ==========================================
  // LEER CONFIGURACIÓN GUARDADA
  // ==========================================
  function obtenerConfig() {
    try {
      const guardada = localStorage.getItem('appConfig');
      if (guardada) return JSON.parse(guardada);
    } catch(e) {}

    return {
      idioma        : 'ca',
      tema          : 'dark',
      animaciones   : true,
      volumen       : 70,
      volumenJuego  : 70,
      sonidoNoti    : true,
      sonidoJuego   : true,
      autoTimer     : true,
      realtimeStats : true,
      dificultad    : 'medium',
      backupInterval: '15',
      cloudSync     : false,
      developerMode : false
    };
  }

  // ==========================================
  // TRADUCCIONES COMPLETAS (3 IDIOMAS)
  // ==========================================
  const textos = {
    es: {
      // ── index.html ──
      bienvenida       : 'Bienvenido a Murcia',
      subtitulo        : 'Tu experiencia comienza aquí',
      iniciar          : 'Pulsa para Entrar',
      visitanosLabel   : 'Visítanos para conocer más',
      visitanosSub     : 'nuestro servicio',
      direccion        : 'Dirección',
      redesSociales    : 'Redes Sociales',
      redesSocialesLabel: 'Redes Sociales',
      cearteeSinaloa   : 'Ceartee Sinaloa',
      cearteeEmail     : 'ceartee@sin.nuevaescuela.mx',
      cearteeBlog      : 'cearteesinaloa.blogspot.mx',
      queEsCeartee     : '¿Qué es Ceartee?',
      cearteeDesc      : 'Centro Experimental de Adecuación y Recursos Telemáticos de Educación Especial',
      cearteeLargo     : 'Un espacio para impulsar la inclusión educativa a través de tecnologías y recursos especializados.',
      
      // Selector de perfiles
      quienJuega       : '¿Quién juega?',
      tocaCarita       : 'Toca tu carita para comenzar',
      nuevo            : 'Nuevo',
      nombre           : 'Nombre',
      tuNombre         : 'Tu nombre',
      eligeAvatar      : 'Elige un avatar',
      cancelar         : 'Cancelar',
      jugar            : '¡Jugar!',
      si               : 'Sí',
      no               : 'No',
      eliminar         : 'Eliminar',
      editar           : 'Editar',
      atras            : 'Atrás',
      seleccionarAvatar: 'Selecciona un avatar',
      confirmar        : 'Confirmar',
      salir            : 'Salir',
      cerrarSesion     : 'Cerrar sesión',
      hola             : 'Hola',
      continuar        : 'Continuar',
      cambiarJugador   : 'Cambiar jugador',
      panelDocente     : 'Panel Docente',
      irPanelDocente   : 'Panel Docente',
      progresoAlumnos  : 'Ver progreso de todos los alumnos',

            // ✅ INSTRUCCIONES.JS
      muyBienDefault   : '🎉 ¡¡¡ Muy bien !!! 🎉',
      prefijoMuyBien   : '🎉',
      sufijoMuyBien    : '🎉',
      cargandoMsg      : 'Cargando...',
      bienvenidaInstr  : 'Bienvenido',
      disfrutaInstr    : 'Disfruta el juego',
      presionaJugar    : 'Presiona para jugar',
      listoJugar       : '¡Listo para jugar!',
      seleccionaOpcion : 'Selecciona una opción',
      muyBien          : '¡Muy bien!',
      excelente        : '¡Excelente!',
      intentaloNuevo   : 'Inténtalo de nuevo',
      correcto         : 'Correcto',
      incorrecto       : 'Incorrecto',
      tiempoAgotado    : 'Tiempo agotado',
      hasGanado        : '¡Has ganado!',
      hasPerdido       : 'Has perdido',
      juegoTerminado   : 'Juego terminado',
      siguienteNivel   : 'Siguiente nivel',
      quieresReintentar: '¿Quieres intentar de nuevo?',
      siReintentar     : 'Sí, reintentar',
      noSalir          : 'No, salir',
      puntos           : 'puntos',
      estrellas        : 'estrellas',
      nivel            : 'Nivel',
      ronda            : 'Ronda',
      ejercicio        : 'Ejercicio',
      actividad        : 'Actividad',


      // ── Etapas ──
      etapasTitulo     : 'Etapas',
      preescolar       : 'Preescolar',
      primaria         : 'Primaria',
      secundaria       : 'Secundaria',

      // ── Categorías ──
      catPreescolar    : 'CATEGORÍAS PREESCOLAR',
      catPrimaria      : 'CATEGORÍAS PRIMARIA',
      catSecundaria    : 'CATEGORÍAS SECUNDARIA',
      catSub           : '¡Elige una categoría y comienza a aprender jugando!',
      lenguaje         : 'Lenguajes',
      saberes          : 'Saberes y pensamiento cientifico',
      etica            : 'Ética,naturaleza y sociedades',
      humano           : 'De lo humano a comunitario',
      explorar         : '▶ EXPLORAR',
      juegosStat       : 'Juegos',
      categoriasStat   : 'Categorías',
      completadosStat  : 'Completados',

      // ── Vista.js / vista.html ──
      lenguajesH1      : 'Lenguajes',
      saberesH1        : 'Saberes y pensamiento cientifico',
      eticaH1          : 'Ética,naturaleza y sociedades',
      humanoH1         : 'De lo humano a comunitario',
      jugarBtn         : 'JUGAR',
      noResultados     : 'No se encontraron juegos',
      anos3_5          : '3-5 años',
      anos4_6          : '4-6 años',
      anos6_8          : '6-8 años',
      anos9_12         : '9-12 años',
      anos13_15        : '13-15 años',
      minTxt           : 'min',
      cargando         : 'Cargando...',
      cargandoJuego    : 'Cargando juego...',
      instrucciones    : 'Instrucciones aparecerán aquí...',
      volverMenu       : 'Volver al menú',
      pantallaCompleta : 'Pantalla completa',
      ejercicioAnterior: 'Ejercicio anterior',
      siguienteEjercicio: 'Siguiente ejercicio',
      reiniciarEjercicio: 'Reiniciar ejercicio',
      volver           : '',
      volverGenerico   : ' ',
      aciertos         : 'Aciertos:',
      intentos         : 'Intentos:',
      tiempo           : 'Tiempo:',
      correctas        : 'Correct:',
      intentosTxt      : 'Attempts:',
      tiempoTxt        : 'Time:',
      siguiente        : 'Siguiente',
      anterior         : 'Anterior',
      reiniciar        : 'Reiniciar',
      barraInstrucciones: 'Instrucciones aparecerán aquí...',

      // ✅ VISTA.JS - Textos del loader y mensajes
      loaderPreparando    : 'Preparando tu experiencia de aprendizaje',
      loaderFinalizando   : 'Finalizando',
      loaderEsperando     : 'Esperando al juego',
      errorTituloCarga    : '¡Ups! No se pudo cargar',
      errorNoJuego        : 'No se especificó ningún juego',
      btnReintentar       : 'Intentar de nuevo',
      noPuedeAvanzar      : 'No se puede avanzar',
      noPuedeRetroceder   : 'No se puede retroceder',
      kioscoPresionaEsc   : 'Presiona ESC 2 veces para salir',
      errorNoDescargar    : 'No se pudo descargar el archivo',
      errorZipVacio       : 'El archivo del juego está vacío o incompleto.',
      errorZipDanado      : 'El archivo del juego está dañado. No es un ZIP válido.',
      errorNoProyecto     : 'El archivo no contiene un proyecto JClic válido.',
      errorProyectoVacio  : 'El proyecto dentro del ZIP está vacío o incompleto.',
      errorZipCorrupto    : 'El archivo ZIP está corrupto.',
      errorTimeout        : 'El juego tardó demasiado en cargar. ¿Quieres intentarlo de nuevo?',
      errorMotor          : 'El motor de juegos tuvo un problema al iniciar esta actividad.',
      errorNoMotor        : 'El motor de juegos no se pudo iniciar.',

      // ── Juegos ──
      juegosTitulo     : 'JUEGOS',
      juegosSub        : 'Selecciona un juego para jugar',
      buscarJuegos     : 'Buscar juego...',
      juegosDisponibles: 'juegos disponibles',
      facil            : 'Fácil',
      medio            : 'Medio',
      dificil          : 'Difícil',

      // ── Configuración ──
      configuracion    : 'CONFIGURACIÓN',
      confGeneral      : 'General',
      confSonido       : 'Sonido',
      confJuego        : 'Juego',
      confBackup       : 'Backup y Sincronización',
      confAvanzado     : 'Avanzado',
      confIdioma       : 'Idioma',
      confIdiomaDesc   : 'Selecciona el idioma de la interfaz',
      langEspanol      : 'Español',
      langCatala       : 'Català',
      langEnglish      : 'English',
      confTema         : 'Tema',
      confTemaDesc     : 'Elige el tema visual de la aplicación',
      confAnimaciones  : 'Animaciones',
      confAnimacionesDesc: 'Activar/desactivar efectos visuales',
      confVolumenJuego : 'Volumen del juego',
      confVolumenJuegoDesc: 'Controla el volumen de los sonidos dentro de los juegos',
      confVolumen      : 'Volumen principal',
      confVolumenDesc  : 'Controla el volumen de los efectos de sonido',
      confSonidoNoti   : 'Efectos de sonido',
      confSonidoNotiDesc: 'Reproducir cuando los botones tienen efectos de sonido',
      confSonidoJuego  : 'Sonido al completar juego',
      confSonidoJuegoDesc: 'Reproducir notificacion de efecto de victoria',
      confTimer        : 'Temporizador automático',
      confTimerDesc    : 'Iniciar temporizador al abrir un juego',
      confPuntuacion   : 'Mostrar puntuación en tiempo real',
      confPuntuacionDesc: 'Actualizar estadísticas mientras juegas',
      confDificultad   : 'Dificultad por defecto',
      confDificultadDesc: 'Nivel de dificultad al iniciar juegos',
      confBackupInterval: 'Auto-backup cada',
      confBackupDesc   : 'Frecuencia de guardado automático',
      confNube         : 'Sincronización en la nube',
      confNubeDesc     : 'Guardar progreso en la nube (requiere cuenta)',
      confDevMode      : 'Modo desarrollador',
      confDevModeDesc  : 'Mostrar información de depuración',
      confLimpiar      : 'Limpiar caché',
      confLimpiarDesc  : 'Eliminar datos temporales',
      confLimpiarBtn   : 'Limpiar',
      confCancelar     : 'CANCELAR',
      confGuardar      : 'GUARDAR CAMBIOS',
      confRestablecer  : 'Restablecer',
      confTemaOscuro   : 'Oscuro (Predeterminado)',
      confTemaClaro    : 'Claro',
      confTemaAuto     : 'Automático',
      confFacil        : 'Fácil',
      confMedio        : 'Medio',
      confDificil      : 'Difícil',
      conf5min         : '5 minutos',
      conf15min        : '15 minutos',
      conf30min        : '30 minutos',
      conf1hora        : '1 hora',
      confTodas        : 'Todas',

      // ── Panel docente ──
      accesoDocente    : 'Acceso Docente',
      accesoDesc       : 'Ingresa la contraseña para ver el progreso de los alumnos',
      contrasenyaPlaceholder: 'Contraseña',
      passwordPlaceholder  : 'Contraseña',
      entrar           : 'Entrar',
      passError        : 'Contraseña incorrecta',
      volverInicio     : '← Volver al inicio',
      panelTitulo      : '👩‍🏫 Panel de Control Docente',
      numAlumnos       : 'alumnos',
      alumnos          : 'alumnos',
      buscarAlumno     : 'Buscar alumno por nombre...',
      ordenNombre      : 'Ordenar por nombre',
      ordenJuegos      : 'Más juegos completados',
      ordenPuntuacion  : 'Mejor puntuación',
      ordenReciente    : 'Más reciente',
      thAlumno         : 'Alumno',
      thJuegos         : 'Juegos',
      thPuntuacion     : 'Mejor Punt.',
      thRacha          : 'Racha',
      thLogros         : 'Logros',
      thUltima         : 'Última vez',
      noAlumnos        : 'No hay alumnos registrados todavía.',
      crearPerfil      : 'Crear primer perfil',
      footerDocente    : 'CEARTEE - Panel Docente • Los datos se guardan localmente en esta computadora',
      
      completados      : 'completados',
      mejorTxt         : 'mejor',
      rachaTxt         : 'mejor racha',
      sinLogros        : 'Sin logros aún',
      haceDias         : 'Hace',
      diasTxt          : 'días',
      haceHoras        : 'Hace',
      horasTxt         : 'horas',
      haceMinutos      : 'Hace',
      minutosTxt       : 'minutos',
      nunca            : 'Nunca',
      soloHaceMomento  : 'Hace un momento',

                // ✅ ESTADISTICA.JS - Reporte Final
      reporteActividades    : 'Reporte de Actividades',
      juego                 : 'Juego',
      totales               : 'Totales',
      secuencia             : 'Secuencia',
      actividad             : 'Actividad',
      correcta              : 'Correcta',
      acciones              : 'Acciones',
      puntuacion            : 'Puntuación',
      tiempo                : 'Tiempo',
      generadoPor           : 'Generado por',
      imprimirPDF           : 'Imprimir / Guardar PDF',
      jugarDeNuevo          : 'Jugar de nuevo',
      cerrar                : 'Cerrar',
      si                    : 'Sí',
      no                    : 'No',

      nombresJuegos    : {
        '4 Cuentos'                        : '4 Cuentos',
        'Actividad 5 años infantil'        : 'Actividad 5 años infantil',
        'Aprende a leer con l,m,s,p,t,n'   : 'Aprende a leer con l,m,s,p,t,n',
        'Aprendo jugando'                  : 'Aprendo jugando',
        'Caperucita Roja'                  : 'Caperucita Roja',
        'Diferentes objetos'               : 'Diferentes objetos',
        'El pollito Chiqui'                : 'El pollito Chiqui',
        'El Soldadito de plomo'            : 'El Soldadito de plomo',
        'Iniciación a la lectura'          : 'Iniciación a la lectura',
        'Jack y las habichuelas mágicas'   : 'Jack y las habichuelas mágicas',
        'La gaviota de la Coviña'          : 'La gaviota de la Coviña',
        'Los cuentos del lobo'             : 'Los cuentos del lobo',
        'Nombre de los animales'           : 'Nombre de los animales',
        'Números y letras'                 : 'Números y letras',
        'Las Vocales'                      : 'Las Vocales',
        'Actinfantil 3 años'                      : 'Actinfantil 3 años',
        'Act infantil 4 años'                     : 'Act infantil 4 años',
        'Actividades de orientacion especial'     : 'Actividades de orientacion especial',
        'Actividades de lógica 1'                 : 'Actividades de lógica 1',
        'Actividades de lógica 2'                 : 'Actividades de lógica 2',
        'Actividades de lógica 3'                 : 'Actividades de lógica 3',
        'Animales salvajes'                       : 'Animales salvajes',
        'Bloques lógicos'                         : 'Bloques lógicos',
        'Cálculo y Números del 1 al 9'           : 'Cálculo y Números del 1 al 9',
        'Clic de las medidas'                     : 'Clic de las medidas',
        'Clic de las posiciones'                  : 'Clic de las posiciones',
        'Conceptos básicos'                       : 'Conceptos básicos',
        'Contar del 1 al 9'                       : 'Contar del 1 al 9',
        'Descomposición de números 0-10'          : 'Descomposición de números 0-10',
        'Direccionalidad, colores y formas'       : 'Direccionalidad, colores y formas',
        'El cuento de los números 0-9'            : 'El cuento de los números 0-9',
        'El verano'                               : 'El verano',
        'Formas y más formas'                     : 'Formas y más formas',
        'Iguales'                                 : 'Iguales',
        'Jugando con números'                     : 'Jugando con números',
        'Jugando con números 2'                   : 'Jugando con números 2',
        'Las regletas'                            : 'Las regletas',
        'Lógica, numeración y lateralidad'        : 'Lógica, numeración y lateralidad',
        'Los 3 osos'                              : 'Los 3 osos',
        'Nina la gallina'                         : 'Nina la gallina',
        'Ordenar tamaños'                         : 'Ordenar tamaños',
        'Producto cartesiano'                     : 'Producto cartesiano',
        'Secuencias'                              : 'Secuencias',
        'Series'                                  : 'Series',
        'Sombras'                                 : 'Sombras',
        'Tiempo, espacio y Cantidad'              : 'Tiempo, espacio y Cantidad',
        'Uno, dos, tres o ninguno'                : 'Uno, dos, tres o ninguno',
        'Aprendiendo a reciclar'        : 'Aprendiendo a reciclar',
        'El elefante y otros grandes'   : 'El elefante y otros grandes',
        'La ratita presumida'           : 'La ratita presumida',
        'Los musicos de bremen'         : 'Los musicos de bremen',
        'Los medios de transporte'      : 'Los medios de transporte',
        'Observa y relaciona'           : 'Observa y relaciona',
        'Once upon a time'              : 'Once upon a time',
        'Otros niños del mundo'         : 'Otros niños del mundo',
        'Puzzles de animales'           : 'Puzzles de animales',
        'Reconocimientos de sonidos'    : 'Reconocimientos de sonidos',
        'Cuento para la tolerancia'   : 'Cuento para la tolerancia',
        'Los rincones de la clase'    : 'Los rincones de la clase'
      },
      descripcionesJuegos: {}
    },

    ca: {
      bienvenida       : 'Benvingut a Murcia',
      subtitulo        : 'La teva experiència comença aquí',
      iniciar          : 'Pulsa per Entrar',
      visitanosLabel   : 'Visita\'ns per conèixer més',
      visitanosSub     : 'el nostre servei',
      direccion        : 'Direcció',
      redesSociales    : 'Xarxes Socials',
      redesSocialesLabel: 'Xarxes Socials',
      cearteeSinaloa   : 'Ceartee Sinaloa',
      cearteeEmail     : 'ceartee@sin.nuevaescuela.mx',
      cearteeBlog      : 'cearteesinaloa.blogspot.mx',
      queEsCeartee     : 'Què és Ceartee?',
      cearteeDesc      : 'Centre Experimental d\'Adequació i Recursos Telemàtics d\'Educació Especial',
      cearteeLargo     : 'Un espai per impulsar la inclusió educativa a través de tecnologies i recursos especialitzats.',
      
      quienJuega       : 'Qui juga?',
      tocaCarita       : 'Toca la teva careta per començar',
      nuevo            : 'Nou',
      nombre           : 'Nom',
      tuNombre         : 'El teu nom',
      eligeAvatar      : 'Tria un avatar',
      cancelar         : 'Cancel·lar',
      jugar            : 'Jugar!',
      si               : 'Sí',
      no               : 'No',
      eliminar         : 'Eliminar',
      editar           : 'Editar',
      atras            : 'Enrere',
      seleccionarAvatar: 'Selecciona un avatar',
      confirmar        : 'Confirmar',
      salir            : 'Sortir',
      cerrarSesion     : 'Tancar sessió',
      hola             : 'Hola',
      continuar        : 'Continuar',
      cambiarJugador   : 'Canviar jugador',
      panelDocente     : 'Panell Docent',
      irPanelDocente   : 'Panell Docent',
      progresoAlumnos  : 'Veure el progrés de tots els alumnes',

            // ✅ INSTRUCCIONS.JS
      muyBienDefault   : '🎉 !!! Molt bé !!! 🎉',
      prefijoMuyBien   : '🎉',
      sufijoMuyBien    : '🎉',
      cargandoMsg      : 'Carregant...',
      bienvenidaInstr  : 'Benvingut',
      disfrutaInstr    : 'Disfruta del joc',
      presionaJugar    : 'Prem per jugar',
      listoJugar       : 'Llest per jugar!',
      seleccionaOpcion : 'Selecciona una opció',
      muyBien          : 'Molt bé!',
      excelente        : 'Excel·lent!',
      intentaloNuevo   : 'Torna-ho a provar',
      correcto         : 'Correcte',
      incorrecto       : 'Incorrecte',
      tiempoAgotado    : 'Temps esgotat',
      hasGanado        : 'Has guanyat!',
      hasPerdido       : 'Has perdut',
      juegoTerminado   : 'Joc acabat',
      siguienteNivel   : 'Següent nivell',
      quieresReintentar: 'Vols tornar-ho a provar?',
      siReintentar     : 'Sí, tornar-ho a provar',
      noSalir          : 'No, sortir',
      puntos           : 'punts',
      estrellas        : 'estrelles',
      nivel            : 'Nivell',
      ronda            : 'Ronda',
      ejercicio        : 'Exercici',
      actividad        : 'Activitat',

      etapasTitulo     : 'Etapes',
      preescolar       : 'Preescolar',
      primaria         : 'Primària',
      secundaria       : 'Secundària',

      catPreescolar    : 'CATEGORIES PREESCOLAR',
      catPrimaria      : 'CATEGORIES PRIMÀRIA',
      catSecundaria    : 'CATEGORIES SECUNDÀRIA',
      catSub           : 'Tria una categoria i comença a aprendre jugant!',
      lenguaje         : 'Llenguatges',
      saberes          : 'Sabers i pensament científic',
      etica            : 'Ètica,natura i societats',
      humano           : 'De l\'humà a comunitari',
      explorar         : '▶ EXPLORAR',
      juegosStat       : 'Jocs',
      categoriasStat   : 'Categories',
      completadosStat  : 'Completats',

      lenguajesH1      : 'Llenguatges',
      saberesH1        : 'Sabers i pensament científic',
      eticaH1          : 'Ètica,natura i societats',
      humanoH1         : 'De l\'humà a comunitari',
      jugarBtn         : 'JUGAR',
      noResultados     : 'No s\'han trobat jocs',
      anos3_5          : '3-5 anys',
      anos4_6          : '4-6 anys',
      anos6_8          : '6-8 anys',
      anos9_12         : '9-12 anys',
      anos13_15        : '13-15 anys',
      minTxt           : 'min',
      cargando         : 'Carregant...',
      cargandoJuego    : 'Carregant joc...',
      instrucciones    : 'Les instruccions apareixeran aquí...',
      volverMenu       : 'Tornar al menú',
      pantallaCompleta : 'Pantalla completa',
      ejercicioAnterior: 'Exercici anterior',
      siguienteEjercicio: 'Següent exercici',
      reiniciarEjercicio: 'Reiniciar exercici',
      volver           : '',
      volverGenerico   : '← Tornar',
      aciertos         : 'Encerts:',
      intentos         : 'Intents:',
      tiempo           : 'Temps:',
      correctas        : 'Correctes:',
      intentosTxt      : 'Intents:',
      tiempoTxt        : 'Temps:',
      siguiente        : 'Següent',
      anterior         : 'Anterior',
      reiniciar        : 'Reiniciar',
      barraInstrucciones: 'Les instruccions apareixeran aquí...',

      loaderPreparando    : 'Preparant la teva experiència d\'aprenentatge',
      loaderFinalizando   : 'Finalitzant',
      loaderEsperando     : 'Esperant el joc',
      errorTituloCarga    : 'Ups! No s\'ha pogut carregar',
      errorNoJuego        : 'No s\'ha especificat cap joc',
      btnReintentar       : 'Tornar-ho a provar',
      noPuedeAvanzar      : 'No es pot avançar',
      noPuedeRetroceder   : 'No es pot retrocedir',
      kioscoPresionaEsc   : 'Prem ESC 2 vegades per sortir',
      errorNoDescargar    : 'No s\'ha pogut descarregar l\'arxiu',
      errorZipVacio       : 'L\'arxiu del joc està buit o incomplet.',
      errorZipDanado      : 'L\'arxiu del joc està malmès. No és un ZIP vàlid.',
      errorNoProyecto     : 'L\'arxiu no conté un projecte JClic vàlid.',
      errorProyectoVacio  : 'El projecte dins del ZIP està buit o incomplet.',
      errorZipCorrupto    : 'L\'arxiu ZIP està corrupte.',
      errorTimeout        : 'El joc ha trigat massa a carregar. Vols tornar-ho a provar?',
      errorMotor          : 'El motor de jocs ha tingut un problema en iniciar aquesta activitat.',
      errorNoMotor        : 'El motor de jocs no s\'ha pogut iniciar.',

      juegosTitulo     : 'JOCS',
      juegosSub        : 'Selecciona un joc per jugar',
      buscarJuegos     : 'Cerca joc...',
      juegosDisponibles: 'jocs disponibles',
      facil            : 'Fàcil',
      medio            : 'Mitjà',
      dificil          : 'Difícil',

      configuracion    : 'CONFIGURACIÓ',
      confGeneral      : 'General',
      confSonido       : 'So',
      confJuego        : 'Joc',
      confBackup       : 'Còpia de seguretat i Sincronització',
      confAvanzado     : 'Avançat',
      confIdioma       : 'Idioma',
      confIdiomaDesc   : 'Selecciona l\'idioma de la interfície',
      langEspanol      : 'Español',
      langCatala       : 'Català',
      langEnglish      : 'English',
      confTema         : 'Tema',
      confTemaDesc     : 'Tria el tema visual de l\'aplicació',
      confAnimaciones  : 'Animacions',
      confAnimacionesDesc: 'Activar/desactivar efectes visuals',
      confVolumenJuego : 'Volum del joc',
      confVolumenJuegoDesc: 'Controla el volum dels sons dins dels jocs',
      confVolumen      : 'Volum principal',
      confVolumenDesc  : 'Controla el volum dels efectes de so',
      confSonidoNoti   : 'So de notificacions',
      confSonidoNotiDesc: 'Reproduir so en rebre notificacions',
      confSonidoJuego  : 'So en completar el joc',
      confSonidoJuegoDesc: 'Reproduir efecte de victòria',
      confTimer        : 'Temporitzador automàtic',
      confTimerDesc    : 'Iniciar temporitzador en obrir un joc',
      confPuntuacion   : 'Mostrar puntuació en temps real',
      confPuntuacionDesc: 'Actualitzar estadístiques mentre jugues',
      confDificultad   : 'Dificultat per defecte',
      confDificultadDesc: 'Nivell de dificultat en iniciar jocs',
      confBackupInterval: 'Auto-backup cada',
      confBackupDesc   : 'Freqüència de desat automàtic',
      confNube         : 'Sincronització al núvol',
      confNubeDesc     : 'Desar progrés al núvol (requereix compte)',
      confDevMode      : 'Mode desenvolupador',
      confDevModeDesc  : 'Mostrar informació de depuració',
      confLimpiar      : 'Netejar caché',
      confLimpiarDesc  : 'Eliminar dades temporals',
      confLimpiarBtn   : 'Netejar',
      confCancelar     : 'CANCEL·LAR',
      confGuardar      : 'DESAR CANVIS',
      confRestablecer  : 'Restablir',
      confTemaOscuro   : 'Fosc (Predeterminat)',
      confTemaClaro    : 'Clar',
      confTemaAuto     : 'Automàtic',
      confFacil        : 'Fàcil',
      confMedio        : 'Mitjà',
      confDificil      : 'Difícil',
      conf5min         : '5 minuts',
      conf15min        : '15 minuts',
      conf30min        : '30 minuts',
      conf1hora        : '1 hora',
      confTodas        : 'Totes',

      accesoDocente    : 'Accés Docent',
      accesoDesc       : 'Introdueix la contrasenya per veure el progrés dels alumnes',
      contrasenyaPlaceholder: 'Contrasenya',
      passwordPlaceholder  : 'Contrasenya',
      entrar           : 'Entrar',
      passError        : 'Contrasenya incorrecta',
      volverInicio     : '← Tornar a l\'inici',
      panelTitulo      : '👩‍🏫 Panell de Control Docent',
      numAlumnos       : 'alumnes',
      alumnos          : 'alumnes',
      buscarAlumno     : 'Cercar alumne per nom...',
      ordenNombre      : 'Ordenar per nom',
      ordenJuegos      : 'Més jocs completats',
      ordenPuntuacion  : 'Millor puntuació',
      ordenReciente    : 'Més recent',
      thAlumno         : 'Alumne',
      thJuegos         : 'Jocs',
      thPuntuacion     : 'Millor Punt.',
      thRacha          : 'Ratxa',
      thLogros         : 'Assoliments',
      thUltima         : 'Última vegada',
      noAlumnos        : 'No hi ha alumnes registrats encara.',
      crearPerfil      : 'Crear primer perfil',
      footerDocente    : 'CEARTEE - Panell Docent • Les dades es guarden localment en aquest ordinador',

       
      
      completados      : 'completats',
      mejorTxt         : 'millor',
      rachaTxt         : 'millor ratxa',
      sinLogros        : 'Sense assoliments encara',
      haceDias         : 'Fa',
      diasTxt          : 'dies',
      haceHoras        : 'Fa',
      horasTxt         : 'hores',
      haceMinutos      : 'Fa',
      minutosTxt       : 'minuts',
      nunca            : 'Mai',
      soloHaceMomento  : 'Fa un moment',

                 // ✅ ESTADISTICA.JS - Reporte Final
      reporteActividades    : 'Report d\'Activitats',
      juego                 : 'Joc',
      totales               : 'Totals',
      secuencia             : 'Seqüència',
      actividad             : 'Activitat',
      correcta              : 'Correcta',
      acciones              : 'Accions',
      puntuacion            : 'Puntuació',
      tiempo                : 'Temps',
      generadoPor           : 'Generat per',
      imprimirPDF           : 'Imprimir / Guardar PDF',
      jugarDeNuevo          : 'Jugar de nou',
      cerrar                : 'Tancar',
      si                    : 'Sí',
      no                    : 'No',


      nombresJuegos    : {
        '4 Cuentos'                        : '4 Contes',
        'Actividad 5 años infantil'        : 'Activitat 5 anys infantil',
        'Aprende a leer con l,m,s,p,t,n'   : 'Aprèn a llegir amb l,m,s,p,t,n',
        'Aprendo jugando'                  : 'Aprenent jugant',
        'Caperucita Roja'                  : 'Caputxeta Vermella',
        'Diferentes objetos'               : 'Diferents objectes',
        'El pollito Chiqui'                : 'El pollet Chiqui',
        'El Soldadito de plomo'            : 'El Soldadet de plom',
        'Iniciación a la lectura'          : 'Iniciació a la lectura',
        'Jack y las habichuelas mágicas'   : 'Jack i les mongetes màgiques',
        'La gaviota de la Coviña'          : 'La gavina de la Coviña',
        'Los cuentos del lobo'             : 'Els contes del llop',
        'Nombre de los animales'           : 'Nom dels animals',
        'Números y letras'                 : 'Números i lletres',
        'Las Vocales'                      : 'Les Vocals',
        'Actinfantil 3 años'                      : 'Actinfantil 3 anys',
        'Act infantil 4 años'                     : 'Act infantil 4 anys',
        'Actividades de orientacion especial'     : 'Activitats d\'orientació especial',
        'Actividades de lógica 1'                 : 'Activitats de lògica 1',
        'Actividades de lógica 2'                 : 'Activitats de lògica 2',
        'Actividades de lógica 3'                 : 'Activitats de lògica 3',
        'Animales salvajes'                       : 'Animals salvatges',
        'Bloques lógicos'                         : 'Blocs lògics',
        'Cálculo y Números del 1 al 9'           : 'Càlcul i Números del 1 al 9',
        'Clic de las medidas'                     : 'Clic de les mesures',
        'Clic de las posiciones'                  : 'Clic de les posicions',
        'Conceptos básicos'                       : 'Conceptes bàsics',
        'Contar del 1 al 9'                       : 'Comptar del 1 al 9',
        'Descomposición de números 0-10'          : 'Descomposició de números 0-10',
        'Direccionalidad, colores y formas'       : 'Direccionalitat, colors i formes',
        'El cuento de los números 0-9'            : 'El conte dels números 0-9',
        'El verano'                               : 'L\'estiu',
        'Formas y más formas'                     : 'Formes i més formes',
        'Iguales'                                 : 'Iguals',
        'Jugando con números'                     : 'Jugant amb números',
        'Jugando con números 2'                   : 'Jugant amb números 2',
        'Las regletas'                            : 'Les regletes',
        'Lógica, numeración y lateralidad'        : 'Lògica, numeració i lateralitat',
        'Los 3 osos'                              : 'Els 3 ossos',
        'Nina la gallina'                         : 'Nina la gallina',
        'Ordenar tamaños'                         : 'Ordenar mides',
        'Producto cartesiano'                     : 'Producte cartesià',
        'Secuencias'                              : 'Seqüències',
        'Series'                                  : 'Sèries',
        'Sombras'                                 : 'Ombres',
        'Tiempo, espacio y Cantidad'              : 'Temps, espai i Quantitat',
        'Uno, dos, tres o ninguno'                : 'Un, dos, tres o cap',
        'Aprendiendo a reciclar'        : 'Aprenent a reciclar',
        'El elefante y otros grandes'   : 'L\'elefant i altres grans',
        'La ratita presumida'           : 'La rateta presumida',
        'Los musicos de bremen'         : 'Els músics de Bremen',
        'Los medios de transporte'      : 'Els mitjans de transport',
        'Observa y relaciona'           : 'Observa i relaciona',
        'Once upon a time'              : 'Once upon a time',
        'Otros niños del mundo'         : 'Altres nens del món',
        'Puzzles de animales'           : 'Puzzles d\'animals',
        'Reconocimientos de sonidos'    : 'Reconeixements de sons',
        'Cuento para la tolerancia'   : 'Conte per a la tolerància',
        'Los rincones de la clase'    : 'Els racons de la classe'
      },
      descripcionesJuegos: {}
    },

    en: {
      bienvenida       : 'Welcome to Murcia',
      subtitulo        : 'Your experience starts here',
      iniciar          : 'Click to Enter',
      visitanosLabel   : 'Visit us to learn more',
      visitanosSub     : 'our service',
      direccion        : 'Address',
      redesSociales    : 'Social Media',
      redesSocialesLabel: 'Social Media',
      cearteeSinaloa   : 'Ceartee Sinaloa',
      cearteeEmail     : 'ceartee@sin.nuevaescuela.mx',
      cearteeBlog      : 'cearteesinaloa.blogspot.mx',
      queEsCeartee     : 'What is Ceartee?',
      cearteeDesc      : 'Center for Experimental Adaptation and Telematic Resources for Special Education',
      cearteeLargo     : 'A space to promote educational inclusion through specialized technologies and resources.',
      
      quienJuega       : 'Who is playing?',
      tocaCarita       : 'Tap your face to start',
      nuevo            : 'New',
      nombre           : 'Name',
      tuNombre         : 'Your name',
      eligeAvatar      : 'Choose an avatar',
      cancelar         : 'Cancel',
      jugar            : 'Play!',
      si               : 'Yes',
      no               : 'No',
      eliminar         : 'Delete',
      editar           : 'Edit',
      atras            : '',
      seleccionarAvatar: 'Select an avatar',
      confirmar        : 'Confirm',
      salir            : 'Exit',
      cerrarSesion     : 'Log out',
      hola             : 'Hello',
      continuar        : 'Continue',
      cambiarJugador   : 'Change player',
      panelDocente     : 'Teacher Panel',
      irPanelDocente   : 'Teacher Panel',
      progresoAlumnos  : 'View all students progress',

      etapasTitulo     : 'Stages',
      preescolar       : 'Preschool',
      primaria         : 'Primary',
      secundaria       : 'Secondary',

      catPreescolar    : 'PRESCHOOL CATEGORIES',
      catPrimaria      : 'PRIMARY CATEGORIES',
      catSecundaria    : 'SECONDARY CATEGORIES',
      catSub           : 'Choose a category and start learning by playing!',
      lenguaje         : 'Languages',
      saberes          : 'Knowledge & Scientific Thinking',
      etica            : 'Ethics, Nature & Societies',
      humano           : 'From Human to Community',
      explorar         : '▶ EXPLORE',
      juegosStat       : 'Games',
      categoriasStat   : 'Categories',
      completadosStat  : 'Completed',

      lenguajesH1      : 'Languages',
      saberesH1        : 'Knowledge & Scientific Thinking',
      eticaH1          : 'Ethics, Nature & Societies',
      humanoH1         : 'From Human to Community',
      jugarBtn         : 'PLAY',
      noResultados     : 'No games found',
      anos3_5          : '3-5 years',
      anos4_6          : '4-6 years',
      anos6_8          : '6-8 years',
      anos9_12         : '9-12 years',
      anos13_15        : '13-15 years',
      minTxt           : 'min',
      cargando         : 'Loading...',
      cargandoJuego    : 'Loading game...',
      instrucciones    : 'Instructions will appear here...',
      volverMenu       : 'Back to menu',
      pantallaCompleta : 'Fullscreen',
      ejercicioAnterior: 'Previous exercise',
      siguienteEjercicio: 'Next exercise',
      reiniciarEjercicio: 'Restart exercise',
      volver           : '',
      volverGenerico   : ' Back',
      aciertos         : 'Correct:',
      intentos         : 'Attempts:',
      tiempo           : 'Time:',
      correctas        : 'Correct:',
      intentosTxt      : 'Attempts:',
      tiempoTxt        : 'Time:',
      siguiente        : 'Next',
      anterior         : 'Previous',
      reiniciar        : 'Restart',
      barraInstrucciones: 'Instructions will appear here...',

      loaderPreparando    : 'Preparing your learning experience',
      loaderFinalizando   : 'Finishing',
      loaderEsperando     : 'Waiting for the game',
      errorTituloCarga    : 'Oops! Could not load',
      errorNoJuego        : 'No game was specified',
      btnReintentar       : 'Try again',
      noPuedeAvanzar      : 'Cannot advance',
      noPuedeRetroceder   : 'Cannot go back',
      kioscoPresionaEsc   : 'Press ESC 2 times to exit',
      errorNoDescargar    : 'Could not download the file',
      errorZipVacio       : 'The game file is empty or incomplete.',
      errorZipDanado      : 'The game file is damaged. Not a valid ZIP.',
      errorNoProyecto     : 'The file does not contain a valid JClic project.',
      errorProyectoVacio  : 'The project inside the ZIP is empty or incomplete.',
      errorZipCorrupto    : 'The ZIP file is corrupted.',
      errorTimeout        : 'The game took too long to load. Do you want to try again?',
      errorMotor          : 'The game engine had a problem starting this activity.',
      errorNoMotor        : 'The game engine could not be started.',

      juegosTitulo     : 'GAMES',
      juegosSub        : 'Select a game to play',
      buscarJuegos     : 'Search game...',
      juegosDisponibles: 'games available',
      facil            : 'Easy',
      medio            : 'Medium',
      dificil          : 'Hard',

      configuracion    : 'SETTINGS',
      confGeneral      : 'General',
      confSonido       : 'Sound',
      confJuego        : 'Game',
      confBackup       : 'Backup & Sync',
      confAvanzado     : 'Advanced',
      confIdioma       : 'Language',
      confIdiomaDesc   : 'Select the interface language',
      langEspanol      : 'Spanish',
      langCatala       : 'Catalan',
      langEnglish      : 'English',
      confTema         : 'Theme',
      confTemaDesc     : 'Choose the visual theme of the app',
      confAnimaciones  : 'Animations',
      confAnimacionesDesc: 'Enable/disable visual effects',
      confVolumenJuego : 'Game volume',
      confVolumenJuegoDesc: 'Controls the volume of sounds inside the games',
      confVolumen      : 'Master volume',
      confVolumenDesc  : 'Control the volume of sound effects',
      confSonidoNoti   : 'Sound effects',
      confSonidoNotiDesc: 'Play when the buttons have sound effects',
      confSonidoJuego  : 'Sound on game completion',
      confSonidoJuegoDesc: 'Play victory effect',
      confTimer        : 'Automatic timer',
      confTimerDesc    : 'Start timer when opening a game',
      confPuntuacion   : 'Show score in real time',
      confPuntuacionDesc: 'Update stats while playing',
      confDificultad   : 'Default difficulty',
      confDificultadDesc: 'Difficulty level when starting games',
      confBackupInterval: 'Auto-backup every',
      confBackupDesc   : 'Automatic save frequency',
      confNube         : 'Cloud sync',
      confNubeDesc     : 'Save progress to the cloud (requires account)',
      confDevMode      : 'Developer mode',
      confDevModeDesc  : 'Show debug information',
      confLimpiar      : 'Clear cache',
      confLimpiarDesc  : 'Remove temporary data',
      confLimpiarBtn   : 'Clear',
      confCancelar     : 'CANCEL',
      confGuardar      : 'SAVE CHANGES',
      confRestablecer  : 'Reset',
      confTemaOscuro   : 'Dark (Default)',
      confTemaClaro    : 'Light',
      confTemaAuto     : 'Automatic',
      confFacil        : 'Easy',
      confMedio        : 'Medium',
      confDificil      : 'Hard',
      conf5min         : '5 minutes',
      conf15min        : '15 minutes',
      conf30min        : '30 minutes',
      conf1hora        : '1 hour',
      confTodas        : 'All',

            // ✅ INSTRUCTIONS.JS
      muyBienDefault   : '🎉 !!! Very good !!! 🎉',
      prefijoMuyBien   : '🎉',
      sufijoMuyBien    : '🎉',
      cargandoMsg      : 'Loading...',
      bienvenidaInstr  : 'Welcome',
      disfrutaInstr    : 'Enjoy the game',
      presionaJugar    : 'Press to play',
      listoJugar       : 'Ready to play!',
      seleccionaOpcion : 'Select an option',
      muyBien          : 'Very good!',
      excelente        : 'Excellent!',
      intentaloNuevo   : 'Try again',
      correcto         : 'Correct',
      incorrecto       : 'Incorrect',
      tiempoAgotado    : 'Time out',
      hasGanado        : 'You won!',
      hasPerdido       : 'You lost',
      juegoTerminado   : 'Game over',
      siguienteNivel   : 'Next level',
      quieresReintentar: 'Do you want to try again?',
      siReintentar     : 'Yes, retry',
      noSalir          : 'No, exit',
      puntos           : 'points',
      estrellas        : 'stars',
      nivel            : 'Level',
      ronda            : 'Round',
      ejercicio        : 'Exercise',
      actividad        : 'Activity',

      accesoDocente    : 'Teacher Access',
      accesoDesc       : 'Enter the password to view student progress',
      contrasenyaPlaceholder: 'Password',
      passwordPlaceholder  : 'Password',
      entrar           : 'Enter',
      passError        : 'Incorrect password',
      volverInicio     : '← Back to start',
      panelTitulo      : '👩‍🏫 Teacher Control Panel',
      numAlumnos       : 'students',
      alumnos          : 'students',
      buscarAlumno     : 'Search student by name...',
      ordenNombre      : 'Sort by name',
      ordenJuegos      : 'Most games completed',
      ordenPuntuacion  : 'Best score',
      ordenReciente    : 'Most recent',
      thAlumno         : 'Student',
      thJuegos         : 'Games',
      thPuntuacion     : 'Best Score',
      thRacha          : 'Streak',
      thLogros         : 'Achievements',
      thUltima         : 'Last time',
      noAlumnos        : 'No students registered yet.',
      crearPerfil      : 'Create first profile',
      footerDocente    : 'CEARTEE - Teacher Panel • Data is saved locally on this computer',
      
      completados      : 'completed',
      mejorTxt         : 'best',
      rachaTxt         : 'best streak',
      sinLogros        : 'No achievements yet',
      haceDias         : '',
      diasTxt          : 'days ago',
      haceHoras        : '',
      horasTxt         : 'hours ago',
      haceMinutos      : '',
      minutosTxt       : 'minutes ago',
      nunca            : 'Never',
      soloHaceMomento  : 'A moment ago',

                  // ✅ STATISTICS.JS - Final Report
      reporteActividades    : 'Activities Report',
      juego                 : 'Game',
      totales               : 'Totals',
      secuencia             : 'Sequence',
      actividad             : 'Activity',
      correcta              : 'Correct',
      acciones              : 'Actions',
      puntuacion            : 'Score',
      tiempo                : 'Time',
      generadoPor           : 'Generated by',
      imprimirPDF           : 'Print / Save PDF',
      jugarDeNuevo          : 'Play again',
      cerrar                : 'Close',
      si                    : 'Yes',
      no                    : 'No',

      nombresJuegos    : {
        '4 Cuentos'                        : '4 Stories',
        'Actividad 5 años infantil'        : '5-year-old Kids Activity',
        'Aprende a leer con l,m,s,p,t,n'   : 'Learn to read with l,m,s,p,t,n',
        'Aprendo jugando'                  : 'Learning by playing',
        'Caperucita Roja'                  : 'Little Red Riding Hood',
        'Diferentes objetos'               : 'Different objects',
        'El pollito Chiqui'                : 'Chiqui the little chick',
        'El Soldadito de plomo'            : 'The Tin Soldier',
        'Iniciación a la lectura'          : 'Introduction to reading',
        'Jack y las habichuelas mágicas'   : 'Jack and the Magic Beans',
        'La gaviota de la Coviña'          : 'The Seagull of Coviña',
        'Los cuentos del lobo'             : 'The Wolf\'s Tales',
        'Nombre de los animales'           : 'Names of animals',
        'Números y letras'                 : 'Numbers and letters',
        'Las Vocales'                      : 'The Vowels',
        'Actinfantil 3 años'                      : 'Kids Activity 3 years',
        'Act infantil 4 años'                     : 'Kids Activity 4 years',
        'Actividades de orientacion especial'     : 'Special orientation activities',
        'Actividades de lógica 1'                 : 'Logic activities 1',
        'Actividades de lógica 2'                 : 'Logic activities 2',
        'Actividades de lógica 3'                 : 'Logic activities 3',
        'Animales salvajes'                       : 'Wild animals',
        'Bloques lógicos'                         : 'Logic blocks',
        'Cálculo y Números del 1 al 9'           : 'Calculation & Numbers 1-9',
        'Clic de las medidas'                     : 'Click of measurements',
        'Clic de las posiciones'                  : 'Click of positions',
        'Conceptos básicos'                       : 'Basic concepts',
        'Contar del 1 al 9'                       : 'Count from 1 to 9',
        'Descomposición de números 0-10'          : 'Number decomposition 0-10',
        'Direccionalidad, colores y formas'       : 'Directionality, colors & shapes',
        'El cuento de los números 0-9'            : 'The tale of numbers 0-9',
        'El verano'                               : 'Summer',
        'Formas y más formas'                     : 'Shapes and more shapes',
        'Iguales'                                 : 'Equals',
        'Jugando con números'                     : 'Playing with numbers',
        'Jugando con números 2'                   : 'Playing with numbers 2',
        'Las regletas'                            : 'The rods',
        'Lógica, numeración y lateralidad'        : 'Logic, numeration & laterality',
        'Los 3 osos'                              : 'The 3 bears',
        'Nina la gallina'                         : 'Nina the hen',
        'Ordenar tamaños'                         : 'Sort sizes',
        'Producto cartesiano'                     : 'Cartesian product',
        'Secuencias'                              : 'Sequences',
        'Series'                                  : 'Series',
        'Sombras'                                 : 'Shadows',
        'Tiempo, espacio y Cantidad'              : 'Time, space & quantity',
        'Uno, dos, tres o ninguno'                : 'One, two, three or none',
        'Aprendiendo a reciclar'        : 'Learning to recycle',
        'El elefante y otros grandes'   : 'The elephant and other big ones',
        'La ratita presumida'           : 'The vain little mouse',
        'Los musicos de bremen'         : 'The musicians of Bremen',
        'Los medios de transporte'      : 'Means of transport',
        'Observa y relaciona'           : 'Observe and relate',
        'Once upon a time'              : 'Once upon a time',
        'Otros niños del mundo'         : 'Other children of the world',
        'Puzzles de animales'           : 'Animal puzzles',
        'Reconocimientos de sonidos'    : 'Sound recognition',
        'Cuento para la tolerancia'   : 'A tale for tolerance',
        'Los rincones de la clase'    : 'The corners of the classroom'
      },
      descripcionesJuegos: {}
    }
  };

  // ✅ EXPONER TEXTOS GLOBALMENTE
  window.textosI18n = textos;

    // ==========================================
  // APLICAR TEMA
  // ==========================================
  function aplicarTema(tema) {
    document.body.classList.remove('tema-dark', 'tema-light', 'tema-auto');
    if (tema === 'auto') {
      const esClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
      document.body.classList.add(esClaro ? 'tema-light' : 'tema-dark');
      document.body.classList.add('tema-auto');
    } else {
      document.body.classList.add('tema-' + tema);
    }
  }

  // ==========================================
  // APLICAR ANIMACIONES (BACKEND ONLY)
  // ==========================================
  function aplicarAnimaciones(activas) {
    if (activas) {
      document.body.classList.remove('sin-animaciones');
    } else {
      document.body.classList.add('sin-animaciones');
    }
  }
  // ==========================================
  // APLICAR IDIOMA (VERSIÓN CON MUTATION OBSERVER)
  // ==========================================
  function aplicarIdioma(idioma) {
    const t = textos[idioma] || textos['es'];

    // 1. data-i18n (textos normales)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const clave = el.getAttribute('data-i18n');
      if (t[clave]) el.textContent = t[clave];
    });

    // 2. data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const clave = el.getAttribute('data-i18n-placeholder');
      if (t[clave]) el.setAttribute('placeholder', t[clave]);
    });

    // 3. data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const clave = el.getAttribute('data-i18n-title');
      if (t[clave]) el.setAttribute('title', t[clave]);
    });

    // 4. data-i18n-tooltip
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
      const clave = el.getAttribute('data-i18n-tooltip');
      if (t[clave]) el.setAttribute('data-tooltip', t[clave]);
    });

    // 5. data-i18n-value
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const clave = el.getAttribute('data-i18n-value');
      if (t[clave]) el.setAttribute('value', t[clave]);
    });

    // 6. Botón volver
    document.querySelectorAll('.btn-back .btn-text').forEach(el => {
      el.textContent = t.volver;
    });
    document.querySelectorAll('.btn-backer').forEach(el => {
      el.textContent = t.volver;
    });

    // 7. Aplicar por página
    aplicarTextoIndex(t);
    aplicarTextoEtapas(t);
    aplicarTextoCategorias(t);
    aplicarTextoJuegos(t);
    aplicarTextoVista(t);
    aplicarTextoConfig(t);
    aplicarTextoPanelDocente(t);

    document.documentElement.lang = idioma;
  }

  // === index.html ===
  function aplicarTextoIndex(t) {
    const title = document.querySelector('.title');
    if (title) title.textContent = t.bienvenida;

    const sub = document.querySelector('.subtitle');
    if (sub) sub.textContent = t.subtitulo;

    const btn = document.getElementById('btnEnter') || document.querySelector('.btn-enter');
    if (btn && !btn.hasAttribute('data-i18n')) btn.textContent = t.iniciar;
  }

  // === Etapas.html ===
  function aplicarTextoEtapas(t) {
    const h1 = document.querySelector('.header-title h1');
    if (h1) {
      const txt = h1.textContent.toLowerCase();
      if (txt.includes('etapa') || txt.includes('stage') || txt.includes('etape')) {
        h1.textContent = t.etapasTitulo;
      }
    }
    document.querySelectorAll('.Btn-button').forEach(btn => { btn.textContent = t.preescolar; });
    document.querySelectorAll('.Btn-button2').forEach(btn => { btn.textContent = t.primaria; });
    document.querySelectorAll('.Btn-button3').forEach(btn => { btn.textContent = t.secundaria; });
  }

  // === Categorias.html ===
  function aplicarTextoCategorias(t) {
    const h1 = document.querySelector('.header-title h1');
    if (h1) {
      const txt = h1.textContent.toUpperCase();
      if (txt.includes('PREESCOLAR') || txt.includes('PRESCHOOL')) h1.textContent = t.catPreescolar;
      if (txt.includes('PRIMARIA') || txt.includes('PRIMARY') || txt.includes('PRIMÀRIA')) h1.textContent = t.catPrimaria;
      if (txt.includes('SECUNDARIA') || txt.includes('SECONDARY') || txt.includes('SECUNDÀRIA')) h1.textContent = t.catSecundaria;
    }
    const sub = document.querySelector('.page-subtitle');
    if (sub) sub.textContent = t.catSub;

    document.querySelectorAll('.category-card').forEach(card => {
      const titulo = card.querySelector('.card-title');
      if (!titulo) return;
      const txt = titulo.textContent.trim().toLowerCase();
      if (txt.includes('lenguaj') || txt.includes('llenguat') || txt.includes('language')) titulo.textContent = t.lenguaje;
      if (txt.includes('saber') || txt.includes('knowledge')) titulo.textContent = t.saberes;
      if (txt.includes('étic') || txt.includes('ètic') || txt.includes('ethic')) titulo.textContent = t.etica;
      if (txt.includes('humano') || txt.includes('humà') || txt.includes('human')) titulo.textContent = t.humano;

      const btn = card.querySelector('.card-btn span');
      if (btn) btn.textContent = t.explorar;

      var gameCount = card.querySelector('.game-count');
      if (gameCount) {
        var num = gameCount.textContent.replace(/[^0-9]/g, '');
        if (num) gameCount.textContent = num + ' ' + t.juegosStat.toLowerCase();
      }
    });

    document.querySelectorAll('.footer-stats .stat-label').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (txt.includes('juego') || txt.includes('joc') || txt.includes('game')) el.textContent = t.juegosStat;
      if (txt.includes('categor')) el.textContent = t.categoriasStat;
      if (txt.includes('completad') || txt.includes('completat') || txt.includes('completed')) el.textContent = t.completadosStat;
    });
  }

  // === Lenguajes.html / Etica.html / Saberes.html / Humano.html ===
  function aplicarTextoJuegos(t) {
    var h1 = document.querySelector('.header-title h1');
    if (h1) {
      var txt = h1.textContent.trim().toLowerCase();
      if (txt.includes('lenguaj') || txt.includes('llenguat') || txt.includes('language')) h1.textContent = t.lenguajesH1;
      if (txt.includes('saber') || txt.includes('knowledge')) h1.textContent = t.saberesH1;
      if (txt.includes('étic') || txt.includes('ètic') || txt.includes('ethic')) h1.textContent = t.eticaH1;
      if (txt.includes('humano') || txt.includes('humà') || txt.includes('human')) h1.textContent = t.humanoH1;
    }

    if (t.nombresJuegos && Object.keys(t.nombresJuegos).length > 0) {
      document.querySelectorAll('.game-card .game-title').forEach(function(el) {
        var original = el.textContent.trim();
        if (t.nombresJuegos[original]) el.textContent = t.nombresJuegos[original];
      });
    }

    if (t.descripcionesJuegos && Object.keys(t.descripcionesJuegos).length > 0) {
      document.querySelectorAll('.game-card .game-description').forEach(function(el) {
        var original = el.textContent.trim();
        if (t.descripcionesJuegos[original]) el.textContent = t.descripcionesJuegos[original];
      });
    }

    document.querySelectorAll('.play-text').forEach(function(el) {
      el.textContent = t.jugarBtn;
    });

    var noResults = document.querySelector('.no-results p');
    if (noResults) noResults.textContent = t.noResultados;

    var search = document.getElementById('searchInput');
    if (search) {
      var ph = search.getAttribute('placeholder') || '';
      if (ph.includes('Buscar') || ph.includes('Cerca') || ph.includes('Search')) {
        search.setAttribute('placeholder', t.buscarJuegos);
      }
    }
  }

  // === vista.html ===
  function aplicarTextoVista(t) {
    document.querySelectorAll('.stat-label').forEach(el => {
      const txt = el.textContent.trim().toLowerCase();
      if (txt.includes('acierto') || txt.includes('encert') || txt.includes('correct')) el.textContent = t.aciertos;
      if (txt.includes('intento') || txt.includes('intent') || txt.includes('attempt')) el.textContent = t.intentos;
      if (txt.includes('tiempo') || txt.includes('temps') || txt.includes('time')) el.textContent = t.tiempo;
    });

    const btnSig  = document.querySelector('.btn-nav2');
    const btnAnt  = document.querySelector('.btn-nav1');
    const btnRein = document.querySelector('.btn-nav3');
    if (btnSig)  btnSig.textContent  = t.siguiente;
    if (btnAnt)  btnAnt.textContent  = t.anterior;
    if (btnRein) btnRein.textContent = t.reiniciar;

    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle && gameTitle.textContent.trim().toLowerCase() === 'cargando...') {
      gameTitle.textContent = t.cargando;
    }
  }

  // === Configuracion.html ===
  function aplicarTextoConfig(t) {
    if (!document.querySelector('.settings-container')) return;
    
    var h1 = document.querySelector('.header-title h1');
    if (h1) h1.textContent = t.configuracion;

    var btnReset = document.querySelector('.btn-reset .btn-text');
    if (btnReset) btnReset.textContent = t.confRestablecer;

    var sections = document.querySelectorAll('.section-title');
    var sectionNames = [t.confGeneral, t.confSonido, t.confJuego, t.confBackup, t.confAvanzado];
    sections.forEach(function(el, i) {
      if (sectionNames[i]) {
        var icon = el.querySelector('.section-icon');
        var iconText = icon ? icon.textContent : '';
        el.innerHTML = '<span class="section-icon">' + iconText + '</span> ' + sectionNames[i];
      }
    });

    var labels = {
      'language': [t.confIdioma, t.confIdiomaDesc],
      'theme': [t.confTema, t.confTemaDesc],
      'animations': [t.confAnimaciones, t.confAnimacionesDesc],
      'game-volume': [t.confVolumenJuego, t.confVolumenJuegoDesc],
      'volume': [t.confVolumen, t.confVolumenDesc],
      'notification-sound': [t.confSonidoNoti, t.confSonidoNotiDesc],
      'completion-sound': [t.confSonidoJuego, t.confSonidoJuegoDesc],
      'auto-timer': [t.confTimer, t.confTimerDesc],
      'realtime-stats': [t.confPuntuacion, t.confPuntuacionDesc],
      'default-difficulty': [t.confDificultad, t.confDificultadDesc],
      'backup-interval': [t.confBackupInterval, t.confBackupDesc],
      'cloud-sync': [t.confNube, t.confNubeDesc],
      'developer-mode': [t.confDevMode, t.confDevModeDesc]
    };

    Object.keys(labels).forEach(function(id) {
      var input = document.getElementById(id);
      if (!input) return;
      var item = input.closest('.setting-item');
      if (!item) return;
      var labelEl = item.querySelector('.setting-label');
      var descEl = item.querySelector('.setting-description');
      if (labelEl) labelEl.textContent = labels[id][0];
      if (descEl) descEl.textContent = labels[id][1];
    });

    var btnClean = document.querySelector('.btn-clean');
    if (btnClean) btnClean.textContent = t.confLimpiarBtn;

    var elTema = document.getElementById('theme');
    if (elTema) {
      elTema.options[0].text = t.confTemaOscuro;
      elTema.options[1].text = t.confTemaClaro;
      elTema.options[2].text = t.confTemaAuto;
    }

    var elDif = document.getElementById('default-difficulty');
    if (elDif) {
      elDif.options[0].text = t.confTodas;
      elDif.options[1].text = t.confFacil;
      elDif.options[2].text = t.confMedio;
      elDif.options[3].text = t.confDificil;
    }

    var elBackup = document.getElementById('backup-interval');
    if (elBackup) {
      elBackup.options[0].text = t.conf5min;
      elBackup.options[1].text = t.conf15min;
      elBackup.options[2].text = t.conf30min;
      elBackup.options[3].text = t.conf1hora;
    }

    var btnCancel = document.querySelector('.btn-cancel');
    if (btnCancel) btnCancel.textContent = t.confCancelar;

    var btnSave = document.querySelector('.btn-save');
    if (btnSave) btnSave.textContent = t.confGuardar;
  }

  // === panel-docente.html ===
  function aplicarTextoPanelDocente(t) {
    if (!document.querySelector('.login-overlay') && !document.querySelector('.panel-container')) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const clave = el.getAttribute('data-i18n');
      if (t[clave]) el.textContent = t[clave];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const clave = el.getAttribute('data-i18n-placeholder');
      if (t[clave]) el.setAttribute('placeholder', t[clave]);
    });

    if (typeof window.renderizarPanel === 'function') {
      window.renderizarPanel();
    }
  }

  // ==========================================
  // CSS DE TEMAS
  // ==========================================
    function inyectarCSSTemas() {
    if (document.getElementById('css-temas-global')) return;
    const style = document.createElement('style');
    style.id = 'css-temas-global';
    style.textContent = `
      /* ==========================================
         TEMAS (DARK / LIGHT / AUTO)
         ========================================== */
      body.tema-light {
        background: linear-gradient(135deg, #e0e7ff, #c7d2fe) !important;
        color: #1a1a2e !important;
      }
      body.tema-light .card,
      body.tema-light .game-card,
      body.tema-light .category-card,
      body.tema-light .stage-card,
      body.tema-light .stats-panel,
      body.tema-light .nav-buttons,
      body.tema-light .header,
      body.tema-light .settings-section,
      body.tema-light .main-container {
        background: rgba(255,255,255,0.85) !important;
        color: #1a1a2e !important;
      }
      body.tema-light h1, body.tema-light h2, body.tema-light h3,
      body.tema-light p, body.tema-light label,
      body.tema-light .stat-label, body.tema-light .stat-value,
      body.tema-light .game-title, body.tema-light .game-description,
      body.tema-light .card-title, body.tema-light .page-subtitle {
        color: #1a1a2e !important;
      }
      body.tema-light .btn-back,
      body.tema-light .btn-backer {
        background: rgba(255,255,255,0.8) !important;
        color: #3730a3 !important;
        border-color: #3730a3 !important;
      }
      body.tema-light .setting-description {
        color: #555 !important;
      }

       /* ==========================================
         ANIMACIONES DESACTIVADAS (BACKEND)
         ========================================== */
      body.sin-animaciones *,
      body.sin-animaciones *::before,
      body.sin-animaciones *::after {
        animation-duration: 0.001s !important;
        animation-delay: 0s !important;
        transition-duration: 0.001s !important;
        transition-delay: 0s !important;
        animation-iteration-count: 1 !important;
      }

      body.sin-animaciones .bg-animation {
        display: none !important;
      }

      body.sin-animaciones .decoration,
      body.sin-animaciones .decoration span,
      body.sin-animaciones .category-card,
      body.sin-animaciones .game-card,
      body.sin-animaciones .stage-card,
      body.sin-animaciones .card,
      body.sin-animaciones .btn-enter,
      body.sin-animaciones .container,
      body.sin-animaciones .main-container,
      body.sin-animaciones .settings-container,
      body.sin-animaciones .logo,
      body.sin-animaciones .logo-badge,
      body.sin-animaciones .info-card {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
        animation: none !important;
        transition: none !important;
      }

      body.sin-animaciones .ceartee-fade-overlay {
        transition: none !important;
      }

      body.sin-animaciones .btn-back:hover,
      body.sin-animaciones .btn-backer:hover,
      body.sin-animaciones .btn-enter:hover,
      body.sin-animaciones .category-card:hover,
      body.sin-animaciones .game-card:hover,
      body.sin-animaciones .stage-card:hover {
        transform: none !important;
      }

      body.sin-animaciones .loader-ring,
      body.sin-animaciones .spinner,
      body.sin-animaciones [class*="loader"] {
        animation: none !important;
        display: none !important;
      }

      /* ✅ Ocultar elementos decorativos animados */
      body.sin-animaciones .bg-animation {
        display: none !important;
      }

      body.sin-animaciones .decoration,
      body.sin-animaciones .decoration span,
      body.sin-animaciones .category-card,
      body.sin-animaciones .game-card,
      body.sin-animaciones .stage-card,
      body.sin-animaciones .card,
      body.sin-animaciones .btn-enter,
      body.sin-animaciones .container,
      body.sin-animaciones .main-container,
      body.sin-animaciones .settings-container,
      body.sin-animaciones .logo,
      body.sin-animaciones .logo-badge,
      body.sin-animaciones .info-card {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
        animation: none !important;
        transition: none !important;
      }

      /* ✅ Fade overlay instantáneo */
      body.sin-animaciones .ceartee-fade-overlay {
        transition: none !important;
      }

      /* ✅ Hover instantáneo */
      body.sin-animaciones .btn-back:hover,
      body.sin-animaciones .btn-backer:hover,
      body.sin-animaciones .btn-enter:hover,
      body.sin-animaciones .category-card:hover,
      body.sin-animaciones .game-card:hover,
      body.sin-animaciones .stage-card:hover {
        transform: none !important;
      }

      /* ✅ Desactivar spinner de carga */
      body.sin-animaciones .loader-ring,
      body.sin-animaciones .spinner,
      body.sin-animaciones [class*="loader"] {
        animation: none !important;
        display: none !important;
      }

      
    `;
    document.head.appendChild(style);
  }
  // ==========================================
  // VOLUMEN
  // ==========================================
  (function instalarInterceptorAudio() {
    if (window.__CEARTEE_AUDIO_INSTALADO__) return;
    window.__CEARTEE_AUDIO_INSTALADO__ = true;

    const AudioOriginal = window.Audio;
    window.Audio = function(src) {
      const audio = new AudioOriginal(src);
      try {
        const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
        const vol = (config.volumen != null ? config.volumen : 70) / 100;
        audio.volume = vol;
      } catch(e) {}
      return audio;
    };
  })();

  function aplicarVolumen(volumen) {
    const vol = (volumen != null ? volumen : 70) / 100;
    window.__volumenGlobal = vol;
    document.querySelectorAll('audio, video').forEach(el => { el.volume = vol; });
  }

  function aplicarModoDesarrollador(activo) {
    if (activo) document.body.classList.add('modo-dev');
    else document.body.classList.remove('modo-dev');
  }

  // Exponer funciones
  window.aplicarIdiomaGlobal = aplicarIdioma;
  window.aplicarTemaGlobal = aplicarTema;
  window.aplicarAnimacionesGlobal = aplicarAnimaciones;

  // ==========================================
  // ✅ MUTATION OBSERVER - Detecta HTML dinámico
  // ==========================================
  let observadorI18n = null;
  
  function iniciarObservadorI18n(idioma) {
    // Si ya existe, desconectar
    if (observadorI18n) observadorI18n.disconnect();
    
    observadorI18n = new MutationObserver(function(mutations) {
      let necesitaReaplicar = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const nodo = mutation.addedNodes[i];
            if (nodo.nodeType === 1) {
              if (nodo.hasAttribute && nodo.hasAttribute('data-i18n')) {
                necesitaReaplicar = true;
                break;
              }
              if (nodo.querySelectorAll && nodo.querySelectorAll('[data-i18n]').length > 0) {
                necesitaReaplicar = true;
                break;
              }
            }
          }
        }
      });
      
      if (necesitaReaplicar) {
        clearTimeout(window._timeoutReaplicarI18n);
        window._timeoutReaplicarI18n = setTimeout(function() {
          aplicarIdioma(idioma);
        }, 10);
      }
    });
    
    observadorI18n.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ==========================================
  // FUNCIÓN PRINCIPAL
  // ==========================================
  function aplicarConfiguracionGlobal() {
    const config = obtenerConfig();
    inyectarCSSTemas();
    aplicarTema(config.tema);
    aplicarAnimaciones(config.animaciones);
    aplicarIdioma(config.idioma);
    aplicarVolumen(config.volumen);
    aplicarModoDesarrollador(config.developerMode);
    window.appConfig = config;
    
    // ✅ Iniciar observador
    iniciarObservadorI18n(config.idioma);
    
    if (document.querySelector('.game-card')) {
      setTimeout(function() {
        if (window.aplicarFiltroDificultad) window.aplicarFiltroDificultad();
      }, 600);
    }
    if (document.querySelector('.footer-stats')) {
      setTimeout(function() {
        if (window.actualizarFooterStats) window.actualizarFooterStats();
      }, 300);
    }
  }

  // Ejecutar tema inmediatamente
  try {
    const config = obtenerConfig();
    inyectarCSSTemas();
    aplicarTema(config.tema);
    aplicarAnimaciones(config.animaciones);
  } catch(e) {}

  // Aplicar todo cuando DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicarConfiguracionGlobal);
  } else {
    aplicarConfiguracionGlobal();
  }

  // ✅ ESCUCHAR CAMBIOS DE IDIOMA EN TIEMPO REAL
  document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'language') {
      const nuevoIdioma = e.target.value;
      const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      config.idioma = nuevoIdioma;
      localStorage.setItem('appConfig', JSON.stringify(config));
      aplicarIdioma(nuevoIdioma);
    }
  });

  // ✅ ESCUCHAR CAMBIOS DE ANIMACIONES (SOLO BACKEND)
  document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'animations') {
      const activas = e.target.checked;
      const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      config.animaciones = activas;
      localStorage.setItem('appConfig', JSON.stringify(config));
      aplicarAnimaciones(activas);
    }
  });

  // ==========================================
  // SISTEMA DE SONIDOS
  // ==========================================
  window.sistemaSonido = {
    playNotificacion: function() {
      var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      if (!config.sonidoNoti) return;
      var vol = (config.volumen != null ? config.volumen : 70) / 100;
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
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
      } catch(e) {}
    },
    playVictoria: function() {
      var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      if (!config.sonidoJuego) return;
      var vol = (config.volumen != null ? config.volumen : 70) / 100;
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
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
      } catch(e) {}
    },
    playClick: function() {
      var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      var vol = (config.volumen != null ? config.volumen : 70) / 100;
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } catch(e) {}
    }
  };

  // ==========================================
  // FILTRO DE DIFICULTAD
  // ==========================================
  window.aplicarFiltroDificultad = function() {
    try {
      var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
      var dificultad = config.dificultad || 'todas';

      document.querySelectorAll('.game-card').forEach(function(card) {
        if (!card.getAttribute('data-difficulty')) {
          var metaItems = card.querySelectorAll('.meta-item span:last-child');
          var diff = 'Facil';
          metaItems.forEach(function(span) {
            var txt = span.textContent.trim().toLowerCase();
            if (txt === 'facil' || txt === 'easy') diff = 'Facil';
            if (txt === 'medio' || txt === 'medium' || txt === 'mitja') diff = 'Medio';
            if (txt === 'dificil' || txt === 'hard') diff = 'Dificil';
          });
          card.setAttribute('data-difficulty', diff);
        }
      });

      if (dificultad === 'todas') {
        document.querySelectorAll('.game-card').forEach(function(card) {
          card.style.display = '';
        });
        return;
      }

      var mapaDificultad = { 'easy': 'Facil', 'medium': 'Medio', 'hard': 'Dificil' };
      var objetivo = mapaDificultad[dificultad] || 'Facil';

      var count = 0;
      document.querySelectorAll('.game-card').forEach(function(card) {
        var cardDiff = card.getAttribute('data-difficulty') || 'Facil';
        if (cardDiff === objetivo) {
          card.style.display = '';
          count++;
        } else {
          card.style.display = 'none';
        }
      });

      var gameCount = document.getElementById('gameCount');
      if (gameCount) gameCount.textContent = count;

      var noResults = document.getElementById('noResults');
      if (noResults) noResults.style.display = count === 0 ? '' : 'none';
    } catch(e) {
      console.warn('Error filtro dificultad:', e);
    }
  };

  // ==========================================
  // ACTUALIZAR FOOTER DE ESTADÍSTICAS
  // ==========================================
  window.actualizarFooterStats = function() {
    try {
      var completados = 0;
      if (window.PerfilesManager) {
        var perfil = window.PerfilesManager.obtenerPerfilActivo();
        if (perfil) {
          var stats = window.PerfilesManager.obtenerDatos(perfil.id, 'stats', {});
          completados = stats.juegosCompletados || 0;
        }
      }

      var footerItems = document.querySelectorAll('.footer-stats .stat-item');
      footerItems.forEach(function(item) {
        var label = item.querySelector('.stat-label');
        if (label) {
          var txt = label.textContent.trim().toLowerCase();
          if (txt === 'completados' || txt === 'completats' || txt === 'completed') {
            var value = item.querySelector('.stat-value');
            if (value) value.textContent = completados;
          }
        }
      });
    } catch(e) {
      console.warn('Error actualizando footer:', e);
    }
  };

  // ==========================================
  // 🐛 PANEL DE DEPURACIÓN
  // ==========================================
  window.initDebugPanel = function() {
    if (document.getElementById('debug-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.9);
      color: #0f0;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #0f0;
      z-index: 2147483647;
      pointer-events: none;
      max-width: 260px;
      line-height: 1.6;
      display: none;
      box-shadow: 0 0 20px rgba(0,255,0,0.2);
    `;
    document.body.appendChild(panel);

    var fps = 0;
    var lastTime = performance.now();
    var frames = 0;
    function updateFPS() {
      frames++;
      var now = performance.now();
      if (now - lastTime >= 1000) {
        fps = frames;
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFPS);
    }
    updateFPS();

    setInterval(function() {
      try {
        var config = JSON.parse(localStorage.getItem('appConfig') || '{}');
        if (!config.developerMode) {
          panel.style.display = 'none';
          return;
        }
        panel.style.display = 'block';

        var pagina = window.location.pathname.split('/').pop() || 'index.html';
        var jclic = window.juegoListo ? '✅ Listo' : (document.getElementById('jclic-container') ? '⏳ Cargando' : '❌');
        var titulo = document.getElementById('gameTitle') ? document.getElementById('gameTitle').textContent : '-';
        var aciertos = document.getElementById('aciertos') ? document.getElementById('aciertos').textContent : '-';
        var intentos = document.getElementById('intentos') ? document.getElementById('intentos').textContent : '-';
        var tiempo = document.getElementById('tiempo') ? document.getElementById('tiempo').textContent : '-';
        var firebase = window.FirebaseSync && window.FirebaseSync.usuario ? '✅' : '❌';
        var lsCount = localStorage.length;
        var memoria = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB' : 'N/A';
        var gameVol = window.__gameVolume != null ? Math.round(window.__gameVolume * 100) + '%' : (config.volumenJuego || '-') + '%';

        panel.innerHTML = 
          '<div style="border-bottom:1px solid #0f0;margin-bottom:6px;font-weight:bold;font-size:13px;">🐛 DEBUG MODE</div>' +
          '<div>📋 FPS: <b>' + fps + '</b></div>' +
          '<div>📄 Página: ' + pagina + '</div>' +
          '<div>🎮 JClic: ' + jclic + '</div>' +
          '<div>🕹️ Juego: ' + titulo + '</div>' +
          '<div>✅ Aciertos: ' + aciertos + ' | 🎯 Intentos: ' + intentos + '</div>' +
          '<div>⏱️ Tiempo: ' + tiempo + '</div>' +
          '<div style="border-top:1px solid #333;margin:6px 0;"></div>' +
          '<div>🌐 Idioma: ' + (config.idioma || '-') + ' | 🎨 Tema: ' + (config.tema || '-') + '</div>' +
          '<div>🔊 Vol App: ' + (config.volumen || '-') + '% | Vol Juego: ' + gameVol + '</div>' +
          '<div>🎯 Dificultad: ' + (config.dificultad || '-') + '</div>' +
          '<div style="border-top:1px solid #333;margin:6px 0;"></div>' +
          '<div>☁️ Firebase: ' + firebase + '</div>' +
          '<div>💾 localStorage: ' + lsCount + ' items</div>' +
          '<div>🧠 Memoria: ' + memoria + '</div>';
      } catch(e) {}
    }, 500);
  };

  window.initDebugPanel();

})();