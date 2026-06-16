<template>
  <section class="space-y-6">

    <!-- Alert for expiring memberships -->
    <div v-if="sociosVencidos.length > 0" class="flex items-center gap-3 bg-amber-950/60 border border-amber-800 rounded-xl px-4 py-3">
      <span class="text-amber-400 text-lg">⚠️</span>
      <p class="text-amber-300 text-sm font-semibold">
        {{ sociosVencidos.length }} socio{{ sociosVencidos.length > 1 ? 's tienen' : ' tiene' }} membresía vencida o por vencer esta semana
      </p>
      <button @click="$emit('cambiarTab', 'socios')" class="ml-auto text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors whitespace-nowrap">Ver socios →</button>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Members Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-800 transition-colors">
        <div class="flex justify-between items-start">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Socios</p>
          <div class="w-7 h-7 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 text-sm">👥</div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-black text-white">{{ socios.length }}</p>
          <p class="text-[11px] text-slate-500 mt-1"><span class="text-emerald-400 font-bold">{{ sociosActivos.length }}</span> activos</p>
        </div>
      </div>

      <!-- Trainers Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-violet-800 transition-colors">
        <div class="flex justify-between items-start">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Entrenadores</p>
          <div class="w-7 h-7 rounded-lg bg-violet-950 flex items-center justify-center text-violet-400 text-sm">🤸</div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-black text-white">{{ statsData.stats?.totalEntrenadores || 0 }}</p>
          <p class="text-[11px] text-slate-500 mt-1"><span class="text-violet-400 font-bold">{{ statsData.stats?.entrenadoresActivos || 0 }}</span> activos</p>
        </div>
      </div>

      <!-- Classes Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-800 transition-colors">
        <div class="flex justify-between items-start">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Clases Totales</p>
          <div class="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 text-sm">🏋️</div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-black text-white">{{ statsData.stats?.totalClases || 0 }}</p>
          <p class="text-[11px] text-slate-500 mt-1">
            <span class="text-emerald-400 font-bold">{{ statsData.stats?.clasesDisponibles || 0 }}</span> disponibles / 
            <span class="text-red-400 font-bold">{{ statsData.stats?.clasesCompletas || 0 }}</span> llenas
          </p>
        </div>
      </div>

      <!-- Memberships/Plans Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-800 transition-colors">
        <div class="flex justify-between items-start">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Planes</p>
          <div class="w-7 h-7 rounded-lg bg-amber-950 flex items-center justify-center text-amber-400 text-sm">🏷️</div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-black text-white">{{ membresias.length }}</p>
          <p class="text-[11px] text-slate-500 mt-1">desde <span class="text-amber-400 font-semibold">${{ precioMinimo.toLocaleString('es-CL') }}</span></p>
        </div>
      </div>
    </div>

    <!-- Secondary Row: Today's Schedule & Trainer Rankings -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      <!-- Today's Classes -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
        <div class="flex justify-between items-center mb-5">
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>📅 Próximas clases del día</span>
              <span class="text-[10px] bg-indigo-900/60 text-indigo-300 font-mono px-2 py-0.5 rounded-full uppercase">{{ diaSemanaHoy }}</span>
            </h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Clases programadas para hoy ordenadas por horario.</p>
          </div>
          <button @click="$emit('cambiarTab', 'clases')" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Ver todas →</button>
        </div>
        
        <div class="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          <div v-for="clase in statsData.clasesDeHoy" :key="clase.id" class="bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition-all">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-slate-100 text-sm">{{ clase.nombre }}</h4>
                  <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">{{ clase.especialidad }}</span>
                </div>
                <p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span>👤 Entrenador: <strong class="text-slate-300">{{ clase.instructor }}</strong></span>
                </p>
              </div>
              <div class="flex sm:flex-col items-start sm:items-end justify-between shrink-0">
                <span class="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-900/50">
                  {{ clase.horaInicio }} a {{ clase.horaFin }}
                </span>
                <span class="text-[10px] text-slate-500 mt-1">
                  Ocupación: <strong class="text-slate-300">{{ clase.cupos }}</strong> / {{ clase.capacidadMax }} libres
                </span>
              </div>
            </div>
          </div>

          <div v-if="!statsData.clasesDeHoy || statsData.clasesDeHoy.length === 0" class="py-16 text-center">
            <p class="text-4xl mb-3">☕</p>
            <p class="text-slate-500 text-sm">No hay clases programadas para hoy.</p>
          </div>
        </div>
      </div>

      <!-- Trainer Leaderboard -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="mb-5">
          <h3 class="text-sm font-bold text-white">🏆 Entrenadores con más alumnos</h3>
          <p class="text-[11px] text-slate-500 mt-0.5">Ranking por número total de inscripciones activas.</p>
        </div>

        <div class="space-y-4">
          <div v-for="(entrenador, index) in statsData.rankingEntrenadores" :key="entrenador.id" class="flex items-center gap-3">
            <!-- Rank Number -->
            <div :class="[
              'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0',
              index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              index === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40' :
              index === 2 ? 'bg-amber-900/20 text-amber-600 border border-amber-900/40' : 'bg-slate-800 text-slate-400'
            ]">
              {{ index + 1 }}
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-slate-100 truncate">{{ entrenador.nombre }}</p>
              <p class="text-[10px] text-violet-400 font-semibold truncate">{{ entrenador.especialidad }}</p>
            </div>
            
            <div class="text-right shrink-0">
              <span class="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                {{ entrenador.totalAlumnos }} alumno{{ entrenador.totalAlumnos !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <div v-if="!statsData.rankingEntrenadores || statsData.rankingEntrenadores.length === 0" class="py-12 text-center text-slate-600 text-sm">
            Sin entrenadores registrados.
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Ocupación de clases & Planes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Ocupación de Clases List -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:col-span-2">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-sm font-bold text-white">Ocupación de clases (Global)</h3>
          <button @click="$emit('cambiarTab', 'clases')" class="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">Ver todas →</button>
        </div>
        <ul class="space-y-1">
          <li v-for="clase in clases.slice(0, 4)" :key="clase.id" class="py-2.5 border-b border-slate-800 last:border-0">
            <div class="flex justify-between items-center mb-1.5">
              <div>
                <p class="text-sm font-semibold text-slate-100">{{ clase.nombre }}</p>
                <p class="text-xs text-slate-500">{{ clase.instructor }}</p>
              </div>
              <span :class="ocupacionColor(clase)" class="text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ml-2">
                {{ clase.cupos }} cupos libres
              </span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="ocupacionBarColor(clase)" :style="{ width: ocupacionPorcentaje(clase) + '%' }"></div>
            </div>
          </li>
          <li v-if="clases.length === 0" class="py-8 text-center text-slate-600 text-sm">No hay clases programadas.</li>
        </ul>
      </div>

      <!-- Planes disponibles -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-sm font-bold text-white">Planes vigentes</h3>
          <button @click="$emit('cambiarTab', 'membresias')" class="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Gestionar →</button>
        </div>
        <div class="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
          <div v-for="plan in membresias" :key="plan.id" class="bg-slate-800/50 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p class="text-xs text-slate-200 font-bold truncate">{{ plan.tipo }}</p>
              <p class="text-[10px] text-slate-500 mt-0.5">{{ plan.duracionDias }} días de acceso</p>
            </div>
            <p class="text-sm font-extrabold text-emerald-400">${{ plan.precio.toLocaleString('es-CL') }}</p>
          </div>
          <div v-if="membresias.length === 0" class="py-6 text-center text-slate-600 text-sm">Sin planes creados aún.</div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  socios: Array,
  clases: Array,
  membresias: Array,
  statsData: {
    type: Object,
    default: () => ({
      stats: { totalEntrenadores: 0, entrenadoresActivos: 0, totalClases: 0, clasesDisponibles: 0, clasesCompletas: 0 },
      clasesDeHoy: [],
      rankingEntrenadores: []
    })
  }
});
defineEmits(['cambiarTab']);

