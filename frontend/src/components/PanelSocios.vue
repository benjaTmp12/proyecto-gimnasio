<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Panel de Socios</h2>
      <button @click="$emit('logout')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Cerrar Sesión
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="py-2 px-4 border">RUT</th>
            <th class="py-2 px-4 border">Nombre</th>
            <th class="py-2 px-4 border">Email</th>
            <th class="py-2 px-4 border">Teléfono</th>
            <th class="py-2 px-4 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="socio in socios" :key="socio.id" class="text-center">
            <td class="py-2 px-4 border">{{ socio.rut }}</td>
            <td class="py-2 px-4 border">{{ socio.nombre }} {{ socio.apellido }}</td>
            <td class="py-2 px-4 border">{{ socio.email }}</td>
            <td class="py-2 px-4 border">{{ socio.telefono }}</td>
            <td class="py-2 px-4 border">
              <span :class="socio.estado ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                {{ socio.estado ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
          </tr>
          <tr v-if="socios.length === 0">
            <td colspan="5" class="py-4 text-center text-gray-500">No hay socios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  token: String
});

const emit = defineEmits(['logout']);
const socios = ref([]);

const obtenerSocios = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/socios', {
      headers: {
        'Authorization': `Bearer ${props.token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) emit('logout');
      throw new Error('No autorizado');
    }

    socios.value = await response.json();
  } catch (error) {
    console.error('Error al obtener socios:', error);
  }
};

onMounted(() => {
  obtenerSocios();
});
</script>