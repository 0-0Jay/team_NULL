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
</script>

<template>
  <div class="layout-topbar relative">
    <div class="layout-topbar-logo-container flex items-center gap-4">
      <router-link to="/main" class="layout-topbar-logo">
        <span class="w-65">발달장애인 지원 프로그램</span>
      </router-link>
      <div class="topbar-menu flex items-center gap-4 whitespace-nowrap">
        <router-link to="/main">지원신청내역</router-link>
        <router-link v-if="user.type != 3" to="/faq">문의</router-link>
        <router-link v-if="user.type == 0" to="/welfareMap">복지지도</router-link>
        <router-link v-if="user.type == 2" to="/staff">담당자관리</router-link>
        <router-link v-if="user.type == 3" to="/center">기관 관리</router-link>
        <router-link v-if="user.type == 3" to="/center/manager">기관 관리자 관리</router-link>
        <router-link v-if="user.type == 3" to="/staff">기관 담당자 관리</router-link>
        <router-link v-if="user.type == 3" to="/survey">지원서</router-link>
      </div>
    </div>

    <div class="layout-topbar-actions">
      <div class="content-center">{{ usertype }} {{ user.u_name }}님 환영합니다.</div>
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        <div class="relative">
          <button
            v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'p-anchored-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'p-anchored-overlay-leave-active', hideOnOutsideClick: true }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'p-anchored-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'p-anchored-overlay-leave-active', hideOnOutsideClick: true }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block content-center">
        <div class="layout-topbar-menu-content">
          <router-link to="/mypage"
            ><Button type="button" class="min-w-[100px] h-11">
              <i class="pi pi-user"> 내 정보 </i>
            </Button>
          </router-link>
          <Button type="button" class="min-w-[100px] h-11" @click="logout">
            <i class="pi pi-sign-out"> 로그아웃 </i>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
