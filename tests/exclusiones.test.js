// Verifica actividades excluidas de la estadística (EXCLUIR_FIN_POR_JUEGO).
// Se evalúa Estadistica.js en scope global (como <script> clásico) y se
// captura excluidaDelFin, que no está expuesta en window.
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(
  path.resolve(__dirname, '../src/Estadistica.js'), 'utf8');
(0, eval)(SRC + '\n;globalThis.__excluida = (typeof excluidaDelFin !== "undefined") ? excluidaDelFin : null;');

function conTitulo(titulo) {
  document.body.innerHTML = '<h1 id="gameTitle">' + titulo + '</h1>';
}

beforeEach(() => {
  localStorage.clear();
  expect(typeof window.__excluida).toBe('function');
});

describe('Exclusión de explorac.ass en Números y letras', () => {
  it('explorac.ass excluida (minúsculas y mayúsculas)', () => {
    conTitulo('Números y letras');
    expect(window.__excluida('explorac.ass')).toBe(true);
    expect(window.__excluida('EXPLORAC.ASS')).toBe(true);
  });

  it('otras actividades del juego siguen contando', () => {
    conTitulo('Números y letras');
    expect(window.__excluida('numeros.ass')).toBe(false);
    expect(window.__excluida('menu.ass')).toBe(false);
  });

  it('la exclusión no afecta a otros juegos', () => {
    conTitulo('Pedro y el lobo');
    expect(window.__excluida('explorac.ass')).toBe(false);
    expect(window.__excluida('trenca4.puz')).toBe(true);
  });
});
