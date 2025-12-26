<script setup>
import Header from '@/layout/HeaderLayout.vue';
</script>

<template>
  <Header v-if="!$route.meta.hideHeader" />
  <router-view />
</template>

<style scoped></style>
