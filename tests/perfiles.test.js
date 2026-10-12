// Pruebas de perfiles, export/import y migración de esquema.
// Carga el archivo real perfiles.js (define window.PerfilesManager).
import { describe, it, expect, beforeEach } from 'vitest';
import '../src/perfiles.js';

const PM = window.PerfilesManager;

beforeEach(() => {
  // Empezar cada prueba con almacenamiento limpio
  localStorage.clear();
});

describe('PerfilesManager - perfiles', () => {
  it('crea un perfil con stats inicializadas en 0', () => {
    const p = PM.crearPerfil('Maria', '👧');

    expect(p.id).toBeTruthy();
    expect(p.nombre).toBe('Maria');
    expect(p.avatar).toBe('👧');

    const lista = PM.obtenerPerfiles();
    expect(lista.length).toBe(1);

    const stats = PM.obtenerDatos(p.id, 'stats', null);
    expect(stats).not.toBeNull();
    expect(stats.juegosCompletados).toBe(0);
    expect(stats.totalAciertos).toBe(0);
  });

  it('edita el nombre y el avatar de un perfil', () => {
    const p = PM.crearPerfil('Ana', '👦');
    PM.editarPerfil(p.id, 'Ana Lucia', '🦊');

    const actualizado = PM.obtenerPerfiles().find(x => x.id === p.id);
    expect(actualizado.nombre).toBe('Ana Lucia');
    expect(actualizado.avatar).toBe('🦊');
  });

  it('elimina un perfil y todos sus datos', () => {
    const p = PM.crearPerfil('Pedro', '👶');
    PM.guardarDatos(p.id, 'logros', ['primero']);

    PM.eliminarPerfil(p.id);

    expect(PM.obtenerPerfiles().length).toBe(0);
    expect(localStorage.getItem(`ceartee_perfil_${p.id}_stats`)).toBeNull();
    expect(localStorage.getItem(`ceartee_perfil_${p.id}_logros`)).toBeNull();
  });

  it('selecciona y obtiene el perfil activo', () => {
    const p = PM.crearPerfil('Luis', '👦');
    PM.seleccionarPerfil(p.id);

    const activo = PM.obtenerPerfilActivo();
    expect(activo).not.toBeNull();
    expect(activo.id).toBe(p.id);
  });
});

describe('PerfilesManager - exportar / importar', () => {
  it('exporta un objeto con perfiles, datos y configuración', async () => {
    const p = PM.crearPerfil('Sara', '👧');
    PM.guardarDatos(p.id, 'stats', { juegosCompletados: 3 });
    localStorage.setItem('appConfig', JSON.stringify({ idioma: 'es' }));

    const backup = await PM.exportarTodo();

    expect(backup.app).toBe('CEARTEE');
    expect(backup.perfiles.length).toBe(1);
    expect(backup.datosPerfiles[p.id].stats.juegosCompletados).toBe(3);
    expect(backup.appConfig.idioma).toBe('es');
    expect(backup._firma).toBeTruthy();
  });

  it('importa en modo reemplazar (borra lo actual)', async () => {
    // Respaldo válido: se genera exportando (firma correcta)
    PM.crearPerfil('Nuevo', '🐶');
    const backup = await PM.exportarTodo();
    const idNuevo = backup.perfiles[0].id;

    // Datos actuales que deben desaparecer
    PM.crearPerfil('Viejo', '👴');

    await PM.importarTodo(backup, 'reemplazar');

    const lista = PM.obtenerPerfiles();
    expect(lista.length).toBe(1);
    expect(lista[0].id).toBe(idNuevo);
    expect(lista.find(x => x.nombre === 'Viejo')).toBeUndefined();
  });

  it('importa en modo combinar (conserva lo actual)', async () => {
    // Respaldo válido con un perfil extra
    PM.crearPerfil('Extra', '🐱');
    const backup = await PM.exportarTodo();

    // Empezar de cero y crear el perfil actual
    localStorage.clear();
    const actual = PM.crearPerfil('Actual', '👩');

    await PM.importarTodo(backup, 'combinar');

    const lista = PM.obtenerPerfiles();
    const ids = lista.map(x => x.id);
    expect(ids).toContain(actual.id);
    expect(ids).toContain(backup.perfiles[0].id);
  });

  it('rechaza un archivo que no es respaldo de CEARTEE', async () => {
    await expect(PM.importarTodo({ algo: 'otro' }, 'combinar')).rejects.toThrow();
  });

  it('rechaza un respaldo manipulado (firma inválida)', async () => {
    PM.crearPerfil('Bueno', '🐶');
    const backup = await PM.exportarTodo();
    backup.perfiles.push({ id: 'hack', nombre: 'Hack', avatar: '👾' }); // romper firma

    await expect(PM.importarTodo(backup, 'combinar')).rejects.toThrow();
  });
});

describe('Migración de esquema', () => {
  it('normaliza stats viejas y marca la versión nueva', () => {
    // Simular datos viejos: perfil sin fechas y stats incompletas, sin versión
    const perfilViejo = { id: 'v1', nombre: 'Antiguo', avatar: '👵' };
    localStorage.setItem('ceartee_perfiles', JSON.stringify([perfilViejo]));
    localStorage.setItem('ceartee_perfil_v1_stats', JSON.stringify({ totalAciertos: 4 }));

    // Ejecutar la migración (expuesta para pruebas)
    window.cearteeMigrarEsquema();

    // La versión de esquema quedó actualizada
    expect(localStorage.getItem('ceartee_schema_version')).toBe('2');

    // Las stats viejas se completaron con los campos faltantes
    const stats = JSON.parse(localStorage.getItem('ceartee_perfil_v1_stats'));
    expect(stats.totalAciertos).toBe(4);
    expect(stats.juegosCompletados).toBe(0);
    expect(stats.juegos).toEqual({});

    // El perfil viejo recibió fechas
    const perfil = JSON.parse(localStorage.getItem('ceartee_perfiles'))[0];
    expect(perfil.fechaCreacion).toBeTruthy();
  });
});
