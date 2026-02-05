// Estado de la aplicación
let usuarioActual = 'Renato  Fuentes';
let modoEdit = false;
let diaEditando = null;
let detalleDiaActual = null;
let detalleDiaEl = null;
let detalleAccordionOpen = false;
let filtroTurnos = 'Todos';
let ocultarLibres = true;

const ORDEN_TURNOS = ['AM', 'PM', 'FULL', 'VAC', 'LIBRE', 'N/A'];
const SELECTED_DAY_CLASS = 'ring-2 ring-offset-2 ring-primary shadow-lg shadow-teal-200/40';

// Marca usuarios inhouse (jefes). Completa con nombres exactos si aplica.
const INHOUSE = new Set([
  'Maria Jesús Rozas',
  'José Ortiz',
  'Pamela Figueroa',
  'Catalina Sandoval'
]);

// Funciones de utilidad
function getColorClasses(turno, esHoy) {
  const base = 'day-cell w-full aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer shadow-sm relative ';
  const hoy = esHoy ? 'ring-2 ring-primary ring-offset-2 shadow-lg shadow-teal-200/50 ' : '';
  
  if (turno === 'AM') return base + hoy + 'bg-accent text-white';
  if (turno === 'PM') return base + hoy + 'bg-secondary text-white';
  if (turno === 'LIBRE') return base + hoy + 'bg-slate-300 text-gray-700';
  if (turno === 'VAC') return base + hoy + 'bg-yellow-300 text-gray-800';
  if (turno === 'FULL') return base + hoy + 'bg-red-400 text-white';
  return base + hoy + 'bg-gray-100 text-gray-400 cursor-default';
}

function getIcono(turno) {
  const iconos = {
    'AM': 'sun',
    'PM': 'moon',
    'LIBRE': 'user-x',
    'VAC': 'umbrella',
    'FULL': 'users',
    'N/A': 'minus'
  };
  return iconos[turno] || 'minus';
}

function getInitials(nombre) {
  return nombre.trim().split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0].toUpperCase())
    .join('')
    .slice(0, 2);
}

function getBadgeClasses(turno) {
  if (turno === 'AM') return 'bg-accent text-white';
  if (turno === 'PM') return 'bg-secondary text-white';
  if (turno === 'LIBRE') return 'bg-slate-300 text-gray-700';
  if (turno === 'VAC') return 'bg-yellow-300 text-gray-800';
  if (turno === 'FULL') return 'bg-red-400 text-white';
  return 'bg-gray-100 text-gray-500';
}

function getDiaSemana(dia) {
  const date = new Date(2026, 1, dia);
  return DIAS[date.getDay()];
}

function getVacationRange(nombreUsuario, diaIndex) {
  const turnos = USUARIOS[nombreUsuario];
  if (!turnos || turnos[diaIndex - 1] !== 'VAC') return null;

  let start = diaIndex;
  let end = diaIndex;

  for (let i = diaIndex - 2; i >= 0; i--) {
    if (turnos[i] !== 'VAC') break;
    start = i + 1;
  }

  for (let i = diaIndex; i < turnos.length; i++) {
    if (turnos[i] !== 'VAC') break;
    end = i + 1;
  }

  return { startDay: start, endDay: end };
}

function getTurnosPorDia(dia) {
  const counts = { 'AM': 0, 'PM': 0, 'FULL': 0, 'LIBRE': 0, 'VAC': 0, 'N/A': 0 };
  const otros = [];
  let turnoUsuario = 'N/A';

  for (const [nombre, turnos] of Object.entries(USUARIOS)) {
    const turno = turnos[dia - 1] || 'N/A';
    if (counts[turno] === undefined) counts[turno] = 0;
    counts[turno] += 1;

    if (nombre === usuarioActual) {
      turnoUsuario = turno;
    } else {
      otros.push({
        nombre,
        turno,
        vacRange: turno === 'VAC' ? getVacationRange(nombre, dia) : null
      });
    }
  }

  return { turnoUsuario, otros, counts };
}

function setFiltroTurnos(valor) {
  filtroTurnos = valor;
  renderDetalleDia();
}

function toggleAccordion() {
  detalleAccordionOpen = !detalleAccordionOpen;
  renderDetalleDia();
}

function toggleOcultarLibres() {
  ocultarLibres = !ocultarLibres;
  renderDetalleDia();
}

function clearSelectedDay() {
  if (detalleDiaEl) {
    detalleDiaEl.classList.remove(...SELECTED_DAY_CLASS.split(' '));
    detalleDiaEl = null;
  }
}

function highlightSelectedDay(el) {
  clearSelectedDay();
  if (el) {
    el.classList.add(...SELECTED_DAY_CLASS.split(' '));
    detalleDiaEl = el;
  }
}

function getUserRowClasses(nombre) {
  const isCurrent = nombre === usuarioActual;
  const isInhouse = INHOUSE.has(nombre);
  const base = 'p-3 rounded-xl border flex items-center gap-3 transition-colors';

  if (isCurrent) {
    return { cls: base + ' bg-yellow-50 border-yellow-200', isCurrent, isInhouse };
  }

  if (isInhouse) {
    return { cls: base + ' bg-slate-50 border-slate-200', isCurrent, isInhouse };
  }

  return { cls: base + ' bg-white border-gray-100', isCurrent, isInhouse };
}

