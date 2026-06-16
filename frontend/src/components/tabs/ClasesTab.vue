<template>
  <section class="space-y-5">

    <div v-if="esAdmin" class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 class="font-bold text-white mb-1 text-sm">➕ Programar nueva clase</h3>
      <p class="text-xs text-slate-500 mb-4">Elige un entrenador para ver sus horarios disponibles. El horario se asigna automáticamente.</p>

      <form @submit.prevent="crearClase()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select v-model="formulario.nombre" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" required>
            <option value="" disabled>-- Nombre de la clase --</option>
            <option v-for="t in tiposClases" :key="t" :value="t">{{ t }}</option>
          </select>
          <input v-model="formulario.cupos" type="number" min="1" max="100" placeholder="Cupos máximos (ej: 15)" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none placeholder-slate-600 text-sm" required>

          <select v-model="entrenadorSeleccionado" @change="formulario.horario = ''" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" required>
            <option value="" disabled>-- Seleccionar entrenador --</option>
            <option v-for="e in entrenadores" :key="e.id" :value="e">{{ e.nombre }} — {{ e.especialidad }}</option>
          </select>
        </div>

        <div v-if="entrenadorSeleccionado && entrenadorSeleccionado.horarios?.length" class="space-y-3">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Horarios de {{ entrenadorSeleccionado.nombre }}</p>
          <div class="flex flex-wrap gap-2">
            <template v-for="bloque in entrenadorSeleccionado.horarios" :key="bloque.dia">
              <div v-for="hora in bloque.horas" :key="bloque.dia + hora">
                <button type="button"
                  @click="seleccionarHorario(bloque.dia, hora)"
                  :class="formulario.horario === bloque.dia + ' ' + hora
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-600 hover:text-white'"
                  class="px-3 py-2 rounded-lg border text-xs font-semibold transition-all">
                  <span class="block text-xs opacity-70">{{ bloque.dia }}</span>
                  {{ hora }}
                </button>
              </div>
            </template>
          </div>
          <p v-if="formulario.horario" class="text-amber-400 text-xs font-semibold">✅ Seleccionado: {{ formulario.horario }}</p>
        </div>

        <button type="submit" :disabled="cargando || !formulario.horario || !entrenadorSeleccionado"
          class="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          {{ cargando ? '...' : 'Guardar Clase' }}
        </button>
      </form>
    </div>

    <div v-else class="bg-amber-950/30 border border-amber-800/50 rounded-xl px-5 py-3">
      <p class="text-amber-400 text-sm font-semibold">🔒 Solo los administradores pueden crear o eliminar clases.</p>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <tr>
            <th class="py-3 px-5 text-left">Clase</th>
            <th class="py-3 px-5 text-left">Horario</th>
            <th class="py-3 px-5 text-left">Instructor</th>
            <th class="py-3 px-5 text-left">Cupos Disp.</th>
            <th class="py-3 px-5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="c in clases" :key="c.id" class="hover:bg-slate-800/50 transition-colors">
            <td class="py-3 px-5 font-semibold text-slate-100">{{ c.nombre }}</td>
            <td class="py-3 px-5 text-slate-400">{{ c.horario }}</td>
            <td class="py-3 px-5 text-slate-400">{{ c.instructor }}</td>
            <td class="py-3 px-5 font-black text-amber-400">{{ c.cupos }}</td>
            <td class="py-3 px-5 text-center space-x-2">
              <button v-if="c.cupos > 0" @click="$emit('abrirInscripcion', c.id)" class="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors border border-emerald-800">
                ➕ Inscribir Socio
              </button>
              <button v-else disabled class="bg-slate-800 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold border border-slate-700 cursor-not-allowed">
                Clase Llena
              </button>
              <button v-if="esAdmin" @click="$emit('pedirConfirmacion', 'clase', c.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="clases.length === 0">
            <td colspan="5" class="py-12 text-center text-slate-600">Aún no hay clases programadas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ clases: Array, entrenadores: Array, esAdmin: Boolean, cargando: Boolean });
const emit = defineEmits(['crearClase', 'pedirConfirmacion', 'abrirInscripcion']);

const tiposClases = [
  'Cross Training', 'Spinning', 'Yoga', 'Pilates', 'Funcional', 
  'HIIT', 'Zumba', 'Musculación Guiada', 'Entrenamiento de Fuerza', 'Box Fitness'
];

const entrenadorSeleccionado = ref('');
const formulario = ref({ nombre: '', instructor: '', horario: '', cupos: '', capacidadMax: 20 });

const seleccionarHorario = (dia, hora) => {
  formulario.value.horario = `${dia} ${hora}`;
};

watch(entrenadorSeleccionado, (e) => {
  if (e) formulario.value.instructor = e.nombre;
});

const crearClase = () => {
  if (!formulario.value.horario) return;
  emit('crearClase', {
    nombre: formulario.value.nombre,
    instructor: formulario.value.instructor,
    horario: formulario.value.horario,
    cupos: Number(formulario.value.cupos),
    capacidadMax: Number(formulario.value.cupos)
  }, () => {
    formulario.value = { nombre: '', instructor: '', horario: '', cupos: '', capacidadMax: 20 };
    entrenadorSeleccionado.value = '';
  });
};
</script>
