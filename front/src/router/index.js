import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { hideHeader: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
      meta: { hideHeader: true }
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
    },
    {
      path: '/loginNA',
      name: 'LoginNA',
      component: () => import('@/views/LoginNotApprovedView.vue'),
      meta: { hideHeader: true }
    },
    {
      path: '/find/:type',
      name: 'findInfo',
      component: () => import('@/views/FindIdView.vue'),
      meta: { hideHeader: true }
    },
    {
      path: '/resultId',
      name: 'resultId',
      component: () => import('@/views/FindIdResultView.vue'),
      meta: { hideHeader: true }
    },
    {
      path: '/changePw',
      name: 'changePw',
      component: () => import('@/views/ChangePwView.vue'),
      meta: { hideHeader: true }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestFile.vue')
    }
  ]
});

export default router;
