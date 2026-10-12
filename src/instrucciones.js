// ==========================================
// INSTRUCCIONES.JS - CON TRADUCCIÓN AUTOMÁTICA
// ==========================================

// ==========================================
// HELPER DE TRADUCCIÓN
// ==========================================
function tInstr(clave) {
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
// OBTENER IDIOMA ACTUAL
// ==========================================
function obtenerIdiomaActual() {
  try {
    const config = JSON.parse(localStorage.getItem('appConfig') || '{}');
    const lang = config.idioma || 'es';
    // El catalán se eliminó: cualquier otro valor cae a español
    return (lang === 'es' || lang === 'en') ? lang : 'es';
  } catch(e) {
    return 'es';
  }
}

// ==========================================
// DICCIONARIO DE TRADUCCIÓN DE INSTRUCCIONES
// ==========================================
const traduccionesInstrucciones = {
  // Instrucciones comunes en JClic
  es: {
    'Arrastra': 'Arrastra',
    'Completa': 'Completa',
    'Encuentra': 'Encuentra',
    'Relaciona': 'Relaciona',
    'Ordena': 'Ordena',
    'Selecciona': 'Selecciona',
    'Haz clic': 'Haz clic',
    'Observa': 'Observa',
    'Escucha': 'Escucha',
    'Lee': 'Lee',
    'Escribe': 'Escribe',
    'Une': 'Une',
    'Identifica': 'Identifica',
    'Colorea': 'Colorea',
    'Descubre': 'Descubre',
    'Resuelve': 'Resuelve',
    'las parejas': 'las parejas',
    'la palabra': 'la palabra',
    'las palabras': 'las palabras',
    'la imagen': 'la imagen',
    'las imágenes': 'las imágenes',
    'el puzzle': 'el puzzle',
    'la respuesta correcta': 'la respuesta correcta',
    'los elementos': 'los elementos',
    'el audio': 'el audio',
    'el sonido': 'el sonido',
    'y relaciona': 'y relaciona',
    'correctamente': 'correctamente',
    'en orden': 'en orden',
    // Mensajes de victoria / fin de actividad
    'muy bien': 'muy bien',
    'bien hecho': 'bien hecho',
    'excelente': 'excelente',
    'bravo': 'bravo',
    'genial': 'genial',
    'perfecto': 'perfecto',
    'perfecta': 'perfecta',
    'correcto': 'correcto',
    'correcta': 'correcta',
    'incorrecto': 'incorrecto',
    'felicidades': 'felicidades',
    'felicitaciones': 'felicitaciones',
    'enhorabuena': 'enhorabuena',
    'inténtalo': 'inténtalo',
    'intenta de nuevo': 'intenta de nuevo',
    'otra vez': 'otra vez',
    'de nuevo': 'de nuevo',
    'bienvenido': 'bienvenido',
    'bienvenida': 'bienvenida',
    'continuar': 'continuar',
    'siguiente': 'siguiente',
    'empezar': 'empezar',
    'comenzar': 'comenzar',
    'ayuda': 'ayuda',
    'instrucciones': 'instrucciones',
    'portada': 'portada',
    'menú': 'menú',
    'menu': 'menu',
    'fin': 'fin',
    'inicio': 'inicio',
    'jugar': 'jugar',
    'puntos': 'puntos',
    'error': 'error',
    'errores': 'errores',
    // Verbos y palabras comunes (instrucciones y victorias)
    'busca': 'busca',
    'mira': 'mira',
    'di': 'di',
    'pon': 'pon',
    'cuenta': 'cuenta',
    'marca': 'marca',
    'elige': 'elige',
    'termina': 'termina',
    'escoge': 'escoge',
    'forma': 'forma',
    'escribe bien': 'escribe bien',
    'inténtalo de nuevo': 'inténtalo de nuevo',
    'bien': 'bien',
    'piezas': 'piezas',
    'con': 'con',
    'para': 'para',
    'los': 'los',
    'las': 'las',
    'el': 'el',
    'la': 'la',
    'un': 'un',
    'una': 'una',
    'del': 'del',
    'al': 'al',
    'en': 'en',
    'de': 'de',
    'y': 'y',
    'o': 'o',
    'tu': 'tu',
    'este': 'este',
    'esta': 'esta',
    'estos': 'estos',
    'estas': 'estas',
    'cada': 'cada',
    'todas': 'todas',
    'todos': 'todos',
    'sin': 'sin',
    'sobre': 'sobre',
    'entre': 'entre',
    'hasta': 'hasta',
    'desde': 'desde',
    'porque': 'porque',
    'cuando': 'cuando',
    'donde': 'donde',
    'más': 'más',
    'muy': 'muy',
    'otro': 'otro',
    'otra': 'otra',
    'mismo': 'mismo',
    'nuevo': 'nuevo',
    'nueva': 'nueva',
    'gran': 'gran',
    'primer': 'primer',
    'primera': 'primera',
    'formas': 'formas',
    'buscar': 'buscar',
    'formar': 'formar',
    'hacer': 'hacer',
    'tener': 'tener',
    'decir': 'decir',
    'ver': 'ver',
    'oir': 'oir',
    'oír': 'oír',
    'poder': 'poder',
    'querer': 'querer',
    'juego': 'juego',
    'final': 'final',
    'futbol': 'futbol',
    'fútbol': 'fútbol',
    'juega': 'juega',
    'atencion': 'atencion',
    'atención': 'atención',
    'parrafos': 'parrafos',
    'párrafos': 'párrafos',
    'frase': 'frase',
    'frases': 'frases',
    'escritor': 'escritor',
    'trabajar': 'trabajar',
    'trabajo': 'trabajo',
    'doce': 'doce',
    'verbo': 'verbo',
    'toma': 'toma',
    'tomate': 'tomate',
    'tómate': 'tómate',
    'rellena': 'rellena',
    'huecos': 'huecos',
    'termines': 'termines',
    'buscando': 'buscando',
    'sigue': 'sigue',
    'falta': 'falta',
    'letra': 'letra',
    'silaba': 'silaba',
    'sílaba': 'sílaba',
    'oracion': 'oracion',
    'oración': 'oración',
    'texto': 'texto',
    'cuento': 'cuento',
    'dibujo': 'dibujo',
    'es': 'es',
    'son': 'son',
    'está': 'está',
    'están': 'están',
    'hay': 'hay',
    'tiene': 'tiene',
    'tienen': 'tienen',
    'quieres': 'quieres',
    'quiero': 'quiero',
    'ese': 'ese',
    'esa': 'esa',
    'eso': 'eso',
    'qué': 'qué',
    'quién': 'quién',
    'cuál': 'cuál',
    'cuáles': 'cuáles',
    'dónde': 'dónde',
    'cuándo': 'cuándo',
    'pero': 'pero',
    'también': 'también',
    'siempre': 'siempre',
    'nunca': 'nunca',
    'ahora': 'ahora',
    'después': 'después',
    'antes': 'antes',
    'aquí': 'aquí',
    'ahí': 'ahí',
    'arriba': 'arriba',
    'abajo': 'abajo',
    'derecha': 'derecha',
    'izquierda': 'izquierda',
    'grande': 'grande',
    'pequeño': 'pequeño',
    'pequeña': 'pequeña',
    'rápido': 'rápido',
    'despacio': 'despacio',
    'mucho': 'mucho',
    'poco': 'poco',
    'todo': 'todo',
    'me': 'me',
    'te': 'te',
    'mi': 'mi',
    'mis': 'mis',
    'a': 'a',
    'que': 'que',
    'lunes': 'lunes',
    'martes': 'martes',
    'miércoles': 'miércoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'sábado': 'sábado',
    'domingo': 'domingo',
    'lo que': 'lo que',
    'actividad': 'actividad',
    'completada': 'completada',
    'completado': 'completado',
    'dice': 'dice',
    'quieras': 'quieras',
    'nos': 'nos',
    'por': 'por',
    'palabras': 'palabras',
    'palabra': 'palabra',
    'número': 'número',
    'números': 'números',
    'clic': 'clic',
    'haz': 'haz',
    'segundo': 'segundo',
    'unidades': 'unidades',
    'euros': 'euros',
    'generado': 'generado',
    'operando': 'operando',
    'nombre': 'nombre',
    'imagen': 'imagen',
    'dos': 'dos',
    'imágenes': 'imágenes',
    'tres': 'tres',
    'sumas': 'sumas',
    'mayor': 'mayor',
    'mil': 'mil',
    'menor': 'menor',
    'señala': 'señala',
    'calcula': 'calcula',
    'corresponde': 'corresponde',
    'cuatro': 'cuatro',
    'estupendo': 'estupendo',
    'escrita': 'escrita',
    'restas': 'restas',
    'cantidad': 'cantidad',
    'rompecabezas': 'rompecabezas',
    'trencaclosques': 'trencaclosques',
    'pasa': 'pasa',
    'cinco': 'cinco',
    'iguales': 'iguales',
    'módulo': 'módulo',
    'nombres': 'nombres',
    'activitat': 'activitat',
    'clase': 'clase',
    'uno': 'uno',
    'sense': 'sense',
    'nueve': 'nueve',
    'amb': 'amb',
    'hecho': 'hecho',
    'objetos': 'objetos',
    'multiplicaciones': 'multiplicaciones',
    'ocho': 'ocho',
    'seis': 'seis',
    'les': 'les',
    'respuesta': 'respuesta',
    'sumando': 'sumando',
    'adelante': 'adelante',
    'flecha': 'flecha',
    'cuántos': 'cuántos',
    'igual': 'igual',
    'así': 'así',
    'tienes': 'tienes',
    'cincuenta': 'cincuenta',
    'parte': 'parte',
    'pantalla': 'pantalla',
    'partes': 'partes',
    'azul': 'azul',
    'treinta': 'treinta',
    'factor': 'factor',
    'han': 'han',
    'siguientes': 'siguientes',
    'aprende': 'aprende',
    'cómo': 'cómo',
    'ochenta': 'ochenta',
    'coloca': 'coloca',
    'correspondiente': 'correspondiente',
    'soy': 'soy',
    'cuarenta': 'cuarenta',
    'sol': 'sol',
    'vocal': 'vocal',
    'partido': 'partido',
    'información': 'información',
    'hace': 'hace',
    'hemos': 'hemos',
    'suma': 'suma',
    'animales': 'animales',
    'litros': 'litros',
    'relacionar': 'relacionar',
    'madre': 'madre',
    'divisions': 'divisions',
    'faltan': 'faltan',
    'futuro': 'futuro',
    'menos': 'menos',
    'temido': 'temido',
    'años': 'años',
    'amado': 'amado',
    'animal': 'animal',
    'lugar': 'lugar',
    'cuadrado': 'cuadrado',
    'día': 'día',
    'noventa': 'noventa',
    'unidad': 'unidad',
    'metros': 'metros',
    'producto': 'producto',
    'sesenta': 'sesenta',
    'setenta': 'setenta',
    'fantástico': 'fantástico',
    'cifras': 'cifras',
    'activitats': 'activitats',
    'dibujos': 'dibujos',
    'sílabas': 'sílabas',
    'nivel': 'nivel',
    'escribir': 'escribir',
    'corresponda': 'corresponda',
    'els': 'els',
    'pasar': 'pasar',
    'presente': 'presente',
    'valor': 'valor',
    'consonante': 'consonante',
    'exercici': 'exercici',
    'vocales': 'vocales',
    'fracciones': 'fracciones',
    'recuerda': 'recuerda',
    'figura': 'figura',
    'orden': 'orden',
    'pretérito': 'pretérito',
    'mas': 'mas',
    'ellos': 'ellos',
    'associació': 'associació',
    'operación': 'operación',
    'text': 'text',
    'lleva': 'lleva',
    'eres': 'eres',
    'ella': 'ella',
    'puedes': 'puedes',
    'kilos': 'kilos',
    'días': 'días',
    'hoy': 'hoy',
    'centenas': 'centenas',
    'adivinanza': 'adivinanza',
    'añade': 'añade',
    'ciento': 'ciento',
    'serie': 'serie',
    'resultados': 'resultados',
    'doble': 'doble',
    'era': 'era',
    'veces': 'veces',
    'paraules': 'paraules',
    'oso': 'oso',
    'sabrás': 'sabrás',
    'contesta': 'contesta',
    'divisor': 'divisor',
    'verde': 'verde',
    'conseguido': 'conseguido',
    'verbos': 'verbos',
    'multiplicar': 'multiplicar',
    'ser': 'ser',
    'ejercicio': 'ejercicio',
    'casilla': 'casilla',
    'había': 'había',
    'seguro': 'seguro',
    'cuántas': 'cuántas',
    'anterior': 'anterior',
    'parejas': 'parejas',
    'grupo': 'grupo',
    'superior': 'superior',
    'cama': 'cama',
    'fenomenal': 'fenomenal',
    'división': 'división',
    'rojo': 'rojo',
    'ordénalas': 'ordénalas',
    'nosotros': 'nosotros',
    'trobar': 'trobar',
    'significado': 'significado',
    'fracción': 'fracción',
    'tilde': 'tilde',
    'horas': 'horas',
    'precio': 'precio',
    'cifra': 'cifra',
    'conejo': 'conejo',
    'misma': 'misma',
    'cantidades': 'cantidades',
    'opción': 'opción',
    'cuerpo': 'cuerpo',
    'completar': 'completar',
    'tema': 'tema',
    'singular': 'singular',
    'vez': 'vez',
    'ejemplo': 'ejemplo',
    'blanco': 'blanco',
    'libro': 'libro',
    'gramos': 'gramos',
    'mano': 'mano',
    'simple': 'simple',
    'dentro': 'dentro',
    'gusta': 'gusta',
    'identificar': 'identificar',
    'minutos': 'minutos',
    'adjetivo': 'adjetivo',
    'dudas': 'dudas',
    'asocia': 'asocia',
    'diez': 'diez',
    'sabes': 'sabes',
    'rectángulo': 'rectángulo',
    'pareja': 'pareja',
    'posición': 'posición',
    'terminar': 'terminar',
    'localiza': 'localiza',
    'comido': 'comido',
    'ayer': 'ayer',
    'adjetivos': 'adjetivos',
    'doscientos': 'doscientos',
    'desordenadas': 'desordenadas',
    'sustraendo': 'sustraendo',
    'roja': 'roja',
    'hora': 'hora',
    'pasado': 'pasado',
    'sentido': 'sentido',
    'décimas': 'décimas',
    'encima': 'encima',
    'manos': 'manos',
    'pronombre': 'pronombre',
    'modo': 'modo',
    'milésimas': 'milésimas',
    'hacia': 'hacia',
    'descomposición': 'descomposición',
    'cociente': 'cociente',
    'cosas': 'cosas',
    'aparecen': 'aparecen',
    'camino': 'camino',
    'crucigrama': 'crucigrama',
    'dado': 'dado',
    'puede': 'puede',
    'dividendo': 'dividendo',
    'leer': 'leer',
    'invierno': 'invierno',
    'trescientos': 'trescientos',
    'base': 'base',
    'permite': 'permite',
    'veleta': 'veleta',
    'microscopio': 'microscopio',
    'microscopios': 'microscopios',
    'compuestos': 'compuestos',
    'amplio': 'amplio',
    'producción': 'producción',
    'ácido': 'ácido',
    'productor': 'productor',
    'ortográfica': 'ortográfica',
    'adecuadamente': 'adecuadamente',
    'invisible': 'invisible',
    'mágico': 'mágico',
    'infeliz': 'infeliz',
    'bandada': 'bandada',
    'traducción': 'traducción',
    'lejanos': 'lejanos',
    'sencillos': 'sencillos',
    'optimista': 'optimista',
    'archipiélago': 'archipiélago',
    'constelación': 'constelación',
    'jauría': 'jauría',
    'proyección': 'proyección',
    'satisfacción': 'satisfacción',
    'inspector': 'inspector',
    'lentes': 'lentes',
    'soporte': 'soporte',
    'individuos': 'individuos',
    'intercambian': 'intercambian',
    'comparte': 'comparte',
    'dichosa': 'dichosa',
    'entusiasta': 'entusiasta',
    'pesimista': 'pesimista',
    'apática': 'apática',
    'cordillera': 'cordillera',
    'pinar': 'pinar',
    'inspección': 'inspección',
    'conducción': 'conducción',
    'corrección': 'corrección',
    'protección': 'protección',
    'selección': 'selección',
    'destrucción': 'destrucción',
    'proyector': 'proyector',
    'traductor': 'traductor',
    'nom': 'nom',
    'trobar': 'trobar',
    // --- Ampliación: frases y palabras frecuentes en instrucciones JClic ---
    'las letras se desordenaron': 'las letras se desordenaron',
    'se desordenaron': 'se desordenaron',
    'está desordenada': 'está desordenada',
    'esta desordenada': 'esta desordenada',
    'están desordenados': 'están desordenados',
    'estan desordenados': 'estan desordenados',
    'están desordenadas': 'están desordenadas',
    'estan desordenadas': 'estan desordenadas',
    'si lo has estudiado bien': 'si lo has estudiado bien',
    'si lo has leido bien': 'si lo has leido bien',
    'si lo has leído bien': 'si lo has leído bien',
    'lo has hecho muy bien': 'lo has hecho muy bien',
    'sopa de letras': 'sopa de letras',
    'pulsa en': 'pulsa en',
    'haz clic en': 'haz clic en',
    'pincha en': 'pincha en',
    'lo que le falta': 'lo que le falta',
    'qué le falta': 'qué le falta',
    'que le falta': 'que le falta',
    'le falta': 'le falta',
    'le faltan': 'le faltan',
    'que le corresponde': 'que le corresponde',
    'que le corresponda': 'que le corresponda',
    'con el raton': 'con el raton',
    'con el ratón': 'con el ratón',
    'hacer fila': 'hacer fila',
    'letras': 'letras',
    'abecedario': 'abecedario',
    'alfabéticamente': 'alfabéticamente',
    'alfabeticamente': 'alfabeticamente',
    'desordenado': 'desordenado',
    'desordenada': 'desordenada',
    'desordenados': 'desordenados',
    'desordenadas': 'desordenadas',
    'desordenaron': 'desordenaron',
    'desordenar': 'desordenar',
    'ayúdalas': 'ayúdalas',
    'ayudalas': 'ayudalas',
    'ayúdalos': 'ayúdalos',
    'ayudalos': 'ayudalos',
    'ayúdala': 'ayúdala',
    'ayudala': 'ayudala',
    'ayúdalo': 'ayúdalo',
    'ayudalo': 'ayudalo',
    'ayúdales': 'ayúdales',
    'ayudales': 'ayudales',
    'ayúdame': 'ayúdame',
    'ayudame': 'ayudame',
    'ayudas': 'ayudas',
    'quieren': 'quieren',
    'quiere': 'quiere',
    'queremos': 'queremos',
    'formarse': 'formarse',
    'ponerse': 'ponerse',
    'fila': 'fila',
    'resultado': 'resultado',
    'se': 'se',
    'le': 'le',
    'lo': 'lo',
    'su': 'su',
    'sus': 'sus',
    'e': 'e',
    'sí': 'sí',
    'si': 'si',
    'según': 'según',
    'segun': 'segun',
    'ordenar': 'ordenar',
    'pulsa': 'pulsa',
    'cuadro': 'cuadro',
    'cuadros': 'cuadros',
    'has': 'has',
    'ha': 'ha',
    'estudiado': 'estudiado',
    'estudia': 'estudia',
    'estudiar': 'estudiar',
    'continúa': 'continúa',
    'continua': 'continua',
    'empareja': 'empareja',
    'emparejar': 'emparejar',
    'pincha': 'pincha',
    'responde': 'responde',
    'responder': 'responder',
    'piensa': 'piensa',
    'pensar': 'pensar',
    'pregunta': 'pregunta',
    'preguntas': 'preguntas',
    'respuestas': 'respuestas',
    'chiquito': 'chiquito',
    'chiquita': 'chiquita',
    'grandote': 'grandote',
    'grandota': 'grandota',
    'haciendo': 'haciendo',
    'minuendo': 'minuendo',
    'como': 'como',
    'oca': 'oca',
    'altavoz': 'altavoz',
    'lista': 'lista',
    'da': 'da',
    'rincón': 'rincón',
    'rincon': 'rincon',
    'conjugación': 'conjugación',
    'conjugacion': 'conjugacion',
    'diferente': 'diferente',
    'diferentes': 'diferentes',
    'distinta': 'distinta',
    'distintas': 'distintas',
    'distintos': 'distintos',
    'atentamente': 'atentamente',
    'adecuada': 'adecuada',
    'adecuado': 'adecuado',
    'estés': 'estés',
    'estes': 'estes',
    'preparado': 'preparado',
    'preparada': 'preparada',
    'casa': 'casa',
    'representa': 'representa',
    'solución': 'solución',
    'solucion': 'solucion',
    'tú': 'tú',
    'oraciones': 'oraciones',
    'pedir': 'pedir',
    'pide': 'pide',
    'camino': 'camino',
    'quiénes': 'quiénes',
    'quienes': 'quienes',
    'ratón': 'ratón',
    'raton': 'raton',
    'verás': 'verás',
    'veras': 'veras',
    'oirás': 'oirás',
    'oiras': 'oiras',
    'amiguitos': 'amiguitos',
    'sopa': 'sopa',
    'faltan': 'faltan',
    'cuantos': 'cuantos',
    'jugar': 'jugar',
    'luna': 'luna',
    'cambia': 'cambia',
    'noche': 'noche',
    'ordénala': 'ordénala',
    'ordenala': 'ordenala',
    'ordénalas': 'ordénalas',
    'ordenalas': 'ordenalas',
    'ordénalos': 'ordénalos',
    'ordenalos': 'ordenalos',
    'colócala': 'colócala',
    'colocala': 'colocala',
    'colócalas': 'colócalas',
    'colocalas': 'colocalas',
    'relaciónalo': 'relaciónalo',
    'relacionalo': 'relacionalo',
    'comprueba': 'comprueba',
    'comprobar': 'comprobar',
    'sombra': 'sombra',
    'vehículo': 'vehículo',
    'vehiculo': 'vehiculo',
    'vehiculos': 'vehiculos',
    'vehículos': 'vehículos',
    'colección': 'colección',
    'coleccion': 'coleccion',
    'colecciones': 'colecciones',
    'fotografía': 'fotografía',
    'fotografia': 'fotografia',
    'fotografías': 'fotografías',
    'fotografias': 'fotografias',
    'león': 'león',
    'leon': 'leon',
    'caballo': 'caballo',
    'caballito': 'caballito',
    'poesía': 'poesía',
    'poesia': 'poesia',
    'memoriza': 'memoriza',
    'gráfica': 'gráfica',
    'grafica': 'grafica',
    'dictado': 'dictado',
    'sello': 'sello',
    'toalla': 'toalla',
    'pollo': 'pollo',
    'peine': 'peine',
    'símbolo': 'símbolo',
    'simbolo': 'simbolo',
    'ordenador': 'ordenador',
    'tira': 'tira',
    'tirar': 'tirar',
    'basura': 'basura',
    'contenedor': 'contenedor',
    'contenedores': 'contenedores',
    'caso': 'caso',
    'casos': 'casos',
    'formando': 'formando',
    'cambiar': 'cambiar',
    'sola': 'sola',
    'solo': 'solo',
    'la que sigue': 'la que sigue',
    'el que sigue': 'el que sigue',
    'lo que sigue': 'lo que sigue',
    'nuevas': 'nuevas',
    'nuevos': 'nuevos',
    'contesta': 'contesta',
    'contestar': 'contestar',
    'SI / NO': 'SI / NO',
    'SI/NO': 'SI/NO',
    'eso es': 'eso es',
    'mira estos': 'mira estos',
    'mira estas': 'mira estas',
    'mira este': 'mira este',
    'mira esta': 'mira esta',
    'mira bien': 'mira bien',
    'mira bien las': 'mira bien las',
    'mira bien la': 'mira bien la',
    'mira bien los': 'mira bien los',
    'mira bien el': 'mira bien el',
    'frase está desordenada': 'frase está desordenada',
    'frase esta desordenada': 'frase esta desordenada',
    'que se tira': 'que se tira',
    'que se tiran': 'que se tiran',
    'sabrás ordenar': 'sabrás ordenar',
    'sabras ordenar': 'sabras ordenar',
    'que sabrás ordenar': 'que sabrás ordenar',
    'que sabras ordenar': 'que sabras ordenar',
    'estas partes desordenadas': 'estas partes desordenadas',
    'más chiquito': 'más chiquito',
    'mas chiquito': 'mas chiquito',
    'más chiquita': 'más chiquita',
    'mas chiquita': 'mas chiquita',
    'más grandote': 'más grandote',
    'mas grandote': 'mas grandote',
    'más grandota': 'más grandota',
    'mas grandota': 'mas grandota',
    'más grande': 'más grande',
    'mas grande': 'mas grande',
    'más pequeño': 'más pequeño',
    'mas pequeño': 'mas pequeño',
    'más pequeña': 'más pequeña',
    'mas pequeña': 'mas pequeña',
    'ordena la imagen del más chiquito al más grandote': 'ordena la imagen del más chiquito al más grandote',
    'ordena la imagen del mas chiquito al mas grandote': 'ordena la imagen del mas chiquito al mas grandote',
    'al cambiar': 'al cambiar',
    'ya': 'ya',
    'línea': 'línea',
    'linea': 'linea',
    'líneas': 'líneas',
    'lineas': 'lineas',
    'personaje': 'personaje',
    'personajes': 'personajes',
    'lado': 'lado',
    'lados': 'lados',
    'sumar': 'sumar',
    'restar': 'restar',
    'relaciónala': 'relaciónala',
    'relacionala': 'relacionala',
    'amarillo': 'amarillo',
    'amarilla': 'amarilla',
    'superficie': 'superficie',
    'ratoncito': 'ratoncito',
    'seguimos': 'seguimos',
    'seguir': 'seguir'
  },

  en: {
    'Arrastra': 'drag',
    'Completa': 'complete',
    'Encuentra': 'find',
    'Relaciona': 'match',
    'Ordena': 'sort',
    'Selecciona': 'select',
    'Haz clic': 'click',
    'Observa': 'observe',
    'Escucha': 'listen',
    'Lee': 'read',
    'Escribe': 'write',
    'Une': 'join',
    'Identifica': 'identify',
    'Colorea': 'color',
    'Descubre': 'discover',
    'Resuelve': 'solve',
    'las parejas': 'the pairs',
    'la palabra': 'the word',
    'las palabras': 'the words',
    'la imagen': 'the image',
    'las imágenes': 'the images',
    'el puzzle': 'the puzzle',
    'la respuesta correcta': 'the correct answer',
    'los elementos': 'the elements',
    'el audio': 'the audio',
    'el sonido': 'the sound',
    'y relaciona': 'and match',
    'correctamente': 'correctly',
    'en orden': 'in order',
    // Mensajes de victoria / fin de actividad
    'muy bien': 'very good',
    'bien hecho': 'well done',
    'excelente': 'excellent',
    'bravo': 'bravo',
    'genial': 'great',
    'perfecto': 'perfect',
    'perfecta': 'perfect',
    'correcto': 'correct',
    'correcta': 'correct',
    'incorrecto': 'incorrect',
    'felicidades': 'congratulations',
    'felicitaciones': 'congratulations',
    'enhorabuena': 'congratulations',
    'inténtalo': 'try again',
    'intenta de nuevo': 'try again',
    'otra vez': 'again',
    'de nuevo': 'again',
    'bienvenido': 'welcome',
    'bienvenida': 'welcome',
    'continuar': 'continue',
    'siguiente': 'next',
    'empezar': 'start',
    'comenzar': 'start',
    'ayuda': 'help',
    'instrucciones': 'instructions',
    'portada': 'cover',
    'menú': 'menu',
    'menu': 'menu',
    'fin': 'end',
    'inicio': 'start',
    'jugar': 'play',
    'puntos': 'points',
    'error': 'error',
    'errores': 'errors',
    // Verbos y palabras comunes (instrucciones y victorias)
    'busca': 'look for',
    'mira': 'look',
    'di': 'say',
    'pon': 'put',
    'cuenta': 'count',
    'marca': 'mark',
    'elige': 'choose',
    'termina': 'finish',
    'escoge': 'pick',
    'forma': 'make',
    'escribe bien': 'write correctly',
    'inténtalo de nuevo': 'try again',
    'bien': 'good',
    'piezas': 'pieces',
    'con': 'with',
    'para': 'to',
    'los': 'the',
    'las': 'the',
    'el': 'the',
    'la': 'the',
    'un': 'a',
    'una': 'a',
    'del': 'of the',
    'al': 'to the',
    'en': 'in',
    'de': 'of',
    'y': 'and',
    'o': 'or',
    'tu': 'your',
    'este': 'this',
    'esta': 'this',
    'estos': 'these',
    'estas': 'these',
    'cada': 'each',
    'todas': 'all',
    'todos': 'all',
    'sin': 'without',
    'sobre': 'about',
    'entre': 'between',
    'hasta': 'until',
    'desde': 'from',
    'porque': 'because',
    'cuando': 'when',
    'donde': 'where',
    'más': 'more',
    'muy': 'very',
    'otro': 'another',
    'otra': 'another',
    'mismo': 'same',
    'nuevo': 'new',
    'nueva': 'new',
    'gran': 'great',
    'primer': 'first',
    'primera': 'first',
    'formas': 'shapes',
    'buscar': 'look for',
    'formar': 'form',
    'hacer': 'do',
    'tener': 'have',
    'decir': 'say',
    'ver': 'see',
    'oir': 'listen',
    'oír': 'listen',
    'poder': 'can',
    'querer': 'want',
    'juego': 'game',
    'final': 'end',
    'futbol': 'soccer',
    'fútbol': 'soccer',
    'juega': 'play',
    'atencion': 'attention',
    'atención': 'attention',
    'parrafos': 'paragraphs',
    'párrafos': 'paragraphs',
    'frase': 'sentence',
    'frases': 'sentences',
    'escritor': 'writer',
    'trabajar': 'work',
    'trabajo': 'work',
    'doce': 'twelve',
    'verbo': 'verb',
    'toma': 'take',
    'tomate': 'take',
    'tómate': 'take',
    'rellena': 'fill in',
    'huecos': 'gaps',
    'termines': 'finish',
    'buscando': 'looking for',
    'sigue': 'keep',
    'falta': 'missing',
    'letra': 'letter',
    'silaba': 'syllable',
    'sílaba': 'syllable',
    'oracion': 'sentence',
    'oración': 'sentence',
    'texto': 'text',
    'cuento': 'story',
    'dibujo': 'drawing',
    'es': 'is',
    'son': 'are',
    'está': 'is',
    'están': 'are',
    'hay': 'there is',
    'tiene': 'has',
    'tienen': 'have',
    'quieres': 'you want',
    'quiero': 'I want',
    'ese': 'that',
    'esa': 'that',
    'eso': 'that',
    'qué': 'what',
    'quién': 'who',
    'cuál': 'which',
    'cuáles': 'which',
    'dónde': 'where',
    'cuándo': 'when',
    'pero': 'but',
    'también': 'also',
    'siempre': 'always',
    'nunca': 'never',
    'ahora': 'now',
    'después': 'after',
    'antes': 'before',
    'aquí': 'here',
    'ahí': 'there',
    'arriba': 'up',
    'abajo': 'down',
    'derecha': 'right',
    'izquierda': 'left',
    'grande': 'big',
    'pequeño': 'small',
    'pequeña': 'small',
    'rápido': 'fast',
    'despacio': 'slowly',
    'mucho': 'a lot',
    'poco': 'little',
    'todo': 'all',
    'me': 'me',
    'te': 'you',
    'mi': 'my',
    'mis': 'my',
    'a': 'to',
    'que': 'that',
    'lunes': 'Monday',
    'martes': 'Tuesday',
    'miércoles': 'Wednesday',
    'jueves': 'Thursday',
    'viernes': 'Friday',
    'sábado': 'Saturday',
    'domingo': 'Sunday',
    'lo que': 'what',
    'actividad': 'activity',
    'completada': 'completed',
    'completado': 'completed',
    'dice': 'says',
    'quieras': 'want',
    'nos': 'us',
    'por': 'for',
    'palabras': 'words',
    'palabra': 'word',
    'número': 'number',
    'números': 'numbers',
    'clic': 'click',
    'haz': 'do',
    'segundo': 'second',
    'unidades': 'ones',
    'euros': 'euros',
    'generado': 'generated',
    'operando': 'operand',
    'nombre': 'name',
    'imagen': 'image',
    'dos': 'two',
    'imágenes': 'images',
    'tres': 'three',
    'sumas': 'sums',
    'mayor': 'greater',
    'mil': 'thousand',
    'menor': 'smaller',
    'señala': 'point at',
    'calcula': 'calculate',
    'corresponde': 'matches',
    'cuatro': 'four',
    'estupendo': 'great',
    'escrita': 'written',
    'restas': 'subtractions',
    'cantidad': 'quantity',
    'rompecabezas': 'puzzle',
    'trencaclosques': 'puzzle',
    'pasa': 'happens',
    'cinco': 'five',
    'iguales': 'equal',
    'módulo': 'module',
    'nombres': 'names',
    'activitat': 'activity',
    'clase': 'class',
    'uno': 'one',
    'sense': 'without',
    'nueve': 'nine',
    'amb': 'with',
    'hecho': 'done',
    'objetos': 'objects',
    'multiplicaciones': 'multiplications',
    'ocho': 'eight',
    'seis': 'six',
    'les': 'the',
    'respuesta': 'answer',
    'sumando': 'adding',
    'adelante': 'forward',
    'flecha': 'arrow',
    'cuántos': 'how many',
    'igual': 'equal',
    'así': 'this way',
    'tienes': 'you have',
    'cincuenta': 'fifty',
    'parte': 'part',
    'pantalla': 'screen',
    'partes': 'parts',
    'azul': 'blue',
    'treinta': 'thirty',
    'factor': 'factor',
    'han': 'have',
    'siguientes': 'following',
    'aprende': 'learn',
    'cómo': 'how',
    'ochenta': 'eighty',
    'coloca': 'place',
    'correspondiente': 'matching',
    'soy': 'I am',
    'cuarenta': 'forty',
    'sol': 'sun',
    'vocal': 'vowel',
    'partido': 'game',
    'información': 'information',
    'hace': 'does',
    'hemos': 'we have',
    'suma': 'addition',
    'animales': 'animals',
    'litros': 'liters',
    'relacionar': 'match',
    'madre': 'mother',
    'divisions': 'divisions',
    'faltan': 'missing',
    'futuro': 'future',
    'menos': 'less',
    'temido': 'feared',
    'años': 'years',
    'amado': 'loved',
    'animal': 'animal',
    'lugar': 'place',
    'cuadrado': 'square',
    'día': 'day',
    'noventa': 'ninety',
    'unidad': 'unit',
    'metros': 'meters',
    'producto': 'product',
    'sesenta': 'sixty',
    'setenta': 'seventy',
    'fantástico': 'fantastic',
    'cifras': 'digits',
    'activitats': 'activities',
    'dibujos': 'drawings',
    'sílabas': 'syllables',
    'nivel': 'level',
    'escribir': 'write',
    'corresponda': 'matches',
    'els': 'the',
    'pasar': 'go through',
    'presente': 'present',
    'valor': 'value',
    'consonante': 'consonant',
    'exercici': 'exercise',
    'vocales': 'vowels',
    'fracciones': 'fractions',
    'recuerda': 'remember',
    'figura': 'figure',
    'orden': 'order',
    'pretérito': 'past tense',
    'mas': 'more',
    'ellos': 'they',
    'associació': 'association',
    'operación': 'operation',
    'text': 'text',
    'lleva': 'takes',
    'eres': 'you are',
    'ella': 'she',
    'puedes': 'you can',
    'kilos': 'kilos',
    'días': 'days',
    'hoy': 'today',
    'centenas': 'hundreds',
    'adivinanza': 'riddle',
    'añade': 'add',
    'ciento': 'hundred',
    'serie': 'series',
    'resultados': 'results',
    'doble': 'double',
    'era': 'was',
    'veces': 'times',
    'paraules': 'words',
    'oso': 'bear',
    'sabrás': 'you will know',
    'contesta': 'answer',
    'divisor': 'divisor',
    'verde': 'green',
    'conseguido': 'achieved',
    'verbos': 'verbs',
    'multiplicar': 'multiply',
    'ser': 'be',
    'ejercicio': 'exercise',
    'casilla': 'square',
    'había': 'there was',
    'seguro': 'sure',
    'cuántas': 'how many',
    'anterior': 'previous',
    'parejas': 'pairs',
    'grupo': 'group',
    'superior': 'upper',
    'fenomenal': 'great',
    'división': 'division',
    'rojo': 'red',
    'ordénalas': 'sort them',
    'nosotros': 'we',
    'trobar': 'find',
    'significado': 'meaning',
    'fracción': 'fraction',
    'tilde': 'accent mark',
    'horas': 'hours',
    'precio': 'price',
    'cifra': 'digit',
    'conejo': 'rabbit',
    'misma': 'same',
    'cantidades': 'quantities',
    'opción': 'option',
    'cuerpo': 'body',
    'completar': 'complete',
    'tema': 'topic',
    'singular': 'singular',
    'vez': 'time',
    'ejemplo': 'example',
    'blanco': 'white',
    'libro': 'book',
    'gramos': 'grams',
    'mano': 'hand',
    'simple': 'simple',
    'dentro': 'inside',
    'gusta': 'likes',
    'identificar': 'identify',
    'minutos': 'minutes',
    'adjetivo': 'adjective',
    'dudas': 'doubts',
    'asocia': 'match',
    'diez': 'ten',
    'sabes': 'you know',
    'rectángulo': 'rectangle',
    'pareja': 'pair',
    'posición': 'position',
    'terminar': 'finish',
    'localiza': 'locate',
    'comido': 'eaten',
    'ayer': 'yesterday',
    'adjetivos': 'adjectives',
    'doscientos': 'two hundred',
    'desordenadas': 'mixed up',
    'sustraendo': 'subtrahend',
    'roja': 'red',
    'hora': 'hour',
    'pasado': 'past',
    'sentido': 'meaning',
    'décimas': 'tenths',
    'encima': 'on top',
    'manos': 'hands',
    'pronombre': 'pronoun',
    'modo': 'mood',
    'milésimas': 'thousandths',
    'hacia': 'towards',
    'descomposición': 'decomposition',
    'cociente': 'quotient',
    'cosas': 'things',
    'aparecen': 'appear',
    'crucigrama': 'crossword',
    'dado': 'die',
    'puede': 'can',
    'dividendo': 'dividend',
    'leer': 'read',
    'invierno': 'winter',
    'trescientos': 'three hundred',
    'base': 'base',
    'permite': 'allows',
    'veleta': 'weathervane',
    'microscopio': 'microscope',
    'microscopios': 'microscopes',
    'compuestos': 'compounds',
    'amplio': 'wide',
    'producción': 'production',
    'ácido': 'acid',
    'productor': 'producer',
    'ortográfica': 'spelling',
    'adecuadamente': 'properly',
    'invisible': 'invisible',
    'mágico': 'magic',
    'infeliz': 'unhappy',
    'bandada': 'flock',
    'traducción': 'translation',
    'lejanos': 'distant',
    'sencillos': 'simple',
    'optimista': 'optimist',
    'archipiélago': 'archipelago',
    'constelación': 'constellation',
    'jauría': 'pack',
    'proyección': 'projection',
    'satisfacción': 'satisfaction',
    'inspector': 'inspector',
    'lentes': 'glasses',
    'soporte': 'stand',
    'individuos': 'individuals',
    'intercambian': 'exchange',
    'comparte': 'shares',
    'dichosa': 'lucky',
    'entusiasta': 'enthusiast',
    'pesimista': 'pessimist',
    'apática': 'apathetic',
    'cordillera': 'mountain range',
    'pinar': 'pine forest',
    'inspección': 'inspection',
    'conducción': 'driving',
    'corrección': 'correction',
    'protección': 'protection',
    'selección': 'selection',
    'destrucción': 'destruction',
    'proyector': 'projector',
    'traductor': 'translator',
    'nom': 'name',
    'trobar': 'find',
    // --- Ampliación: frases y palabras frecuentes en instrucciones JClic ---
    'las letras se desordenaron': 'the letters got scrambled',
    'se desordenaron': 'got scrambled',
    'está desordenada': 'it is scrambled',
    'esta desordenada': 'it is scrambled',
    'están desordenados': 'they are scrambled',
    'estan desordenados': 'they are scrambled',
    'están desordenadas': 'they are scrambled',
    'estan desordenadas': 'they are scrambled',
    'si lo has estudiado bien': 'if you have studied well',
    'si lo has leido bien': 'if you have read carefully',
    'si lo has leído bien': 'if you have read carefully',
    'lo has hecho muy bien': 'you did very well',
    'sopa de letras': 'word search',
    'pulsa en': 'tap on',
    'haz clic en': 'click on',
    'pincha en': 'click on',
    'lo que le falta': 'what is missing',
    'qué le falta': 'what is missing',
    'que le falta': 'that is missing',
    'le falta': 'is missing',
    'le faltan': 'are missing',
    'que le corresponde': 'that matches',
    'que le corresponda': 'that matches',
    'con el raton': 'with the mouse',
    'con el ratón': 'with the mouse',
    'hacer fila': 'line up',
    'letras': 'letters',
    'abecedario': 'alphabet',
    'alfabéticamente': 'alphabetically',
    'alfabeticamente': 'alphabetically',
    'desordenado': 'scrambled',
    'desordenada': 'scrambled',
    'desordenados': 'scrambled',
    'desordenadas': 'scrambled',
    'desordenaron': 'scrambled',
    'desordenar': 'scramble',
    'ayúdalas': 'help them',
    'ayudalas': 'help them',
    'ayúdalos': 'help them',
    'ayudalos': 'help them',
    'ayúdala': 'help it',
    'ayudala': 'help it',
    'ayúdalo': 'help it',
    'ayudalo': 'help it',
    'ayúdales': 'help them',
    'ayudales': 'help them',
    'ayúdame': 'help me',
    'ayudame': 'help me',
    'ayudas': 'help',
    'quieren': 'want',
    'quiere': 'wants',
    'queremos': 'we want',
    'formarse': 'line up',
    'ponerse': 'get',
    'fila': 'line',
    'resultado': 'result',
    'se': '',
    'le': '',
    'lo': 'it',
    'su': 'its',
    'sus': 'their',
    'e': 'and',
    'sí': 'yes',
    'si': 'if',
    'según': 'according to',
    'segun': 'according to',
    'ordenar': 'sort',
    'pulsa': 'press',
    'cuadro': 'box',
    'cuadros': 'boxes',
    'has': 'have',
    'ha': 'has',
    'estudiado': 'studied',
    'estudia': 'study',
    'estudiar': 'study',
    'continúa': 'continue',
    'continua': 'continue',
    'empareja': 'match',
    'emparejar': 'match',
    'pincha': 'click',
    'responde': 'answer',
    'responder': 'answer',
    'piensa': 'think',
    'pensar': 'think',
    'pregunta': 'question',
    'preguntas': 'questions',
    'respuestas': 'answers',
    'chiquito': 'little',
    'chiquita': 'little',
    'grandote': 'big',
    'grandota': 'big',
    'haciendo': 'doing',
    'minuendo': 'minuend',
    'como': 'as',
    'oca': 'goose',
    'altavoz': 'speaker',
    'lista': 'list',
    'da': 'gives',
    'rincón': 'corner',
    'rincon': 'corner',
    'conjugación': 'conjugation',
    'conjugacion': 'conjugation',
    'diferente': 'different',
    'diferentes': 'different',
    'distinta': 'different',
    'distintas': 'different',
    'distintos': 'different',
    'atentamente': 'carefully',
    'adecuada': 'suitable',
    'adecuado': 'suitable',
    'estés': 'are',
    'estes': 'are',
    'preparado': 'ready',
    'preparada': 'ready',
    'casa': 'house',
    'representa': 'shows',
    'solución': 'solution',
    'solucion': 'solution',
    'tú': 'you',
    'oraciones': 'sentences',
    'pedir': 'ask for',
    'pide': 'ask for',
    'camino': 'path',
    'quiénes': 'who',
    'quienes': 'who',
    'ratón': 'mouse',
    'raton': 'mouse',
    'verás': 'you will see',
    'veras': 'you will see',
    'oirás': 'you will hear',
    'oiras': 'you will hear',
    'amiguitos': 'little friends',
    'sopa': 'word search',
    'faltan': 'are missing',
    'cuantos': 'how many',
    'jugar': 'play',
    'luna': 'moon',
    'cambia': 'changes',
    'noche': 'night',
    'ordénala': 'sort it',
    'ordenala': 'sort it',
    'ordénalas': 'sort them',
    'ordenalas': 'sort them',
    'ordénalos': 'sort them',
    'ordenalos': 'sort them',
    'colócala': 'place it',
    'colocala': 'place it',
    'colócalas': 'place them',
    'colocalas': 'place them',
    'relaciónalo': 'match it',
    'relacionalo': 'match it',
    'comprueba': 'check',
    'comprobar': 'check',
    'sombra': 'shadow',
    'vehículo': 'vehicle',
    'vehiculo': 'vehicle',
    'vehiculos': 'vehicles',
    'vehículos': 'vehicles',
    'colección': 'collection',
    'coleccion': 'collection',
    'colecciones': 'collections',
    'fotografía': 'photograph',
    'fotografia': 'photograph',
    'fotografías': 'photographs',
    'fotografias': 'photographs',
    'león': 'lion',
    'leon': 'lion',
    'caballo': 'horse',
    'caballito': 'little horse',
    'poesía': 'poem',
    'poesia': 'poem',
    'memoriza': 'memorize',
    'gráfica': 'chart',
    'grafica': 'chart',
    'dictado': 'dictation',
    'sello': 'stamp',
    'toalla': 'towel',
    'pollo': 'chicken',
    'peine': 'comb',
    'símbolo': 'symbol',
    'simbolo': 'symbol',
    'ordenador': 'computer',
    'tira': 'throw',
    'tirar': 'throw',
    'basura': 'trash',
    'contenedor': 'container',
    'contenedores': 'containers',
    'caso': 'case',
    'casos': 'cases',
    'formando': 'forming',
    'cambiar': 'change',
    'sola': 'single',
    'solo': 'only',
    'la que sigue': 'the next one',
    'el que sigue': 'the next one',
    'lo que sigue': 'what comes next',
    'nuevas': 'new',
    'nuevos': 'new',
    'contesta': 'answer',
    'contestar': 'answer',
    'SI / NO': 'YES / NO',
    'SI/NO': 'YES/NO',
    'eso es': "that's it",
    'mira estos': 'look at these',
    'mira estas': 'look at these',
    'mira este': 'look at this',
    'mira esta': 'look at this',
    'mira bien': 'look carefully',
    'mira bien las': 'look carefully at the',
    'mira bien la': 'look carefully at the',
    'mira bien los': 'look carefully at the',
    'mira bien el': 'look carefully at the',
    'frase está desordenada': 'sentence is scrambled',
    'frase esta desordenada': 'sentence is scrambled',
    'que se tira': 'thrown',
    'que se tiran': 'thrown',
    'sabrás ordenar': 'will know how to sort',
    'sabras ordenar': 'will know how to sort',
    'que sabrás ordenar': 'that you will know how to sort',
    'que sabras ordenar': 'that you will know how to sort',
    'estas partes desordenadas': 'these scrambled parts',
    'más chiquito': 'smallest',
    'mas chiquito': 'smallest',
    'más chiquita': 'smallest',
    'mas chiquita': 'smallest',
    'más grandote': 'biggest',
    'mas grandote': 'biggest',
    'más grandota': 'biggest',
    'mas grandota': 'biggest',
    'más grande': 'biggest',
    'mas grande': 'biggest',
    'más pequeño': 'smallest',
    'mas pequeño': 'smallest',
    'más pequeña': 'smallest',
    'mas pequeña': 'smallest',
    'ordena la imagen del más chiquito al más grandote': 'sort the image from the smallest to the biggest',
    'ordena la imagen del mas chiquito al mas grandote': 'sort the image from the smallest to the biggest',
    'al cambiar': 'when changing',
    'ya': 'already',
    'línea': 'line',
    'linea': 'line',
    'líneas': 'lines',
    'lineas': 'lines',
    'personaje': 'character',
    'personajes': 'characters',
    'lado': 'side',
    'lados': 'sides',
    'sumar': 'add',
    'restar': 'subtract',
    'relaciónala': 'match it',
    'relacionala': 'match it',
    'amarillo': 'yellow',
    'amarilla': 'yellow',
    'superficie': 'surface',
    'ratoncito': 'little mouse',
    'seguimos': 'we continue',
    'seguir': 'continue'
  }
};

// ==========================================
// TEXTOS CON LETRAS ESPACIADAS ("M U Y B I E N")
// Algunos juegos escriben los mensajes de victoria letra por letra.
// Traducirlos palabra por palabra los corrompe (la "A" de "B R A V O"
// se volvía "TO", la "Y" de "M U Y" se volvía "AND"), así que se
// detectan y se traducen por palabra completa.
// ==========================================
function tieneLetrasEspaciadas(texto) {
  try {
    return /(?:^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(?:[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]\s){2,}[A-Za-zÁÉÍÓÚÜÑáéíóúüñ](?![A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/u.test(texto);
  } catch (e) {
    return /(?:^|[^A-Za-z])(?:[A-Za-z]\s){2,}[A-Za-z](?![A-Za-z])/.test(texto);
  }
}

// Victorias habituales escritas con letras espaciadas (clave = sin
// espacios, minúsculas y sin acentos para comparar).
const victoriasEspaciadas = {
  'muybien': 'very good',
  'bravo': 'bravo',
  'excelente': 'excellent',
  'perfecto': 'perfect',
  'perfecta': 'perfect',
  'genial': 'great',
  'estupendo': 'great',
  'bingo': 'bingo',
  'fantastico': 'fantastic',
  'fenomenal': 'great',
  'sensacional': 'sensational',
  'felicidades': 'congratulations',
  'felicitaciones': 'congratulations',
  'enhorabuena': 'congratulations',
  'correcto': 'correct',
  'correcta': 'correct',
  'bien': 'good',
  'lohashechomuybien': 'you did very well',
  'hashechomuybien': 'you did very well'
};

function traducirEspaciado(textoOriginal) {
  // Devuelve la traducción conservando ¡!/¿? de los bordes, o null.
  try {
    var pref = (textoOriginal.match(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/) || [''])[0];
    var suf = (textoOriginal.match(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/) || [''])[0];
    var letras = (textoOriginal.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) || []).join('');
    if (!letras) return null;
    var todoMayus = letras === letras.toUpperCase();
    var norm = letras.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var claves = Object.keys(victoriasEspaciadas).sort(function(a, b) { return b.length - a.length; });
    var resto = norm, salida = [];
    while (resto.length) {
      var avanzo = false;
      for (var i = 0; i < claves.length; i++) {
        if (resto.indexOf(claves[i]) === 0) {
          salida.push(victoriasEspaciadas[claves[i]]);
          resto = resto.slice(claves[i].length);
          avanzo = true;
          break;
        }
      }
      if (!avanzo) return null;
    }
    var trad = salida.join(' ');
    if (todoMayus) trad = trad.toUpperCase();
    else trad = trad.charAt(0).toUpperCase() + trad.slice(1);
    return pref + trad + suf;
  } catch (e) { return null; }
}

// ==========================================
// TRADUCCIÓN POR FRASE COMPLETA (traducciones-en.js)
// Busca el texto entero normalizado (espacios, mayúsculas). Si viene con
// un prefijo tipo '🎉 ' o espacios, lo separa, traduce el núcleo y lo
// vuelve a poner. Devuelve null si la frase no está en la tabla.
// ==========================================
var __frasesEnLower = null;
function normalizarFrase(s) {
  return String(s).normalize('NFC').replace(/\s+/g, ' ').trim();
}
function traducirFraseCompleta(textoOriginal, idioma) {
  if (idioma !== 'en') return null;
  var tabla = (typeof window !== 'undefined' && window.traduccionesFrasesEN) || null;
  if (!tabla) return null;
  if (!__frasesEnLower) {
    __frasesEnLower = {};
    Object.keys(tabla).forEach(function(k) { __frasesEnLower[k.toLowerCase()] = tabla[k]; });
  }
  var m = String(textoOriginal).match(/^([\s\p{Extended_Pictographic}\uFE0F\u200D]*)([\s\S]*?)(\s*)$/u);
  var pref = m ? m[1] : '';
  var nucleo = normalizarFrase(m ? m[2] : textoOriginal);
  if (!nucleo) return null;
  var t = tabla[nucleo] || __frasesEnLower[nucleo.toLowerCase()];
  return t ? pref + t : null;
}

// ==========================================
// TRADUCIR INSTRUCCIÓN AUTOMÁTICAMENTE
// ==========================================
function traducirInstruccion(textoOriginal) {
  const idioma = obtenerIdiomaActual();

  // Si está en español o el texto está vacío, devolver original
  if (idioma === 'es' || !textoOriginal) {
    return textoOriginal;
  }

  // 1) Traducción de FRASE COMPLETA (traducciones-en.js). Es la fuente
  //    principal: evita frases mezcladas español/inglés del diccionario.
  try {
    var tFrase = traducirFraseCompleta(textoOriginal, idioma);
    if (tFrase) return tFrase;
  } catch (e) {}

  // Textos con letras espaciadas: traducir por palabra completa o
  // dejar el original intacto (nunca corromperlo palabra por palabra).
  try {
    if (tieneLetrasEspaciadas(textoOriginal)) {
      var tEsp = traducirEspaciado(textoOriginal);
      if (tEsp) return tEsp;
      return textoOriginal;
    }
  } catch (e) {}

  // Respeta mayúsculas: TODO→TODO, Hola→Hola, hola→hola
  function ajustarMayus(original, traducida) {
    try {
      var letras = original.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
      if (letras && letras === letras.toUpperCase()) return traducida.toUpperCase();
      if (/^[A-ZÁÉÍÓÚÜÑ]/.test(original)) {
        return traducida.charAt(0).toUpperCase() + traducida.slice(1);
      }
    } catch (e) {}
    return traducida;
  }

  let textoTraducido = textoOriginal;
  const diccionario = traduccionesInstrucciones[idioma];

  if (diccionario) {
    // Frases largas primero ('muy bien' antes que 'bien') y solo
    // palabras completas (evita que 'Une' rompa 'lunes', 'fin' rompa 'final').
    // Las claves de una letra (a, y, o, e) van ANTES: si fueran después,
    // pillarían la "a" que dejan 'una'/'un' al traducirse ("una sola"
    // acababa en "to single" en vez de "a single").
    var todas = Object.keys(traduccionesInstrucciones.es);
    var deUnaLetra = todas.filter(function(k) { return k.length === 1; });
    var resto = todas.filter(function(k) { return k.length > 1; }).sort(function(a, b) {
      return b.length - a.length;
    });
    var claves = deUnaLetra.concat(resto);
    claves.forEach(function(palabraEs) {
      const palabraTraducida = diccionario[palabraEs];
      if (palabraTraducida === undefined) return;
      // Las claves de una sola letra (a, y, o, e) nunca se aplican en
      // textos con letras espaciadas: los corrompen ("B R A V O").
      if (palabraEs.length === 1) {
        try { if (tieneLetrasEspaciadas(textoTraducido)) return; } catch (e) {}
      }
      try {
        var escapada = palabraEs.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Bordes unicode (sirve con acentos: niño, rápido...)
        var regex = new RegExp('(?<![\\p{L}\\p{N}_])' + escapada + '(?![\\p{L}\\p{N}_])', 'giu');
        textoTraducido = textoTraducido.replace(regex, function(m) {
          return ajustarMayus(m, palabraTraducida);
        });
      } catch (e) {
        try {
          textoTraducido = textoTraducido.replace(new RegExp(palabraEs, 'gi'), palabraTraducida);
        } catch (e2) {}
      }
    });
  }

  // Limpieza: algunas claves se traducen a vacío (se, le) y dejan
  // espacios dobles o espacio antes del punto. Se normaliza aquí.
  try {
    textoTraducido = textoTraducido.replace(/\s+([.,;:!?])/g, '$1').replace(/[ \t]{2,}/g, ' ');
  } catch (e) {}

  return textoTraducido;
}

// ==========================================
// DICCIONARIO SOLO DE IMÁGENES
// ==========================================
const mensajesFinalPorActividad = {
  'portasa.ass' : { tipo: 'img', src: 'assets/Imagenes/bienvenida.gif' },
  'g1.puz'      : { tipo: 'img', src: 'assets/Imagenes/estupendo.gif' },
  'g2.puz'      : { tipo: 'img', src: 'assets/Imagenes/muyBien.gif' },
  'g11.ass'      : { tipo: 'img', src: 'assets/Mensaje_final_imagenes/Excelente.gif' }
};

// ==========================================
// MENSAJES POR DEFECTO TRADUCIDOS
// ==========================================
const mensajesPorDefecto = {
  es: {
    bienvenida: 'Bienvenido al juego',
    instruccionesDefault: 'Instrucciones aparecerán aquí...',
    muyBien: '¡Muy bien! Actividad completada',
    excelente: '¡Excelente trabajo!',
    cargando: 'Cargando...'
  },
  en: {
    bienvenida: 'Welcome to the game',
    instruccionesDefault: 'Instructions will appear here...',
    muyBien: 'Great job! Activity completed',
    excelente: 'Excellent work!',
    cargando: 'Loading...'
  }
};

// ==========================================
// LIMPIAR NOMBRES INTERNOS DE ARCHIVO
// "3aclic.ass" -> "3aclic" | "Muy_bien.wav" -> "Muy bien"
// Para los juegos sin mensaje programado (670 sin initial,
// 590 sin nada en final según auditoría de los 62 zips)
// ==========================================
function limpiarNombreArchivo(nombre) {
  try {
    return String(nombre || '')
      .replace(/\.(ass|puz|xml|jclic|wav|mp3|ogg)$/i, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (e) { return String(nombre || ''); }
}

// ==========================================
// CAMBIAR INSTRUCCIÓN CON ANIMACIÓN
// ==========================================
function cambiarInstruccion(texto) {
  const barra = document.getElementById('barra-instrucciones');
  if (!barra) return;
  
  // Traducir el texto antes de mostrarlo
  const textoTraducido = traducirInstruccion(texto);
  
  if (barra.textContent === textoTraducido) return;

  barra.style.transition = 'opacity 0.3s ease';
  barra.style.opacity    = '0';

  setTimeout(() => {
    barra.textContent   = textoTraducido;
    barra.style.opacity = '1';
  }, 300);
}

// ==========================================
// LLAMADA DESDE ESTADISTICA.JS
// ==========================================
function cambiarInstruccionPorNombre(nombreActividad) {
  console.log('📚 cambiarInstruccionPorNombre:', nombreActividad);
  try {
    const p          = window.JClicObject?.currentPlayers?.[0];
    const messages   = p?.actPanel?.act?.messages;
    const initialTxt = messages?.initial?.text || '';
    cambiarInstruccion(' ' + (initialTxt || limpiarNombreArchivo(nombreActividad)));
  } catch(e) {
    console.error('Error:', e);
  }
}

// ==========================================
// IMAGEN FINAL DEL ARCHIVO JCLIC (cell type="final" image="...")
// La imagen vive dentro del .zip: se extrae una vez y se cachea
// como blob URL. Si no se encuentra, se usa texto/audio/defecto.
// ==========================================
window.__imgFinalCache = window.__imgFinalCache || {};

function resolverImagenFinal(nombreImg, cb) {
  var zipUrl = window.__ultimaRutaJuego || '';
  if (!nombreImg || !zipUrl || !window.JSZip) { cb(null); return; }
  var key = (zipUrl + '|' + nombreImg).toLowerCase();
  if (window.__imgFinalCache[key]) { cb(window.__imgFinalCache[key]); return; }
  try {
    fetch(zipUrl).then(function(r) {
      if (!r.ok) throw new Error('zip');
      return r.blob();
    }).then(function(b) {
      return window.JSZip.loadAsync(b);
    }).then(function(zip) {
      var names = Object.keys(zip.files);
      var target = String(nombreImg).toLowerCase();
      var base = target.split('/').pop();
      var found = names.find(function(n) { return n.toLowerCase() === target; }) ||
                  names.find(function(n) { return n.toLowerCase().split('/').pop() === base; });
      if (!found) throw new Error('img');
      return zip.file(found).async('blob');
    }).then(function(blob) {
      var objUrl = URL.createObjectURL(blob);
      window.__imgFinalCache[key] = objUrl;
      cb(objUrl);
    }).catch(function() { cb(null); });
  } catch (e) { cb(null); }
}

function renderFinalConImagen(objUrl, textoFinal) {
  var barra = document.getElementById('barra-instrucciones');
  if (!barra) return;
  barra.style.transition = 'opacity 0.3s ease';
  barra.style.opacity = '0';
  setTimeout(function() {
    barra.innerHTML = '';
    var img = document.createElement('img');
    img.src = objUrl;
    img.alt = '';
    img.style.cssText = 'max-height:55px;max-width:250px;object-fit:contain;vertical-align:middle;';
    img.onerror = function() {
      cambiarInstruccion('🎉 ' + (textoFinal || (mensajesPorDefecto[obtenerIdiomaActual()] || mensajesPorDefecto.es).muyBien));
    };
    barra.appendChild(img);
    if (textoFinal) {
      var span = document.createElement('span');
      span.style.cssText = 'margin-left:10px;vertical-align:middle;';
      span.textContent = '🎉 ' + traducirInstruccion(textoFinal);
      barra.appendChild(span);
    }
    barra.style.opacity = '1';
  }, 300);
}

// ==========================================
// MOSTRAR MENSAJE FINAL
// ==========================================
function mostrarMensajeFinal(messages) {
  const barra = document.getElementById('barra-instrucciones');
  if (!barra) return;

  const p               = window.JClicObject?.currentPlayers?.[0];
  const nombreActividad = p?.actPanel?.act?.name || '';
  const idioma          = obtenerIdiomaActual();

  // 1. Buscar en diccionario SOLO si es IMAGEN
  const entrada = mensajesFinalPorActividad[nombreActividad];
  if (entrada && entrada.tipo === 'img') {
    barra.style.transition = 'opacity 0.3s ease';
    barra.style.opacity    = '0';
    setTimeout(() => {
      barra.innerHTML   = '';
      const img         = document.createElement('img');
      img.src           = entrada.src;
      img.style.cssText =
        'max-height:55px;max-width:250px;object-fit:contain;vertical-align:middle;';
      img.onerror = () => {
        barra.textContent = '🎉 ' + (mensajesPorDefecto[idioma] || mensajesPorDefecto.es).muyBien;
      };
      barra.appendChild(img);
      barra.style.opacity = '1';
      console.log('✅ Imagen diccionario:', entrada.src);
    }, 300);
    return;
  }

  // 2. Leer del archivo JClic: IMAGEN primero, luego texto/audio
  const finalTxt   = messages?.final?.text               || '';
  const finalAudio = messages?.final?.mediaContent?.file || '';
  const finalImg   = messages?.final?.image              || '';

  if (finalImg) {
    // Mostrar texto al momento y mejorar con la imagen al resolverla.
    // Si no se encuentra la imagen en el zip, queda el texto/defecto.
    if (finalTxt) cambiarInstruccion('🎉 ' + finalTxt);
    resolverImagenFinal(finalImg, function(objUrl) {
      if (objUrl) {
        renderFinalConImagen(objUrl, finalTxt);
      } else if (!finalTxt) {
        cambiarInstruccion('🎉 ' + (mensajesPorDefecto[idioma] || mensajesPorDefecto.es).muyBien);
      }
    });
    return;
  }

  if (finalTxt) {
    cambiarInstruccion('🎉 ' + finalTxt);
    return;
  }

  if (finalAudio) {
    cambiarInstruccion('🎉 ' + limpiarNombreArchivo(finalAudio));
    return;
  }

  // 3. Texto por defecto traducido
  cambiarInstruccion('🎉 ' + (mensajesPorDefecto[idioma] || mensajesPorDefecto.es).muyBien);
}

// ==========================================
// OCULTAR INSTRUCCIONES NATIVAS DE JCLIC
// ==========================================
function ocultarInstruccionesJClic() {
  setInterval(() => {
    try {
      const jclic = document.querySelector('.JClic');
      if (!jclic) return;

      jclic.querySelectorAll('canvas').forEach(canvas => {
        if (canvas.width > canvas.height * 3) {
          canvas.style.setProperty('display', 'none', 'important');
        }
      });

      const coloresVerdes = [
        '0, 128, 0','34, 139, 34','0, 100, 0',
        '46, 125, 50','76, 175, 80','56, 142, 60'
      ];

      jclic.querySelectorAll('div').forEach(div => {
        const bg = window.getComputedStyle(div).backgroundColor;
        const h  = div.offsetHeight;
        const w  = div.offsetWidth;
        if (h > 0 && h < 60 && w > 200 &&
            coloresVerdes.some(c => bg.includes(c))) {
          div.style.setProperty('display', 'none', 'important');
        }
      });
    } catch(e) {}
  }, 300);
}

// ==========================================
// SINCRONIZAR CON JCLIC
// ==========================================
function sincronizarInstrucciones() {
  let ultimaActividad = '';
  let ultimoSolved    = false;
  let jclicListo      = false;

  setInterval(() => {
    try {
      const p = window.JClicObject?.currentPlayers?.[0];
      if (!p?.actPanel) return;

      const nombreActividad = p.actPanel?.act?.name || '';
      const solved          = p.actPanel.solved      || false;
      const messages        = p.actPanel.act?.messages;
      const initialTxt      = messages?.initial?.text || '';

      // Primera vez que JClic está listo
      if (!jclicListo && nombreActividad) {
        jclicListo      = true;
        ultimaActividad = nombreActividad;
        ultimoSolved    = false;
        console.log('✅ JClic listo. Actividad:', nombreActividad);
        cambiarInstruccion(' ' + (initialTxt || limpiarNombreArchivo(nombreActividad)));
        return;
      }

      // CAMBIO DE ACTIVIDAD
      if (nombreActividad && nombreActividad !== ultimaActividad) {
        ultimaActividad = nombreActividad;
        ultimoSolved    = false;
        console.log('🎯 Nueva actividad:', nombreActividad);
        cambiarInstruccion(' ' + (initialTxt || limpiarNombreArchivo(nombreActividad)));
        return;
      }

      // ACTIVIDAD COMPLETADA
      if (solved && !ultimoSolved) {
        ultimoSolved = true;
        console.log('🏆 Completada:', nombreActividad);
        mostrarMensajeFinal(messages);
        return;
      }

      // ACTIVIDAD RESETEADA
      if (!solved && ultimoSolved) {
        ultimoSolved = false;
        console.log('🔄 Reseteada:', nombreActividad);
        cambiarInstruccion(' ' + (initialTxt || limpiarNombreArchivo(nombreActividad)));
      }

    } catch(e) {}
  }, 500);
}

// ==========================================
// ACTUALIZAR INSTRUCCIONES AL CAMBIAR IDIOMA
// ==========================================
window.addEventListener('storage', (e) => {
  if (e.key === 'appConfig') {
    console.log('🌍 Idioma cambiado, actualizando instrucciones...');
    // Re-traducir la instrucción actual
    try {
      const p = window.JClicObject?.currentPlayers?.[0];
      if (p?.actPanel?.act) {
        const messages   = p.actPanel.act.messages;
        const initialTxt = messages?.initial?.text || '';
        cambiarInstruccion(' ' + initialTxt);
      }
    } catch(e) {}
  }
});

// ==========================================
// INICIALIZAR
// ==========================================
window.addEventListener('load', () => {
  const barra = document.getElementById('barra-instrucciones');
  const idioma = obtenerIdiomaActual();
  
  if (barra) {
    var msgs = mensajesPorDefecto[idioma] || mensajesPorDefecto.es;
    barra.textContent = ' ' + msgs.cargando;
  }

  ocultarInstruccionesJClic();
  sincronizarInstrucciones();
});