const hoy = computed(() => new Date().toISOString().split('T')[0]);
const estaActivo = (s) => s.fechaVencimiento && s.fechaVencimiento >= hoy.value;
const sociosActivos = computed(() => props.socios.filter(estaActivo));
const precioMinimo = computed(() => props.membresias.length ? Math.min(...props.membresias.map(m => m.precio)) : 0);

const diaSemanaHoy = computed(() => {
  const diasEsp = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return diasEsp[new Date().getDay()];
});

const sociosVencidos = computed(() => {
  const semana = new Date();
  semana.setDate(semana.getDate() + 7);
  const str = semana.toISOString().split('T')[0];
  return props.socios.filter(s => s.fechaVencimiento && s.fechaVencimiento < str);
});

const ocupacionPorcentaje = (c) => Math.min(Math.round((1 - c.cupos / (c.capacidadMax || 20)) * 100), 100);
const ocupacionColor = (c) => {
  const p = ocupacionPorcentaje(c);
  if (p >= 80) return 'bg-red-950/60 text-red-400 border-red-900';
  if (p >= 50) return 'bg-amber-950/60 text-amber-400 border-amber-900';
  return 'bg-emerald-950/60 text-emerald-400 border-emerald-900';
};
const ocupacionBarColor = (c) => {
  const p = ocupacionPorcentaje(c);
  if (p >= 80) return 'bg-red-500';
  if (p >= 50) return 'bg-amber-500';
  return 'bg-emerald-500';
};
</script>
