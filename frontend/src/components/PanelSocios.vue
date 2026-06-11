<template>
  <div class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10 mb-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">💪 Sistema de Gestión Gym</h2>
      <button @click="$emit('logout')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold transition-colors">
        Cerrar Sesión
      </button>
    </div>

    <div class="flex gap-4 mb-6 border-b pb-2">
      <button @click="pestanaActual = 'dashboard'" :class="pestanaActual === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" class="px-4 py-2 rounded font-bold transition-all">
        📊 Dashboard
      </button>
      <button @click="pestanaActual = 'socios'" :class="pestanaActual === 'socios' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" class="px-4 py-2 rounded font-bold transition-all">
        👥 Gestión de Socios
      </button>
      <button @click="pestanaActual = 'membresias'" :class="pestanaActual === 'membresias' ? 'bg-green-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" class="px-4 py-2 rounded font-bold transition-all">
        🏷️ Membresías
      </button>
    </div>

    <div v-if="pestanaActual === 'dashboard'" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg text-white">
          <h3 class="text-sm font-bold uppercase tracking-wider opacity-80">Total Socios</h3>
          <p class="text-5xl font-black mt-2">{{ socios.length }}</p>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-emerald-700 p-6 rounded-xl shadow-lg text-white">
          <h3 class="text-sm font-bold uppercase tracking-wider opacity-80">Planes Activos</h3>
          <p class="text-5xl font-black mt-2">{{ membresias.length }}</p>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between">
          <h3 class="text-sm font-bold uppercase tracking-wider opacity-80">Último Ingreso</h3>
          <p class="text-2xl font-bold mt-2 truncate">
            {{ socios.length > 0 ? socios[socios.length - 1].nombre + ' ' + socios[socios.length - 1].apellido : 'Sin datos' }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg text-gray-800">Últimos Registros</h3>
            <button @click="pestanaActual = 'socios'" class="text-blue-600 hover:underline text-sm font-semibold">Ver todos</button>
          </div>
          <ul class="divide-y divide-gray-100">
            <li v-for="socio in ultimosSocios" :key="socio.id" class="py-3 flex justify-between items-center">
              <div>
                <p class="font-semibold text-gray-800">{{ socio.nombre }} {{ socio.apellido }}</p>
                <p class="text-xs text-gray-500">RUT: {{ socio.rut }}</p>
              </div>
              <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Socio</span>
            </li>
            <li v-if="ultimosSocios.length === 0" class="py-3 text-gray-500 text-sm">Aún no hay socios registrados.</li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg text-gray-800">Planes Disponibles</h3>
            <button @click="pestanaActual = 'membresias'" class="text-green-600 hover:underline text-sm font-semibold">Gestionar</button>
          </div>
          <ul class="divide-y divide-gray-100">
            <li v-for="plan in membresias" :key="plan.id" class="py-3 flex justify-between items-center">
              <div>
                <p class="font-semibold text-gray-800">{{ plan.tipo }}</p>
                <p class="text-xs text-gray-500">Duración: {{ plan.duracionDias }} días</p>
              </div>
              <span class="font-black text-gray-700 text-lg">${{ plan.precio.toLocaleString('es-CL') }}</span>
            </li>
            <li v-if="membresias.length === 0" class="py-3 text-gray-500 text-sm">Aún no hay planes creados.</li>
          </ul>
        </div>

      </div>
    </div>

    <div v-if="pestanaActual === 'socios'">
      <div class="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6 shadow-sm">
        <h3 class="font-bold mb-3 text-blue-800">{{ socioEditandoId ? 'Actualizar Datos del Socio' : 'Agregar Nuevo Socio' }}</h3>
        <form @submit.prevent="socioEditandoId ? actualizarSocio() : crearSocio()" class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input v-model="formularioSocio.rut" placeholder="RUT" class="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required>
          <input v-model="formularioSocio.nombre" placeholder="Nombre" class="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required>
          <input v-model="formularioSocio.apellido" placeholder="Apellido" class="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required>
          <input v-model="formularioSocio.email" type="email" placeholder="Email" class="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required>
          <div class="flex gap-2">
            <button type="submit" :class="socioEditandoId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'" class="text-white p-2 rounded font-bold flex-1 shadow transition-colors">
              {{ socioEditandoId ? 'Actualizar' : 'Guardar' }}
            </button>
            <button v-if="socioEditandoId" @click="cancelarEdicionSocio" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-3 rounded font-bold shadow">X</button>
          </div>
        </form>
      </div>

      <div class="overflow-hidden rounded-lg shadow border border-gray-200">
        <table class="min-w-full bg-white text-center">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">RUT</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Nombre</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Email</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="socio in socios" :key="socio.id" class="hover:bg-gray-50">
              <td class="py-3 px-4">{{ socio.rut }}</td>
              <td class="py-3 px-4 font-medium text-gray-800">{{ socio.nombre }} {{ socio.apellido }}</td>
              <td class="py-3 px-4 text-gray-500">{{ socio.email }}</td>
              <td class="py-3 px-4 space-x-2">
                <button @click="cargarDatosSocio(socio)" class="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold hover:bg-blue-200 transition-colors">Editar</button>
                <button @click="eliminarSocio(socio.id)" class="bg-red-100 text-red-700 px-3 py-1 rounded font-bold hover:bg-red-200 transition-colors">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="pestanaActual === 'membresias'">
      <div class="bg-green-50 p-5 rounded-lg border border-green-100 mb-6 shadow-sm">
        <h3 class="font-bold mb-3 text-green-800">{{ membresiaEditandoId ? 'Actualizar Membresía' : 'Agregar Nueva Membresía' }}</h3>
        <form @submit.prevent="membresiaEditandoId ? actualizarMembresia() : crearMembresia()" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input v-model="formularioMembresia.tipo" placeholder="Tipo (Ej: Plan Anual)" class="border border-green-200 p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" required>
          <input v-model="formularioMembresia.precio" type="number" placeholder="Precio ($)" class="border border-green-200 p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" required>
          <input v-model="formularioMembresia.duracionDias" type="number" placeholder="Duración (Días)" class="border border-green-200 p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" required>
          <div class="flex gap-2">
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded font-bold flex-1 shadow transition-colors">
              {{ membresiaEditandoId ? 'Actualizar' : 'Guardar' }}
            </button>
            <button v-if="membresiaEditandoId" @click="cancelarEdicionMembresia" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-3 rounded font-bold shadow">X</button>
          </div>
        </form>
      </div>

      <div class="overflow-hidden rounded-lg shadow border border-gray-200">
        <table class="min-w-full bg-white text-center">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">ID</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Tipo de Plan</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Precio</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Duración (Días)</th>
              <th class="py-3 px-4 uppercase text-sm font-semibold tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="membresia in membresias" :key="membresia.id" class="hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-500">#{{ membresia.id }}</td>
              <td class="py-3 px-4 font-medium text-gray-800">{{ membresia.tipo }}</td>
              <td class="py-3 px-4 font-bold text-gray-700">${{ membresia.precio.toLocaleString('es-CL') }}</td>
              <td class="py-3 px-4">{{ membresia.duracionDias }}</td>
              <td class="py-3 px-4 space-x-2">
                <button @click="cargarDatosMembresia(membresia)" class="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold hover:bg-blue-200 transition-colors">Editar</button>
                <button @click="eliminarMembresia(membresia.id)" class="bg-red-100 text-red-700 px-3 py-1 rounded font-bold hover:bg-red-200 transition-colors">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
// Agregamos 'computed' para sacar cálculos automáticos para el dashboard
import { ref, onMounted, computed } from 'vue';

const props = defineProps({ token: String });
const emit = defineEmits(['logout']);

const pestanaActual = ref('dashboard');

// --- ESTADOS SOCIOS ---
const socios = ref([]);
const socioEditandoId = ref(null);
const formularioSocio = ref({ rut: '', nombre: '', apellido: '', email: '' });

// --- ESTADOS MEMBRESÍAS ---
const membresias = ref([]);
const membresiaEditandoId = ref(null);
const formularioMembresia = ref({ tipo: '', precio: '', duracionDias: '' });

// --- VARIABLES COMPUTADAS PARA EL DASHBOARD ---
// Toma los últimos 5 socios ingresados, los voltea (para ver el más nuevo primero)
const ultimosSocios = computed(() => {
  return [...socios.value].slice(-5).reverse();
});

// ================= LÓGICA DE SOCIOS =================
const obtenerSocios = async () => {
  const res = await fetch('http://localhost:3000/api/socios', { headers: { 'Authorization': `Bearer ${props.token}` } });
  if (res.ok) socios.value = await res.json();
  else if (res.status === 401) emit('logout');
};

const crearSocio = async () => {
  const res = await fetch('http://localhost:3000/api/socios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
    body: JSON.stringify(formularioSocio.value)
  });
  if (res.ok) {
    cancelarEdicionSocio();
    obtenerSocios();
  }
};

