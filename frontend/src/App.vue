<template>
<<<<<<< HEAD
  <div class="min-h-screen bg-gray-100 font-sans text-gray-800">
    <Login v-if="!token" @login-success="manejarLogin" />
    
    <div v-else>
      <nav class="bg-white shadow px-6 py-4 flex flex-wrap gap-4 items-center mb-6">
        <div class="font-black text-2xl mr-6 text-blue-600 tracking-tight">GymOS</div>
        
        <button @click="vista = 'dashboard'" :class="['px-4 py-2 rounded font-semibold transition', vista === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800']">Dashboard</button>
        <button @click="vista = 'socios'" :class="['px-4 py-2 rounded font-semibold transition', vista === 'socios' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800']">Socios</button>
        <button @click="vista = 'membresias'" :class="['px-4 py-2 rounded font-semibold transition', vista === 'membresias' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800']">Membresías</button>
        <button @click="vista = 'clases'" :class="['px-4 py-2 rounded font-semibold transition', vista === 'clases' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800']">Clases</button>
        
        <button @click="manejarLogout" class="ml-auto text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded transition">
          Cerrar sesión
        </button>
      </nav>

      <main class="max-w-7xl mx-auto px-4 pb-10">
        <Dashboard v-if="vista === 'dashboard'" :token="token" />
        <PanelSocios v-if="vista === 'socios'" :token="token" />
        <PanelMembresias v-if="vista === 'membresias'" :token="token" />
        <PanelClases v-if="vista === 'clases'" :token="token" />
      </main>
    </div>
=======
  <div class="min-h-screen bg-gray-100 p-4">
    <Login v-if="!token" @login-success="manejarLogin" />
    
    <PanelSocios v-else :token="token" @logout="manejarLogout" />
>>>>>>> parent of c3de7bb (siu)
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import PanelSocios from './components/PanelSocios.vue';

const token = ref(localStorage.getItem('token') || '');
<<<<<<< HEAD
const vista = ref('dashboard'); 
=======
>>>>>>> parent of c3de7bb (siu)

const manejarLogin = (nuevoToken) => {
  token.value = nuevoToken;
  localStorage.setItem('token', nuevoToken);
};

const manejarLogout = () => {
  token.value = '';
  localStorage.removeItem('token');
};
</script>