<template>
  <div class="bg-slate-950 text-slate-100 min-h-screen" style="font-family: 'Inter', system-ui, sans-serif;">

    <!-- Toast de notificación -->
    <Transition name="toast">
      <div v-if="toast.visible" :class="[
        'fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border',
        toast.tipo === 'ok' ? 'bg-emerald-950 border-emerald-700 text-emerald-200' : 'bg-red-950 border-red-700 text-red-200'
      ]">
        <span>{{ toast.tipo === 'ok' ? '✅' : '❌' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Modal de confirmación de eliminación -->
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

    <!-- Modal de inscripción a clase -->
    <Transition name="modal">
      <div v-if="modalInscripcion.visible" class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-7 max-w-lg w-full mx-4">
          <h3 class="text-lg font-bold text-white mb-2">🏋️ Inscribir Socio a Clase</h3>
          <p class="text-slate-400 text-sm mb-4">Revisa la información de la sesión y selecciona un socio activo.</p>
          
          <div v-if="claseInscripcion" class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-6">
            <h4 class="text-emerald-400 font-bold text-lg mb-3">{{ claseInscripcion.nombre }}</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase">Entrenador</p>
                <p class="text-slate-200">{{ claseInscripcion.instructor }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase">Horario</p>
                <p class="text-slate-200">{{ claseInscripcion.horario }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase">Duración</p>
                <p class="text-slate-200">60 minutos</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase">Ocupación</p>
                <p class="text-slate-200"><span class="text-amber-400 font-bold">{{ claseInscripcion.cupos }}</span> disponibles / {{ claseInscripcion.capacidadMax }} máx.</p>
              </div>
            </div>
          </div>

          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Seleccionar Socio</label>
          <select v-model="modalInscripcion.socioId" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-6 text-sm">
            <option value="" disabled>-- Selecciona un socio activo --</option>
            <option v-for="s in sociosActivos" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellido }} (RUT: {{ s.rut }})</option>
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
        <span v-if="rolUsuario === 'admin'" class="hidden sm:flex items-center gap-1 bg-amber-950/60 border border-amber-800 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
          👑 Admin
        </span>
        <span class="text-xs text-slate-500 hidden sm:block">{{ usuarioActual }}</span>
        <button @click="cerrarSesion" class="flex items-center gap-2 bg-slate-800 hover:bg-red-950 border border-slate-700 hover:border-red-800 text-slate-300 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Cerrar sesión
        </button>
      </div>
    </header>

    <!-- Contenido principal -->
    <div class="max-w-6xl mx-auto px-4 py-8">

      <!-- Navegación de tabs -->
      <nav class="flex gap-1.5 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-fit overflow-x-auto">
        <button v-for="tab in tabs" :key="tab.id"
          @click="tabActual = tab.id"
          :class="tabActual === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
          class="px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap">
          {{ tab.icono }} {{ tab.label }}
        </button>
      </nav>

      <!-- Tabs -->
      <DashboardTab v-if="tabActual === 'dashboard'" :socios="socios" :clases="clases" :membresias="membresias" :statsData="statsData" @cambiarTab="tabActual = $event" />
      <SociosTab v-if="tabActual === 'socios'" :socios="socios" :membresias="membresias" :clases="clases" :cargando="cargando" @crearSocio="crearSocio" @actualizarSocio="actualizarSocio" @pedirConfirmacion="pedirConfirmacion" />
      <MembresiaTab v-if="tabActual === 'membresias'" :membresias="membresias" :esAdmin="esAdmin" :cargando="cargando" @crearMembresia="crearMembresia" @actualizarMembresia="actualizarMembresia" @pedirConfirmacion="pedirConfirmacion" />
      <ClasesTab v-if="tabActual === 'clases'" :clases="clases" :entrenadores="entrenadores" :esAdmin="esAdmin" :cargando="cargando" @crearClase="crearClase" @actualizarClase="actualizarClase" @pedirConfirmacion="pedirConfirmacion" @abrirInscripcion="abrirModalInscripcion" />
      <EntrenadoresTab v-if="tabActual === 'entrenadores'" :entrenadores="entrenadores" :esAdmin="esAdmin" :cargando="cargando" @agregarEntrenador="agregarEntrenador" @actualizarEntrenador="actualizarEntrenador" @pedirConfirmacion="pedirConfirmacion" />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardTab from './tabs/DashboardTab.vue';
import SociosTab from './tabs/SociosTab.vue';
import MembresiaTab from './tabs/MembresiaTab.vue';
import ClasesTab from './tabs/ClasesTab.vue';
import EntrenadoresTab from './tabs/EntrenadoresTab.vue';

const router = useRouter();
const token = localStorage.getItem('token');
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ─── Estado del usuario ────────────────────────────────────────────────
const usuarioActual = computed(() => {
  try {
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.nombre || payload.email || '';
  } catch { return ''; }
});

const rolUsuario = computed(() => {
  try {
    if (!token) return 'empleado';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol || 'empleado';
  } catch { return 'empleado'; }
});

const esAdmin = computed(() => rolUsuario.value === 'admin');

// ─── Tabs ───────────────────────────────────────────────────────────────
const tabActual = ref('dashboard');
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icono: '📊' },
  { id: 'socios', label: 'Socios', icono: '👥' },
  { id: 'membresias', label: 'Membresías', icono: '🏷️' },
  { id: 'clases', label: 'Clases', icono: '🏋️' },
  { id: 'entrenadores', label: 'Entrenadores', icono: '🤸' },
];

