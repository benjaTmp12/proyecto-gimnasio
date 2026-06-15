<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Gestión de Membresías</h2>
    
    <!-- Formulario para agregar -->
    <div class="bg-white p-4 rounded shadow mb-6">
      <form @submit.prevent="crearMembresia" class="flex gap-4">
        <input v-model="nueva.tipo_plan" placeholder="Tipo de plan (ej: Básico)" class="border p-2 rounded flex-1" required />
        <input v-model="nueva.precio" type="number" placeholder="Precio ($)" class="border p-2 rounded w-32" required />
        <input v-model="nueva.duracion_dias" type="number" placeholder="Duración (días)" class="border p-2 rounded w-32" required />
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Guardar</button>
      </form>
    </div>

    <!-- Tabla de resultados -->
    <div class="bg-white p-4 rounded shadow">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b">
            <th class="p-2">Plan</th>
            <th class="p-2">Precio</th>
            <th class="p-2">Duración</th>
            <th class="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in membresias" :key="m.id" class="border-b hover:bg-gray-50">
            <td class="p-2">{{ m.tipo_plan }}</td>
            <td class="p-2 text-green-600 font-bold">${{ m.precio }}</td>
            <td class="p-2">{{ m.duracion_dias }} días</td>
            <td class="p-2">
              <button @click="eliminar(m.id)" class="text-red-500 hover:text-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="membresias.length === 0" class="text-gray-500 p-4 text-center">No hay membresías registradas.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps(['token']);
const membresias = ref([]);
const nueva = ref({ tipo_plan: '', precio: '', duracion_dias: '' });

const config = { headers: { Authorization: `Bearer ${props.token}` } };
const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const cargar = async () => {
  try {
    const res = await axios.get(`${api}/api/membresias`, config);
    membresias.value = res.data;
  } catch (error) {
    console.error("Error al cargar membresías", error);
  }
};

const crearMembresia = async () => {
  try {
    await axios.post(`${api}/api/membresias`, nueva.value, config);
    nueva.value = { tipo_plan: '', precio: '', duracion_dias: '' };
    cargar();
  } catch (error) {
    alert("Error al crear la membresía");
  }
};

const eliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar esta membresía?")) {
    await axios.delete(`${api}/api/membresias/${id}`, config);
    cargar();
  }
};

onMounted(cargar);
</script>