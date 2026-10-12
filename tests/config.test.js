// Pruebas antibug: idioma catalán y dificultad "medio" en otras PCs.
// Carga aplicar-config.js real (expone window.CearteeConfig).
import { describe, it, expect, beforeEach } from 'vitest';
import '../src/aplicar-config.js';

const CC = window.CearteeConfig;

beforeEach(() => {
  localStorage.clear();
});

describe('Idioma: nunca catalán ni "undefined"', () => {
  it('normaliza ca/catalan a es', () => {
    expect(CC.normalizarIdioma('ca')).toBe('es');
    expect(CC.normalizarIdioma('catalan')).toBe('es');
    expect(CC.normalizarIdioma('català')).toBe('es');
  });

  it('acepta es/en en cualquier mayúscula', () => {
    expect(CC.normalizarIdioma('es')).toBe('es');
    expect(CC.normalizarIdioma('ES')).toBe('es');
    expect(CC.normalizarIdioma('en')).toBe('en');
    expect(CC.normalizarIdioma('EN')).toBe('en');
    expect(CC.normalizarIdioma('English')).toBe('en');
  });

  it('corruptos caen a es (undefined, null, "", basura)', () => {
    expect(CC.normalizarIdioma(undefined)).toBe('es');
    expect(CC.normalizarIdioma(null)).toBe('es');
    expect(CC.normalizarIdioma('')).toBe('es');
    expect(CC.normalizarIdioma('undefined')).toBe('es');
    expect(CC.normalizarIdioma('xx')).toBe('es');
  });

  it('obtenerConfig migra un backup viejo con ca a es y lo persiste', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'ca', dificultad: 'todas' }));
    const cfg = CC.obtenerConfig();
    expect(cfg.idioma).toBe('es');
    expect(JSON.parse(localStorage.getItem('appConfig')).idioma).toBe('es');
  });

  it('obtenerConfig con JSON corrupto devuelve defaults es/todas', () => {
    localStorage.setItem('appConfig', '{no-json');
    const cfg = CC.obtenerConfig();
    expect(cfg.idioma).toBe('es');
    expect(cfg.dificultad).toBe('todas');
  });

  it('PC nueva sin nada arranca en es/todas', () => {
    const cfg = CC.obtenerConfig();
    expect(cfg.idioma).toBe('es');
    expect(cfg.dificultad).toBe('todas');
  });
});

describe('Dificultad: ES/EN/tildes, nunca cae mal a Facil', () => {
  it('normaliza español a canónico', () => {
    expect(CC.normalizarDificultad('todas')).toBe('todas');
    expect(CC.normalizarDificultad('fácil')).toBe('easy');
    expect(CC.normalizarDificultad('facil')).toBe('easy');
    expect(CC.normalizarDificultad('medio')).toBe('medium');
    expect(CC.normalizarDificultad('medio ')).toBe('medium');
    expect(CC.normalizarDificultad('difícil')).toBe('hard');
    expect(CC.normalizarDificultad('dificil')).toBe('hard');
  });

  it('normaliza inglés y mayúsculas', () => {
    expect(CC.normalizarDificultad('easy')).toBe('easy');
    expect(CC.normalizarDificultad('MEDIUM')).toBe('medium');
    expect(CC.normalizarDificultad('Hard')).toBe('hard');
    expect(CC.normalizarDificultad('all')).toBe('todas');
  });

  it('corruptos caen a todas (no filtran), no a Facil', () => {
    expect(CC.normalizarDificultad(undefined)).toBe('todas');
    expect(CC.normalizarDificultad('undefined')).toBe('todas');
    expect(CC.normalizarDificultad('medioasdf')).toBe('todas');
    expect(CC.normalizarDificultad('')).toBe('todas');
  });

  it('obtenerConfig migra backup viejo con "medio" a "medium"', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'es', dificultad: 'medio' }));
    const cfg = CC.obtenerConfig();
    expect(cfg.dificultad).toBe('medium');
  });

  it('aplicarFiltroDificultad con "medio" muestra los medios, no los fáciles', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'es', dificultad: 'medio' }));
    document.body.innerHTML =
      '<div class="game-card" data-difficulty="Medio"></div>' +
      '<div class="game-card" data-difficulty="Facil"></div>';
    window.aplicarFiltroDificultad();
    const cards = document.querySelectorAll('.game-card');
    expect(cards[0].style.display).toBe('');
    expect(cards[1].style.display).toBe('none');
  });

  it('aplicarFiltroDificultad con valor basura muestra todo', () => {
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'es', dificultad: 'basura-xyz' }));
    document.body.innerHTML =
      '<div class="game-card" data-difficulty="Medio"></div>' +
      '<div class="game-card" data-difficulty="Facil"></div>';
    window.aplicarFiltroDificultad();
    const cards = document.querySelectorAll('.game-card');
    expect(cards[0].style.display).toBe('');
    expect(cards[1].style.display).toBe('');
  });
});