function renderUserBadges(isCurrent, isInhouse) {
  let badges = '';
  if (isCurrent) {
    badges += '<span class="text-[10px] px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-900 font-semibold" aria-label="Tú">Tú</span>';
  }
  if (isInhouse) {
    badges += '<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold" aria-label="Inhouse">Inhouse</span>';
  }
  return badges;
}

function renderDetalleDia() {
  if (!detalleDiaActual) return;
  const { turnoUsuario, otros, counts } = getTurnosPorDia(detalleDiaActual);
  const diaName = getDiaSemana(detalleDiaActual);
  const vacRange = turnoUsuario === 'VAC' ? getVacationRange(usuarioActual, detalleDiaActual) : null;
  const inhouseActual = INHOUSE.has(usuarioActual);

  const resumenLinea = `AM: ${counts.AM} · PM: ${counts.PM} · FULL: ${counts.FULL} · VAC: ${counts.VAC} · LIBRE: ${counts.LIBRE}`;

  const filtros = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Solo LIBRE', value: 'Solo LIBRE' },
    { label: 'Solo AM/PM', value: 'Solo AM/PM' },
    { label: 'Solo VAC', value: 'Solo VAC' }
  ];

  const aplicaFiltro = (turno) => {
    if (filtroTurnos === 'Todos') return true;
    if (filtroTurnos === 'Solo LIBRE') return turno === 'LIBRE';
    if (filtroTurnos === 'Solo AM/PM') return turno === 'AM' || turno === 'PM';
    if (filtroTurnos === 'Solo VAC') return turno === 'VAC';
    return true;
  };

  const otrosFiltrados = otros.filter(u => aplicaFiltro(u.turno)).filter(u => {
    if (filtroTurnos === 'Solo LIBRE') return true;
    if (ocultarLibres && u.turno === 'LIBRE') return false;
    return true;
  });

  const grupos = ORDEN_TURNOS.map(turno => ({
    turno,
    usuarios: otrosFiltrados.filter(u => u.turno === turno)
  })).filter(g => g.usuarios.length > 0);

  let otrosHtml = '';
  if (grupos.length === 0) {
    otrosHtml = '<div class="p-4 text-center text-sm text-gray-500">No hay otros turnos para este día.</div>';
  } else {
    grupos.forEach(grupo => {
      if (grupo.turno === 'LIBRE' && ocultarLibres && filtroTurnos !== 'Solo LIBRE') return;

      otrosHtml += `
        <div class="pt-3">
          <div class="px-4 pb-2 text-xs font-bold uppercase tracking-wide text-gray-500">${grupo.turno} (${grupo.usuarios.length})</div>
          <div class="px-4 space-y-2">
            ${grupo.usuarios.map(u => {
              const row = getUserRowClasses(u.nombre);
              const badges = renderUserBadges(row.isCurrent, row.isInhouse);
              const vacInfo = u.turno === 'VAC' && u.vacRange ? ` <span class="text-xs text-gray-500">(Vacaciones del ${u.vacRange.startDay} al ${u.vacRange.endDay})</span>` : '';

              return `
                <div class="${row.cls}">
                  <div class="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    ${getInitials(u.nombre)}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <div class="font-medium text-sm text-gray-800 truncate">${u.nombre}</div>
                      ${badges}
                    </div>
                    <div class="text-xs text-gray-600 font-medium">${u.turno}${vacInfo}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });
  }

  const content = `
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <div class="text-sm font-semibold text-gray-500">Detalle del día</div>
        <button onclick="cerrarDetalleDia()" class="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors">
          <i data-lucide="x" class="w-5 h-5 text-gray-600"></i>
        </button>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <div class="bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-500">Tu turno</div>
          <div class="flex items-center gap-2">
            ${inhouseActual ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold" aria-label="Inhouse">Inhouse</span>' : ''}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 rounded-2xl text-sm font-bold ${getBadgeClasses(turnoUsuario)}">
            ${turnoUsuario}
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="${getIcono(turnoUsuario)}" class="w-6 h-6 text-gray-700"></i>
            <div class="text-2xl font-extrabold text-gray-800">${turnoUsuario}</div>
          </div>
        </div>
        <div class="mt-2 text-sm text-gray-600 font-medium">Día ${detalleDiaActual} ${diaName}</div>
        ${vacRange ? `<div class="mt-1 text-xs text-gray-500">(Vacaciones del ${vacRange.startDay} al ${vacRange.endDay})</div>` : ''}
      </div>

      <div class="text-xs text-gray-500 space-y-1">
        <div class="font-semibold text-gray-600">Resumen del día</div>
        <div>${resumenLinea}</div>
        <div>Libres hoy: ${counts.LIBRE} · En vacaciones: ${counts.VAC}</div>
      </div>
    </div>

    <div class="border-t border-gray-200">
      <button class="w-full px-4 py-3 flex items-center justify-between" onclick="toggleAccordion()" aria-expanded="${detalleAccordionOpen}">
        <span class="font-semibold text-sm text-gray-800">Otros turnos</span>
        <i data-lucide="chevron-down" class="w-5 h-5 text-gray-500 transition-transform ${detalleAccordionOpen ? 'rotate-180' : ''}"></i>
      </button>
      ${detalleAccordionOpen ? `
        <div class="pb-4">
          <div class="px-4 flex items-center justify-between text-xs text-gray-600 mb-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="rounded border-gray-300" ${ocultarLibres ? 'checked' : ''} onchange="toggleOcultarLibres()">
              <span class="font-semibold">Ocultar libres</span>
            </label>
          </div>
          <div class="px-4 flex flex-wrap gap-2 mb-3">
            ${filtros.map(f => `
              <button onclick="setFiltroTurnos('${f.value}')" class="text-xs px-3 py-1 rounded-full border ${filtroTurnos === f.value ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}">
                ${f.label}
              </button>
            `).join('')}
          </div>
          ${otrosHtml}
        </div>
      ` : ''}
    </div>
  `;

  const container = document.getElementById('dayModalContent');
  container.innerHTML = content;

  lucide.createIcons();
}

