import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import PanelSocios from '../components/PanelSocios.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: PanelSocios,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.path === '/login' && token) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
