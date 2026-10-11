import Login from '@/view/Login.vue'
import Register from '@/view/Register.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Login
    },
    {
      path: "/register",
      component: Register
    }
  ],
})

export default router
