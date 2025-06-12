// src/router/index.js - CORE ROUTER
import { createRouter, createWebHistory } from 'vue-router'

// ================================
// RUTAS PRINCIPALES
// ================================
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: 'Dashboard Principal',
      icon: 'mdi-view-dashboard'
    }
  },

  // ================================
  // DOCGEN ROUTES
  // ================================
  {
    path: '/docgen',
    name: 'docgen',
    redirect: { name: 'docgen-dashboard' },
    meta: {
      title: 'DocGen Services',
      service: 'docgen'
    }
  },
  {
    path: '/docgen/dashboard',
    name: 'docgen-dashboard',
    component: () => import('@/views/docgen/DocGenDashboard.vue'),
    meta: {
      title: 'Dashboard DocGen',
      service: 'docgen'
    }
  },
  {
    path: '/docgen/editor',
    name: 'docgen-editor',
    // CAMBIAR ESTA LÍNEA:
    component: () => import('@/views/docgen/TemplateEditor.vue'),
    // EN LUGAR DE:
    // component: () => import('@/components/TemplateEditor.vue'),
    meta: {
      title: 'Editor de Templates',
      service: 'docgen'
    }
   },
  {
    path: '/docgen/manager',
    name: 'docgen-manager',
    component: () => import('@/views/docgen/TemplateManager.vue'),
    meta: {
      title: 'Gestión de Templates',
      service: 'docgen'
    }
  },

  // ================================
  // CONFIGURACIÓN Y AYUDA
  // ================================
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: 'Configuración'
    }
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('@/views/Help.vue'),
    meta: {
      title: 'Ayuda'
    }
  },

  // ================================
  // LEGACY ROUTES (Compatibilidad)
  // ================================
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('@/views/AboutView.vue'),
  //   meta: {
  //     title: 'Acerca de'
  //   }
  // },

  // ================================
  // 404 NOT FOUND
  // ================================
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Página no encontrada'
    }
  }
]

// ================================
// CREAR ROUTER
// ================================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// ================================
// NAVIGATION GUARDS
// ================================

// Guard global - Actualizar título
router.beforeEach((to, from, next) => {
  // Actualizar título de la pestaña del navegador
  const baseTitle = 'Surfrut Platform'
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${baseTitle}`
  } else {
    document.title = baseTitle
  }

  // Log de navegación en desarrollo
  if (import.meta.env.DEV) {
    console.log(`🧭 Navegando: ${from.name || 'inicio'} → ${to.name}`)
  }

  next()
})

// Guard after - Analytics o tracking futuro
router.afterEach((to, from) => {
  // Aquí puedes agregar analytics, tracking, etc.
  if (import.meta.env.DEV) {
    console.log(`✅ Navegación completada a: ${to.name}`)
  }
})

export default router