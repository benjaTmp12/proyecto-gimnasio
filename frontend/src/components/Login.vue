<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4" style="font-family: 'Inter', system-ui, sans-serif;">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-lg shadow-indigo-900">G</div>
        <h1 class="text-2xl font-black text-white tracking-tight">GymOS</h1>
        <p class="text-slate-500 text-sm mt-1">Sistema de Gestión de Gimnasio</p>
      </div>

      <!-- Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <!-- Tabs login / registro -->
        <div class="flex bg-slate-800 rounded-xl p-1 mb-6">
          <button @click="modo = 'login'" :class="modo === 'login' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'"
            class="flex-1 py-2 rounded-lg font-semibold text-sm transition-all">Iniciar sesión</button>
          <button @click="modo = 'registro'" :class="modo === 'registro' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'"
            class="flex-1 py-2 rounded-lg font-semibold text-sm transition-all">Registrarse</button>
        </div>

        <!-- ── LOGIN ── -->
        <form v-if="modo === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input v-model="email" type="email" placeholder="tu@email.com" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-colors">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
            <input v-model="password" type="password" placeholder="••••••••" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-colors">
          </div>

          <div v-if="errorMsg" class="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="cargando"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors mt-2">
            {{ cargando ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <!-- ── REGISTRO ── -->
        <form v-if="modo === 'registro'" @submit.prevent="handleRegistro" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Nombre</label>
            <input v-model="nombre" type="text" placeholder="Tu nombre" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-colors">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input v-model="email" type="email" placeholder="tu@email.com" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-colors">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
            <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" required minlength="6"
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-colors">
            <p class="text-xs text-slate-600 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div v-if="errorMsg" class="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
            {{ errorMsg }}
          </div>
          <div v-if="exitoMsg" class="bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm px-4 py-3 rounded-xl">
            {{ exitoMsg }}
          </div>

          <button type="submit" :disabled="cargando"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors mt-2">
            {{ cargando ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>

      </div>

      <p class="text-center text-slate-700 text-xs mt-6">GymOS — Sistema de Gestión de Gimnasio</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const modo = ref('login');
const email = ref('');
const password = ref('');
const nombre = ref('');
const errorMsg = ref('');
const exitoMsg = ref('');
const cargando = ref(false);

const limpiar = () => { errorMsg.value = ''; exitoMsg.value = ''; };

const handleLogin = async () => {
  limpiar();
  cargando.value = true;
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      // Muestra error específico del server (400, 401, 409, 422)
      errorMsg.value = data.error || data.errores?.[0]?.msg || 'Credenciales incorrectas.';
      return;
    }
    emit('login-success', data.token);
  } catch {
    errorMsg.value = 'No se pudo conectar al servidor.';
  } finally {
    cargando.value = false;
  }
};

const handleRegistro = async () => {
  limpiar();
  cargando.value = true;
  try {
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre.value, email: email.value, password: password.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      // Errores 400 (validación), 409 (email duplicado)
      if (data.errores) {
        errorMsg.value = data.errores.map(e => e.msg).join(' · ');
      } else {
        errorMsg.value = data.error || 'Error al registrar.';
      }
      return;
    }
    exitoMsg.value = '¡Cuenta creada! Ahora puedes iniciar sesión.';
    nombre.value = ''; email.value = ''; password.value = '';
    setTimeout(() => { modo.value = 'login'; limpiar(); }, 2000);
  } catch {
    errorMsg.value = 'No se pudo conectar al servidor.';
  } finally {
    cargando.value = false;
  }
};
</script>