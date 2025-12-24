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
