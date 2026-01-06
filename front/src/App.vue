<script setup>
import Header from '@/layout/HeaderLayout.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <Header v-if="route.meta.showHeader" />
  <router-view />
</template>

<style scoped></style>
