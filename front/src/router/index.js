import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue')
    },
    {
      path: '/planinsert',
      name: 'planinsert',
      component: () => import('@/views/PlanInsert.vue')
    },
    { path: '/faq', name: 'faq', component: () => import('@/views/FaqList.vue') },
    {
      path: '/faq/create',
      name: 'faq-create',
      component: () => import('@/views/FaqCreate.vue')
    },
    {
      path: '/centers',
      name: 'centers',
      component: () => import('@/views/AdminCenter.vue')
    }
  ]
});

export default router;
