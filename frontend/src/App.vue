<template>
  <div class="min-h-screen p-8 bg-gray-100">
    <Login v-if="!token" @login-success="handleLoginSuccess" />
    <Dashboard v-else :token="token" @logout="handleLogout" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

const token = ref(localStorage.getItem('token') || '');

const handleLoginSuccess = (nuevoToken) => {
  token.value = nuevoToken;
  localStorage.setItem('token', nuevoToken);
};

const handleLogout = () => {
  token.value = '';
  localStorage.removeItem('token');
};
</script>