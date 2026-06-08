<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
    <h2 class="text-2xl font-bold mb-4 text-center">Acceso al Sistema</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full px-3 py-2 border rounded" required>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Contraseña</label>
        <input v-model="password" type="password" class="w-full px-3 py-2 border rounded" required>
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Ingresar
      </button>
    </form>
    <p v-if="errorMsg" class="text-red-500 mt-3 text-center">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);
const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleSubmit = async () => {
  errorMsg.value = '';
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    emit('login-success', data.token);
  } catch (error) {
    errorMsg.value = error.message;
  }
};
</script>