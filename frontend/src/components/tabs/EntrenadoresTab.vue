<template>
  <section class="space-y-6">

    <!-- Formulario Agregar/Editar Entrenador -->
    <div v-if="esAdmin" class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 class="font-bold text-white mb-4 text-sm flex items-center gap-2">
        <span>{{ editandoId ? '✏️ Editar Entrenador' : '➕ Agregar Entrenador' }}</span>
        <span v-if="!editandoId" class="text-xs text-slate-500 font-normal">(con horario fijo asignado)</span>
      </h3>
      <form @submit.prevent="guardar()" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Nombre completo</label>
            <input v-model="formulario.nombre" placeholder="ej: Carlos 'El Toro' López" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none placeholder-slate-600 text-sm" required>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Especialidad</label>
            <select v-model="formulario.especialidad" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none text-sm" required>
              <option value="" disabled>-- Seleccione especialidad --</option>
              <option v-for="esp in listaEspecialidades" :key="esp" :value="esp">{{ esp }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Teléfono de contacto</label>
            <input v-model="formulario.telefono" placeholder="ej: +56 9 1234 5678" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none placeholder-slate-600 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Correo electrónico</label>
            <input v-model="formulario.email" type="email" placeholder="ej: carlos.lopez@gym.com" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none placeholder-slate-600 text-sm">
          </div>
          <div v-if="editandoId" class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Estado</label>
            <select v-model="formulario.estado" class="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none text-sm" required>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="border-t border-slate-800/80 pt-4">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">📅 Configurar Horario Fijo</p>
          <p class="text-[11px] text-slate-500 mb-4">Selecciona los bloques horarios en los que este entrenador estará disponible para programar clases.</p>
          
          <div class="space-y-4">
            <div v-for="dia in diasSemana" :key="dia" class="flex flex-col md:flex-row md:items-center gap-2 border-b border-slate-800/50 pb-3">
              <span class="text-xs font-bold text-slate-300 w-24 shrink-0">{{ dia }}</span>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="hora in bloquesHoras" :key="dia + hora"
                  type="button"
                  @click="toggleBloque(dia, hora)"
                  :class="estaSeleccionado(dia, hora)
                    ? 'bg-violet-900/80 border-violet-600 text-violet-200 shadow shadow-violet-950'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'"
                  class="px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all">
                  {{ hora }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button v-if="editandoId" type="button" @click="cancelarEdicion()" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="cargando" class="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-violet-900/20">
            {{ cargando ? '...' : (editandoId ? 'Guardar Cambios' : 'Registrar Entrenador') }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="bg-amber-950/30 border border-amber-800/50 rounded-xl px-5 py-3">
      <p class="text-amber-400 text-sm font-semibold">🔒 Solo los administradores pueden gestionar entrenadores.</p>
    </div>

    <!-- Lista de Entrenadores -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="e in entrenadores" :key="e.id" :class="e.estado === 'Inactivo' ? 'opacity-60 border-dashed' : ''" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-violet-800 transition-colors group">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-bold text-white text-base">{{ e.nombre }}</p>
              <span :class="e.estado === 'Activo' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900' : 'bg-red-950/60 text-red-400 border-red-900'" class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border">
                {{ e.estado }}
              </span>
            </div>
            <p class="text-xs text-violet-400 font-semibold mt-0.5">{{ e.especialidad }}</p>
          </div>
          <div v-if="esAdmin" class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="cargarParaEditar(e)" class="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
              Editar
            </button>
            <button @click="$emit('pedirConfirmacion', 'entrenador', e.id)"
              class="bg-red-900/30 text-red-400 px-2 py-1 rounded-lg text-xs font-bold border border-red-900 shrink-0 hover:bg-red-900/60 transition-colors">
              Eliminar
            </button>
          </div>
        </div>

        <!-- Contact details -->
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <div>
            <span class="text-[10px] text-slate-500 block uppercase font-bold">Teléfono</span>
            <span class="text-slate-300 font-mono">{{ e.telefono || 'No registrado' }}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block uppercase font-bold">Email</span>
            <span class="text-slate-300 truncate block" :title="e.email">{{ e.email || 'No registrado' }}</span>
          </div>
        </div>

        <!-- Fixed schedules -->
        <div v-if="e.horarios && e.horarios.length" class="space-y-2 border-t border-slate-800/60 pt-3">
          <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Horarios fijos</p>
          <div v-for="bloque in e.horarios" :key="bloque.dia" class="flex items-start gap-2">
            <span class="text-xs font-bold text-slate-400 w-20 shrink-0 mt-0.5">{{ bloque.dia }}</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="hora in bloque.horas" :key="hora" class="bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono px-2 py-0.5 rounded-md">
                {{ hora }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-slate-600 border-t border-slate-800/60 pt-3">Sin horarios configurados.</p>
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
const emit = defineEmits(['agregarEntrenador', 'actualizarEntrenador', 'pedirConfirmacion']);

const listaEspecialidades = [
  'Musculación', 'Cross Training', 'Spinning', 'Yoga', 'Pilates', 
  'Entrenamiento Funcional', 'Box Fitness', 'HIIT', 'Rehabilitación Física'
];

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const bloquesHoras = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const editandoId = ref(null);
const formulario = ref({ nombre: '', especialidad: '', telefono: '', email: '', estado: 'Activo' });
const seleccionHorarios = ref({}); // { 'Lunes': { '07:00': true } }

const toggleBloque = (dia, hora) => {
  if (!seleccionHorarios.value[dia]) {
    seleccionHorarios.value[dia] = {};
  }
  seleccionHorarios.value[dia][hora] = !seleccionHorarios.value[dia][hora];
};

const estaSeleccionado = (dia, hora) => {
  return !!seleccionHorarios.value[dia]?.[hora];
};

const cargarParaEditar = (e) => {
  editandoId.value = e.id;
  formulario.value = {
    nombre: e.nombre,
    especialidad: e.especialidad || '',
    telefono: e.telefono || '',
    email: e.email || '',
    estado: e.estado || 'Activo'
  };
  
  // Mapear horarios guardados a seleccionHorarios
  seleccionHorarios.value = {};
  if (e.horarios && Array.isArray(e.horarios)) {
    e.horarios.forEach(bloque => {
      if (!seleccionHorarios.value[bloque.dia]) {
        seleccionHorarios.value[bloque.dia] = {};
      }
      if (bloque.horas && Array.isArray(bloque.horas)) {
        bloque.horas.forEach(h => {
          seleccionHorarios.value[bloque.dia][h] = true;
        });
      }
    });
  }
};

const cancelarEdicion = () => {
  editandoId.value = null;
  formulario.value = { nombre: '', especialidad: '', telefono: '', email: '', estado: 'Activo' };
  seleccionHorarios.value = {};
};

const guardar = () => {
  const horariosList = [];
  for (const dia of diasSemana) {
    const horasSelected = [];
    for (const hora of bloquesHoras) {
      if (seleccionHorarios.value[dia]?.[hora]) {
        horasSelected.push(hora);
      }
    }
    if (horasSelected.length > 0) {
      horariosList.push({ dia, horas: horasSelected });
    }
  }

  const payload = {
    nombre: formulario.value.nombre,
    especialidad: formulario.value.especialidad,
    telefono: formulario.value.telefono,
    email: formulario.value.email,
    estado: formulario.value.estado,
    horarios: horariosList
  };

  if (editandoId.value) {
    emit('actualizarEntrenador', editandoId.value, payload, () => {
      cancelarEdicion();
    });
  } else {
    emit('agregarEntrenador', payload, () => {
      cancelarEdicion();
    });
  }
};
</script>