function abrirDetalleDia(dia, el) {
  detalleDiaActual = dia;
  highlightSelectedDay(el);
  renderDetalleDia();
  document.getElementById('dayModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function cerrarDetalleDia() {
  document.getElementById('dayModal').classList.add('hidden');
  document.body.style.overflow = '';
  clearSelectedDay();
  detalleDiaActual = null;
  detalleAccordionOpen = false;
  filtroTurnos = 'Todos';
  ocultarLibres = true;
}

// Renderizar calendario
function renderCalendario() {
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  
  const turnos = USUARIOS[usuarioActual];
  if (!turnos) {
    console.error('Usuario no encontrado:', usuarioActual);
    return;
  }
  
  for (let d = 1; d <= 28; d++) {
    const turno = turnos[d - 1];
    const esHoy = d === HOY;
    
    const div = document.createElement('div');
    div.className = getColorClasses(turno, esHoy);
    div.dataset.day = d;
    
    if (turno !== 'N/A') {
      div.onclick = () => modoEdit ? abrirEdit(d) : abrirDetalleDia(d, div);
    }
    
    div.innerHTML = `
      <div class="text-base font-bold mb-0.5">${d}</div>
      <i data-lucide="${getIcono(turno)}" class="w-3.5 h-3.5 opacity-75"></i>
      <div class="text-[9px] font-semibold mt-0.5">${turno}</div>
    `;
    
    grid.appendChild(div);
  }
  
  // Inicializar íconos Lucide
  lucide.createIcons();
}

// Cambiar usuario
function cambiarUsuario() {
  usuarioActual = document.getElementById('userSelect').value;
  renderCalendario();
}

// Toggle modo edición
function toggleEdit() {
  modoEdit = !modoEdit;
  const btn = document.getElementById('editBtn');
  btn.classList.toggle('bg-white/20', modoEdit);
}

// Abrir modal de edición
function abrirEdit(dia) {
  diaEditando = dia;
  const turnoActual = USUARIOS[usuarioActual][dia - 1];
  const diaName = DIAS[new Date(2026, 1, dia).getDay()];
  
  document.getElementById('editTitle').textContent = `Editar Día ${dia} - ${diaName}`;
  document.getElementById('editTurno').value = turnoActual;
  document.getElementById('editModal').classList.remove('hidden');
  
  // Evitar scroll del body
  document.body.style.overflow = 'hidden';
}

// Cerrar modal de edición
function cerrarEdit() {
  document.getElementById('editModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Guardar edición
function guardarEdit() {
  const nuevoTurno = document.getElementById('editTurno').value;
  USUARIOS[usuarioActual][diaEditando - 1] = nuevoTurno;
  renderCalendario();
  cerrarEdit();
  
  // Mostrar notificación de éxito
  mostrarNotificacion('? Turno actualizado correctamente');
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-slide-up';
  notif.textContent = mensaje;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Upload Excel
function uploadExcel() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Procesar datos del Excel
        procesarExcel(data);
        
        mostrarNotificacion(`? Excel cargado: ${workbook.SheetNames.length} hojas procesadas`);
      } catch (err) {
        console.error('Error al procesar Excel:', err);
        mostrarNotificacion('? Error al leer el archivo Excel');
      }
    };
    
    reader.readAsBinaryString(file);
  };
  
  input.click();
}

// Procesar datos del Excel
function procesarExcel(data) {
  console.log('Procesando Excel:', data);
  // Aquí puedes implementar la lógica para parsear el Excel y actualizar USUARIOS
  // Por ahora solo mostramos los datos en consola
}

// Cerrar modal de edición al hacer click fuera
document.addEventListener('click', (e) => {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    cerrarEdit();
  }
});

// Cerrar modal de detalle con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('dayModal');
    if (!modal.classList.contains('hidden')) {
      cerrarDetalleDia();
    }
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderCalendario();
  lucide.createIcons();
});
