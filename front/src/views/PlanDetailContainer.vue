<!--지원계획서 화면 분기용 파일-->
<script setup>
import { useUsersStore } from '@/stores/users';
import PlanDetail from './PlanDetail.vue';
import AdminPlanDetail from './AdminPlanDetail.vue';
import { useRoute } from 'vue-router';

const usersStore = useUsersStore();
const route = useRoute();
const application_no = Number(route.params.application_no);
console.log('로그인 유저 정보:', usersStore.user);
console.log('isAdmin:', usersStore.isAdmin);
</script>

<template>
  <div v-if="usersStore.user !== null">
    <AdminPlanDetail v-if="usersStore.user && usersStore.isAdmin" :application_no="application_no" />
    <PlanDetail v-else :application_no="application_no" />
  </div>
  <div v-else>Loading...</div>
</template>
