<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Gestión de Clases</h2>
    
    <!-- Formulario -->
    <div class="bg-white p-4 rounded shadow mb-6">
      <form @submit.prevent="crearClase" class="flex flex-wrap gap-4">
        <input v-model="nueva.nombre" placeholder="Nombre (ej: Spinning)" class="border p-2 rounded flex-1" required />
        <input v-model="nueva.horario" type="time" class="border p-2 rounded" required />
        <input v-model="nueva.instructor" placeholder="Instructor" class="border p-2 rounded flex-1" required />
        <input v-model="nueva.cupos" type="number" placeholder="Cupos Totales" class="border p-2 rounded w-32" required />
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Guardar Clase</button>
      </form>
    </div>

    <!-- Tabla -->
    <div class="bg-white p-4 rounded shadow">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b">
            <th class="p-2">Clase</th>
            <th class="p-2">Horario</th>
            <th class="p-2">Instructor</th>
            <th class="p-2">Cupos</th>
            <th class="p-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in clases" :key="c.id" class="border-b hover:bg-gray-50">
            <td class="p-2">{{ c.nombre }}</td>
            <td class="p-2">{{ c.horario }}</td>
            <td class="p-2">{{ c.instructor }}</td>
            <td class="p-2">{{ c.cupos }}</td>
            <td class="p-2 flex gap-3 justify-end">
              <button @click="inscribir(c.id)" class="text-green-600 font-bold border border-green-600 px-2 rounded hover:bg-green-50">+ Inscribir</button>
              <button @click="eliminar(c.id)" class="text-red-500 hover:text-red-700 px-2">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="clases.length === 0" class="text-gray-500 p-4 text-center">No hay clases programadas.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps(['token']);
const clases = ref([]);
const nueva = ref({ nombre: '', horario: '', instructor: '', cupos: '' });

const config = { headers: { Authorization: `Bearer ${props.token}` } };
const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const cargar = async () => {
  try {
    const res = await axios.get(`${api}/api/clases`, config);
    clases.value = res.data;
  } catch (error) {
    console.error("Error al cargar clases", error);
  }
};

const crearClase = async () => {
  try {
    await axios.post(`${api}/api/clases`, nueva.value, config);
    nueva.value = { nombre: '', horario: '', instructor: '', cupos: '' };
    cargar();
  } catch (error) {
    alert("Error al crear la clase");
  }
};

const eliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar esta clase?")) {
    await axios.delete(`${api}/api/clases/${id}`, config);
    cargar();
  }
};

const inscribir = (id) => {
  alert(`La lógica de inscripción para la clase ID ${id} está lista en el backend para ser conectada.`);
};

onMounted(cargar);
</script>