const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip'); // npm install adm-zip

const archivosRaros = [
    'Actividaddenumeracion.jclic.zip',
    'Formasgeometricas.jclic.zip', 
    'Lamanzana.jclic.zip'
];

const rutaBase = './src/assets/Saberes/';

archivosRaros.forEach(archivo => {
    console.log(`\n🔧 Procesando: ${archivo}`);
    
    try {
        const rutaArchivo = path.join(rutaBase, archivo);
        const zip = new AdmZip(rutaArchivo);
        const tempDir = path.join(rutaBase, `__temp_${archivo}`);
        
        // Extraer todo
        zip.extractAllTo(tempDir, true);
        
        // Buscar el archivo .jclic dentro de subcarpetas
        let rutaJclic = null;
        let rutaRaiz = null;
        
        function buscarJclic(dir, nivel = 0) {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const rutaCompleta = path.join(dir, item);
                const stat = fs.statSync(rutaCompleta);
                
                if (stat.isDirectory()) {
                    buscarJclic(rutaCompleta, nivel + 1);
                } else if (item.endsWith('.jclic') || item.endsWith('.jclic.xml')) {
                    rutaJclic = rutaCompleta;
                    rutaRaiz = dir; // La carpeta donde está el jclic
                    console.log(`  📁 Encontrado en: ${item} (nivel ${nivel})`);
                }
            }
        }
        
        buscarJclic(tempDir);
        
        if (!rutaJclic) {
            console.log('  ❌ No se encontró archivo .jclic');
            return;
        }
        
        // Si está en subcarpeta, mover todo a raíz
        if (rutaRaiz !== tempDir) {
            console.log('  📝 Moviendo archivos a raíz del ZIP...');
            
            const archivosAMover = fs.readdirSync(rutaRaiz);
            archivosAMover.forEach(file => {
                const origen = path.join(rutaRaiz, file);
                const destino = path.join(tempDir, file);
                if (origen !== destino) {
                    fs.renameSync(origen, destino);
                }
            });
            
            // Limpiar carpetas vacías
            function limpiarVacias(dir) {
                fs.readdirSync(dir).forEach(file => {
                    const ruta = path.join(dir, file);
                    if (fs.statSync(ruta).isDirectory()) {
                        limpiarVacias(ruta);
                        if (fs.readdirSync(ruta).length === 0) {
                            fs.rmdirSync(ruta);
                        }
                    }
                });
            }
            limpiarVacias(tempDir);
        }
        
        // Crear nuevo ZIP limpio
        const nuevoZip = new AdmZip();
        const archivosFinales = fs.readdirSync(tempDir);
        
        archivosFinales.forEach(file => {
            const ruta = path.join(tempDir, file);
            if (fs.statSync(ruta).isDirectory()) {
                nuevoZip.addLocalFolder(ruta, file);
            } else {
                nuevoZip.addLocalFile(ruta, '', file);
            }
        });
        
        // Backup y reemplazo
        fs.renameSync(rutaArchivo, rutaArchivo + '.backup');
        nuevoZip.writeZip(rutaArchivo);
        
        // Limpiar temp
        fs.rmSync(tempDir, { recursive: true, force: true });
        
        console.log(`  ✅ ${archivo} arreglado`);
        
    } catch (err) {
        console.error(`  ❌ Error:`, err.message);
    }
});

console.log('\n🎉 Proceso completado. Prueba los juegos ahora.');