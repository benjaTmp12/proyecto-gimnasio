<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4" style="font-family: 'Inter', system-ui, sans-serif;">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-600/20 mb-3">G</div>
        <h2 class="text-2xl font-black text-white tracking-tight">GymOS</h2>
        <p class="text-slate-500 text-sm font-medium">Panel de Administración</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">

        <!-- Tabs login / registro (solo en vista login) -->
        <div v-if="vistaActual === 'login' || vistaActual === 'registro'" class="flex bg-slate-800 rounded-xl p-1 mb-6">
          <button @click="cambiarVista('login')"
            :class="vistaActual === 'login' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'"
            class="flex-1 py-2 rounded-lg font-semibold text-sm transition-all">
            Iniciar sesión
          </button>
          <button @click="cambiarVista('registro')"
            :class="vistaActual === 'registro' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'"
            class="flex-1 py-2 rounded-lg font-semibold text-sm transition-all">
            Registrarse
          </button>
        </div>

        <!-- Indicador de vista para reset password -->
        <div v-if="vistaActual === 'olvide' || vistaActual === 'reset'" class="flex items-center gap-2 mb-6">
          <button @click="cambiarVista('login')" class="text-slate-500 hover:text-white transition-colors text-sm">← Volver</button>
          <span class="text-slate-700">|</span>
          <span class="text-slate-400 text-sm font-semibold">
            {{ vistaActual === 'olvide' ? 'Recuperar contraseña' : 'Nueva contraseña' }}
          </span>
        </div>

        <!-- ── VISTA: LOGIN ── -->
        <form v-if="vistaActual === 'login'" @submit.prevent="manejarLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input v-model="formularioLogin.email" type="email" placeholder="admin@gym.com" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
            <input v-model="formularioLogin.password" type="password" placeholder="••••••••" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <div class="flex justify-end">
            <button type="button" @click="cambiarVista('olvide')" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <button type="submit" :disabled="cargando"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold shadow-lg transition-all">
            {{ cargando ? 'Verificando...' : 'Ingresar al sistema' }}
          </button>
        </form>

        <!-- ── VISTA: REGISTRO (GEN-04) ── -->
        <form v-else-if="vistaActual === 'registro'" @submit.prevent="manejarRegistro" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre</label>
            <input v-model="formularioRegistro.nombre" type="text" placeholder="Tu nombre completo" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input v-model="formularioRegistro.email" type="email" placeholder="tu@email.com" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
            <input v-model="formularioRegistro.password" type="password" placeholder="Mínimo 6 caracteres" required minlength="6"
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <button type="submit" :disabled="cargando"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold shadow-lg transition-all">
            {{ cargando ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>

        <!-- ── VISTA: OLVIDÉ CONTRASEÑA (GEN-07 paso 1) ── -->
        <form v-else-if="vistaActual === 'olvide'" @submit.prevent="solicitarToken" class="space-y-4">
          <p class="text-slate-400 text-sm text-center">Ingresa tu email y generaremos un código temporal de recuperación.</p>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email registrado</label>
            <input v-model="formularioRecuperar.email" type="email" placeholder="tu@email.com" required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <button type="submit" :disabled="cargando"
            class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all">
            {{ cargando ? 'Procesando...' : 'Solicitar código' }}
          </button>
        </form>

        <!-- ── VISTA: RESET PASSWORD (GEN-07 paso 2) ── -->
        <form v-else-if="vistaActual === 'reset'" @submit.prevent="cambiarPassword" class="space-y-4">
          <div class="bg-amber-900/30 border border-amber-800 text-amber-300 text-xs p-3 rounded-lg text-center">
            🔑 Revisa la consola del servidor para obtener el token de recuperación.
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Token de seguridad</label>
            <input v-model="formularioReset.token" type="text" placeholder="Pega el token aquí..." required
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-600 text-sm font-mono transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nueva contraseña</label>
            <input v-model="formularioReset.nuevaPassword" type="password" placeholder="Mínimo 6 caracteres" required minlength="6"
              class="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-600 text-sm transition-all">
          </div>
          <button type="submit" :disabled="cargando"
            class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all">
            {{ cargando ? 'Actualizando...' : 'Guardar nueva contraseña' }}
          </button>
        </form>

        <!-- Mensaje global de error / éxito -->
        <Transition name="msg">
          <div v-if="mensajeG"
            :class="mensajeG.tipo === 'error'
              ? 'bg-red-950 border-red-800 text-red-300'
              : 'bg-emerald-950 border-emerald-800 text-emerald-300'"
            class="mt-5 p-3 rounded-xl border text-sm text-center font-semibold">
            {{ mensajeG.texto }}
          </div>
        </Transition>

      </div>

      <p class="text-center text-slate-700 text-xs mt-6">GymOS — Sistema de Gestión de Gimnasio</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// vistas: 'login' | 'registro' | 'olvide' | 'reset'
const vistaActual = ref('login');
const cargando = ref(false);
const mensajeG = ref(null);

const formularioLogin = ref({ email: '', password: '' });
const formularioRegistro = ref({ nombre: '', email: '', password: '' });
const formularioRecuperar = ref({ email: '' });
const formularioReset = ref({ token: '', nuevaPassword: '' });

const mostrarMensaje = (texto, tipo = 'success') => {
  mensajeG.value = { texto, tipo };
  setTimeout(() => { mensajeG.value = null; }, 5000);
};

const cambiarVista = (vista) => {
  vistaActual.value = vista;
  mensajeG.value = null;
};

// ── LOGIN ──────────────────────────────────────────────────
const manejarLogin = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioLogin.value)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errores?.[0]?.msg || data.error || 'Credenciales inválidas');
    }
    emit('login-success', data.token);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};

// ── REGISTRO (GEN-04) ──────────────────────────────────────
const manejarRegistro = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioRegistro.value)
    });
    const data = await res.json();
    if (!res.ok) {
      // Muestra errores 400 (validación) o 409 (email duplicado)
      throw new Error(data.errores?.[0]?.msg || data.error || 'Error al registrar');
    }
    formularioRegistro.value = { nombre: '', email: '', password: '' };
    cambiarVista('login');
    mostrarMensaje('¡Cuenta creada! Ya puedes iniciar sesión.');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};

// ── SOLICITAR TOKEN (GEN-07 paso 1) ───────────────────────
const solicitarToken = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const res = await fetch(`${API}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioRecuperar.value)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errores?.[0]?.msg || data.error || 'Error al solicitar token');
    }
    cambiarVista('reset');
    mostrarMensaje('Código generado. Revisa la consola del servidor.');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};

// ── CAMBIAR PASSWORD (GEN-07 paso 2) ──────────────────────
const cambiarPassword = async () => {
  cargando.value = true;
  mensajeG.value = null;
  try {
    const res = await fetch(`${API}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioReset.value)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errores?.[0]?.msg || data.error || 'Token inválido o expirado');
    }
    formularioReset.value = { token: '', nuevaPassword: '' };
    formularioLogin.value.password = '';
    cambiarVista('login');
    mostrarMensaje('¡Contraseña actualizada! Ya puedes iniciar sesión.');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.msg-enter-active, .msg-leave-active { transition: all 0.3s ease; }
.msg-enter-from, .msg-leave-to { opacity: 0; transform: translateY(-0.5rem); }
</style>