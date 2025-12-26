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
      path: '/faq/update/:faq_no',
      name: 'faq-update',
      component: () => import('@/views/FaqUpdate.vue')
    },
    {
      path: '/centers',
      name: 'centers',
      component: () => import('@/views/AdminCenter.vue')
    },
    {
      path: '/loginNA',
      name: 'LoginNA',
      component: () => import('@/views/LoginNotApprovedView.vue')
    },
    {
      path: '/findId',
      name: 'findId',
      component: () => import('@/views/FindIdView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestFile.vue')
    }
  ]
});

export default router;
