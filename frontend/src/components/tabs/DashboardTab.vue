<template>
  <section class="space-y-5">

    <div v-if="sociosVencidos.length > 0" class="flex items-center gap-3 bg-amber-950/60 border border-amber-800 rounded-xl px-4 py-3">
      <span class="text-amber-400 text-lg">⚠️</span>
      <p class="text-amber-300 text-sm font-semibold">
        {{ sociosVencidos.length }} socio{{ sociosVencidos.length > 1 ? 's tienen' : ' tiene' }} membresía vencida o por vencer esta semana
      </p>
      <button @click="$emit('cambiarTab', 'socios')" class="ml-auto text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors whitespace-nowrap">Ver socios →</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 text-base">👥</div>
        <p class="text-3xl font-black text-blue-400">{{ socios.length }}</p>
        <div>
          <p class="text-xs text-slate-400 font-semibold">Total socios</p>
          <p class="text-xs text-slate-600 mt-0.5">{{ sociosActivos.length }} activos</p>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 text-base">✅</div>
        <p class="text-3xl font-black text-emerald-400">{{ sociosActivos.length }}</p>
        <div>
          <p class="text-xs text-slate-400 font-semibold">Socios activos</p>
          <p class="text-xs text-slate-600 mt-0.5">{{ socios.length > 0 ? Math.round(sociosActivos.length / socios.length * 100) : 0 }}% del total</p>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
        <div class="w-8 h-8 rounded-lg bg-violet-950 flex items-center justify-center text-violet-400 text-base">🏋️</div>
        <p class="text-3xl font-black text-violet-400">{{ clases.length }}</p>
        <div>
          <p class="text-xs text-slate-400 font-semibold">Clases activas</p>
          <p class="text-xs text-slate-600 mt-0.5">{{ cuposTotales }} cupos disponibles</p>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
        <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-base">🏷️</div>
        <p class="text-3xl font-black text-slate-300">{{ membresias.length }}</p>
        <div>
          <p class="text-xs text-slate-400 font-semibold">Tipos de plan</p>
          <p class="text-xs text-slate-600 mt-0.5">desde ${{ precioMinimo.toLocaleString('es-CL') }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-sm font-bold text-white">Últimos registros</h3>
          <button @click="$emit('cambiarTab', 'socios')" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Ver todos →</button>
        </div>
        <ul class="space-y-1">
          <li v-for="socio in ultimosSocios" :key="socio.id" class="flex items-center gap-3 py-2.5 border-b border-slate-800 last:border-0">
            <div class="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-xs font-black text-indigo-300 shrink-0">
              {{ socio.nombre[0] }}{{ socio.apellido[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-100 text-sm truncate">{{ socio.nombre }} {{ socio.apellido }}</p>
              <p class="text-xs text-emerald-400 font-semibold truncate">
                {{ socio.plan_nombre ? socio.plan_nombre + ' ($' + (socio.plan_precio ? socio.plan_precio.toLocaleString('es-CL') : '0') + ')' : 'Sin membresía' }}
              </p>
            </div>
            <span :class="estaActivo(socio) ? 'bg-emerald-950/70 text-emerald-400 border-emerald-900' : 'bg-slate-800 text-slate-500 border-slate-700'"
              class="text-xs font-bold px-2.5 py-1 rounded-full border shrink-0">
              {{ estaActivo(socio) ? 'Activo' : 'Vencido' }}
            </span>
          </li>
          <li v-if="ultimosSocios.length === 0" class="py-8 text-center text-slate-600 text-sm">Sin socios registrados aún.</li>
        </ul>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-sm font-bold text-white">Ocupación de clases</h3>
          <button @click="$emit('cambiarTab', 'clases')" class="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">Ver todas →</button>
        </div>
        <ul class="space-y-1">
          <li v-for="clase in clases.slice(0, 5)" :key="clase.id" class="py-2.5 border-b border-slate-800 last:border-0">
            <div class="flex justify-between items-center mb-1.5">
              <div>
                <p class="text-sm font-semibold text-slate-100">{{ clase.nombre }}</p>
                <p class="text-xs text-slate-500">{{ clase.instructor }}</p>
              </div>
              <span :class="ocupacionColor(clase)" class="text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ml-2">
                {{ clase.cupos }} cupos
              </span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="ocupacionBarColor(clase)" :style="{ width: ocupacionPorcentaje(clase) + '%' }"></div>
            </div>
          </li>
          <li v-if="clases.length === 0" class="py-8 text-center text-slate-600 text-sm">No hay clases programadas.</li>
        </ul>
      </div>

    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div class="flex justify-between items-center mb-5">
        <h3 class="text-sm font-bold text-white">Planes disponibles</h3>
        <button @click="$emit('cambiarTab', 'membresias')" class="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Gestionar →</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="plan in membresias" :key="plan.id" class="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-1 hover:border-slate-500 transition-colors">
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider truncate">{{ plan.tipo }}</p>
          <p class="text-xl font-black text-emerald-400">${{ plan.precio.toLocaleString('es-CL') }}</p>
          <p class="text-xs text-slate-600">{{ plan.duracionDias }} días</p>
        </div>
        <div v-if="membresias.length === 0" class="col-span-4 py-6 text-center text-slate-600 text-sm">Sin planes creados aún.</div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  socios: Array,
  clases: Array,
  membresias: Array
});
defineEmits(['cambiarTab']);

const hoy = computed(() => new Date().toISOString().split('T')[0]);
const estaActivo = (s) => s.fechaVencimiento && s.fechaVencimiento >= hoy.value;
const sociosActivos = computed(() => props.socios.filter(estaActivo));
const ultimosSocios = computed(() => [...props.socios].slice(-5).reverse());
const cuposTotales = computed(() => props.clases.reduce((a, c) => a + c.cupos, 0));
const precioMinimo = computed(() => props.membresias.length ? Math.min(...props.membresias.map(m => m.precio)) : 0);
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