// ─── UI helpers ─────────────────────────────────────────────────────────
const cargando = ref(false);
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
      if (tipo === 'socio') eliminarSocio(id);
      if (tipo === 'membresia') eliminarMembresia(id);
      if (tipo === 'clase') eliminarClase(id);
      if (tipo === 'entrenador') eliminarEntrenador(id);
    }
  };
};
const confirmarModal = () => { modal.value.accion?.(); modal.value.visible = false; };

// ─── Cliente API ─────────────────────────────────────────────────────────
const api = async (path, opts = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...opts.headers },
  });
  if (res.status === 401) { cerrarSesion(); return null; }
  return res;
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

// ─── Datos reactivos ─────────────────────────────────────────────────────
const socios = ref([]);
const membresias = ref([]);
const clases = ref([]);
const entrenadores = ref([]);
const statsData = ref({
  stats: { totalEntrenadores: 0, entrenadoresActivos: 0, totalClases: 0, clasesDisponibles: 0, clasesCompletas: 0 },
  clasesDeHoy: [],
  rankingEntrenadores: []
});

const hoy = computed(() => new Date().toISOString().split('T')[0]);
const sociosActivos = computed(() => socios.value.filter(s => s.fechaVencimiento && s.fechaVencimiento >= hoy.value));

const modalInscripcion = ref({ visible: false, claseId: null, socioId: '' });
const claseInscripcion = computed(() => clases.value.find(c => c.id === modalInscripcion.value.claseId));

// ─── Stats ───────────────────────────────────────────────────────────────
const cargarStats = async () => {
  const res = await api('/dashboard/stats');
  if (res?.ok) statsData.value = await res.json();
};

// ─── CRUD Socios ─────────────────────────────────────────────────────────
const cargarSocios = async () => {
  const res = await api('/socios');
  if (res?.ok) socios.value = await res.json();
};

