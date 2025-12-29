import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { showHeader: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
      meta: { showHeader: false }
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
      path: '/centers/managers',
      name: 'managers',
      component: () => import('@/views/AdminManager.vue')
    },
    {
      path: '/loginNA',
      name: 'LoginNA',
      component: () => import('@/views/LoginNotApprovedView.vue'),
      meta: { showHeader: false }
    },
    {
      path: '/find/:type',
      name: 'findInfo',
      component: () => import('@/views/FindIdView.vue'),
      meta: { showHeader: false }
    },
    {
      path: '/resultId',
      name: 'resultId',
      component: () => import('@/views/FindIdResultView.vue'),
      meta: { showHeader: false }
    },
    {
      path: '/changePw',
      name: 'changePw',
      component: () => import('@/views/ChangePwView.vue'),
      meta: { showHeader: false }
    },
    {
      path: '/welfareMap',
      name: 'welfareMap',
      component: () => import('@/views/WelfareMapView.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestFile.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/planDetail',
      name: 'planDetail',
      component: () => import('@/views/PlanDetail.vue'),
      meta: { showHeader: true }
    }
  ]
});

export default router;
