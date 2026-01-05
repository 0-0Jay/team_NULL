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
      path: '/main',
      name: 'main',
      component: () => import('@/views/MainView.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/planinsert',
      name: 'planinsert',
      component: () => import('@/views/PlanInsert.vue'),
      meta: { showHeader: true } //머지하고 다시해볼예정
    },
    {
      path: '/resultinsert',
      name: 'resultinsert',
      component: () => import('@/views/ResultInsert.vue')
      // meta: { showHeader: true }  //머지하고 다시해볼예정
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
      path: '/center',
      name: 'center',
      component: () => import('@/views/AdminCenterView.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/center/manager',
      name: 'manager',
      component: () => import('@/views/AdminManagerView.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/staff',
      name: 'staff',
      component: () => import('@/views/ManageStaffView.vue'),
      meta: { showHeader: true }
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
      component: () => import('@/views/PlanDetail.vue')
      // meta: { showHeader: true }
    },
    {
      path: '/resultDetail',
      name: 'resultDetail',
      component: () => import('@/views/ResultDetail.vue')
      // meta: { showHeader: true }
    },
    {
      path: '/survey',
      name: 'survey',
      component: () => import('@/views/SurveyView.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/editSurvey',
      name: 'editSurvey',
      component: () => import('@/views/EditSurveyView.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: () => import('@/views/MyPage.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/counselInsert',
      name: 'counselInsert',
      component: () => import('@/views/CounselInsert.vue')
      // meta: { showHeader: true }
    },
    {
      path: '/rejectplanDetail',
      name: 'rejectplanDetail',
      component: () => import('@/views/RejectPlanDetail.vue')
      // meta: { showHeader: true }
    },
    {
      path: '/rejectresultDetail',
      name: 'rejectresultDetail',
      component: () => import('@/views/RejectResultDetail.vue')
      // meta: { showHeader: true }
    },
    {
      path: '/counselDetail',
      name: 'counselDetail',
      component: () => import('@/views/CounselDetail.vue')
      // meta: { showHeader: true }
    }
  ]
});

export default router;
