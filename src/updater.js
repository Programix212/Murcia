import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { getVersion } from '@tauri-apps/api/app';

async function iniciarUpdater() {
  try {
    const versionActual = await getVersion();
    console.log('[Updater] Versión actual:', versionActual);

    const update = await check();
    if (!update?.available) {
      console.log('[Updater] No hay actualizaciones');
      return;
    }

    // Si el usuario ya rechazo ESTA version, no volver a mostrar
    const rechazada = localStorage.getItem('updateRechazada');
    if (rechazada === update.version) {
      console.log('[Updater] El usuario ya rechazo la version', update.version);
      return;
    }

    console.log('[Updater] Update encontrado:', update.version);
    mostrarModalActualizacion(update);

  } catch (err) {
    console.error('[Updater] Error en check:', err);
  }
}

function mostrarModalActualizacion(update) {
  if (document.getElementById('updater-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'updater-modal';
  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:100000;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',system-ui,sans-serif;">
      <div style="background:linear-gradient(135deg,#1e3c72,#2a5298);color:#fff;padding:2.5rem;border-radius:20px;max-width:500px;width:90%;text-align:center;box-shadow:0 25px 80px rgba(0,0,0,0.6);">
        <div style="font-size:48px;margin-bottom:12px;">🎓</div>
        <h2 style="margin:0 0 8px;">Nueva versión disponible</h2>
        <p style="opacity:0.9;margin-bottom:4px;">CEARTEE <strong>${update.version}</strong> está lista.</p>
        <p style="opacity:0.75;font-size:0.95rem;margin-bottom:1.5rem;">${update.body || 'Incluye mejoras y nuevos contenidos.'}</p>

        <div id="upd-progress" style="display:none;margin:1.5rem 0;">
          <div style="width:100%;height:12px;background:rgba(255,255,255,0.15);border-radius:6px;overflow:hidden;">
            <div id="upd-bar" style="width:0%;height:100%;background:#00d26a;transition:width 0.25s ease;"></div>
          </div>
          <p id="upd-pct" style="font-size:0.9rem;margin-top:8px;opacity:0.9;">Preparando descarga...</p>
        </div>

        <div id="upd-buttons" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button id="btn-upd-now" style="background:#00d26a;color:#002;border:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:1rem;cursor:pointer;">Actualizar ahora</button>
          <button id="btn-upd-later" style="background:rgba(255,255,255,0.15);color:#fff;border:none;padding:14px 24px;border-radius:10px;cursor:pointer;font-size:1rem;">Más tarde</button>
        </div>
        <p id="upd-status" style="margin-top:1rem;font-size:0.85rem;min-height:1.2rem;color:#ffd166;word-break:break-word;"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // BOTON "MAS TARDE": cierra y NO vuelve a mostrar para esta version
  document.getElementById('btn-upd-later').addEventListener('click', () => {
    localStorage.setItem('updateRechazada', update.version);
    modal.remove();
  });

  // BOTON "ACTUALIZAR AHORA": inicia la descarga con barra de progreso
  document.getElementById('btn-upd-now').addEventListener('click', () => {
    iniciarDescarga(update);
  });
}

async function iniciarDescarga(update) {
  document.getElementById('upd-buttons').style.display = 'none';
  document.getElementById('upd-progress').style.display = 'block';

  const barEl = document.getElementById('upd-bar');
  const pctEl = document.getElementById('upd-pct');
  const statusEl = document.getElementById('upd-status');

  let contentLength = 0;
  let descargado = 0;

  try {
    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case 'Started':
          contentLength = event.data?.contentLength || 0;
          descargado = 0;
          pctEl.textContent = '0%';
          break;

        case 'Progress':
          descargado += event.data?.chunkLength || 0;
          if (contentLength > 0) {
            const pct = Math.min(100, Math.round((descargado / contentLength) * 100));
            barEl.style.width = pct + '%';
            pctEl.textContent = pct + '%';
          } else {
            pctEl.textContent = (descargado / 1048576).toFixed(1) + ' MB';
          }
          break;

        case 'Finished':
          barEl.style.width = '100%';
          pctEl.textContent = '100%';
          statusEl.style.color = '#00d26a';
          statusEl.textContent = 'Descarga completa. Instalando...';
          break;
      }
    });

    barEl.style.width = '100%';
    pctEl.textContent = '100%';
    statusEl.style.color = '#00d26a';
    statusEl.innerHTML = '<b>✓ Listo. Reiniciando...</b>';
    setTimeout(() => relaunch(), 1500);

  } catch (err) {
    console.error('[Updater] Error completo:', err);
    let mensaje = 'Error desconocido';
    if (typeof err === 'string') {
      mensaje = err;
    } else if (err && typeof err === 'object') {
      mensaje = err.message || err.error || err.statusText || JSON.stringify(err);
    }
    statusEl.style.color = '#ff6b6b';
    statusEl.innerHTML = `<b>❌ Error:</b> ${mensaje}`;
    // Permitir reintentar
    document.getElementById('upd-progress').style.display = 'none';
    document.getElementById('upd-buttons').style.display = 'flex';
    document.getElementById('btn-upd-now').textContent = 'Reintentar';
  }
}

setTimeout(iniciarUpdater, 3000);
