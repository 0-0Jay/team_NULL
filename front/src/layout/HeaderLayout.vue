<script setup>
import { computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { useRouter } from 'vue-router';

const { toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];

const usertype = computed(() => {
  switch (user.type) {
    case 1:
      return user.c_name + ' 담당자';
    case 2:
      return user.c_name + ' 관리자';
    default:
      return '';
  }
});

const logout = () => {
  localStorage.removeItem('users');
  router.replace({ path: '/' });
};

const roleSeverity = computed(() => {
  switch (user.type) {
    case 0:
      return 'primary';
    case 1:
      return 'info';
    case 2:
      return 'contrast';
    case 3:
      return 'secondary';
    default:
      return 'help';
  }
});
</script>

<template>
  <div class="layout-topbar relative">
    <!-- 좌측: 로고 + 메뉴 -->
    <div class="layout-topbar-logo-container flex items-center gap-8 flex-1">
      <!-- 로고 -->
      <router-link to="/main" class="layout-topbar-logo flex items-center shrink-0 font-semibold text-lg text-black gap-2">
        <img src="/logo2.png" alt="로고" class="w-15 h-15" />
        <span>발달장애인 지원 프로그램</span>
      </router-link>
      <!-- 메뉴 -->
      <div class="topbar-menu flex items-center gap-6 whitespace-nowrap flex-1">
        <router-link to="/main" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-list"></i>
          <span>지원신청내역</span>
        </router-link>

        <router-link v-if="user.type != 3" to="/questions" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-question-circle"></i>
          <span>문의</span>
        </router-link>

        <!-- <router-link v-if="user.type == 0" to="/welfareMap" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800" :active-class="menuActiveClass">
          <i class="pi pi-map"></i>
          <span>복지지도</span>
        </router-link> -->

        <router-link v-if="user.type == 2" to="/staff" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-users"></i>
          <span>담당자 관리</span>
        </router-link>

        <router-link v-if="user.type == 2" to="/generalUser" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-user-edit"></i>
          <span>일반회원관리</span>
        </router-link>

        <router-link v-if="user.type == 3" to="/center" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-building"></i>
          <span>기관 관리</span>
        </router-link>

        <router-link v-if="user.type == 3" to="/center/manager" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-users"></i>
          <span>기관관리자 관리</span>
        </router-link>

        <router-link v-if="user.type == 3" to="/staff" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-users"></i>
          <span>기관담당자 관리</span>
        </router-link>

        <router-link v-if="user.type == 3" to="/survey" class="menu-link flex items-center gap-3 pb-1 font-medium text-gray-800">
          <i class="pi pi-file"></i>
          <span>지원서</span>
        </router-link>
      </div>
    </div>

    <!-- 우측: 액션 -->
    <div class="layout-topbar-actions shrink-0">
      <div class="content-center">{{ usertype }} {{ user.u_name }}님 환영합니다.</div>

      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>

        <div class="relative">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'p-anchored-overlay-enter-active',
              leaveToClass: 'hidden',
              leaveActiveClass: 'p-anchored-overlay-leave-active',
              hideOnOutsideClick: true
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div>
      </div>

      <div class="layout-topbar-menu hidden lg:block content-center">
        <div class="layout-topbar-menu-content">
          <router-link to="/mypage">
            <Button v-if="user.type != 3" class="min-w-[100px] h-11 rounded-xl" :severity="roleSeverity"> <i class="pi pi-user mr-2"></i> 내 정보 </Button>
          </router-link>

          <Button class="min-w-[100px] h-11 rounded-xl" :severity="roleSeverity" @click="logout"> <i class="pi pi-sign-out mr-2"></i> 로그아웃 </Button>
        </div>
      </div>
    </div>
  </div>
</template>
