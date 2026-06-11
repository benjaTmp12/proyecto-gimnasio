<template>
  <div class="dashboard-page">
    <header class="header">
      <div>
        <p class="subtitle">Resumen del gimnasio</p>
        <h1>Dashboard simple</h1>
      </div>
      <div class="header-actions">
        <button class="button" @click="logout">Cerrar sesión</button>
      </div>
    </header>

    <div class="toolbar">
      <button class="button secondary" :disabled="loading" @click="loadData">
        {{ loading ? 'Cargando...' : 'Actualizar datos' }}
      </button>
    </div>

    <section class="stats">
      <article class="card">
        <span>Total socios</span>
        <strong>{{ socios.length }}</strong>
      </article>
      <article class="card">
        <span>Total membresías</span>
        <strong>{{ membresias.length }}</strong>
      </article>
      <article class="card">
        <span>Socios con email</span>
        <strong>{{ sociosConEmail }}</strong>
      </article>
    </section>

    <section class="lists">
      <div class="panel">
        <h2>Últimos socios</h2>
        <ul>
          <li v-for="socio in sociosRecientes" :key="socio.id">
            {{ socio.nombre }} {{ socio.apellido }}
            <span>{{ socio.email || 'sin email' }}</span>
          </li>
          <li v-if="sociosRecientes.length === 0" class="empty">No hay socios registrados.</li>
        </ul>
      </div>

      <div class="panel">
        <h2>Membresías</h2>
        <ul>
          <li v-for="membresia in membresias" :key="membresia.id">
            {{ membresia.tipo }} - {{ formatMoney(membresia.precio) }} - {{ membresia.duracionDias }} días
          </li>
          <li v-if="membresias.length === 0" class="empty">No hay membresías registradas.</li>
        </ul>
      </div>
    </section>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['logout']);
const API = 'http://localhost:3000/api';

const loading = ref(false);
const error = ref('');
const socios = ref([]);
const membresias = ref([]);

const authHeaders = (json = false) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  Authorization: `Bearer ${props.token}`,
});

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
};

const sociosConEmail = computed(() => socios.value.filter((s) => s.email).length);
const sociosRecientes = computed(() => [...socios.value].slice(-5).reverse());

const manejar401 = (res) => {
  if (res.status === 401) {
    error.value = 'Sesión expirada. Inicia sesión de nuevo.';
    return true;
  }
  return false;
};

const obtenerSocios = async () => {
  const res = await fetch(`${API}/socios`, { headers: authHeaders() });
  if (manejar401(res)) return;
  if (!res.ok) {
    error.value = 'No se pudieron cargar los socios.';
    return;
  }
  socios.value = await res.json();
};

const obtenerMembresias = async () => {
  const res = await fetch(`${API}/membresias`, { headers: authHeaders() });
  if (manejar401(res)) return;
  if (!res.ok) {
    error.value = 'No se pudieron cargar las membresías.';
    return;
  }
  membresias.value = await res.json();
};

const loadData = async () => {
  loading.value = true;
  error.value = '';
  await Promise.all([obtenerSocios(), obtenerMembresias()]);
  loading.value = false;
};

const logout = () => {
  emit('logout');
};

onMounted(loadData);
</script>

<style scoped>
.dashboard-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
  color: #1f2937;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.subtitle {
  margin: 0 0 6px;
  color: #4b5563;
  font-size: 14px;
}

.header h1 {
  margin: 0;
  font-size: 32px;
}

.toolbar {
  margin-bottom: 18px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.card {
  padding: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.card span {
  display: block;
  color: #6b7280;
  margin-bottom: 8px;
}

.card strong {
  font-size: 28px;
}

.lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
}

.panel h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.panel ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.panel li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.panel li:last-child {
  border-bottom: none;
}

.panel span {
  color: #6b7280;
}

.empty {
  color: #6b7280;
  padding: 10px 0;
}

.button {
  border: none;
  background: #2563eb;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.button.secondary {
  background: #475569;
}

.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  margin-top: 20px;
  padding: 14px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 12px;
}

@media (max-width: 850px) {
  .stats,
  .lists {
    grid-template-columns: 1fr;
  }
}
</style>