const cargarDatosSocio = (socio) => {
  socioEditandoId.value = socio.id;
  formularioSocio.value = { ...socio };
  pestanaActual.value = 'socios'; 
};

const cancelarEdicionSocio = () => {
  socioEditandoId.value = null;
  formularioSocio.value = { rut: '', nombre: '', apellido: '', email: '' };
};

const actualizarSocio = async () => {
  const res = await fetch(`http://localhost:3000/api/socios/${socioEditandoId.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
    body: JSON.stringify(formularioSocio.value)
  });
  if (res.ok) {
    cancelarEdicionSocio();
    obtenerSocios();
  }
};

const eliminarSocio = async (id) => {
  if(!confirm('¿Seguro que quieres eliminar este socio?')) return;
  const res = await fetch(`http://localhost:3000/api/socios/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${props.token}` } });
  if (res.ok) obtenerSocios();
};

// ================= LÓGICA DE MEMBRESÍAS =================
const obtenerMembresias = async () => {
  const res = await fetch('http://localhost:3000/api/membresias', { headers: { 'Authorization': `Bearer ${props.token}` } });
  if (res.ok) membresias.value = await res.json();
};

const crearMembresia = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/membresias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
      body: JSON.stringify({
        tipo: formularioMembresia.value.tipo,
        precio: Number(formularioMembresia.value.precio), 
        duracionDias: Number(formularioMembresia.value.duracionDias) 
      })
    });
    if (res.ok) {
      cancelarEdicionMembresia();
      obtenerMembresias();
    }
  } catch (error) { console.error('Error de conexión.'); }
};

const cargarDatosMembresia = (membresia) => {
  membresiaEditandoId.value = membresia.id;
  formularioMembresia.value = { ...membresia };
  pestanaActual.value = 'membresias';
};

const cancelarEdicionMembresia = () => {
  membresiaEditandoId.value = null;
  formularioMembresia.value = { tipo: '', precio: '', duracionDias: '' };
};

const actualizarMembresia = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/membresias/${membresiaEditandoId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
      body: JSON.stringify({
        tipo: formularioMembresia.value.tipo,
        precio: Number(formularioMembresia.value.precio), 
        duracionDias: Number(formularioMembresia.value.duracionDias) 
      })
    });
    if (res.ok) {
      cancelarEdicionMembresia();
      obtenerMembresias();
    }
  } catch (error) { console.error('Error al actualizar.'); }
};

const eliminarMembresia = async (id) => {
  if(!confirm('¿Seguro que quieres eliminar esta membresía?')) return;
  const res = await fetch(`http://localhost:3000/api/membresias/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${props.token}` } });
  if (res.ok) obtenerMembresias();
};

onMounted(() => {
  obtenerSocios();
  obtenerMembresias();
});
</script>