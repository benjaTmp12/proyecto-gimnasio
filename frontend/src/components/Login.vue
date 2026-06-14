<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4" style="font-family: 'Inter', system-ui, sans-serif;">
    <div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
      
      <div class="flex flex-col items-center mb-8">
        <div class="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-600/20 mb-3">
          G
        </div>
        <h2 class="text-2xl font-black text-white tracking-tight">GymOS</h2>
        <p class="text-slate-500 text-sm font-medium">Panel de Administración</p>
      </div>

      <form v-if="vistaActual === 'login'" @submit.prevent="manejarLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
          <input 
            v-model="formularioLogin.email" 
            type="email" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600 text-sm" 
            placeholder="admin@gym.com" 
            required>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
          <input 
            v-model="formularioLogin.password" 
            type="password" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600 text-sm" 
            placeholder="••••••••" 
            required>
        </div>
        
        <div class="flex justify-end">
          <button type="button" @click="cambiarVista('olvide')" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" :disabled="cargando" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">
          {{ cargando ? 'Verificando...' : 'Ingresar al sistema' }}
        </button>
      </form>

      <form v-else-if="vistaActual === 'olvide'" @submit.prevent="solicitarToken" class="space-y-4">
        <p class="text-slate-400 text-sm mb-4 text-center">Ingresa tu email y te enviaremos un código temporal para recuperar tu acceso.</p>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email registrado</label>
          <input 
            v-model="formularioRecuperar.email" 
            type="email" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600 text-sm" 
            required>
        </div>

        <button type="submit" :disabled="cargando" class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all mt-2">
          {{ cargando ? 'Procesando...' : 'Solicitar Código' }}
        </button>
        
        <button type="button" @click="cambiarVista('login')" class="w-full text-slate-400 hover:text-white text-sm font-semibold transition-colors mt-2">
          Volver al inicio
        </button>
      </form>

      <form v-else-if="vistaActual === 'reset'" @submit.prevent="cambiarPassword" class="space-y-4">
        <p class="text-emerald-400 text-sm mb-4 text-center bg-emerald-900/30 p-3 rounded-lg border border-emerald-900">
          Revisa la consola del backend para copiar el token.
        </p>
        
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Token de Seguridad</label>
          <input 
            v-model="formularioReset.token" 
            type="text" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600 text-sm font-mono" 
            placeholder="Pega el código aquí..." 
            required>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nueva Contraseña</label>
          <input 
            v-model="formularioReset.nuevaPassword" 
            type="password" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600 text-sm" 
            placeholder="Mínimo 6 caracteres" 
            minlength="6" 
            required>
        </div>

        <button type="submit" :disabled="cargando" class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all mt-2">
          {{ cargando ? 'Actualizando...' : 'Guardar Nueva Contraseña' }}
        </button>

        <button type="button" @click="cambiarVista('login')" class="w-full text-slate-400 hover:text-white text-sm font-semibold transition-colors mt-2">
          Cancelar
        </button>
      </form>

      <div 
        v-if="mensajeG" 
        :class="mensajeG.tipo === 'error' ? 'bg-red-900/50 text-red-400 border-red-800' : 'bg-emerald-900/50 text-emerald-400 border-emerald-800'" 
        class="mt-5 p-3 rounded-lg border text-sm text-center font-semibold animate-pulse">
        {{ mensajeG.texto }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Estados
const vistaActual = ref('login'); // 'login', 'olvide', 'reset'
const cargando = ref(false);
const mensajeG = ref(null);

// Formularios
const formularioLogin = ref({ email: '', password: '' });
const formularioRecuperar = ref({ email: '' });
const formularioReset = ref({ token: '', nuevaPassword: '' });

const mostrarMensaje = (texto, tipo) => {
  mensajeG.value = { texto, tipo };
  setTimeout(() => { mensajeG.value = null; }, 5000);
};

const cambiarVista = (vista) => {
  vistaActual.value = vista;
  mensajeG.value = null;
};

// --- API LLAMADAS ---

const manejarLogin = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioLogin.value)
    });
    const data = await response.json();
    
    // Capturamos si la API nos devuelve error de validación express-validator
    if (!response.ok) {
      if (data.errores) throw new Error(data.errores[0].msg);
      throw new Error(data.error || 'Credenciales inválidas');
    }
    
    emit('login-success', data.token);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};

const solicitarToken = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const response = await fetch(`${API}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioRecuperar.value)
    });
    const data = await response.json();
    
    if (!response.ok) {
      if (data.errores) throw new Error(data.errores[0].msg);
      throw new Error(data.error || 'Error al solicitar token');
    }
    
    // Cambiamos a la vista para ingresar el token
    cambiarVista('reset');
    mostrarMensaje('Token generado. Revisa la consola del backend.', 'success');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};

const cambiarPassword = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const response = await fetch(`${API}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioReset.value)
    });
    const data = await response.json();
    
    if (!response.ok) {
      if (data.errores) throw new Error(data.errores[0].msg);
      throw new Error(data.error || 'Error al cambiar contraseña');
    }
    
    // Si sale bien, volvemos al login limpiando todo
    formularioReset.value = { token: '', nuevaPassword: '' };
    formularioLogin.value.password = '';
    cambiarVista('login');
    mostrarMensaje('¡Contraseña actualizada! Ya puedes iniciar sesión.', 'success');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};
</script>