const crearSocio = async (datos, callback) => {
  cargando.value = true;
  const res = await api('/socios', { method: 'POST', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarSocios(); 
    await cargarClases(); // Reload classes to reflect updated spots
    await cargarStats();
    mostrarToast('Socio registrado y clases asignadas.'); 
  } else {
    const data = res ? await res.json() : {};
    mostrarToast(data.mensaje || data.error || 'Error al crear socio o clases llenas.', 'err');
  }
  cargando.value = false;
};
const actualizarSocio = async (id, datos, callback) => {
  cargando.value = true;
  const res = await api(`/socios/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarSocios(); 
    await cargarStats();
    mostrarToast('Socio actualizado.'); 
  }
  else mostrarToast('Error al actualizar.', 'err');
  cargando.value = false;
};
const eliminarSocio = async (id) => {
  const res = await api(`/socios/${id}`, { method: 'DELETE' });
  if (res?.ok) { 
    await cargarSocios(); 
    await cargarStats();
    mostrarToast('Socio eliminado.'); 
  }
  else mostrarToast('Error al eliminar.', 'err');
};

// ─── CRUD Membresías ─────────────────────────────────────────────────────
const cargarMembresias = async () => {
  const res = await api('/membresias');
  if (res?.ok) membresias.value = await res.json();
};
const crearMembresia = async (datos, callback) => {
  cargando.value = true;
  const res = await api('/membresias', { method: 'POST', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarMembresias(); 
    await cargarStats();
    mostrarToast('Membresía creada.'); 
  }
  else mostrarToast('Error al crear membresía.', 'err');
  cargando.value = false;
};
const actualizarMembresia = async (id, datos, callback) => {
  cargando.value = true;
  const res = await api(`/membresias/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarMembresias(); 
    await cargarStats();
    mostrarToast('Membresía actualizada.'); 
  }
  else mostrarToast('Error al actualizar.', 'err');
  cargando.value = false;
};
const eliminarMembresia = async (id) => {
  const res = await api(`/membresias/${id}`, { method: 'DELETE' });
  if (res?.ok) { 
    await cargarMembresias(); 
    await cargarStats();
    mostrarToast('Membresía eliminada.'); 
  }
  else mostrarToast('Error al eliminar.', 'err');
};

// ─── CRUD Clases ─────────────────────────────────────────────────────────
const cargarClases = async () => {
  const res = await api('/clases');
  if (res?.ok) clases.value = await res.json();
};
const crearClase = async (datos, callback) => {
  cargando.value = true;
  const res = await api('/clases', { method: 'POST', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarClases(); 
    await cargarStats();
    mostrarToast('Clase programada con éxito.'); 
  }
  else {
    const data = res ? await res.json() : {};
    mostrarToast(data.error || 'Error al crear la clase.', 'err');
  }
  cargando.value = false;
};
const actualizarClase = async (id, datos, callback) => {
  cargando.value = true;
  const res = await api(`/clases/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarClases(); 
    await cargarStats();
    mostrarToast('Clase actualizada con éxito.'); 
  }
  else {
    const data = res ? await res.json() : {};
    mostrarToast(data.error || 'Error al actualizar la clase.', 'err');
  }
  cargando.value = false;
};
const eliminarClase = async (id) => {
  const res = await api(`/clases/${id}`, { method: 'DELETE' });
  if (res?.ok) { 
    await cargarClases(); 
    await cargarStats();
    mostrarToast('Clase eliminada.'); 
  }
  else mostrarToast('Error al eliminar clase.', 'err');
};

// ─── Entrenadores ─────────────────────────────────────────────────────────
const cargarEntrenadores = async () => {
  const res = await api('/entrenadores');
  if (res?.ok) entrenadores.value = await res.json();
};
const agregarEntrenador = async (datos, callback) => {
  cargando.value = true;
  const res = await api('/entrenadores', { method: 'POST', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarEntrenadores(); 
    await cargarStats();
    mostrarToast('Entrenador agregado.'); 
  }
  else {
    const data = res ? await res.json() : {};
    mostrarToast(data.error || 'Error al agregar entrenador.', 'err');
  }
  cargando.value = false;
};
const actualizarEntrenador = async (id, datos, callback) => {
  cargando.value = true;
  const res = await api(`/entrenadores/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
  if (res?.ok) { 
    callback?.(); 
    await cargarEntrenadores(); 
    await cargarStats();
    mostrarToast('Entrenador actualizado.'); 
  }
  else {
    const data = res ? await res.json() : {};
    mostrarToast(data.error || 'Error al actualizar entrenador.', 'err');
  }
  cargando.value = false;
};
const eliminarEntrenador = async (id) => {
  const res = await api(`/entrenadores/${id}`, { method: 'DELETE' });
  if (res?.ok) { 
    await cargarEntrenadores(); 
    await cargarStats();
    mostrarToast('Entrenador eliminado.'); 
  }
  else mostrarToast('Error al eliminar.', 'err');
};

// ─── Inscripciones ────────────────────────────────────────────────────────
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
      await cargarClases();
      await cargarStats();
    } else if (res) {
      const data = await res.json();
      mostrarToast(data.message || data.error || 'Error al inscribir.', 'err');
    }
  } catch { mostrarToast('Error de conexión al servidor', 'err'); }
  cargando.value = false;
};

// ─── Init ────────────────────────────────────────────────────────────────
onMounted(() => {
  if (token) {
    cargarSocios();
    cargarMembresias();
    cargarClases();
    cargarEntrenadores();
    cargarStats();
  }
});
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(1rem); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>