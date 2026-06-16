<template>
  <section class="space-y-5">

    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 class="font-bold text-white mb-4 text-sm">{{ socioEditandoId ? '✏️ Actualizar socio' : '➕ Registrar nuevo socio y asignar membresía' }}</h3>
      <form @submit.prevent="socioEditandoId ? actualizarSocio() : crearSocio()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
          <div class="flex flex-col gap-1">
            <input v-model="formulario.rut" @blur="validarRut" placeholder="RUT (ej: 12.345.678-9)"
              :class="errorRut ? 'border-red-600 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'"
              class="bg-slate-800 border text-slate-100 p-2.5 rounded-lg focus:ring-2 outline-none placeholder-slate-600 text-sm" required>
            <span v-if="errorRut" class="text-red-400 text-xs">{{ errorRut }}</span>
          </div>
          <input v-model="formulario.nombre" placeholder="Nombre" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
          <input v-model="formulario.apellido" placeholder="Apellido" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
          <input v-model="formulario.email" type="email" placeholder="Email" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm" required>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <div class="flex flex-col gap-1 w-full">
            <label class="text-xs font-semibold text-slate-400 uppercase">Seleccionar Plan</label>
            <select v-model="formulario.plan_nombre" @change="asignarPrecio" class="bg-slate-800 border border-slate-700 text-slate-100 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm w-full" required>
              <option value="" disabled>-- Elige un Plan --</option>
              <option v-for="m in membresias" :key="m.id" :value="m.tipo">{{ m.tipo }}</option>
            </select>
          </div>
          
          <div v-if="planSeleccionado" class="col-span-1 md:col-span-2 grid grid-cols-3 gap-3">
            <div class="bg-slate-800/80 border border-slate-700 p-2.5 rounded-lg">
              <p class="text-[10px] font-bold text-slate-500 uppercase">Precio</p>
              <p class="text-emerald-400 font-black">${{ planSeleccionado.precio.toLocaleString('es-CL') }}</p>
            </div>
            <div class="bg-slate-800/80 border border-slate-700 p-2.5 rounded-lg">
              <p class="text-[10px] font-bold text-slate-500 uppercase">Duración</p>
              <p class="text-slate-300 font-semibold">{{ planSeleccionado.duracionDias }} días</p>
            </div>
            <div class="bg-slate-800/80 border border-slate-700 p-2.5 rounded-lg">
              <p class="text-[10px] font-bold text-slate-500 uppercase">Vencimiento</p>
              <p class="text-indigo-300 font-bold">{{ formulario.fechaVencimiento }}</p>
            </div>
          </div>
          <div v-else class="col-span-1 md:col-span-2 text-sm text-slate-500 p-2.5 flex items-center justify-center border border-dashed border-slate-700 rounded-lg h-full">
            Selecciona un plan para ver los detalles.
          </div>
        </div>

        <div class="flex gap-2">
          <button type="submit" :disabled="cargando || !!errorRut || !formulario.plan_nombre" class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
            {{ cargando ? '...' : (socioEditandoId ? 'Actualizar Socio' : 'Registrar Socio') }}
          </button>
          <button v-if="socioEditandoId" @click="cancelar" type="button" class="bg-slate-700 hover:bg-slate-600 text-white px-5 rounded-lg font-bold transition-colors">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="relative">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
      <input v-model="busqueda" placeholder="Buscar por nombre, apellido o RUT..." class="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 text-sm">
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <tr>
            <th class="py-3 px-5 text-left">RUT</th>
            <th class="py-3 px-5 text-left">Nombre</th>
            <th class="py-3 px-5 text-left">Plan Activo</th>
            <th class="py-3 px-5 text-left">Vencimiento</th>
            <th class="py-3 px-5 text-left">Estado</th>
            <th class="py-3 px-5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="socio in sociosFiltrados" :key="socio.id" class="hover:bg-slate-800/50 transition-colors">
            <td class="py-3 px-5 text-slate-400 font-mono text-xs">{{ socio.rut }}</td>
            <td class="py-3 px-5 font-semibold text-slate-100">{{ socio.nombre }} {{ socio.apellido }}</td>
            <td class="py-3 px-5 font-semibold text-emerald-400">{{ socio.plan_nombre || 'Sin membresía' }}</td>
            <td class="py-3 px-5 text-slate-400">{{ socio.fechaVencimiento || 'Sin pago' }}</td>
            <td class="py-3 px-5">
              <span :class="estaActivo(socio) ? 'bg-emerald-950/70 text-emerald-400 border-emerald-900' : 'bg-red-950/50 text-red-400 border-red-900'"
                class="text-xs font-bold px-2.5 py-1 rounded-full border">
                {{ estaActivo(socio) ? 'Activo' : 'Vencido' }}
              </span>
            </td>
            <td class="py-3 px-5 text-center space-x-2">
              <button @click="cargarSocio(socio)" class="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-900 transition-colors border border-indigo-800">Editar</button>
              <button @click="$emit('pedirConfirmacion', 'socio', socio.id)" class="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900/60 transition-colors border border-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="sociosFiltrados.length === 0">
            <td colspan="6" class="py-12 text-center text-slate-600">No se encontraron socios.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  socios: Array,
  membresias: Array,
  cargando: Boolean
});
const emit = defineEmits(['crearSocio', 'actualizarSocio', 'pedirConfirmacion']);

