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
      path: '/mypage',
      name: 'myPage',
      component: () => import('@/views/MyPage.vue'),
      meta: { showHeader: true },
      children: [
        {
          path: '',
          name: 'myPageApplicantEmpty',
          component: () => import('@/components/mypage/ApplicantEmpty.vue')
        },
        {
          path: 'new',
          name: 'myPageApplicantCreate',
          component: () => import('@/components/mypage/ApplicantCreate.vue')
        },
        {
          path: ':a_no',
          name: 'myPageApplicantDetail',
          component: () => import('@/components/mypage/ApplicantDetail.vue')
        }
      ]
    },

    {
      path: '/application',
      name: 'application',
      component: () => import('@/views/ApplicationDetailView.vue'),
      meta: { showHeader: true },
      children: [
        // 지원계획서
        {
          path: 'write',
          name: 'write',
          component: () => import('@/views/ApplicationWriteView.vue')
        },
        {
          path: 'planInsert',
          name: 'planInsert',
          component: () => import('@/views/PlanInsert.vue')
        },
        {
          path: 'planDetail/:application_no',
          name: 'planDetail',
          component: () => import('@/views/PlanDetail.vue')
        },
        {
          path: '/pendingplanDetail/:application_no',
          name: 'pendingplanDetail',
          component: () => import('@/views/PendingPlanDetail.vue')
        },
        {
          path: '/rejectplanDetail/:application_no',
          name: 'rejectplanDetail',
          component: () => import('@/views/RejectPlanDetail.vue')
        },
        // 지원결과서
        {
          path: '/resultDetail/:plan_no',
          name: 'resultDetail',
          component: () => import('@/views/ResultDetail.vue')
        },
        {
          path: '/rejectresultDetail/:plan_no',
          name: 'rejectresultDetail',
          component: () => import('@/views/RejectResultDetail.vue')
        },
        {
          path: '/pendingresultDetail/:plan_no',
          name: 'pendingresultDetail',
          component: () => import('@/views/PendingResultDetail.vue')
        },
        {
          path: '/resultinsert',
          name: 'resultinsert',
          component: () => import('@/views/ResultInsert.vue')
        },
        // 상담내역
        {
          path: '/counselInsert',
          name: 'counselInsert',
          component: () => import('@/views/CounselInsert.vue')
        },
        {
          path: '/counselDetail/:application_no',
          name: 'counselDetail',
          component: () => import('@/views/CounselDetail.vue')
        }
      ]
    }
  ]
});

export default router;
