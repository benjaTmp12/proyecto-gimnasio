<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Login v-if="!token" @login-success="manejarLogin" />
    
    <PanelSocios v-else :token="token" @logout="manejarLogout" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import PanelSocios from './components/PanelSocios.vue';

const token = ref(localStorage.getItem('token') || '');

const manejarLogin = (nuevoToken) => {
  token.value = nuevoToken;
  localStorage.setItem('token', nuevoToken);
};

const manejarLogout = () => {
  token.value = '';
  localStorage.removeItem('token');
};
</script>