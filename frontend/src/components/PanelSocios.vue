<template>
  <div class="min-h-screen bg-slate-950 text-slate-100" style="font-family: 'Inter', system-ui, sans-serif;">

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.visible" :class="[
        'fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border',
        toast.tipo === 'ok'
          ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
          : 'bg-red-950 border-red-700 text-red-200'
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
      <nav class="flex gap-1.5 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button v-for="tab in tabs" :key="tab.id"
          @click="tabActual = tab.id"
          :class="tabActual === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
          class="px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
          {{ tab.icono }} {{ tab.label }}
        </button>
      </nav>

      <!-- ===== DASHBOARD ===== -->
      <section v-if="tabActual === 'dashboard'" class="space-y-6">

        <!-- KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="kpi in kpis" :key="kpi.label"
            class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2 hover:border-slate-600 transition-colors">
            <span class="text-xl">{{ kpi.icono }}</span>
            <p class="text-3xl font-black" :class="kpi.color">{{ kpi.valor }}</p>
            <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">{{ kpi.label }}</p>
          </div>
        </div>

        <!-- Gráfico de barras de membresías + últimos socios -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Gráfico membresías por precio -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 class="font-bold text-white mb-5 text-sm uppercase tracking-wider">Planes por precio</h3>
            <div v-if="membresias.length === 0" class="py-10 text-center text-slate-600 text-sm">Sin planes creados.</div>
            <div v-else class="space-y-3">
              <div v-for="plan in membresiasPorPrecio" :key="plan.id" class="flex items-center gap-3">
                <span class="text-xs text-slate-400 w-28 truncate shrink-0">{{ plan.tipo }}</span>
                <div class="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div class="h-full rounded-full bg-indigo-500 transition-all duration-700"
                    :style="{ width: plan.porcentaje + '%' }"></div>
                </div>
                <span class="text-xs font-black text-emerald-400 w-20 text-right shrink-0">${{ plan.precio.toLocaleString('es-CL') }}</span>
              </div>
            </div>
          </div>

          <!-- Últimos socios -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-white text-sm uppercase tracking-wider">Últimos registros</h3>
              <button @click="tabActual = 'socios'" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Ver todos →</button>
            </div>
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
                <span :class="socio.estado ? 'bg-emerald-900/60 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'"
                  class="text-xs font-bold px-2 py-1 rounded-full border">
                  {{ socio.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </li>
              <li v-if="ultimosSocios.length === 0" class="py-10 text-center text-slate-600 text-sm">Sin socios registrados aún.</li>
            </ul>
          </div>
        </div>

        <!-- Plan más caro + plan más barato -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="membresias.length > 0">
          <div class="bg-slate-900 border border-emerald-900 rounded-2xl p-5 flex items-center gap-4">
            <span class="text-3xl">🏆</span>
            <div>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-bold">Plan premium</p>
              <p class="font-black text-white text-lg">{{ planMasCaro.tipo }}</p>
              <p class="text-emerald-400 font-black text-2xl">${{ planMasCaro.precio.toLocaleString('es-CL') }}</p>
            </div>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <span class="text-3xl">💡</span>
            <div>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-bold">Plan accesible</p>
              <p class="font-black text-white text-lg">{{ planMasBarato.tipo }}</p>
              <p class="text-blue-400 font-black text-2xl">${{ planMasBarato.precio.toLocaleString('es-CL') }}</p>
            </div>
          </div>
        </div>

      </section>

      <!-- ===== SOCIOS ===== -->
      <section v-if="tabActual === 'socios'" class="space-y-5">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="font-bold text-white mb-4 text-sm">{{ socioEditandoId ? '✏️ Actualizar socio' : '➕ Agregar socio' }}</h3>
          <form @submit.prevent="socioEditandoId ? actualizarSocio() : crearSocio()" class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div class="flex flex-col gap-1">
              <input v-model="formularioSocio.rut" @blur="validarRut" placeholder="RUT (ej: 12.345.678-9)"
                :class="errorRut ? 'border-red-600 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'"
                class="bg-slate-800 border text-slate-100 p-2.5 rounded-lg focus:ring-2 outline-none placeholder-slate-600 text-sm" required>
              <span v-if="errorRut" class="text-red-400 text-xs">{{ errorRut }}</span>
            </div>
            <input v-model="formularioSocio.nombre" placeholder="Nombre"
              class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioSocio.apellido" placeholder="Apellido"
              class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioSocio.email" type="email" placeholder="Email"
              class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
            <div class="flex gap-2">
              <button type="submit" :disabled="cargando || !!errorRut"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                {{ cargando ? '...' : (socioEditandoId ? 'Actualizar' : 'Guardar') }}
              </button>
              <button v-if="socioEditandoId" @click="cancelarEdicionSocio" type="button"
                class="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg font-bold transition-colors">✕</button>
            </div>
          </form>
        </div>

        <!-- Buscador -->
        <div class="relative">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input v-model="busqueda" placeholder="Buscar por nombre, apellido o RUT..."
            class="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm">
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th class="py-3 px-5 text-left">RUT</th>
                <th class="py-3 px-5 text-left">Nombre</th>
                <th class="py-3 px-5 text-left">Email</th>
                <th class="py-3 px-5 text-left">Estado</th>
                <th class="py-3 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="socio in sociosFiltrados" :key="socio.id" class="hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-5 text-slate-400 font-mono text-xs">{{ socio.rut }}</td>
                <td class="py-3 px-5 font-semibold text-slate-100">{{ socio.nombre }} {{ socio.apellido }}</td>
                <td class="py-3 px-5 text-slate-400">{{ socio.email }}</td>
                <td class="py-3 px-5">
                  <span :class="socio.estado ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-500 border-slate-700'"
                    class="text-xs font-bold px-2 py-1 rounded-full border">
                    {{ socio.estado ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="py-3 px-5 text-center space-x-2">
                  <button @click="cargarDatosSocio(socio)" class="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-900 transition-colors border border-indigo-800">Editar</button>
                  <button @click="pedirConfirmacion('socio', socio.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
                </td>
              </tr>
              <tr v-if="sociosFiltrados.length === 0">
                <td colspan="5" class="py-12 text-center text-slate-600">
                  {{ busqueda ? 'Sin resultados para esa búsqueda.' : 'Aún no hay socios registrados.' }}
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
            <input v-model="formularioMembresia.tipo" placeholder="Tipo (ej: Plan Mensual)"
              class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioMembresia.precio" type="number" min="0" placeholder="Precio ($)"
              class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-600 text-sm" required>
            <input v-model="formularioMembresia.duracionDias" type="number" min="1" placeholder="Duración (días)"
              class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-600 text-sm" required>
            <div class="flex gap-2">
              <button type="submit" :disabled="cargando"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                {{ cargando ? '...' : (membresiaEditandoId ? 'Actualizar' : 'Guardar') }}
              </button>
              <button v-if="membresiaEditandoId" @click="cancelarEdicionMembresia" type="button"
                class="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg font-bold transition-colors">✕</button>
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
              <tr v-if="membresias.length === 0">
                <td colspan="5" class="py-12 text-center text-slate-600">Aún no hay membresías creadas.</td>
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
];

const toast = ref({ visible: false, msg: '', tipo: 'ok' });
let toastTimer = null;
const mostrarToast = (msg, tipo = 'ok') => {
  clearTimeout(toastTimer);
  toast.value = { visible: true, msg, tipo };
  toastTimer = setTimeout(() => { toast.value.visible = false; }, 3500);
};

const modal = ref({ visible: false, titulo: '', msg: '', accion: null });
const pedirConfirmacion = (tipo, id) => {
  modal.value = {
    visible: true,
    titulo: tipo === 'socio' ? 'Eliminar socio' : 'Eliminar membresía',
    msg: 'Esta acción no se puede deshacer.',
    accion: () => tipo === 'socio' ? eliminarSocio(id) : eliminarMembresia(id),
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

const socios = ref([]);
const socioEditandoId = ref(null);
const formularioSocio = ref({ rut: '', nombre: '', apellido: '', email: '' });

const sociosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase();
  if (!q) return socios.value;
  return socios.value.filter(s =>
    s.nombre.toLowerCase().includes(q) ||
    s.apellido.toLowerCase().includes(q) ||
    s.rut.toLowerCase().includes(q)
  );
});

const ultimosSocios = computed(() => [...socios.value].slice(-5).reverse());

const sociosActivos = computed(() => socios.value.filter(s => s.estado).length);

const obtenerSocios = async () => {
  try {
    const res = await api('/socios');
    if (res?.ok) socios.value = await res.json();
  } catch { mostrarToast('No se pudo conectar al servidor.', 'err'); }
};

const crearSocio = async () => {
  if (errorRut.value) return;
  cargando.value = true;
  try {
    const res = await api('/socios', { method: 'POST', body: JSON.stringify(formularioSocio.value) });
    if (res?.ok) { cancelarEdicionSocio(); obtenerSocios(); mostrarToast('Socio creado.'); }
    else mostrarToast('No se pudo crear el socio.', 'err');
  } catch { mostrarToast('Error de conexión.', 'err'); }
  finally { cargando.value = false; }
};

const cargarDatosSocio = (socio) => {
  socioEditandoId.value = socio.id;
  formularioSocio.value = { ...socio };
  errorRut.value = '';
  tabActual.value = 'socios';
};

const cancelarEdicionSocio = () => {
  socioEditandoId.value = null;
  formularioSocio.value = { rut: '', nombre: '', apellido: '', email: '' };
  errorRut.value = '';
};

const actualizarSocio = async () => {
  if (errorRut.value) return;
  cargando.value = true;
  try {
    const res = await api(`/socios/${socioEditandoId.value}`, { method: 'PUT', body: JSON.stringify(formularioSocio.value) });
    if (res?.ok) { cancelarEdicionSocio(); obtenerSocios(); mostrarToast('Socio actualizado.'); }
    else mostrarToast('No se pudo actualizar.', 'err');
  } catch { mostrarToast('Error de conexión.', 'err'); }
  finally { cargando.value = false; }
};

const eliminarSocio = async (id) => {
  try {
    const res = await api(`/socios/${id}`, { method: 'DELETE' });
    if (res?.ok) { obtenerSocios(); mostrarToast('Socio eliminado.'); }
    else mostrarToast('No se pudo eliminar.', 'err');
  } catch { mostrarToast('Error de conexión.', 'err'); }
};

const membresias = ref([]);
const membresiaEditandoId = ref(null);
const formularioMembresia = ref({ tipo: '', precio: '', duracionDias: '' });

const precioMaximo = computed(() => Math.max(...membresias.value.map(m => m.precio), 1));
const membresiasPorPrecio = computed(() =>
  [...membresias.value]
    .sort((a, b) => b.precio - a.precio)
    .map(m => ({ ...m, porcentaje: Math.round((m.precio / precioMaximo.value) * 100) }))
);
const planMasCaro = computed(() => [...membresias.value].sort((a, b) => b.precio - a.precio)[0] || {});
const planMasBarato = computed(() => [...membresias.value].sort((a, b) => a.precio - b.precio)[0] || {});

const kpis = computed(() => [
  { icono: '👥', label: 'Total socios', valor: socios.value.length, color: 'text-blue-400' },
  { icono: '✅', label: 'Socios activos', valor: sociosActivos.value, color: 'text-emerald-400' },
  { icono: '🏷️', label: 'Tipos de plan', valor: membresias.value.length, color: 'text-purple-400' },
  { icono: '💰', label: 'Precio promedio', valor: membresias.value.length ? '$' + Math.round(membresias.value.reduce((a, m) => a + m.precio, 0) / membresias.value.length).toLocaleString('es-CL') : '—', color: 'text-amber-400' },
]);

const obtenerMembresias = async () => {
  try {
    const res = await api('/membresias');
    if (res?.ok) membresias.value = await res.json();
  } catch { mostrarToast('No se pudieron cargar las membresías.', 'err'); }
};

const crearMembresia = async () => {
  cargando.value = true;
  try {
    const body = { tipo: formularioMembresia.value.tipo, precio: Number(formularioMembresia.value.precio), duracionDias: Number(formularioMembresia.value.duracionDias) };
    const res = await api('/membresias', { method: 'POST', body: JSON.stringify(body) });
    if (res?.ok) { cancelarEdicionMembresia(); obtenerMembresias(); mostrarToast('Membresía creada.'); }
    else mostrarToast('No se pudo crear la membresía.', 'err');
  } catch { mostrarToast('Error de conexión.', 'err'); }
  finally { cargando.value = false; }
};

const cargarDatosMembresia = (m) => {
  membresiaEditandoId.value = m.id;
  formularioMembresia.value = { ...m };
  tabActual.value = 'membresias';
};

const cancelarEdicionMembresia = () => {
  membresiaEditandoId.value = null;
  formularioMembresia.value = { tipo: '', precio: '', duracionDias: '' };
};

const actualizarMembresia = async () => {
  cargando.value = true;
  try {
    const body = { tipo: formularioMembresia.value.tipo, precio: Number(formularioMembresia.value.precio), duracionDias: Number(formularioMembresia.value.duracionDias) };
    const res = await api(`/membresias/${membresiaEditandoId.value}`, { method: 'PUT', body: JSON.stringify(body) });
    if (res?.ok) { cancelarEdicionMembresia(); obtenerMembresias(); mostrarToast('Membresía actualizada.'); }
    else mostrarToast('No se pudo actualizar.', 'err');
  } catch { mostrarToast('Error de conexión.', 'err'); }
  finally { cargando.value = false; }
};

const eliminarMembresia = async (id) => {
  try {
    const res = await api(`/membresias/${id}`, { method: 'DELETE' });
    if (res?.ok) { obtenerMembresias(); mostrarToast('Membresía eliminada.'); }
    else mostrarToast('No se pudo eliminar.', 'err');
  } catch { mostrarToast('Error de conexión.', 'err'); }
};

onMounted(() => { obtenerSocios(); obtenerMembresias(); });
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(1rem); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>