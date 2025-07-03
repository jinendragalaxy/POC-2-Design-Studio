// src/router/index.js
import DesignStudio from '@/views/DesignStudio.vue'
import ProductPage from '@/views/ProductPage.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  { path: '/', name: 'Home', component: ProductPage },
  { path: '/design', name: 'DesignStudio', component: DesignStudio },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
