<template>
  <div class="min-h-screen bg-slate-950 text-slate-100" style="font-family: 'Inter', system-ui, sans-serif;">

    <!-- Toast de Notificaciones -->
    <Transition name="toast">
      <div v-if="toast.visible" :class="[
        'fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border',
        toast.tipo === 'ok' ? 'bg-emerald-950 border-emerald-700 text-emerald-200' : 'bg-red-950 border-red-700 text-red-200'
      ]">
        <span>{{ toast.tipo === 'ok' ? '✅' : '❌' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Modal confirmar eliminación -->
    <Transition name="modal">
      <div v-if="modal.visible" class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-7 max-w-sm w-full mx-4">
          <div class="text-4xl text-center mb-3">⚠️</div>
          <h3 class="text-lg font-bold text-center text-white mb-2">{{ modal.titulo }}</h3>
          <p class="text-slate-400 text-sm text-center mb-6">{{ modal.msg }}</p>
          <div class="flex gap-3">
            <button @click="modal.visible = false" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors">Cancelar</button>
            <button @click="confirmarModal" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Inscribir Socio a Clase -->
    <Transition name="modal">
      <div v-if="modalInscripcion.visible" class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-7 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-white mb-2">🏋️ Inscribir Socio a Clase</h3>
          <p class="text-slate-400 text-sm mb-6">Selecciona el socio que asistirá a esta clase. Se validará su membresía automáticamente.</p>
          
          <select v-model="modalInscripcion.socioId" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-6 text-sm">
            <option value="" disabled>-- Selecciona un socio --</option>
            <option v-for="s in socios" :key="s.id" :value="s.id">
              {{ s.nombre }} {{ s.apellido }} (RUT: {{ s.rut }})
            </option>
          </select>

          <div class="flex gap-3">
            <button @click="modalInscripcion.visible = false" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors">Cancelar</button>
            <button @click="procesarInscripcion" :disabled="!modalInscripcion.socioId || cargando" class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-2 rounded-lg font-semibold transition-colors">
              {{ cargando ? 'Validando...' : 'Confirmar Ingreso' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header -->
    <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-lg font-black">G</div>
        <div>
          <p class="text-xs text-slate-500 leading-none">Sistema de Gestión</p>
          <h1 class="text-base font-black tracking-tight text-white leading-tight">GymOS</h1>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-slate-500 hidden sm:block">{{ usuarioActual }}</span>
        <button @click="$emit('logout')" class="flex items-center gap-2 bg-slate-800 hover:bg-red-950 border border-slate-700 hover:border-red-800 text-slate-300 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Cerrar sesión
        </button>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 py-8">

      <!-- Tabs -->
      <nav class="flex gap-1.5 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-fit overflow-x-auto">
        <button v-for="tab in tabs" :key="tab.id"
          @click="tabActual = tab.id"
          :class="tabActual === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
          class="px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap">
          {{ tab.icono }} {{ tab.label }}
        </button>
      </nav>

      <!-- ===== DASHBOARD ===== -->
      <section v-if="tabActual === 'dashboard'" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="kpi in kpis" :key="kpi.label" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2 hover:border-slate-600 transition-colors">
            <span class="text-xl">{{ kpi.icono }}</span>
            <p class="text-3xl font-black" :class="kpi.color">{{ kpi.valor }}</p>
            <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">{{ kpi.label }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 class="font-bold text-white mb-5 text-sm uppercase tracking-wider">Últimos registros</h3>
            <ul class="divide-y divide-slate-800">
              <li v-for="socio in ultimosSocios" :key="socio.id" class="py-3 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center text-xs font-black text-indigo-300">
                    {{ socio.nombre[0] }}{{ socio.apellido[0] }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-100 text-sm">{{ socio.nombre }} {{ socio.apellido }}</p>
                    <p class="text-xs text-slate-500 font-mono">{{ socio.rut }}</p>
                  </div>
                </div>
              </li>
              <li v-if="ultimosSocios.length === 0" class="py-10 text-center text-slate-600 text-sm">Sin socios registrados aún.</li>
            </ul>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 class="font-bold text-white mb-5 text-sm uppercase tracking-wider">Clases Disponibles</h3>
            <ul class="divide-y divide-slate-800">
              <li v-for="clase in clases" :key="clase.id" class="py-3 flex justify-between items-center">
                <div>
                  <p class="font-semibold text-slate-100 text-sm">{{ clase.nombre }}</p>
                  <p class="text-xs text-slate-500">Instructor: {{ clase.instructor }}</p>
                </div>
                <span class="bg-slate-800 text-indigo-400 font-bold px-3 py-1 rounded-full text-xs border border-slate-700">
                  {{ clase.cupos }} cupos
                </span>
              </li>
              <li v-if="clases.length === 0" class="py-10 text-center text-slate-600 text-sm">No hay clases programadas.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ===== SOCIOS ===== -->
      <section v-if="tabActual === 'socios'" class="space-y-5">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="font-bold text-white mb-4 text-sm">{{ socioEditandoId ? '✏️ Actualizar socio' : '➕ Agregar socio' }}</h3>
          <form @submit.prevent="socioEditandoId ? actualizarSocio() : crearSocio()" class="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div class="flex flex-col gap-1">
              <input v-model="formularioSocio.rut" @blur="validarRut" placeholder="RUT (ej: 12.345.678-9)"
                :class="errorRut ? 'border-red-600 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'"
                class="bg-slate-800 border text-slate-100 p-2.5 rounded-lg focus:ring-2 outline-none placeholder-slate-600 text-sm" required>
              <span v-if="errorRut" class="text-red-400 text-xs">{{ errorRut }}</span>
            </div>
            <input v-model="formularioSocio.nombre" placeholder="Nombre" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioSocio.apellido" placeholder="Apellido" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioSocio.email" type="email" placeholder="Email" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioSocio.fechaVencimiento" type="date" title="Fecha Vencimiento" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" required>
            <div class="flex gap-2">
              <button type="submit" :disabled="cargando || !!errorRut" class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                {{ cargando ? '...' : (socioEditandoId ? 'Actualizar' : 'Guardar') }}
              </button>
              <button v-if="socioEditandoId" @click="cancelarEdicionSocio" type="button" class="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg font-bold transition-colors">✕</button>
            </div>
          </form>
        </div>

        <div class="relative">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input v-model="busqueda" placeholder="Buscar por nombre, apellido o RUT..." class="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm">
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th class="py-3 px-5 text-left">RUT</th>
                <th class="py-3 px-5 text-left">Nombre</th>
                <th class="py-3 px-5 text-left">Vencimiento</th>
                <th class="py-3 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="socio in sociosFiltrados" :key="socio.id" class="hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-5 text-slate-400 font-mono text-xs">{{ socio.rut }}</td>
                <td class="py-3 px-5 font-semibold text-slate-100">{{ socio.nombre }} {{ socio.apellido }}</td>
                <td class="py-3 px-5 text-slate-400">{{ socio.fechaVencimiento || 'Sin pago' }}</td>
                <td class="py-3 px-5 text-center space-x-2">
                  <button @click="cargarDatosSocio(socio)" class="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-900 transition-colors border border-indigo-800">Editar</button>
                  <button @click="pedirConfirmacion('socio', socio.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===== MEMBRESÍAS ===== -->
      <section v-if="tabActual === 'membresias'" class="space-y-5">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="font-bold text-white mb-4 text-sm">{{ membresiaEditandoId ? '✏️ Actualizar membresía' : '➕ Agregar membresía' }}</h3>
          <form @submit.prevent="membresiaEditandoId ? actualizarMembresia() : crearMembresia()" class="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            <!-- Ahora es un Select con planes predefinidos -->
            <select v-model="formularioMembresia.tipo" @change="autoCompletarMembresia" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required>
              <option value="" disabled>Elige el tipo de plan...</option>
              <option v-for="plan in opcionesPlanes" :key="plan.tipo" :value="plan.tipo">{{ plan.tipo }}</option>
            </select>

            <!-- Inputs en modo solo lectura para que no los rompan -->
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
              <input v-model="formularioMembresia.precio" type="number" placeholder="Precio" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-bold pl-8 pr-2.5 py-2.5 rounded-lg outline-none cursor-not-allowed text-sm" readonly required>
            </div>

            <div class="relative">
              <input v-model="formularioMembresia.duracionDias" type="number" placeholder="Duración" class="w-full bg-slate-900 border border-slate-700 text-slate-400 pl-3 pr-12 py-2.5 rounded-lg outline-none cursor-not-allowed text-sm" readonly required>
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">DÍAS</span>
            </div>

            <div class="flex gap-2">
              <button type="submit" :disabled="cargando || !formularioMembresia.tipo" class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                {{ cargando ? '...' : (membresiaEditandoId ? 'Actualizar' : 'Guardar') }}
              </button>
              <button v-if="membresiaEditandoId" @click="cancelarEdicionMembresia" type="button" class="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg font-bold transition-colors">✕</button>
            </div>
          </form>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th class="py-3 px-5 text-left">ID</th>
                <th class="py-3 px-5 text-left">Tipo de Plan</th>
                <th class="py-3 px-5 text-left">Precio</th>
                <th class="py-3 px-5 text-left">Duración</th>
                <th class="py-3 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="m in membresias" :key="m.id" class="hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-5 text-slate-600 font-mono text-xs">#{{ m.id }}</td>
                <td class="py-3 px-5 font-semibold text-slate-100">{{ m.tipo }}</td>
                <td class="py-3 px-5 font-black text-emerald-400">${{ m.precio.toLocaleString('es-CL') }}</td>
                <td class="py-3 px-5 text-slate-400">{{ m.duracionDias }} días</td>
                <td class="py-3 px-5 text-center space-x-2">
                  <button @click="cargarDatosMembresia(m)" class="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-900 transition-colors border border-indigo-800">Editar</button>
                  <button @click="pedirConfirmacion('membresia', m.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===== CLASES ===== -->
      <section v-if="tabActual === 'clases'" class="space-y-5">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="font-bold text-white mb-4 text-sm">➕ Programar nueva clase</h3>
          <form @submit.prevent="crearClase()" class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input v-model="formularioClase.nombre" placeholder="Clase (ej: Spinning)" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none placeholder-slate-600 text-sm" required>
            
            <!-- Horario va primero ahora -->
            <input v-model="formularioClase.horario" type="time" title="Horario de inicio" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" required>

            <!-- Instructor predefinido -->
            <select v-model="formularioClase.instructor" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" required>
              <option value="" disabled>Selecciona instructor...</option>
              <option v-for="inst in opcionesInstructores" :key="inst" :value="inst">{{ inst }}</option>
            </select>

            <input v-model="formularioClase.cupos" type="number" min="1" placeholder="Cupos (ej: 15)" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none placeholder-slate-600 text-sm" required>
            <button type="submit" :disabled="cargando" class="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
              {{ cargando ? '...' : 'Guardar Clase' }}
            </button>
          </form>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th class="py-3 px-5 text-left">Clase</th>
                <th class="py-3 px-5 text-left">Horario</th>
                <th class="py-3 px-5 text-left">Instructor</th>
                <th class="py-3 px-5 text-left">Cupos Disp.</th>
                <th class="py-3 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="c in clases" :key="c.id" class="hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-5 font-semibold text-slate-100">{{ c.nombre }}</td>
                <td class="py-3 px-5 text-slate-400">{{ c.horario }}</td>
                <td class="py-3 px-5 text-slate-400">{{ c.instructor }}</td>
                <td class="py-3 px-5 font-black text-amber-400">{{ c.cupos }}</td>
                <td class="py-3 px-5 text-center space-x-2">
                  <button @click="abrirModalInscripcion(c.id)" class="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors border border-emerald-800">
                    ➕ Inscribir
                  </button>
                  <button @click="pedirConfirmacion('clase', c.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
                </td>
              </tr>
              <tr v-if="clases.length === 0">
                <td colspan="5" class="py-12 text-center text-slate-600">Aún no hay clases programadas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({ token: String });
const emit = defineEmits(['logout']);

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const tabActual = ref('dashboard');
const cargando = ref(false);
const busqueda = ref('');
const errorRut = ref('');

const usuarioActual = computed(() => {
  try {
    const payload = JSON.parse(atob(props.token.split('.')[1]));
    return payload.nombre || payload.email || '';
  } catch { return ''; }
});

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icono: '📊' },
  { id: 'socios', label: 'Socios', icono: '👥' },
  { id: 'membresias', label: 'Membresías', icono: '🏷️' },
  { id: 'clases', label: 'Clases', icono: '🏋️' },
];

const toast = ref({ visible: false, msg: '', tipo: 'ok' });
let toastTimer = null;
const mostrarToast = (msg, tipo = 'ok') => {
  clearTimeout(toastTimer);
  toast.value = { visible: true, msg, tipo };
  toastTimer = setTimeout(() => { toast.value.visible = false; }, 4000);
};

const modal = ref({ visible: false, titulo: '', msg: '', accion: null });
const pedirConfirmacion = (tipo, id) => {
  modal.value = {
    visible: true,
    titulo: `Eliminar ${tipo}`,
    msg: 'Esta acción no se puede deshacer.',
    accion: () => {
      if(tipo === 'socio') eliminarSocio(id);
      if(tipo === 'membresia') eliminarMembresia(id);
      if(tipo === 'clase') eliminarClase(id);
    },
  };
};
const confirmarModal = () => { modal.value.accion?.(); modal.value.visible = false; };

const api = async (path, opts = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`,
      ...opts.headers,
    },
  });
  if (res.status === 401) { emit('logout'); return null; }
  return res;
};

const validarRut = () => {
  const rut = formularioSocio.value.rut.trim();
  if (!rut) { errorRut.value = ''; return; }
  const limpio = rut.replace(/\./g, '').replace(/-/g, '');
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();
  if (!/^\d+$/.test(cuerpo)) { errorRut.value = 'Formato inválido (ej: 12.345.678-9)'; return; }
  let suma = 0, mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * mult;
    mult = mult < 7 ? mult + 1 : 2;
  }
  const dvEsp = 11 - (suma % 11);
  const dvCalc = dvEsp === 11 ? '0' : dvEsp === 10 ? 'K' : String(dvEsp);
  errorRut.value = dv === dvCalc ? '' : 'RUT inválido';
};

// ================= DATOS PREDEFINIDOS (INVENTOS PRO) =================
const opcionesPlanes = [
  { tipo: 'Plan Básico (1 Mes)', precio: 25000, duracionDias: 30 },
  { tipo: 'Plan Pumper (3 Meses)', precio: 65000, duracionDias: 90 },
  { tipo: 'Plan Espartano (6 Meses)', precio: 120000, duracionDias: 180 },
  { tipo: 'Plan Bestia (1 Año)', precio: 200000, duracionDias: 365 }
];

const opcionesInstructores = [
  'Juan "La Roca" Pérez',
  'María "Espartana" Gómez',
  'Pedro "Ironman" Silva',
  'Camila "Destructora" Rojas',
  'Ronnie "Yeah Buddy" C.'
];

// Función mágica que auto-llena el formulario de membresía
const autoCompletarMembresia = () => {
  const planElegido = opcionesPlanes.find(p => p.tipo === formularioMembresia.value.tipo);
  if (planElegido) {
    formularioMembresia.value.precio = planElegido.precio;
    formularioMembresia.value.duracionDias = planElegido.duracionDias;
  }
};

// ================= ESTADOS Y LÓGICA =================
const socios = ref([]);
const membresias = ref([]);
const clases = ref([]);

const socioEditandoId = ref(null);
const formularioSocio = ref({ rut: '', nombre: '', apellido: '', email: '', fechaVencimiento: '' });

const membresiaEditandoId = ref(null);
const formularioMembresia = ref({ tipo: '', precio: '', duracionDias: '' });

const formularioClase = ref({ nombre: '', instructor: '', horario: '', cupos: '' });
const modalInscripcion = ref({ visible: false, claseId: null, socioId: '' });

// Computados Dashboard
const sociosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase();
  if (!q) return socios.value;
  return socios.value.filter(s => s.nombre.toLowerCase().includes(q) || s.apellido.toLowerCase().includes(q) || s.rut.toLowerCase().includes(q));
});
const ultimosSocios = computed(() => [...socios.value].slice(-5).reverse());
const kpis = computed(() => [
  { icono: '👥', label: 'Total socios', valor: socios.value.length, color: 'text-blue-400' },
  { icono: '🏷️', label: 'Planes creados', valor: membresias.value.length, color: 'text-emerald-400' },
  { icono: '🏋️', label: 'Clases Activas', valor: clases.value.length, color: 'text-amber-400' },
  { icono: '🏆', label: 'Cupos Totales', valor: clases.value.reduce((a, c) => a + c.cupos, 0), color: 'text-indigo-400' },
]);

// SOCIOS
const obtenerSocios = async () => {
  const res = await api('/socios');
  if (res?.ok) socios.value = await res.json();
};
const crearSocio = async () => {
  if (errorRut.value) return;
  cargando.value = true;
  const res = await api('/socios', { method: 'POST', body: JSON.stringify(formularioSocio.value) });
  if (res?.ok) { cancelarEdicionSocio(); obtenerSocios(); mostrarToast('Socio creado.'); }
  else mostrarToast('No se pudo crear. Revisa RUT/Email repetidos.', 'err');
  cargando.value = false;
};
const cargarDatosSocio = (socio) => { socioEditandoId.value = socio.id; formularioSocio.value = { ...socio }; errorRut.value = ''; tabActual.value = 'socios'; };
const cancelarEdicionSocio = () => { socioEditandoId.value = null; formularioSocio.value = { rut: '', nombre: '', apellido: '', email: '', fechaVencimiento: '' }; errorRut.value = ''; };
const actualizarSocio = async () => {
  if (errorRut.value) return;
  cargando.value = true;
  const res = await api(`/socios/${socioEditandoId.value}`, { method: 'PUT', body: JSON.stringify(formularioSocio.value) });
  if (res?.ok) { cancelarEdicionSocio(); obtenerSocios(); mostrarToast('Socio actualizado.'); }
  else mostrarToast('Error al actualizar.', 'err');
  cargando.value = false;
};
const eliminarSocio = async (id) => {
  const res = await api(`/socios/${id}`, { method: 'DELETE' });
  if (res?.ok) { obtenerSocios(); mostrarToast('Socio eliminado.'); }
  else mostrarToast('Error al eliminar.', 'err');
};

// MEMBRESÍAS
const obtenerMembresias = async () => {
  const res = await api('/membresias');
  if (res?.ok) membresias.value = await res.json();
};
const crearMembresia = async () => {
  cargando.value = true;
  const body = { tipo: formularioMembresia.value.tipo, precio: Number(formularioMembresia.value.precio), duracionDias: Number(formularioMembresia.value.duracionDias) };
  const res = await api('/membresias', { method: 'POST', body: JSON.stringify(body) });
  if (res?.ok) { cancelarEdicionMembresia(); obtenerMembresias(); mostrarToast('Membresía creada.'); }
  else mostrarToast('Error al crear membresía.', 'err');
  cargando.value = false;
};
const cargarDatosMembresia = (m) => { membresiaEditandoId.value = m.id; formularioMembresia.value = { ...m }; tabActual.value = 'membresias'; };
const cancelarEdicionMembresia = () => { membresiaEditandoId.value = null; formularioMembresia.value = { tipo: '', precio: '', duracionDias: '' }; };
const actualizarMembresia = async () => {
  cargando.value = true;
  const body = { tipo: formularioMembresia.value.tipo, precio: Number(formularioMembresia.value.precio), duracionDias: Number(formularioMembresia.value.duracionDias) };
  const res = await api(`/membresias/${membresiaEditandoId.value}`, { method: 'PUT', body: JSON.stringify(body) });
  if (res?.ok) { cancelarEdicionMembresia(); obtenerMembresias(); mostrarToast('Membresía actualizada.'); }
  else mostrarToast('Error al actualizar.', 'err');
  cargando.value = false;
};
const eliminarMembresia = async (id) => {
  const res = await api(`/membresias/${id}`, { method: 'DELETE' });
  if (res?.ok) { obtenerMembresias(); mostrarToast('Membresía eliminada.'); }
  else mostrarToast('Error al eliminar.', 'err');
};

// CLASES E INSCRIPCIONES
const obtenerClases = async () => {
  const res = await api('/clases');
  if (res?.ok) clases.value = await res.json();
};
const crearClase = async () => {
  cargando.value = true;
  const body = { ...formularioClase.value, cupos: Number(formularioClase.value.cupos) };
  const res = await api('/clases', { method: 'POST', body: JSON.stringify(body) });
  if (res?.ok) { 
    formularioClase.value = { nombre: '', instructor: '', horario: '', cupos: '' };
    obtenerClases(); 
    mostrarToast('Clase programada con éxito.'); 
  } else {
    mostrarToast('Error al crear la clase.', 'err');
  }
  cargando.value = false;
};
const eliminarClase = async (id) => {
  const res = await api(`/clases/${id}`, { method: 'DELETE' });
  if (res?.ok) { obtenerClases(); mostrarToast('Clase eliminada.'); }
  else mostrarToast('Error al eliminar clase.', 'err');
};

const abrirModalInscripcion = (claseId) => {
  modalInscripcion.value = { visible: true, claseId, socioId: '' };
};

const procesarInscripcion = async () => {
  cargando.value = true;
  try {
    const res = await api('/inscripciones', {
      method: 'POST',
      body: JSON.stringify({ claseId: modalInscripcion.value.claseId, socioId: modalInscripcion.value.socioId })
    });

    if (res?.ok) {
      mostrarToast('Inscripción exitosa. Cupo descontado.', 'ok');
      modalInscripcion.value.visible = false;
      obtenerClases(); // Refrescar los cupos
    } else if (res) {
      const data = await res.json();
      mostrarToast(data.message || 'Error al inscribir.', 'err');
    }
  } catch (error) {
    mostrarToast('Error de conexión al servidor', 'err');
  }
  cargando.value = false;
};

onMounted(() => { obtenerSocios(); obtenerMembresias(); obtenerClases(); });
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(1rem); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>