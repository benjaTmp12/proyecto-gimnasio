<template>
  <section class="space-y-5">

    <div v-if="esAdmin" class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 class="font-bold text-white mb-4 text-sm">{{ editandoId ? '✏️ Actualizar membresía' : '➕ Agregar membresía' }}</h3>
      <form @submit.prevent="editandoId ? actualizarMembresia() : crearMembresia()" class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input v-model="formulario.tipo" placeholder="Nombre del Plan (ej: Full Anual)" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
          <input v-model="formulario.precio" type="number" placeholder="Precio" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-bold pl-8 pr-2.5 py-2.5 rounded-lg outline-none text-sm" required>
        </div>
        <div class="relative">
          <input v-model="formulario.duracionDias" type="number" placeholder="Duración" class="w-full bg-slate-900 border border-slate-700 text-slate-400 pl-3 pr-12 py-2.5 rounded-lg outline-none text-sm" required>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">DÍAS</span>
        </div>
        <div class="flex gap-2">
          <button type="submit" :disabled="cargando || !formulario.tipo" class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
            {{ cargando ? '...' : (editandoId ? 'Actualizar' : 'Guardar') }}
          </button>
          <button v-if="editandoId" @click="cancelar" type="button" class="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg font-bold transition-colors">✕</button>
        </div>
      </form>
    </div>

    <div v-else class="bg-amber-950/30 border border-amber-800/50 rounded-xl px-5 py-3">
      <p class="text-amber-400 text-sm font-semibold">🔒 Solo los administradores pueden crear o modificar membresías.</p>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <tr>
            <th class="py-3 px-5 text-left">ID</th>
            <th class="py-3 px-5 text-left">Tipo de Plan</th>
            <th class="py-3 px-5 text-left">Precio</th>
            <th class="py-3 px-5 text-left">Duración</th>
            <th v-if="esAdmin" class="py-3 px-5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="m in membresias" :key="m.id" class="hover:bg-slate-800/50 transition-colors">
            <td class="py-3 px-5 text-slate-600 font-mono text-xs">#{{ m.id }}</td>
            <td class="py-3 px-5 font-semibold text-slate-100">{{ m.tipo }}</td>
            <td class="py-3 px-5 font-black text-emerald-400">${{ m.precio.toLocaleString('es-CL') }}</td>
            <td class="py-3 px-5 text-slate-400">{{ m.duracionDias }} días</td>
            <td v-if="esAdmin" class="py-3 px-5 text-center space-x-2">
              <button @click="cargarMembresia(m)" class="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-900 transition-colors border border-indigo-800">Editar</button>
              <button @click="$emit('pedirConfirmacion', 'membresia', m.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="membresias.length === 0">
            <td colspan="5" class="py-12 text-center text-slate-600">Sin planes creados aún.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ membresias: Array, esAdmin: Boolean, cargando: Boolean });
const emit = defineEmits(['crearMembresia', 'actualizarMembresia', 'pedirConfirmacion']);

const editandoId = ref(null);
const formulario = ref({ tipo: '', precio: '', duracionDias: '' });

const cargarMembresia = (m) => { editandoId.value = m.id; formulario.value = { ...m }; };
const cancelar = () => { editandoId.value = null; formulario.value = { tipo: '', precio: '', duracionDias: '' }; };

const crearMembresia = () => { emit('crearMembresia', { tipo: formulario.value.tipo, precio: Number(formulario.value.precio), duracionDias: Number(formulario.value.duracionDias) }, cancelar); };
const actualizarMembresia = () => { emit('actualizarMembresia', editandoId.value, { tipo: formulario.value.tipo, precio: Number(formulario.value.precio), duracionDias: Number(formulario.value.duracionDias) }, cancelar); };
</script>