const busqueda = ref('');
const errorRut = ref('');
const socioEditandoId = ref(null);
const formulario = ref({ rut: '', nombre: '', apellido: '', email: '', fechaVencimiento: '', plan_nombre: '', plan_precio: null });

const planSeleccionado = computed(() => props.membresias.find(m => m.tipo === formulario.value.plan_nombre) || null);

const hoy = computed(() => new Date().toISOString().split('T')[0]);
const estaActivo = (s) => s.fechaVencimiento && s.fechaVencimiento >= hoy.value;

const sociosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase();
  if (!q) return props.socios;
  return props.socios.filter(s => s.nombre.toLowerCase().includes(q) || s.apellido.toLowerCase().includes(q) || s.rut.toLowerCase().includes(q));
});

const validarRut = () => {
  const rut = formulario.value.rut.trim();
  if (!rut) { errorRut.value = ''; return; }
  const limpio = rut.replace(/\./g, '').replace(/-/g, '');
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();
  if (!/^\d+$/.test(cuerpo)) { errorRut.value = 'Formato inválido (ej: 12.345.678-9)'; return; }
  let suma = 0, mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * mult;
    mult = mult < 7 ? mult + 1 : 2;
  }
  const dvEsp = 11 - (suma % 11);
  const dvCalc = dvEsp === 11 ? '0' : dvEsp === 10 ? 'K' : String(dvEsp);
  errorRut.value = dv === dvCalc ? '' : 'RUT inválido';
};

const asignarPrecio = () => {
  const plan = props.membresias.find(m => m.tipo === formulario.value.plan_nombre);
  if (plan) {
    formulario.value.plan_precio = plan.precio;
    const d = new Date();
    d.setDate(d.getDate() + plan.duracionDias);
    formulario.value.fechaVencimiento = d.toISOString().split('T')[0];
  } else {
    formulario.value.plan_precio = null;
  }
};

const cargarSocio = (s) => { socioEditandoId.value = s.id; formulario.value = { ...s }; errorRut.value = ''; };
const cancelar = () => { socioEditandoId.value = null; formulario.value = { rut: '', nombre: '', apellido: '', email: '', fechaVencimiento: '', plan_nombre: '', plan_precio: null }; errorRut.value = ''; };

const crearSocio = () => {
  if (errorRut.value) return;
  emit('crearSocio', { ...formulario.value }, cancelar);
};
const actualizarSocio = () => {
  if (errorRut.value) return;
  emit('actualizarSocio', socioEditandoId.value, { ...formulario.value }, cancelar);
};
</script>
