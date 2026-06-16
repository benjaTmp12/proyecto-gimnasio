<template>
  <section class="space-y-5">

    <div v-if="esAdmin" class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 class="font-bold text-white mb-4 text-sm">➕ Agregar entrenador</h3>
      <form @submit.prevent="agregar()" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input v-model="formulario.nombre" placeholder="Nombre completo (ej: Carlos 'El Toro' López)" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none placeholder-slate-600 text-sm" required>
        <input v-model="formulario.especialidad" placeholder="Especialidad (ej: Musculación)" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none placeholder-slate-600 text-sm" required>
        <button type="submit" :disabled="cargando" class="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
          {{ cargando ? '...' : 'Agregar Entrenador' }}
        </button>
      </form>
    </div>

    <div v-else class="bg-amber-950/30 border border-amber-800/50 rounded-xl px-5 py-3">
      <p class="text-amber-400 text-sm font-semibold">🔒 Solo los administradores pueden agregar o eliminar entrenadores.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="e in entrenadores" :key="e.id" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-violet-800 transition-colors group">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <p class="font-bold text-white">{{ e.nombre }}</p>
            <p class="text-xs text-violet-400 font-semibold mt-0.5">{{ e.especialidad }}</p>
          </div>
          <button v-if="esAdmin" @click="$emit('pedirConfirmacion', 'entrenador', e.id)"
            class="opacity-0 group-hover:opacity-100 transition-opacity bg-red-900/30 text-red-400 px-2 py-1 rounded-lg text-xs font-bold border border-red-900 shrink-0">
            Eliminar
          </button>
        </div>

        <div v-if="e.horarios?.length" class="space-y-2">
          <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Horarios fijos</p>
          <div v-for="bloque in e.horarios" :key="bloque.dia" class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-400 w-20 shrink-0">{{ bloque.dia }}</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="hora in bloque.horas" :key="hora" class="bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono px-2 py-0.5 rounded-md">
                {{ hora }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-slate-600">Sin horarios configurados.</p>
      </div>
      <div v-if="entrenadores.length === 0" class="md:col-span-2 py-12 text-center text-slate-600 bg-slate-900 rounded-2xl border border-slate-800">
        No hay entrenadores registrados.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ entrenadores: Array, esAdmin: Boolean, cargando: Boolean });
const emit = defineEmits(['agregarEntrenador', 'pedirConfirmacion']);

const formulario = ref({ nombre: '', especialidad: '', horarios: [] });

const agregar = () => {
  emit('agregarEntrenador', { nombre: formulario.value.nombre, especialidad: formulario.value.especialidad, horarios: [] }, () => {
    formulario.value = { nombre: '', especialidad: '', horarios: [] };
  });
};
</script>
