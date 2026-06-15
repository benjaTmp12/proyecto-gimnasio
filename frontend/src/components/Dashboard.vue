<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Dashboard Operativo</h2>
        <p class="text-gray-500">Resumen general del gimnasio</p>
      </div>
      <button @click="fetchDashboardData" class="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 font-bold transition">
        ↻ Actualizar
      </button>
    </div>

    <div v-if="loading" class="text-gray-500 font-bold text-center py-10">Cargando métricas desde Railway...</div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <div class="text-xs text-gray-500 uppercase font-bold tracking-wider">Socios Totales</div>
          <div class="text-4xl font-black text-gray-800 mt-2">{{ kpis.totalSocios }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-red-500">
          <div class="text-xs text-gray-500 uppercase font-bold tracking-wider">Membresías Vencidas</div>
          <div class="text-4xl font-black text-red-600 mt-2">{{ kpis.membresiasVencidas }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <div class="text-xs text-gray-500 uppercase font-bold tracking-wider">Clases Activas</div>
          <div class="text-4xl font-black text-gray-800 mt-2">{{ kpis.clasesHoy }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
          <div class="text-xs text-gray-500 uppercase font-bold tracking-wider">Ingresos Mes (Est.)</div>
          <div class="text-4xl font-black text-gray-800 mt-2">${{ kpis.ingresosMes.toLocaleString('es-CL') }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white rounded shadow p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Ocupación de Clases</h3>
          <div v-if="clases.length === 0" class="text-gray-500 text-sm">No hay clases registradas.</div>
          <div v-for="c in clases" :key="c.id" class="mb-4">
            <div class="flex justify-between text-sm font-bold mb-1">
              <span class="text-gray-700">{{ c.nombre }} ({{ c.horario }})</span>
              <span :class="c.inscritos >= c.cuposTotales ? 'text-red-500' : 'text-green-600'">
                {{ c.inscritos }} / {{ c.cuposTotales }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
              <div class="h-2 transition-all" 
                   :class="c.inscritos >= c.cuposTotales ? 'bg-red-500' : 'bg-green-500'" 
                   :style="{ width: `${Math.min((c.inscritos / (c.cuposTotales || 1)) * 100, 100)}%` }">
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Últimos Registros</h3>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-gray-500 text-xs uppercase tracking-wider border-b">
                <th class="pb-2">Nombre</th>
                <th class="pb-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in ultimosSocios" :key="s.id" class="border-b last:border-0 hover:bg-gray-50">
                <td class="py-3 text-sm text-gray-700 font-medium">{{ s.nombre }} {{ s.apellido }}</td>
                <td class="py-3">
                  <span :class="['px-2 py-1 text-xs font-bold rounded', s.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                    {{ s.estado }}
                  </span>
                </td>
              </tr>
              <tr v-if="ultimosSocios.length === 0">
                <td colspan="2" class="py-4 text-center text-gray-500 text-sm">No hay socios nuevos.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const token = localStorage.getItem('token');
const loading = ref(true);

const kpis = ref({ totalSocios: 0, membresiasVencidas: 0, clasesHoy: 0, ingresosMes: 0 });
const clases = ref([]);
const ultimosSocios = ref([]);

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    kpis.value = res.data.kpis;
    clases.value = res.data.clases;
    ultimosSocios.value = res.data.ultimosSocios;
  } catch (error) {
    console.error("Error al cargar dashboard", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>