<template>
  <div class="admin-dashboard">
    <!-- Header y Rol -->
    <header class="dashboard-header">
      <div>
        <h1>Dashboard Operativo</h1>
        <p class="subtitle">Visión general del sistema - <span class="role-badge">Admin</span></p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="fetchDashboardData" :disabled="loading">
          {{ loading ? 'Actualizando...' : 'Actualizar Datos' }}
        </button>
      </div>
    </header>

    <!-- Estado de Carga / Error -->
    <div v-if="loading" class="loading-state">Cargando métricas del gimnasio...</div>
    <div v-if="error" class="error-state">{{ error }}</div>

    <template v-else>
      <!-- SECCIÓN 1: Alertas Críticas -->
      <section v-if="alertas.length > 0" class="alerts-section">
        <div v-for="(alerta, index) in alertas" :key="index" :class="['alert-card', alerta.tipo]">
          <span class="alert-icon">⚠️</span>
          <span>{{ alerta.mensaje }}</span>
        </div>
      </section>

      <!-- SECCIÓN 2: KPIs Principales -->
      <section class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">Socios Totales</div>
          <div class="kpi-value">{{ kpis.totalSocios }}</div>
          <div class="kpi-subtext positive">{{ kpis.sociosActivos }} activos</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Membresías Vencidas</div>
          <div class="kpi-value warning">{{ kpis.membresiasVencidas }}</div>
          <div class="kpi-subtext">Requieren atención</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Clases Hoy</div>
          <div class="kpi-value">{{ kpis.clasesHoy }}</div>
          <div class="kpi-subtext">{{ kpis.cuposDisponibles }} cupos disp.</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Ingresos Mes (Est.)</div>
          <div class="kpi-value success">${{ kpis.ingresosMes.toLocaleString('es-CL') }}</div>
          <div class="kpi-subtext">+12% vs mes anterior</div>
        </div>
      </section>

      <!-- SECCIÓN 3: Grillas de Contenido -->
      <section class="content-grid">
        
        <!-- Panel de Clases (Ocupación) -->
        <div class="content-card">
          <h2>Ocupación de Clases (Hoy)</h2>
          <div v-if="clases.length === 0" class="empty-state">No hay clases hoy.</div>
          <ul class="item-list">
            <li v-for="clase in clases" :key="clase.id" class="list-item">
              <div class="item-info">
                <strong>{{ clase.nombre }}</strong>
                <span class="text-muted">{{ clase.horario }} | {{ clase.instructor }}</span>
              </div>
              <div class="item-status">
                <div class="progress-bar-container">
                  <div class="progress-bar" 
                       :style="{ width: getOcupacion(clase.inscritos, clase.cuposTotales) + '%' }"
                       :class="getStatusClass(clase.inscritos, clase.cuposTotales)">
                  </div>
                </div>
                <span class="text-xs">{{ clase.cuposTotales - clase.inscritos }} cupos libres</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Últimos Socios -->
        <div class="content-card">
          <h2>Últimos Socios Registrados</h2>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="socio in ultimosSocios" :key="socio.id">
                  <td>{{ socio.nombre }} {{ socio.apellido }}</td>
                  <td>
                    <span :class="['badge', socio.estado === 'Activo' ? 'badge-success' : 'badge-danger']">
                      {{ socio.estado }}
                    </span>
                  </td>
                  <td>{{ socio.vencimiento }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Placeholders para Gráficos -->
        <div class="content-card chart-container">
          <h2>Ingresos vs Renuncias</h2>
          <div class="chart-placeholder">
            <span>[Espacio para Chart.js / Recharts]</span>
          </div>
        </div>

      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(true);
const error = ref(null);

const kpis = ref({
  totalSocios: 0, sociosActivos: 0, membresiasVencidas: 0,
  clasesHoy: 0, cuposDisponibles: 0, ingresosMes: 0
});
const alertas = ref([]);
const clases = ref([]);
const ultimosSocios = ref([]);

const getOcupacion = (inscritos, totales) => (inscritos / totales) * 100;
const getStatusClass = (inscritos, totales) => {
  const porcentaje = getOcupacion(inscritos, totales);
  if (porcentaje >= 90) return 'bg-danger';
  if (porcentaje >= 70) return 'bg-warning';
  return 'bg-success';
};

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Obtenemos el token de sesión (si tienes tu sistema protegido)
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    // Llamada real a tu backend
    const url = `${import.meta.env.VITE_API_URL}/api/dashboard`;
    const response = await axios.get(url, config);

    // Inyectamos los datos de Railway directo a la vista
    kpis.value = response.data.kpis;
    alertas.value = response.data.alertas;
    clases.value = response.data.clases;
    ultimosSocios.value = response.data.ultimosSocios;

  } catch (err) {
    error.value = 'Error al conectar con la base de datos. Verifica la consola.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Base Theme: Dark & Professional */
.admin-dashboard {
  padding: 2rem;
  background-color: #0f172a;
  color: #f8fafc;
  font-family: 'Inter', -apple-system, sans-serif;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #f1f5f9;
}

.subtitle {
  color: #94a3b8;
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
}

.role-badge {
  background: #3b82f6;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover { background: #1d4ed8; }
.btn-primary:disabled { background: #475569; cursor: not-allowed; }

/* Alerts */
.alerts-section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-card {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.alert-card.danger { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #fca5a5; }
.alert-card.warning { background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; color: #fcd34d; }

/* KPIs Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #334155;
}

.kpi-title { color: #94a3b8; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
.kpi-value { font-size: 2.5rem; font-weight: 700; color: #f8fafc; }
.kpi-value.warning { color: #fbbf24; }
.kpi-value.success { color: #34d399; }
.kpi-subtext { margin-top: 0.5rem; font-size: 0.85rem; color: #64748b; }
.kpi-subtext.positive { color: #10b981; }

/* Main Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #334155;
}

.content-card h2 { margin: 0 0 1.5rem 0; font-size: 1.2rem; color: #e2e8f0; border-bottom: 1px solid #334155; padding-bottom: 0.75rem; }

/* Lists & Bars */
.item-list { list-style: none; padding: 0; margin: 0; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #334155; }
.list-item:last-child { border-bottom: none; }
.item-info { display: flex; flex-direction: column; gap: 0.25rem; }
.text-muted { color: #94a3b8; font-size: 0.85rem; }

.item-status { width: 120px; text-align: right; }
.progress-bar-container { background: #334155; height: 6px; border-radius: 3px; margin-bottom: 0.5rem; overflow: hidden; }
.progress-bar { height: 100%; transition: width 0.5s ease; }
.bg-success { background: #10b981; }
.bg-warning { background: #f59e0b; }
.bg-danger { background: #ef4444; }
.text-xs { font-size: 0.75rem; color: #94a3b8; }

/* Tables */
.table-responsive { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; padding: 0.75rem; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #334155; }
.admin-table td { padding: 1rem 0.75rem; color: #e2e8f0; font-size: 0.9rem; border-bottom: 1px solid #334155; }
.admin-table tr:last-child td { border-bottom: none; }

.badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge-success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
.badge-danger { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

/* Charts Placeholder */
.chart-container { display: flex; flex-direction: column; }
.chart-placeholder { flex: 1; min-height: 200px; display: flex; align-items: center; justify-content: center; border: 2px dashed #334155; border-radius: 8px; color: #64748b; font-style: italic; }

@media (max-width: 768px) {
  .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .content-grid { grid-template-columns: 1fr; }
}
</style>