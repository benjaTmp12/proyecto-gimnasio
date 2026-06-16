<template>
  <section class="space-y-6">

    <!-- Formulario Crear/Editar Clase -->
    <div v-if="esAdmin" class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 class="font-bold text-white mb-4 text-sm flex items-center gap-2">
        <span>{{ editandoId ? '✏️ Editar Clase' : '➕ Programar nueva clase' }}</span>
        <span class="text-xs text-slate-500 font-normal">Elige el entrenador y configura el horario de inicio/término.</span>
      </h3>

      <form @submit.prevent="guardar()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Clase / Actividad</label>
            <select v-model="formulario.nombre" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" required>
              <option value="" disabled>-- Nombre de la clase --</option>
              <option v-for="t in tiposClases" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Cupos máximos</label>
            <input v-model="formulario.capacidadMax" type="number" min="1" max="100" placeholder="Cupos máximos (ej: 15)" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none placeholder-slate-600 text-sm" required>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Entrenador asignado</label>
            <select v-model="formulario.entrenadorId" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" required>
              <option value="" disabled>-- Seleccionar entrenador --</option>
              <option v-for="e in entrenadoresActivos" :key="e.id" :value="e.id">
                {{ e.nombre }} ({{ e.especialidad }})
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Hora de Inicio</label>
            <input v-model="formulario.horaInicio" type="time" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono" required>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Hora de Término</label>
            <input v-model="formulario.horaFin" type="time" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono" required>
          </div>
          <div class="flex flex-col justify-end">
            <span class="text-xs text-slate-500 font-semibold uppercase block mb-1">Duración calculada</span>
            <div class="bg-slate-800/80 border border-slate-700/60 text-amber-400 p-2.5 rounded-lg text-sm font-bold font-mono">
              ⏱️ {{ duracionCalculada || 'Esperando horas...' }}
            </div>
          </div>
        </div>

        <!-- Dias selection -->
        <div class="pt-3">
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-2">Días de la semana</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="d in diasLista" :key="d"
              type="button"
              @click="toggleDia(d)"
              :class="formulario.dias.includes(d)
                ? 'bg-amber-600 border-amber-500 text-white shadow shadow-amber-900'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-600'"
              class="px-4 py-2 rounded-lg border text-xs font-semibold transition-all">
              {{ d }}
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button v-if="editandoId" type="button" @click="cancelarEdicion()" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="cargando || formulario.dias.length === 0 || duracionCalculada === 'Horario inválido'"
            class="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-amber-900/20">
            {{ cargando ? '...' : (editandoId ? 'Guardar Cambios' : 'Programar Clase') }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="bg-amber-950/30 border border-amber-800/50 rounded-xl px-5 py-3">
      <p class="text-amber-400 text-sm font-semibold">🔒 Solo los administradores pueden crear, editar o eliminar clases.</p>
    </div>

    <!-- Lista de Clases -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <tr>
            <th class="py-3.5 px-5 text-left">Clase</th>
            <th class="py-3.5 px-5 text-left">Entrenador / Especialidad</th>
            <th class="py-3.5 px-5 text-left">Horario / Duración</th>
            <th class="py-3.5 px-5 text-center">Inscritos / Capacidad</th>
            <th class="py-3.5 px-5 text-center">Cupos Libres</th>
            <th class="py-3.5 px-5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="c in clases" :key="c.id" class="hover:bg-slate-800/50 transition-colors">
            <td class="py-4 px-5 font-bold text-slate-100 text-base">{{ c.nombre }}</td>
            <td class="py-4 px-5">
              <p class="font-bold text-slate-200">{{ c.entrenador ? c.entrenador.nombre : c.instructor }}</p>
              <p class="text-xs text-violet-400 font-semibold mt-0.5">{{ c.entrenador ? c.entrenador.especialidad : 'Instructor' }}</p>
            </td>
            <td class="py-4 px-5">
              <p class="text-slate-300 font-medium">{{ formatearDias(c.dias) }}</p>
              <p class="text-xs text-slate-500 font-mono mt-0.5">
                ⏱️ {{ c.horaInicio }} - {{ c.horaFin }} ({{ calcularMinutos(c.horaInicio, c.horaFin) }} min)
              </p>
            </td>
            <td class="py-4 px-5 text-center text-slate-300 font-semibold">
              {{ (c.capacidadMax || 20) - c.cupos }} / {{ c.capacidadMax || 20 }}
            </td>
            <td class="py-4 px-5 text-center">
              <span :class="c.cupos === 0 ? 'bg-red-950/60 text-red-400 border-red-900' : c.cupos <= 3 ? 'bg-amber-950/60 text-amber-400 border-amber-900' : 'bg-emerald-950/60 text-emerald-400 border-emerald-900'" class="px-2.5 py-1 rounded-full text-xs font-black border">
                {{ c.cupos }} libres
              </span>
            </td>
            <td class="py-4 px-5 text-center">
              <div class="flex items-center justify-center gap-2">
                <button v-if="c.cupos > 0" @click="$emit('abrirInscripcion', c.id)" class="bg-emerald-900/50 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-950/40 transition-colors border border-emerald-800">
                  ➕ Inscribir
                </button>
                <button v-else disabled class="bg-slate-800 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 cursor-not-allowed">
                  Llena
                </button>
                <div v-if="esAdmin" class="flex gap-1">
                  <button @click="cargarParaEditar(c)" class="bg-slate-800 text-slate-300 px-2 py-1.5 rounded-lg text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
                    Editar
                  </button>
                  <button @click="$emit('pedirConfirmacion', 'clase', c.id)" class="bg-red-900/30 text-red-400 px-2 py-1.5 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">
                    Eliminar
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="clases.length === 0">
            <td colspan="6" class="py-12 text-center text-slate-600">Aún no hay clases programadas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ clases: Array, entrenadores: Array, esAdmin: Boolean, cargando: Boolean });
