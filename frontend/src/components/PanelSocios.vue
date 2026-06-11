<template>
  <div class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Panel Principal del Gimnasio</h2>
      <button @click="$emit('logout')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold">
        Cerrar Sesión
      </button>
    </div>

    <div class="flex gap-4 mb-6 border-b pb-2">
      <button @click="pestanaActual = 'socios'" :class="pestanaActual === 'socios' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'" class="px-4 py-2 rounded font-bold">
        Gestión de Socios
      </button>
      <button @click="pestanaActual = 'membresias'" :class="pestanaActual === 'membresias' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'" class="px-4 py-2 rounded font-bold">
        Gestión de Membresías
      </button>
    </div>

    <div v-if="pestanaActual === 'socios'">
      <div class="bg-gray-50 p-4 rounded border mb-6">
        <h3 class="font-bold mb-3 text-lg">{{ socioEditandoId ? 'Actualizar Socio' : 'Agregar Nuevo Socio' }}</h3>
        <form @submit.prevent="socioEditandoId ? actualizarSocio() : crearSocio()" class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input v-model="formularioSocio.rut" placeholder="RUT" class="border p-2 rounded" required>
          <input v-model="formularioSocio.nombre" placeholder="Nombre" class="border p-2 rounded" required>
          <input v-model="formularioSocio.apellido" placeholder="Apellido" class="border p-2 rounded" required>
          <input v-model="formularioSocio.email" type="email" placeholder="Email" class="border p-2 rounded" required>
          <div class="flex gap-2">
            <button type="submit" :class="socioEditandoId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'" class="text-white p-2 rounded font-bold flex-1">
              {{ socioEditandoId ? 'Actualizar' : 'Guardar' }}
            </button>
            <button v-if="socioEditandoId" @click="cancelarEdicionSocio" type="button" class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded font-bold">X</button>
          </div>
        </form>
      </div>

      <table class="min-w-full bg-white border text-center">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="py-2 px-4 border">RUT</th>
            <th class="py-2 px-4 border">Nombre</th>
            <th class="py-2 px-4 border">Email</th>
            <th class="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="socio in socios" :key="socio.id">
            <td class="py-2 px-4 border">{{ socio.rut }}</td>
            <td class="py-2 px-4 border">{{ socio.nombre }} {{ socio.apellido }}</td>
            <td class="py-2 px-4 border">{{ socio.email }}</td>
            <td class="py-2 px-4 border space-x-2">
              <button @click="cargarDatosSocio(socio)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 font-bold">Editar</button>
              <button @click="eliminarSocio(socio.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 font-bold">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pestanaActual === 'membresias'">
      <div class="bg-gray-50 p-4 rounded border mb-6">
        <h3 class="font-bold mb-3 text-lg">{{ membresiaEditandoId ? 'Actualizar Membresía' : 'Agregar Nueva Membresía' }}</h3>
        <form @submit.prevent="membresiaEditandoId ? actualizarMembresia() : crearMembresia()" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input v-model="formularioMembresia.tipo" placeholder="Tipo (Ej: Plan Anual)" class="border p-2 rounded" required>
          <input v-model="formularioMembresia.precio" type="number" placeholder="Precio" class="border p-2 rounded" required>
          <input v-model="formularioMembresia.duracionDias" type="number" placeholder="Duración (Días)" class="border p-2 rounded" required>
          <div class="flex gap-2">
            <button type="submit" :class="membresiaEditandoId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'" class="text-white p-2 rounded font-bold flex-1">
              {{ membresiaEditandoId ? 'Actualizar' : 'Guardar' }}
            </button>
            <button v-if="membresiaEditandoId" @click="cancelarEdicionMembresia" type="button" class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded font-bold">X</button>
          </div>
        </form>
      </div>

      <table class="min-w-full bg-white border text-center">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="py-2 px-4 border">ID</th>
            <th class="py-2 px-4 border">Tipo de Plan</th>
            <th class="py-2 px-4 border">Precio</th>
            <th class="py-2 px-4 border">Duración (Días)</th>
            <th class="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="membresia in membresias" :key="membresia.id">
            <td class="py-2 px-4 border">{{ membresia.id }}</td>
            <td class="py-2 px-4 border">{{ membresia.tipo }}</td>
            <td class="py-2 px-4 border">${{ membresia.precio }}</td>
            <td class="py-2 px-4 border">{{ membresia.duracionDias }}</td>
            <td class="py-2 px-4 border space-x-2">
              <button @click="cargarDatosMembresia(membresia)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 font-bold">Editar</button>
              <button @click="eliminarMembresia(membresia.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 font-bold">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ token: String });
const emit = defineEmits(['logout']);

const pestanaActual = ref('socios');

// --- ESTADOS SOCIOS ---
const socios = ref([]);
const socioEditandoId = ref(null);
const formularioSocio = ref({ rut: '', nombre: '', apellido: '', email: '' });

// --- ESTADOS MEMBRESÍAS ---
const membresias = ref([]);
const membresiaEditandoId = ref(null);
const formularioMembresia = ref({ tipo: '', precio: '', duracionDias: '' });

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
  if(!confirm('¿Eliminar socio?')) return;
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
  if(!confirm('¿Eliminar membresía?')) return;
  const res = await fetch(`http://localhost:3000/api/membresias/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${props.token}` } });
  if (res.ok) obtenerMembresias();
};

onMounted(() => {
  obtenerSocios();
  obtenerMembresias();
});
</script>