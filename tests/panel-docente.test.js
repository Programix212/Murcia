// Pruebas del panel docente: las 4 opciones de orden + buscador.
// Simula 3 perfiles con stats distintas y verifica el orden de las filas.
// (Archivo local de verificación; no interfiere con la app.)
import { describe, it, expect, beforeEach } from 'vitest';
import '../src/perfiles.js';
import '../src/aplicar-config.js';
import '../src/panel-docente.js';

const PM = window.PerfilesManager;

function montarDOM() {
  document.body.innerHTML =
    '<div id="panelContainer">' +
    '<span id="totalAlumnos"></span>' +
    '<div id="panelVacio" style="display:none;"></div>' +
    '<table id="tablaAlumnos"><tbody id="tbodyAlumnos"></tbody></table>' +
    '<input type="text" id="buscadorAlumnos" value="">' +
    '<select id="ordenarPor">' +
    '<option value="nombre">Ordenar por nombre</option>' +
    '<option value="juegos">Más juegos completados</option>' +
    '<option value="puntuacion">Mejor puntuación</option>' +
    '<option value="reciente">Más reciente</option>' +
    '</select>' +
    '</div>';
}

function crearTres() {
  const ana = PM.crearPerfil('Ana', '👧');
  const luis = PM.crearPerfil('Luis', '👦');
  const zoe = PM.crearPerfil('Zoe', '🦊');
  const ahora = Date.now();
  PM.guardarDatos(ana.id, 'stats', {
    juegosTerminados: { a: 1, b: 1, c: 1 },
    mejorPuntuacion: 90, mejorRacha: 2, logros: [],
    ultimaActividad: new Date(ahora - 1000).toISOString()
  });
  PM.guardarDatos(luis.id, 'stats', {
    juegosTerminados: { a: 1 },
    mejorPuntuacion: 100, mejorRacha: 5, logros: ['x'],
    ultimaActividad: new Date(ahora - 60000).toISOString()
  });
  PM.guardarDatos(zoe.id, 'stats', {
    juegosTerminados: {},
    mejorPuntuacion: 50, mejorRacha: 1, logros: [],
    ultimaActividad: new Date(ahora - 3600000).toISOString()
  });
}

function nombresEnTabla() {
  return Array.from(document.querySelectorAll('#tbodyAlumnos .alumno-nombre'))
    .map(function(el) { return el.textContent; });
}

function ordenar(criterio, busqueda) {
  document.getElementById('ordenarPor').value = criterio;
  document.getElementById('buscadorAlumnos').value = busqueda || '';
  window.renderizarPanel();
  return nombresEnTabla();
}

beforeEach(() => {
  localStorage.clear();
  montarDOM();
  crearTres();
});

describe('Panel docente - 4 criterios de orden', () => {
  it('1. Ordenar por nombre: Ana, Luis, Zoe', () => {
    expect(ordenar('nombre')).toEqual(['Ana', 'Luis', 'Zoe']);
  });

  it('2. Más juegos completados: Ana(3), Luis(1), Zoe(0)', () => {
    expect(ordenar('juegos')).toEqual(['Ana', 'Luis', 'Zoe']);
  });

  it('3. Mejor puntuación: Luis(100), Ana(90), Zoe(50)', () => {
    expect(ordenar('puntuacion')).toEqual(['Luis', 'Ana', 'Zoe']);
  });

  it('4. Más reciente: Ana, Luis, Zoe', () => {
    expect(ordenar('reciente')).toEqual(['Ana', 'Luis', 'Zoe']);
  });

  it('buscador filtra por nombre ("lu" solo muestra a Luis)', () => {
    expect(ordenar('nombre', 'lu')).toEqual(['Luis']);
  });

  it('perfil sin stats no rompe el orden', () => {
    PM.crearPerfil('Beto', '🐶');
    expect(ordenar('juegos')[0]).toBe('Ana');
    expect(ordenar('nombre')).toEqual(['Ana', 'Beto', 'Luis', 'Zoe']);
  });
});

describe('Panel docente en inglés (claves vacías no se filtran)', () => {
  function ultimaVezDe(nombre) {
    var filas = Array.from(document.querySelectorAll('#tbodyAlumnos tr'));
    for (var i = 0; i < filas.length; i++) {
      var nom = filas[i].querySelector('.alumno-nombre');
      if (nom && nom.textContent === nombre) {
        return filas[i].lastElementChild.textContent;
      }
    }
    return null;
  }

  it('hace 2 minutos se lee "2 minutes ago" (sin "haceMinutos")', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'en' }));
    const p = PM.crearPerfil('TestMin', '🐶');
    PM.guardarDatos(p.id, 'stats', {
      juegosTerminados: {}, mejorPuntuacion: 0, mejorRacha: 0, logros: [],
      ultimaActividad: new Date(Date.now() - 150000).toISOString()
    });
    window.renderizarPanel();
    expect(ultimaVezDe('TestMin')).toBe('2 minutes ago');
  });

  it('hace 2 horas se lee "2 hours ago"', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'en' }));
    const p = PM.crearPerfil('TestHor', '🐱');
    PM.guardarDatos(p.id, 'stats', {
      juegosTerminados: {}, mejorPuntuacion: 0, mejorRacha: 0, logros: [],
      ultimaActividad: new Date(Date.now() - 9000000).toISOString()
    });
    window.renderizarPanel();
    expect(ultimaVezDe('TestHor')).toBe('2 hours ago');
  });

  it('en español conserva "Hace 2 minutos"', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'es' }));
    const p = PM.crearPerfil('TestEs', '🦊');
    PM.guardarDatos(p.id, 'stats', {
      juegosTerminados: {}, mejorPuntuacion: 0, mejorRacha: 0, logros: [],
      ultimaActividad: new Date(Date.now() - 150000).toISOString()
    });
    window.renderizarPanel();
    expect(ultimaVezDe('TestEs')).toBe('Hace 2 minutos');
  });
});
