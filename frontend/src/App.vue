<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <Login v-if="!token" @login-success="manejarLogin" />
    
    <div v-else>
      <!-- Navbar Central -->
      <nav class="bg-gray-900 text-white p-4 shadow-lg flex flex-wrap gap-2 items-center px-6">
        <div class="font-bold text-xl mr-6 tracking-wide">Gym<span class="text-blue-500">OS</span></div>
        
        <button @click="vista = 'dashboard'" :class="['px-4 py-2 rounded transition', vista === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800']">📊 Dashboard</button>
        <button @click="vista = 'socios'" :class="['px-4 py-2 rounded transition', vista === 'socios' ? 'bg-blue-600' : 'hover:bg-gray-800']">👥 Socios</button>
        <button @click="vista = 'membresias'" :class="['px-4 py-2 rounded transition', vista === 'membresias' ? 'bg-blue-600' : 'hover:bg-gray-800']">🏷️ Membresías</button>
        <button @click="vista = 'clases'" :class="['px-4 py-2 rounded transition', vista === 'clases' ? 'bg-blue-600' : 'hover:bg-gray-800']">🏋️ Clases</button>
        
        <button @click="manejarLogout" class="ml-auto text-red-400 font-bold px-4 py-2 hover:bg-gray-800 rounded transition border border-red-900">
          Cerrar sesión
        </button>
      </nav>

      <!-- Vistas Dinámicas -->
      <main class="max-w-7xl mx-auto mt-6">
        <Dashboard v-if="vista === 'dashboard'" :token="token" />
        <PanelSocios v-if="vista === 'socios'" :token="token" />
        <PanelMembresias v-if="vista === 'membresias'" :token="token" />
        <PanelClases v-if="vista === 'clases'" :token="token" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import PanelSocios from './components/PanelSocios.vue';
import PanelMembresias from './components/PanelMembresias.vue';
import PanelClases from './components/PanelClases.vue';

const token = ref(localStorage.getItem('token') || '');
const vista = ref('dashboard'); // Pantalla inicial por defecto

const manejarLogin = (nuevoToken) => {
  token.value = nuevoToken;
  localStorage.setItem('token', nuevoToken);
};

const manejarLogout = () => {
  token.value = '';
  localStorage.removeItem('token');
};
</script>