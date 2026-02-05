// Estado de la aplicación
let usuarioActual = 'Renato  Fuentes';
let modoEdit = false;
let diaEditando = null;
let detalleDiaActual = null;
let detalleDiaEl = null;
let detalleAccordionOpen = false;
let filtroTurnos = 'Todos';

const ORDEN_TURNOS = ['AM', 'PM', 'FULL', 'LIBRE', 'VAC', 'N/A'];
const SELECTED_DAY_CLASS = 'ring-2 ring-offset-2 ring-primary shadow-lg shadow-teal-200/40';

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

// Mostrar coincidencias
function mostrarCoincidencias(dia) {
  const turnoUsuario = USUARIOS[usuarioActual][dia - 1];
  
  if (turnoUsuario === 'N/A') return;
  
  const diaName = DIAS[new Date(2026, 1, dia).getDay()];
  
  document.getElementById('sidebarTitle').textContent = `Día ${dia} ${diaName} - ${turnoUsuario}`;
  
  // Buscar coincidencias
  const mismosTurno = [];
  for (const [nombre, turnos] of Object.entries(USUARIOS)) {
    if (nombre === usuarioActual || turnos[dia - 1] === 'N/A') continue;
    if (turnos[dia - 1] === turnoUsuario) {
      mismosTurno.push(nombre);
    }
  }
  
  let html = '';
  
  // Usuario actual (destacado)
  html += `
    <div class="p-3 border-b border-gray-100 bg-yellow-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
          ${getInitials(usuarioActual)}
        </div>
        <div class="flex-1">
          <div class="font-semibold text-sm text-gray-800">${usuarioActual}</div>
          <div class="text-xs text-gray-600 font-medium">${turnoUsuario} <span class="text-primary">(Tú)</span></div>
        </div>
        <i data-lucide="star" class="w-4 h-4 text-yellow-500 fill-yellow-500"></i>
      </div>
    </div>
  `;
  
  // Coincidencias
  if (mismosTurno.length > 0) {
    mismosTurno.forEach(nombre => {
      html += `
        <div class="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              ${getInitials(nombre)}
            </div>
            <div class="flex-1">
              <div class="font-medium text-sm text-gray-800">${nombre}</div>
              <div class="text-xs text-gray-600">${turnoUsuario}</div>
            </div>
            <i data-lucide="check-circle" class="w-4 h-4 text-success"></i>
          </div>
        </div>
      `;
    });
  } else {
    html += `
      <div class="p-6 text-center">
        <i data-lucide="users-round" class="w-12 h-12 text-gray-300 mx-auto mb-2"></i>
        <p class="text-sm text-gray-500 font-medium">No hay otros compañeros en este turno</p>
      </div>
    `;
  }
  
  document.getElementById('sidebarContent').innerHTML = html;
  document.getElementById('sidebar').classList.remove('hidden');
  
  // Inicializar íconos Lucide
  lucide.createIcons();
  
  // Scroll suave al sidebar
  setTimeout(() => {
    document.getElementById('sidebar').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function getFiltroButtonClass(valor) {
  return valor === filtroTurnos
    ? 'bg-primary text-white'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
}

function renderDetalleDia() {
  if (!detalleDiaActual) return;

  const { turnoUsuario, otros, counts } = getTurnosPorDia(detalleDiaActual);
  const diaName = getDiaSemana(detalleDiaActual);
  const vacRange = turnoUsuario === 'VAC' ? getVacationRange(usuarioActual, detalleDiaActual) : null;
  const vacText = vacRange ? ` (Vacaciones del ${vacRange.startDay} al ${vacRange.endDay})` : '';

  let otrosFiltrados = otros;
  if (filtroTurnos === 'Solo LIBRE') {
    otrosFiltrados = otros.filter(u => u.turno === 'LIBRE');
  } else if (filtroTurnos === 'Solo AM/PM') {
    otrosFiltrados = otros.filter(u => u.turno === 'AM' || u.turno === 'PM');
  } else if (filtroTurnos === 'Solo VAC') {
    otrosFiltrados = otros.filter(u => u.turno === 'VAC');
  }

  let otrosHtml = '';
  const grupos = {};
  ORDEN_TURNOS.forEach(turno => { grupos[turno] = []; });
  otrosFiltrados.forEach(u => {
    if (!grupos[u.turno]) grupos[u.turno] = [];
    grupos[u.turno].push(u);
  });

  const hayOtros = otrosFiltrados.length > 0;

  if (hayOtros) {
    ORDEN_TURNOS.forEach(turno => {
      const lista = grupos[turno];
      if (!lista || lista.length === 0) return;

      otrosHtml += `
        <div class="pt-3">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">${turno} (${lista.length})</div>
          <div class="space-y-2">
            ${lista.map(u => {
              const vacInfo = u.turno === 'VAC' && u.vacRange
                ? `VAC (Vacaciones del ${u.vacRange.startDay} al ${u.vacRange.endDay})`
                : u.turno;
              return `
                <div class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    ${getInitials(u.nombre)}
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-gray-800">${u.nombre}</div>
                    <div class="text-xs text-gray-600 font-medium">${vacInfo}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });
  }

  if (!hayOtros) {
    otrosHtml = `
      <div class="py-6 text-center text-sm text-gray-500 font-medium">
        No hay otros turnos para este día.
      </div>
    `;
  }

  const content = `
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-bold text-lg text-gray-800">Día ${detalleDiaActual} ${diaName}</h3>
          <div class="mt-1 text-sm font-semibold text-gray-700">
            Turno de ${usuarioActual}: ${turnoUsuario}${vacText}
          </div>
        </div>
        <button onclick="cerrarDetalleDia()" class="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors">
          <i data-lucide="x" class="w-5 h-5 text-gray-600"></i>
        </button>
      </div>
      <div class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${getBadgeClasses(turnoUsuario)}">
        ${turnoUsuario}
      </div>
      <div class="mt-3 text-xs text-gray-600 space-y-1">
        <div>Total libres hoy: <span class="font-semibold text-gray-800">${counts.LIBRE}</span></div>
        <div>Total en vacaciones: <span class="font-semibold text-gray-800">${counts.VAC}</span></div>
        <div>Total AM: <span class="font-semibold text-gray-800">${counts.AM}</span> · PM: <span class="font-semibold text-gray-800">${counts.PM}</span> · FULL: <span class="font-semibold text-gray-800">${counts.FULL}</span></div>
      </div>
    </div>
    <div class="p-4">
      <button onclick="toggleAccordion()" class="w-full flex items-center justify-between gap-3 py-3 border-b border-gray-200 text-left font-semibold text-gray-800" aria-expanded="${detalleAccordionOpen}">
        <span>Otros turnos</span>
        <i data-lucide="chevron-down" class="w-5 h-5 text-gray-500 transition-transform ${detalleAccordionOpen ? 'rotate-180' : ''}"></i>
      </button>
      <div class="transition-all duration-200 ${detalleAccordionOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden">
        <div class="pt-3">
          <div class="flex flex-wrap gap-2 mb-3">
            <button onclick="setFiltroTurnos('Todos')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${getFiltroButtonClass('Todos')}">Todos</button>
            <button onclick="setFiltroTurnos('Solo LIBRE')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${getFiltroButtonClass('Solo LIBRE')}">Solo LIBRE</button>
            <button onclick="setFiltroTurnos('Solo AM/PM')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${getFiltroButtonClass('Solo AM/PM')}">Solo AM/PM</button>
            <button onclick="setFiltroTurnos('Solo VAC')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${getFiltroButtonClass('Solo VAC')}">Solo VAC</button>
          </div>
          ${otrosHtml}
        </div>
      </div>
    </div>
  `;

  document.getElementById('dayModalContent').innerHTML = content;
  lucide.createIcons();
}

function abrirDetalleDia(dia, el) {
  detalleDiaActual = dia;
  highlightSelectedDay(el || document.querySelector(`[data-day="${dia}"]`));

  document.getElementById('sidebar').classList.add('hidden');
  renderDetalleDia();
  document.getElementById('dayModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function cerrarDetalleDia() {
  document.getElementById('dayModal').classList.add('hidden');
  document.getElementById('dayModalContent').innerHTML = '';
  document.body.style.overflow = '';
  detalleDiaActual = null;
  clearSelectedDay();
}

// Cambiar usuario
function cambiarUsuario() {
  usuarioActual = document.getElementById('userSelect').value;
  document.getElementById('sidebar').classList.add('hidden');
  if (!document.getElementById('dayModal').classList.contains('hidden')) {
    cerrarDetalleDia();
  }
  renderCalendario();
}

// Toggle modo edición
function toggleEdit() {
  modoEdit = !modoEdit;
  const btn = document.getElementById('editBtn');
  btn.classList.toggle('bg-white/20', modoEdit);
  
  // Ocultar sidebar si está abierto
  if (modoEdit) {
    document.getElementById('sidebar').classList.add('hidden');
    if (!document.getElementById('dayModal').classList.contains('hidden')) {
      cerrarDetalleDia();
    }
  }
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
  mostrarNotificacion('✅ Turno actualizado correctamente');
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
        
        mostrarNotificacion(`✅ Excel cargado: ${workbook.SheetNames.length} hojas procesadas`);
      } catch (err) {
        console.error('Error al procesar Excel:', err);
        mostrarNotificacion('❌ Error al leer el archivo Excel');
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

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    cerrarEdit();
  }
});

// Cerrar modal detalle con Escape
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const dayModal = document.getElementById('dayModal');
  if (!dayModal.classList.contains('hidden')) {
    cerrarDetalleDia();
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderCalendario();
  lucide.createIcons();
});

