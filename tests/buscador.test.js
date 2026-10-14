// Verifica búsqueda por prefijo (desde la primera letra) en listas de juegos.
// Usa Lenguajes2.js como representante (los 8 archivos comparten la lógica).
// Se carga con eval indirecto (scope global, como <script> clásico), porque
// importado como módulo ES sus funciones no quedan en window.
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import '../src/aplicar-config.js';

const SRC = fs.readFileSync(
  path.resolve(__dirname, '../src/Primaria/Lenguajes2.js'), 'utf8');
(0, eval)(SRC + '\n;globalThis.filterGames = filterGames;');

function montar() {
  document.body.innerHTML =
    '<input type="text" id="searchInput" value="">' +
    '<span id="gameCount">3</span>' +
    '<div id="noResults" style="display:none;"></div>' +
    '<div class="game-card" data-name="Caperucita Roja"><h3 class="game-title">Caperucita Roja</h3></div>' +
    '<div class="game-card" data-name="La Caperucita"><h3 class="game-title">La Caperucita</h3></div>' +
    '<div class="game-card" data-name="Verbos"><h3 class="game-title">Verbos</h3></div>';
}

function buscar(texto) {
  document.getElementById('searchInput').value = texto;
  window.filterGames();
  return Array.from(document.querySelectorAll('.game-card'))
    .filter(function(c) { return c.style.display !== 'none'; })
    .map(function(c) { return c.dataset.name; });
}

beforeEach(() => { montar(); });

describe('Buscador por prefijo', () => {
  it('"cap" solo muestra Caperucita Roja (no La Caperucita)', () => {
    expect(buscar('cap')).toEqual(['Caperucita Roja']);
  });

  it('"la cap" muestra La Caperucita', () => {
    expect(buscar('la cap')).toEqual(['La Caperucita']);
  });

  it('mayúsculas y espacios no afectan ("  VER ")', () => {
    expect(buscar('  VER ')).toEqual(['Verbos']);
  });

  it('vacío muestra todo', () => {
    expect(buscar('')).toEqual(['Caperucita Roja', 'La Caperucita', 'Verbos']);
  });

  it('sin coincidencias muestra aviso y contador en 0', () => {
    expect(buscar('zzz')).toEqual([]);
    expect(document.getElementById('noResults').style.display).toBe('flex');
    // NOTA: happy-dom guarda el número crudo ('') en vez de coerces a '0'
    // como hacen los navegadores reales; Number() iguala ambas conductas.
    expect(Number(document.getElementById('gameCount').textContent)).toBe(0);
  });
});

describe('Buscador sin historial del navegador', () => {  it('desactiva autocompletado y pone readonly hasta el foco', () => {
    document.body.innerHTML =
      '<input type="text" class="search-input" id="searchInput" value="">';
    var input = document.getElementById('searchInput');
    expect(typeof window.desactivarAutocompletadoBuscador).toBe('function');
    window.desactivarAutocompletadoBuscador();
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.hasAttribute('readonly')).toBe(true);
    input.focus();
    expect(input.hasAttribute('readonly')).toBe(false);
    input.blur();
    expect(input.hasAttribute('readonly')).toBe(true);
  });
});

describe('Categoría vacía muestra aviso al abrir', () => {
  it('lista sin tarjetas: noResults visible', () => {
    document.body.innerHTML =
      '<div id="gamesList">' +
      '<div class="no-results" id="noResults" style="display:none;"></div>' +
      '</div>';
    window.mostrarVacioSiNoHayJuegos();
    expect(document.getElementById('noResults').style.display).toBe('flex');
  });

  it('lista con tarjetas: noResults intacto', () => {
    document.body.innerHTML =
      '<div id="gamesList">' +
      '<div class="game-card" data-name="X"><h3 class="game-title">X</h3></div>' +
      '<div class="no-results" id="noResults" style="display:none;"></div>' +
      '</div>';
    window.mostrarVacioSiNoHayJuegos();
    expect(document.getElementById('noResults').style.display).toBe('none');
  });
});