const emit = defineEmits(['crearClase', 'actualizarClase', 'pedirConfirmacion', 'abrirInscripcion']);

const tiposClases = [
  'Cross Training', 'Spinning', 'Yoga', 'Pilates', 'Entrenamiento Funcional', 
  'HIIT', 'Zumba', 'Musculación Guiada', 'Entrenamiento de Fuerza', 'Box Fitness', 'Rehabilitación Física'
];

const diasLista = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const editandoId = ref(null);
const formulario = ref({ nombre: '', entrenadorId: '', horaInicio: '', horaFin: '', dias: [], capacidadMax: 20 });

const entrenadoresActivos = computed(() => {
  return props.entrenadores.filter(e => e.estado === 'Activo' || e.id === formulario.value.entrenadorId);
});

const toggleDia = (dia) => {
  const index = formulario.value.dias.indexOf(dia);
  if (index === -1) {
    formulario.value.dias.push(dia);
  } else {
    formulario.value.dias.splice(index, 1);
  }
};

const duracionCalculada = computed(() => {
  if (!formulario.value.horaInicio || !formulario.value.horaFin) return '';
  const [hIni, mIni] = formulario.value.horaInicio.split(':').map(Number);
  const [hFin, mFin] = formulario.value.horaFin.split(':').map(Number);
  const totalMin = (hFin * 60 + mFin) - (hIni * 60 + mIni);
  if (totalMin <= 0) return 'Horario inválido';
  const horas = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (horas > 0) {
    return `${horas}h ${mins > 0 ? mins + 'm' : ''} (${totalMin} min)`;
  }
  return `${totalMin} min`;
});

const calcularMinutos = (ini, fin) => {
  if (!ini || !fin) return 0;
  const [h1, m1] = ini.split(':').map(Number);
  const [h2, m2] = fin.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
};

const formatearDias = (dias) => {
  if (!dias) return '';
  let arr = [];
  try {
    arr = Array.isArray(dias) ? dias : JSON.parse(dias);
  } catch {
    arr = [];
  }
  if (arr.length === 0) return 'Sin días';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} y ${arr[1]}`;
  
  // Lunes, Miércoles y Viernes format
  const inicio = arr.slice(0, -1).join(', ');
  const fin = arr[arr.length - 1];
  return `${inicio} y ${fin}`;
};

const cargarParaEditar = (clase) => {
  editandoId.value = clase.id;
  
  let diasArr = [];
  try {
    diasArr = Array.isArray(clase.dias) ? clase.dias : JSON.parse(clase.dias || '[]');
  } catch {
    diasArr = [];
  }

  formulario.value = {
    nombre: clase.nombre,
    entrenadorId: clase.entrenadorId,
    horaInicio: clase.horaInicio,
    horaFin: clase.horaFin,
    dias: diasArr,
    capacidadMax: clase.capacidadMax || 20
  };
};

const cancelarEdicion = () => {
  editandoId.value = null;
  formulario.value = { nombre: '', entrenadorId: '', horaInicio: '', horaFin: '', dias: [], capacidadMax: 20 };
};

const guardar = () => {
  const payload = {
    nombre: formulario.value.nombre,
    entrenadorId: formulario.value.entrenadorId,
    horaInicio: formulario.value.horaInicio,
    horaFin: formulario.value.horaFin,
    dias: formulario.value.dias,
    capacidadMax: Number(formulario.value.capacidadMax),
    cupos: Number(formulario.value.capacidadMax) // Al crear/editar se recalcula en base al delta de inscritos en backend o mantenemos el valor
  };

  // En el backend al editar/crear necesitamos actualizar el número de cupos
  // Si estamos editando, los cupos deben ser: capacidadMax - totalInscritos
  if (editandoId.value) {
    emit('actualizarClase', editandoId.value, payload, () => {
      cancelarEdicion();
    });
  } else {
    emit('crearClase', payload, () => {
      cancelarEdicion();
    });
  }
};
</script>
