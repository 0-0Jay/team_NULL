<!--지원계획서 화면 분기용 파일-->

<script setup>
import { useUsersStore } from '@/stores/users';
import PlanDetail from './PlanDetail.vue';
import AdminPlanDetail from './AdminPlanDetail.vue';

const usersStore = useUsersStore();
</script>

<template>
  <AdminPlanDetail v-if="usersStore.isAdmin" />
  <PlanDetail v-else />
</template>
