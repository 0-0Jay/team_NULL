<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';

const { toggleDarkMode, isDarkTheme } = useLayout();
const user = JSON.parse(localStorage.getItem('users')).user[0];
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <router-link to="/" class="layout-topbar-logo">
        <span>발달장애인 지원 프로그램</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="content-center">{{ user?.u_name }} 님 환영합니다.</div>
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
          <Button type="button" class="min-w-[100px]">
            <i class="pi pi-user"> 내 정보 </i>
          </Button>
          <Button type="button" class="min-w-[100px]">
            <i class="pi pi-sign-out"> 로그아웃 </i>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
