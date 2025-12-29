<script setup>
import Header from '@/layout/HeaderLayout.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  authStore.loadFromStorage();
});
</script>

<template>
  <Header v-if="route.meta.showHeader" />
  <router-view />
</template>

<style scoped></style>
