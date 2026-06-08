// Pruebas de registro de estadísticas.
// Carga perfiles.js primero (lo necesita Estadistica.js) y luego Estadistica.js.
import { describe, it, expect, beforeEach } from 'vitest';
import '../src/perfiles.js';
import '../src/Estadistica.js';

const PM = window.PerfilesManager;

beforeEach(() => {
  localStorage.clear();
});

describe('registrarEstadistica', () => {
  it('suma aciertos, errores y tiempo en el perfil activo', () => {
    const p = PM.crearPerfil('Tester', '👧');
    PM.seleccionarPerfil(p.id);

    // Registrar un juego: 5 aciertos, 2 errores, 60 segundos
    window.registrarEstadistica('Juego A', 5, 2, 60);

    const stats = PM.obtenerDatos(p.id, 'stats', null);
    expect(stats.juegosCompletados).toBe(1);
    expect(stats.totalAciertos).toBe(5);
    expect(stats.totalErrores).toBe(2);
    expect(stats.tiempoTotal).toBe(60);
  });

  it('calcula la mejor puntuación como porcentaje de aciertos', () => {
    const p = PM.crearPerfil('Tester2', '👦');
    PM.seleccionarPerfil(p.id);

    // 5 aciertos de 7 intentos => 71%
    window.registrarEstadistica('Juego B', 5, 2, 30);

    const stats = PM.obtenerDatos(p.id, 'stats', null);
    expect(stats.mejorPuntuacion).toBe(71);
    expect(stats.juegos['Juego B']).toBeTruthy();
    expect(stats.juegos['Juego B'].vecesJugado).toBe(1);
  });

  it('acumula al jugar dos veces', () => {
    const p = PM.crearPerfil('Tester3', '🦊');
    PM.seleccionarPerfil(p.id);

    window.registrarEstadistica('Juego C', 3, 1, 20);
    window.registrarEstadistica('Juego C', 4, 0, 25);

    const stats = PM.obtenerDatos(p.id, 'stats', null);
    expect(stats.juegosCompletados).toBe(2);
    expect(stats.totalAciertos).toBe(7);
    expect(stats.juegos['Juego C'].vecesJugado).toBe(2);
  });
});
